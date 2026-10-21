'use client'
import { Check, CloudOff, Loader2 } from 'lucide-react'
import type { SaveState } from '@/lib/useAutosave'

/** Tiny "Saving… / Saved / Not saved" status for autosaving pages. */
export function SaveIndicator({ state, error }: { state: SaveState; error?: string | null }) {
  if (state === 'idle') return null
  const map = {
    pending: { icon: <Loader2 size={14} className="animate-spin" />, text: 'Saving…', color: 'var(--text-muted)' },
    saving: { icon: <Loader2 size={14} className="animate-spin" />, text: 'Saving…', color: 'var(--text-muted)' },
    saved: { icon: <Check size={14} />, text: 'Saved', color: 'var(--accent-lime)' },
    error: { icon: <CloudOff size={14} />, text: error ? `Not saved: ${error}` : 'Not saved', color: 'var(--danger)' },
  }[state]
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm" style={{ color: map.color }}>
      {map.icon}{map.text}
    </span>
  )
}
