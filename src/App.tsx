import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { HowItWorks } from './components/sections/HowItWorks'
import { Teachers } from './components/sections/Teachers'
import { Reviews } from './components/sections/Reviews'
import { Pricing } from './components/sections/Pricing'
import { Registration } from './components/sections/Registration'
import { ErrorBanner } from './components/ui/ErrorBanner'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { SiteDataProvider, useSiteData } from './context/SiteDataContext'

function AppContent() {
  const { state, error, retry } = useSiteData()

  if (state === 'loading' || state === 'idle') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingSpinner label="Загрузка контента Maklein..." />
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="max-w-md">
          <ErrorBanner
            message={error ?? 'Не удалось загрузить данные с Google Sheets'}
            onRetry={retry}
          />
          <p className="mt-4 text-center text-sm text-slate-500">
            Проверьте настройки VITE_GOOGLE_SHEET_ID и доступность таблицы
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Teachers />
        <Reviews />
        <Pricing />
        <Registration />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <SiteDataProvider>
      <AppContent />
    </SiteDataProvider>
  )
}
