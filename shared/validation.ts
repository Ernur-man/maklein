export const FIELD_LIMITS = {
  name: 100,
  email: 100,
  phone: 30,
  message: 1000,
  plan: 100,
} as const

export interface RegistrationPayload {
  name: string
  email: string
  phone: string
  plan: string
  message: string
  /** Honeypot — должно оставаться пустым */
  _gotcha?: string
  turnstileToken?: string
}

export function validateRegistrationFields(
  data: RegistrationPayload,
): Record<string, string> {
  const errors: Record<string, string> = {}

  const name = data.name?.trim() ?? ''
  const email = data.email?.trim() ?? ''
  const phone = data.phone?.trim() ?? ''
  const plan = data.plan?.trim() ?? ''
  const message = data.message?.trim() ?? ''

  if (!name) errors.name = 'Укажите имя'
  else if (name.length > FIELD_LIMITS.name) errors.name = 'Имя слишком длинное'

  if (!email) errors.email = 'Укажите email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Некорректный email'
  else if (email.length > FIELD_LIMITS.email) errors.email = 'Email слишком длинный'

  if (!phone) errors.phone = 'Укажите телефон'
  else if (phone.replace(/\D/g, '').length < 10) errors.phone = 'Некорректный номер телефона'
  else if (phone.length > FIELD_LIMITS.phone) errors.phone = 'Номер слишком длинный'

  if (!plan) errors.plan = 'Выберите тариф'
  else if (plan.length > FIELD_LIMITS.plan) errors.plan = 'Некорректный тариф'

  if (message.length > FIELD_LIMITS.message) errors.message = 'Комментарий слишком длинный'

  return errors
}
