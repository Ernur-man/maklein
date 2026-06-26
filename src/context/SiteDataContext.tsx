import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchSiteData } from '../services/googleSheets'
import type { DataLoadState, SiteData } from '../types'

interface SiteDataContextValue {
  data: SiteData | null
  state: DataLoadState
  error: string | null
  retry: () => void
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null)
  const [state, setState] = useState<DataLoadState>('idle')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setState('loading')
    setError(null)

    try {
      const siteData = await fetchSiteData()
      setData(siteData)
      setState('success')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Неизвестная ошибка загрузки данных'
      setError(message)
      setState('error')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const value = useMemo(
    () => ({ data, state, error, retry: load }),
    [data, state, error, load],
  )

  return (
    <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
  )
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }
  return context
}
