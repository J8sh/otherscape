/**
 * Undo/redo history for the character sheet. Edits that arrive close
 * together (typing a tag, tapping several boxes) collapse into one step,
 * so Undo rewinds a whole action rather than a single keystroke.
 */
export interface History<T> {
  past: T[]
  future: T[]
  /** When the last edit was recorded (ms), for coalescing. */
  lastAt: number
}

export const HISTORY_LIMIT = 30
export const COALESCE_MS = 1000

export const emptyHistory = <T>(): History<T> => ({ past: [], future: [], lastAt: 0 })

/** Record `prev` (the value before an edit) made at time `now`. */
export function record<T>(h: History<T>, prev: T, now: number, coalesceMs = COALESCE_MS, limit = HISTORY_LIMIT): History<T> {
  if (h.past.length > 0 && now - h.lastAt < coalesceMs) return { ...h, future: [], lastAt: now }
  return { past: [...h.past, prev].slice(-limit), future: [], lastAt: now }
}

/** Step back: returns the value to restore, or null when there's nothing to undo. */
export function undo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  if (h.past.length === 0) return null
  const value = h.past[h.past.length - 1]
  return { value, history: { past: h.past.slice(0, -1), future: [current, ...h.future], lastAt: 0 } }
}

/** Step forward again after an undo. */
export function redo<T>(h: History<T>, current: T): { history: History<T>; value: T } | null {
  if (h.future.length === 0) return null
  const [value, ...future] = h.future
  return { value, history: { past: [...h.past, current], future, lastAt: 0 } }
}
