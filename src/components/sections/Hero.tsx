import { useSiteData } from '../../context/SiteDataContext'
import { Button } from '../ui/Button'

export function Hero() {
  const { data } = useSiteData()
  if (!data) return null

  const { config } = data

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#f1f5f9_0%,_transparent_50%)]" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-slate-500">
            Курсы английского
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {config.heroTitle}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            {config.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={scrollToRegistration}>
              {config.heroCtaText}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Смотреть тарифы
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8">
            <div>
              <dt className="text-2xl font-semibold text-slate-900">500+</dt>
              <dd className="text-sm text-slate-500">студентов</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-slate-900">15+</dt>
              <dd className="text-sm text-slate-500">преподавателей</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-slate-900">98%</dt>
              <dd className="text-sm text-slate-500">довольны результатом</dd>
            </div>
          </dl>
        </div>

        <div className="relative order-first lg:order-none">
          <div className="overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-200/50">
            <img
              src={config.heroImageUrl}
              alt="Студенты изучают английский"
              className="h-full w-full object-cover aspect-[4/3]"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
