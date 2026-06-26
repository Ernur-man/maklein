import { useState, type FormEvent } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { submitRegistration } from '../../services/sheetMonkey'
import { validateRegistrationFields } from '../../../shared/validation'
import { Button } from '../ui/Button'
import { ErrorBanner } from '../ui/ErrorBanner'
import { SectionTitle } from '../ui/SectionTitle'
import { TurnstileField } from '../ui/TurnstileField'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  plan: '',
  message: '',
}

export function Registration() {
  const { data } = useSiteData()
  const [form, setForm] = useState(initialForm)
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileError, setTurnstileError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const plans = data?.pricing ?? []

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitError(null)
    setTurnstileError(null)
    setIsSuccess(false)

    const errors = validateRegistrationFields(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    if (!turnstileToken) {
      setTurnstileError('Подтвердите, что вы не робот.')
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const result = await submitRegistration({
        ...form,
        _gotcha: honeypot,
        turnstileToken,
      })

      if (!result.success) {
        if (result.errors) setFieldErrors(result.errors)
        setSubmitError(result.error ?? 'Не удалось отправить заявку')
        setTurnstileToken('')
        return
      }

      setIsSuccess(true)
      setForm(initialForm)
      setTurnstileToken('')
    } catch {
      setSubmitError('Непредвиденная ошибка. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <section id="registration" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Регистрация"
          subtitle="Оставьте заявку — мы свяжемся с вами в течение 24 часов"
        />

        <div className="mx-auto mt-14 max-w-xl">
          {isSuccess && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <p className="font-medium">Заявка отправлена!</p>
              <p className="mt-1 text-emerald-700">
                Мы свяжемся с вами в ближайшее время.
              </p>
            </div>
          )}

          {submitError && (
            <div className="mb-6">
              <ErrorBanner message={submitError} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] opacity-0 h-0 w-0 pointer-events-none"
            />

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Имя
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-900/10 ${
                    fieldErrors.name ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="Анна"
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-900/10 ${
                    fieldErrors.email ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="anna@example.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                  Телефон
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-900/10 ${
                    fieldErrors.phone ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="+7 (999) 123-45-67"
                  aria-invalid={Boolean(fieldErrors.phone)}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-slate-700">
                  Тариф
                </label>
                <select
                  id="plan"
                  value={form.plan}
                  onChange={(e) => updateField('plan', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-900/10 ${
                    fieldErrors.plan ? 'border-red-300' : 'border-slate-200'
                  }`}
                  aria-invalid={Boolean(fieldErrors.plan)}
                >
                  <option value="">Выберите тариф</option>
                  {plans.map((plan, index) => (
                    <option key={plan.id || index} >
                      {plan.name || 'Тариф'} — {plan.price} {plan.period}
                    </option>
                  ))}
                </select>
                {fieldErrors.plan && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.plan}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                  Комментарий <span className="text-slate-400">(необязательно)</span>
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={form.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-900/10 ${
                    fieldErrors.message ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="Расскажите о ваших целях..."
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
                )}
              </div>

              <div>
                <TurnstileField
                  onSuccess={(token) => {
                    setTurnstileToken(token)
                    setTurnstileError(null)
                  }}
                  onExpire={() => setTurnstileToken('')}
                  onError={() => {
                    setTurnstileToken('')
                    setTurnstileError('Ошибка проверки. Попробуйте снова.')
                  }}
                />
                {turnstileError && (
                  <p className="mt-2 text-center text-sm text-red-600">{turnstileError}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>

            <p className="mt-4 text-center text-xs text-slate-400">
              Нажимая кнопку, вы соглашаетеся с обработкой персональных данных
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
