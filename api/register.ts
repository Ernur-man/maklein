import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { RegistrationPayload } from '../shared/validation.ts'
import { getSheetMonkeyUrl, getTurnstileSecret } from '../server/env.ts'
import { handleRegister } from '../server/registerHandler.ts'

function getClientIp(req: VercelRequest): string | undefined {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim()
  if (Array.isArray(forwarded)) return forwarded[0]
  return req.socket?.remoteAddress
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' })
    return
  }

  const payload = req.body as RegistrationPayload
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  const result = await handleRegister(
    payload,
    {
      sheetMonkeyUrl: getSheetMonkeyUrl(process.env),
      turnstileSecret: getTurnstileSecret(process.env),
      isProduction,
    },
    getClientIp(req),
  )

  res.status(result.status).json(result.body)
}
