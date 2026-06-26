import { useSiteData } from '../../context/SiteDataContext'

export function Footer() {
  const { data } = useSiteData()
  const brandName = data?.config.brandName ?? 'Maklein'

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} {brandName}. Курсы английского языка.
          </p>
          <p className="text-sm text-slate-500">
            maklein@example.com · +7 (999) 123-45-67
          </p>
        </div>
      </div>
    </footer>
  )
}
