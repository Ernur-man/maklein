/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_SHEET_ID: string
  readonly VITE_SHEET_CONFIG: string
  readonly VITE_SHEET_HOW_IT_WORKS: string
  readonly VITE_SHEET_TEACHERS: string
  readonly VITE_SHEET_REVIEWS: string
  readonly VITE_SHEET_PRICING: string
  readonly VITE_TURNSTILE_SITE_KEY: string
  readonly VITE_ALLOWED_IMAGE_HOSTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
