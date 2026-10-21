/**
 * Tiny in-memory limiter for sign-in attempts. Good enough for a single
 * server process; it resets on restart, which only ever loosens it.
 */
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 10

const attempts = new Map<string, { count: number; resetAt: number }>()

/** Returns false once `key` has failed too often in the current window. */
export function allowAttempt(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || entry.resetAt < now) return true
  return entry.count < MAX_ATTEMPTS
}

export function recordFailure(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || entry.resetAt < now) attempts.set(key, { count: 1, resetAt: now + WINDOW_MS })
  else entry.count++
}

export function clearFailures(key: string) {
  attempts.delete(key)
}
