/**
 * Validates redirect paths to prevent open redirect attacks.
 * Only allows relative paths — blocks protocol-relative URLs, absolute URLs, and encoded variants.
 */
export function getSafeRedirectPath(path: string | null, fallback = '/projects'): string {
  if (!path) return fallback

  // Decode to catch encoded bypass attempts (e.g., %2F%2F -> //)
  let decoded: string
  try {
    decoded = decodeURIComponent(path)
  } catch {
    return fallback
  }

  // Must start with a single slash (relative path)
  if (!decoded.startsWith('/')) return fallback

  // Block protocol-relative URLs (//evil.com) and backslash variants (\/evil.com)
  if (/^\/[\\/]/.test(decoded)) return fallback

  // Block URLs containing protocol indicators
  if (/[:\\/]{2}/.test(decoded)) return fallback

  // Block any path with a colon before the first slash (scheme:...)
  if (/^\/[^/]*:/.test(decoded)) return fallback

  return path
}
