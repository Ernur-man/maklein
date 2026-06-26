import type { RegistrationPayload } from '../../shared/validation'

export interface SubmitResult {
  success: boolean
  error?: string
  errors?: Record<string, string>
}

const GENERIC_ERROR =
  'Не удалось отправить заявку. Попробуйте позже или напишите нам на email.'

export async function submitRegistration(
  data: RegistrationPayload,
): Promise<SubmitResult> {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = (await response.json()) as SubmitResult

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.error ?? GENERIC_ERROR,
        errors: result.errors,
      }
    }

    return { success: true }
  } catch {
    return {
      success: false,
      error: 'Сетевая ошибка. Проверьте подключение к интернету.',
    }
  }
}
