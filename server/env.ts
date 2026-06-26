/**
 * Серверные переменные окружения.
 * SHEET_MONKEY_URL — основной ключ (без VITE_).
 * VITE_SHEET_MONKEY_URL — fallback только для локальной разработки (legacy).
 */
export function getSheetMonkeyUrl(
  env: NodeJS.ProcessEnv | Record<string, string>,
): string | undefined {
  return env.SHEET_MONKEY_URL || env.VITE_SHEET_MONKEY_URL || undefined
}

export function getTurnstileSecret(
  env: NodeJS.ProcessEnv | Record<string, string>,
): string | undefined {
  return env.TURNSTILE_SECRET || undefined
}
