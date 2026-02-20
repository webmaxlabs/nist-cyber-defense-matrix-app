/**
 * Defense-in-depth input sanitization.
 * Strips HTML tags and control characters from user text input.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')          // Strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // Strip control chars (preserve \t \n \r)
    .trim()
}
