'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error'

/**
 * Debounced save: call `schedule(value)` on every edit; only the latest value
 * is sent once edits pause. A pending save is flushed when the page is hidden
 * or unmounted, so quick navigation doesn't drop the last change.
 */
export function useAutosave<T>(save: (value: T) => Promise<unknown>, delay = 700) {
  const [state, setState] = useState<SaveState>('idle')
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef<{ value: T } | null>(null)
  const saveRef = useRef(save)
  saveRef.current = save

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    const pending = latest.current
    if (!pending) return
    latest.current = null
    setState('saving')
    try {
      await saveRef.current(pending.value)
      setError(null)
      setState(latest.current ? 'pending' : 'saved')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setState('error')
    }
  }, [])

  const schedule = useCallback((value: T) => {
    latest.current = { value }
    setState('pending')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(flush, delay)
  }, [delay, flush])

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') flush() }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
  }, [flush])

  return { schedule, flush, state, error }
}
