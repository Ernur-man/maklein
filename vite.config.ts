import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage } from 'node:http'
import type { RegistrationPayload } from './shared/validation'
import { handleRegister } from './server/registerHandler'
import { getSheetMonkeyUrl, getTurnstileSecret } from './server/env'

function readJsonBody(req: IncomingMessage): Promise<RegistrationPayload> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}') as RegistrationPayload)
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function devApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api-register',
    configureServer(server) {
      server.middlewares.use('/api/register', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
          return
        }

        try {
          const payload = await readJsonBody(req)
          const result = await handleRegister(
            payload,
            {
              sheetMonkeyUrl: getSheetMonkeyUrl(env),
              turnstileSecret: getTurnstileSecret(env),
              isProduction: false,
            },
            req.socket.remoteAddress,
          )

          res.statusCode = result.status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.body))
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ success: false, error: 'Invalid request' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), devApiPlugin(env)],
  }
})
