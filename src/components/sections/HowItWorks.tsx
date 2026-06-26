import { useSiteData } from '../../context/SiteDataContext'
import { SectionTitle } from '../ui/SectionTitle'

const iconMap: Record<string, string> = {
  target: '🎯',
  plan: '📋',
  video: '💬',
  chart: '📈',
}

export function HowItWorks() {
  const { data } = useSiteData()
  if (!data) return null

  return (
    <section id="how-it-works" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Как проходит обучение"
          subtitle="Прозрачный процесс от первого занятия до вашего результата"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.howItWorks.map((step) => (
            <article
              key={step.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  {iconMap[step.icon] ?? '✦'}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  Шаг {step.step}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
