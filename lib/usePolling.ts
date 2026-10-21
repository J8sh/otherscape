'use client'
import { useEffect, useRef } from 'react'

/**
 * Call `tick` every `ms` while the tab is visible (and once on returning
 * to it), so everyone at the table sees each other's changes without
 * reloading. Errors are ignored — the next tick tries again.
 */
export function usePolling(tick: () => Promise<unknown> | void, ms = 8000, enabled = true) {
  const tickRef = useRef(tick)
  tickRef.current = tick

  useEffect(() => {
    if (!enabled) return
    let stopped = false
    const run = () => {
      if (stopped || document.visibilityState !== 'visible') return
      Promise.resolve(tickRef.current()).catch(() => {})
    }
    const timer = setInterval(run, ms)
    const onVisible = () => { if (document.visibilityState === 'visible') run() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [ms, enabled])
}

/** True when `a` (ISO date) is strictly newer than `b`. */
export function isNewer(a?: string, b?: string) {
  if (!a) return false
  if (!b) return true
  return new Date(a).getTime() > new Date(b).getTime()
}
