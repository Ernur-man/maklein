import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import type { RegistrationPayload } from '../shared/validation'
import { getSheetMonkeyUrl, getTurnstileSecret } from '../server/env'
import { handleRegister } from '../server/registerHandler'

function getClientIp(event: HandlerEvent): string | undefined {
  return event.headers['x-nf-client-connection-ip'] ?? event.headers['client-ip']
}

const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    }
  }

  let payload: RegistrationPayload
  try {
    payload = JSON.parse(event.body ?? '{}') as RegistrationPayload
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: 'Invalid JSON' }),
    }
  }

  const isProduction = process.env.CONTEXT === 'production'

  const result = await handleRegister(
    payload,
    {
      sheetMonkeyUrl: getSheetMonkeyUrl(process.env),
      turnstileSecret: getTurnstileSecret(process.env),
      isProduction,
    },
    getClientIp(event),
  )

  return {
    statusCode: result.status,
    body: JSON.stringify(result.body),
  }
}

export { handler }
