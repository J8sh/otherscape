'use client'
import { Flame, HeartHandshake } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import type { ICharacter } from '@/types'

/** Every character's relationship tags in one place: who feels what about whom. */
export function RelationshipWeb({ characters }: { characters: ICharacter[] }) {
  const rows = characters.flatMap(c =>
    (c.crewRelationships ?? []).filter(r => r.relationshipTag.trim()).map(r => ({ from: c.name || 'Unnamed', to: r.crewMember || '?', tag: r.relationshipTag, burned: !!r.isBurned })))
  if (rows.length === 0) return null
  return (
    <section className="panel p-4" aria-labelledby="rel-heading">
      <h2 id="rel-heading" className="font-display text-xl tracking-widest mb-2 flex items-center gap-2" style={{ color: 'var(--accent-cyan)' }}>
        <HeartHandshake size={17} aria-hidden /> RELATIONSHIPS
        <InfoTip label="relationships">Each character holds one relationship tag per crewmate. Invoking one burns it; burned tags come back at the Credit Roll.</InfoTip>
      </h2>
      <ul className="space-y-1 text-[15px]">
        {rows.map((r, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-1.5" style={{ opacity: r.burned ? 0.6 : 1 }}>
            <b>{r.from}</b><span style={{ color: 'var(--text-muted)' }}>→ {r.to}:</span>
            <i style={{ textDecoration: r.burned ? 'line-through' : undefined }}>{r.tag}</i>
            {r.burned && <Flame size={13} style={{ color: '#ffb347' }} aria-label="burned" />}
          </li>
        ))}
      </ul>
    </section>
  )
}
