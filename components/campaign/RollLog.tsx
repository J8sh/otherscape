'use client'
import { useCallback, useEffect, useState } from 'react'
import { Dices } from 'lucide-react'
import { api } from '@/lib/api'
import { usePolling } from '@/lib/usePolling'

interface RollEntry { _id: string; note?: string; characterName: string; dice: number[]; power: number; total: number; outcome: 'miss' | 'mixed' | 'strong'; tags: string[]; createdAt: string }

const OUTCOME = {
  strong: { label: 'STRONG HIT', color: 'var(--accent-lime)' },
  mixed: { label: 'MIXED HIT', color: '#ffd166' },
  miss: { label: 'MISS', color: 'var(--danger)' },
}

function ago(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString()
}

/** Recent rolls shared from character sheets, live. */
export function RollLog({ campaignId, limit = 8 }: { campaignId: string; limit?: number }) {
  const [rolls, setRolls] = useState<RollEntry[]>([])
  const load = useCallback(() => api<RollEntry[]>(`/api/campaigns/${campaignId}/rolls`).then(setRolls), [campaignId])
  useEffect(() => { load().catch(() => {}) }, [load])
  usePolling(load, 5000)

  return (
    <section className="panel p-4" aria-labelledby="rolls-heading">
      <h2 id="rolls-heading" className="font-display text-xl tracking-widest mb-2 flex items-center gap-2"><Dices size={18} aria-hidden /> RECENT ROLLS</h2>
      {rolls.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Rolls made with the ROLL button on a sheet show up here for everyone.</p>
      ) : (
        <ul className="space-y-2" aria-live="polite">
          {rolls.slice(0, limit).map(r => (
            <li key={r._id} className="text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span><b>{r.characterName || 'Someone'}</b>{r.note === 'mitigation' && <span style={{ color: 'var(--text-muted)' }}> mitigates</span>} <span style={{ color: 'var(--text-muted)' }}>{r.dice.join('+')} {r.power >= 0 ? '+' : '−'} {Math.abs(r.power)} = </span><b>{r.total}</b></span>
                <span className="font-display tracking-widest shrink-0" style={{ color: OUTCOME[r.outcome].color }}>{OUTCOME[r.outcome].label}</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ago(r.createdAt)}{r.tags.length ? ` · ${r.tags.join(', ')}` : ''}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
