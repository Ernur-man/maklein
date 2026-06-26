export const env = {
  googleSheetId: import.meta.env.VITE_GOOGLE_SHEET_ID ?? '',
  sheets: {
    config: import.meta.env.VITE_SHEET_CONFIG ?? 'config',
    howItWorks: import.meta.env.VITE_SHEET_HOW_IT_WORKS ?? 'how_it_works',
    teachers: import.meta.env.VITE_SHEET_TEACHERS ?? 'teachers',
    reviews: import.meta.env.VITE_SHEET_REVIEWS ?? 'reviews',
    pricing: import.meta.env.VITE_SHEET_PRICING ?? 'pricing',
  },
  turnstileSiteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '',
  isConfigured: Boolean(import.meta.env.VITE_GOOGLE_SHEET_ID),
}
