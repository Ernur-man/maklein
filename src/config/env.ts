export const env = {
  googleSheetId: process.env.VITE_GOOGLE_SHEET_ID ?? '',
  sheets: {
    config: process.env.VITE_SHEET_CONFIG ?? 'config',
    howItWorks: process.env.VITE_SHEET_HOW_IT_WORKS ?? 'how_it_works',
    teachers: process.env.VITE_SHEET_TEACHERS ?? 'teachers',
    reviews: process.env.VITE_SHEET_REVIEWS ?? 'reviews',
    pricing: process.env.VITE_SHEET_PRICING ?? 'pricing',
  },
  turnstileSiteKey: process.env.VITE_TURNSTILE_SITE_KEY ?? '',
  isConfigured: Boolean(process.env.VITE_GOOGLE_SHEET_ID),
}
