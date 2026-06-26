const DEFAULT_ALLOWED_HOSTS = [
  'images.unsplash.com',
  'lh3.googleusercontent.com',
  'drive.google.com',
]

function getAllowedHosts(): string[] {
  const extra =
    import.meta.env.VITE_ALLOWED_IMAGE_HOSTS?.split(',').map((h) => h.trim()).filter(Boolean) ??
    []

  return [...DEFAULT_ALLOWED_HOSTS, ...extra]
}

function isHostAllowed(hostname: string, allowedHosts: string[]): boolean {
  return allowedHosts.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  )
}

export function sanitizeImageUrl(url: string): string {
  if (!url?.trim()) return ''

  try {
    const parsed = new URL(url.trim())

    if (parsed.protocol !== 'https:') return ''

    if (!isHostAllowed(parsed.hostname, getAllowedHosts())) {
      console.warn(`[Security] Blocked image URL host: ${parsed.hostname}`)
      return ''
    }

    return parsed.href
  } catch {
    return ''
  }
}

export function sanitizeText(text: string, maxLength = 5000): string {
  if (!text) return ''
  return text.trim().slice(0, maxLength)
}
