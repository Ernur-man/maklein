import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'
import { env } from '../../config/env'

interface TurnstileFieldProps {
  onSuccess: (token: string) => void
  onExpire: () => void
  onError: () => void
}

const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'

export function TurnstileField({ onSuccess, onExpire, onError }: TurnstileFieldProps) {
  const turnstileRef = useRef<TurnstileInstance>(null)
  const siteKey = env.turnstileSiteKey || TURNSTILE_TEST_SITE_KEY

  return (
    <div className="flex justify-center">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        onSuccess={onSuccess}
        onExpire={() => {
          turnstileRef.current?.reset()
          onExpire()
        }}
        onError={() => {
          turnstileRef.current?.reset()
          onError()
        }}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  )
}
