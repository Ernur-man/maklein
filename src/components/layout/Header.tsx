import { useSiteData } from '../../context/SiteDataContext'
import { Button } from '../ui/Button'

const navItems = [
  { label: 'Обучение', href: '#how-it-works' },
  { label: 'Преподаватели', href: '#teachers' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Тарифы', href: '#pricing' },
]

export function Header() {
  const { data } = useSiteData()
  const brandName = data?.config.brandName ?? 'Maklein'
  const logoUrl = data?.config.logoUrl

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brandName}
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              M
            </span>
          )}
          <span className="text-lg font-semibold text-slate-900">{brandName}</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Основная навигация">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Button size="sm" onClick={scrollToRegistration} className="shrink-0">
          Записаться
        </Button>
      </div>
    </header>
  )
}
