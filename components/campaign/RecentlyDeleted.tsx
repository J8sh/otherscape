'use client'
import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'

interface Deleted { _id: string; name: string; deletedAt: string; purgeAt: string }

/**
 * Characters deleted in this campaign that the viewer may bring back (their
 * own, or any for the MC). They're purged automatically after 30 days.
 */
export function RecentlyDeleted({ campaignId, refreshKey, onRestored }: {
  campaignId: string
  /** Bump to reload after a delete. */
  refreshKey: number
  onRestored: () => void
}) {
  const [items, setItems] = useState<Deleted[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    api<Deleted[]>(`/api/characters?campaignId=${campaignId}&deleted=1`)
      .then(list => { if (live) setItems(list) })
      .catch(() => { if (live) setItems([]) })
    return () => { live = false }
  }, [campaignId, refreshKey])

  async function restore(id: string) {
    setError(null)
    try {
      await api(`/api/characters/${id}/restore`, { method: 'POST' })
      setItems(prev => prev.filter(c => c._id !== id))
      onRestored()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not restore')
    }
  }

  if (items.length === 0) return null
  return (
    <details className="panel px-4 py-2 mb-4">
      <summary className="cursor-pointer font-display tracking-widest text-sm flex items-center" style={{ minHeight: 40, color: 'var(--text-muted)' }}>
        RECENTLY DELETED ({items.length})
      </summary>
      <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Deleted characters can be restored for 30 days.</p>
      {error && <p role="alert" className="text-sm mb-2" style={{ color: 'var(--danger)' }}>{error}</p>}
      <ul className="space-y-1.5 mb-2">
        {items.map(c => {
          const days = Math.max(0, Math.ceil((new Date(c.purgeAt).getTime() - Date.now()) / 86_400_000))
          return (
            <li key={c._id} className="flex items-center justify-between gap-3">
              <span className="min-w-0">
                <span className="font-semibold truncate block">{c.name || 'Unnamed character'}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Gone for good in {days} day{days === 1 ? '' : 's'}</span>
              </span>
              <button type="button" className="btn btn-ghost btn-sm shrink-0" onClick={() => restore(c._id)} aria-label={`Restore ${c.name || 'character'}`}>
                <RotateCcw size={14} aria-hidden /> RESTORE
              </button>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
