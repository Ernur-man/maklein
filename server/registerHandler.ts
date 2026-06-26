import {
  type RegistrationPayload,
  validateRegistrationFields,
} from '../shared/validation'

export interface RegisterEnv {
  sheetMonkeyUrl?: string
  turnstileSecret?: string
  isProduction?: boolean
}

export interface RegisterResult {
  status: number
  body: { success: boolean; error?: string; errors?: Record<string, string> }
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 3

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false

  entry.count += 1
  return true
}

async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
): Promise<boolean> {
  const params = new URLSearchParams({
    secret,
    response: token,
  })

  if (ip) params.append('remoteip', ip)

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      body: params,
    },
  )

  if (!response.ok) return false

  const data = (await response.json()) as { success?: boolean }
  return Boolean(data.success)
}

async function forwardToSheetMonkey(
  data: RegistrationPayload,
  sheetMonkeyUrl: string,
): Promise<{ ok: boolean; status: number; detail: string }> {
  const payload = {
    Name: data.name.trim(),
    Email: data.email.trim(),
    Phone: data.phone.trim(),
    Plan: data.plan.trim(),
    Message: data.message.trim(),
    'Submitted At': 'x-sheetmonkey-current-date-time',
  }

  const response = await fetch(sheetMonkeyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const detail = await response.text().catch(() => '')

  return { ok: response.ok, status: response.status, detail }
}

export async function handleRegister(
  payload: RegistrationPayload,
  env: RegisterEnv,
  clientIp?: string,
): Promise<RegisterResult> {
  // Honeypot: тихий успех для ботов (поле не должно заполняться пользователем)
  if (payload._gotcha?.trim()) {
    return { status: 200, body: { success: true } }
  }

  const fieldErrors = validateRegistrationFields(payload)
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: { success: false, error: 'Проверьте поля формы', errors: fieldErrors },
    }
  }

  if (clientIp && !checkRateLimit(clientIp)) {
    return {
      status: 429,
      body: {
        success: false,
        error: 'Слишком много заявок. Попробуйте через час.',
      },
    }
  }

  const isProduction = env.isProduction ?? false
  const turnstileSecret = env.turnstileSecret

  if (isProduction && !turnstileSecret) {
    return {
      status: 503,
      body: { success: false, error: 'Сервис временно недоступен.' },
    }
  }

  if (turnstileSecret) {
    const token = payload.turnstileToken?.trim()
    if (!token) {
      return {
        status: 400,
        body: { success: false, error: 'Подтвердите, что вы не робот.' },
      }
    }

    const turnstileOk = await verifyTurnstile(token, turnstileSecret, clientIp)
    if (!turnstileOk) {
      return {
        status: 403,
        body: { success: false, error: 'Проверка безопасности не пройдена.' },
      }
    }
  }

  const sheetMonkeyUrl = env.sheetMonkeyUrl
  if (!sheetMonkeyUrl) {
    return {
      status: 503,
      body: { success: false, error: 'Сервис временно недоступен.' },
    }
  }

  try {
    const forwarded = await forwardToSheetMonkey(payload, sheetMonkeyUrl)

    if (!forwarded.ok) {
      console.error(
        `[register] Sheet Monkey error HTTP ${forwarded.status}:`,
        forwarded.detail.slice(0, 200),
      )
      return {
        status: 502,
        body: {
          success: false,
          error: 'Не удалось отправить заявку. Попробуйте позже.',
        },
      }
    }

    return { status: 200, body: { success: true } }
  } catch (error) {
    console.error('[register] Sheet Monkey request failed:', error)
    return {
      status: 500,
      body: {
        success: false,
        error: 'Не удалось отправить заявку. Попробуйте позже.',
      },
    }
  }
}
