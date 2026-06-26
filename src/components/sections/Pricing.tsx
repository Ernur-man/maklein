import { useSiteData } from '../../context/SiteDataContext'
import { Button } from '../ui/Button'
import { SectionTitle } from '../ui/SectionTitle'

export function Pricing() {
  const { data } = useSiteData()
  if (!data) return null

  const scrollToRegistration = (planName?: string) => {
    const registration = document.getElementById('registration')
    if (!registration) return

    if (planName) {
      const planSelect = registration.querySelector<HTMLSelectElement>('#plan')
      if (planSelect) {
        const option = Array.from(planSelect.options).find(
          (o) => o.value === planName || o.text === planName,
        )
        if (option) planSelect.value = option.value
      }
    }

    registration.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Тарифы"
          subtitle="Выберите формат, который подходит вашему расписанию и целям"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {data.pricing.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
                plan.highlighted
                  ? 'border-slate-900 bg-slate-900 text-white shadow-lg'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900">
                  Популярный
                </span>
              )}

              <h3
                className={`text-lg font-semibold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}
              >
                {plan.name}
              </h3>
              <p
                className={`mt-1 text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}
              >
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span
                  className={`text-4xl font-semibold tracking-tight ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-500'}`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex items-start gap-2 text-sm ${plan.highlighted ? 'text-slate-200' : 'text-slate-600'}`}
                  >
                    <span className="mt-0.5 shrink-0" aria-hidden="true">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="mt-8 w-full"
                variant={plan.highlighted ? 'secondary' : 'primary'}
                onClick={() => scrollToRegistration(plan.name)}
              >
                {plan.ctaText}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
