/**
 * In-memory token bucket rate limiter. Zero dependencies.
 * Each user gets a bucket that refills at a fixed rate.
 */

interface Bucket {
  tokens: number
  lastRefill: number
}

const buckets = new Map<string, Bucket>()

// Clean up stale buckets every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000
const STALE_THRESHOLD = 10 * 60 * 1000

let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > STALE_THRESHOLD) {
      buckets.delete(key)
    }
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter: number | null
}

/**
 * Check if a request is allowed under the rate limit.
 * @param key - Unique identifier (e.g., user ID)
 * @param maxTokens - Maximum burst size (default: 20)
 * @param refillRate - Tokens per second (default: 20/60 = 1 per 3 seconds)
 */
export function checkRateLimit(
  key: string,
  maxTokens = 20,
  refillRate = 20 / 60,
): RateLimitResult {
  cleanup()

  const now = Date.now()
  let bucket = buckets.get(key)

  if (!bucket) {
    bucket = { tokens: maxTokens, lastRefill: now }
    buckets.set(key, bucket)
  }

  // Refill tokens based on elapsed time
  const elapsed = (now - bucket.lastRefill) / 1000
  bucket.tokens = Math.min(maxTokens, bucket.tokens + elapsed * refillRate)
  bucket.lastRefill = now

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1
    return { allowed: true, remaining: Math.floor(bucket.tokens), retryAfter: null }
  }

  // Calculate time until next token
  const retryAfter = Math.ceil((1 - bucket.tokens) / refillRate)
  return { allowed: false, remaining: 0, retryAfter }
}
