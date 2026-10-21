'use client'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ACTION_INDEX } from '@/lib/actionIndex'
import { EFFECTS } from '@/lib/effects'

const EFFECT_NAMES = [...EFFECTS.map(e => e.name), 'Mitigate']
const CHAPTERS = [...new Set(ACTION_INDEX.map(a => a.chapter))]

/** One-line orientation per chapter, in our own words. */
const CHAPTER_BLURB: Record<string, string> = {
  'Combat': 'Hitting, defending, maneuvering and supporting allies in a fight.',
  'Cyberspace': 'Data, networks, hacking, building in VR and Harnessing other minds.',
  'Exploration & Survival': 'Chases, hazards, scavenging, travel and keeping bodies working.',
  'Mythos': 'Using Mythic powers, dealing with Sources and Conjurations, and the arcane arts.',
  'Social Interactions': 'Buying and selling, persuading, deceiving and working as a team.',
  'Spycraft': 'Sneaking, infiltrating, surveilling and digging up intel.',
  'Tech & Gear': 'Operating, piloting, trapping, building and fixing technology.',
}

export function ActionIndex() {
  const [query, setQuery] = useState('')
  const [effect, setEffect] = useState<string | null>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ACTION_INDEX.filter(a =>
      (!effect || a.effects.includes(effect)) &&
      (!q || `${a.name} ${a.section} ${a.chapter}`.toLowerCase().includes(q)))
  }, [query, effect])

  return (
    <div>
      <div className="panel p-4 space-y-3">
        <label htmlFor="action-search" className="field-label">WHAT ARE YOU TRYING TO DO?</label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} aria-hidden />
          <input id="action-search" className="input" style={{ paddingLeft: 36 }} placeholder="e.g. disarm, hack, chase, persuade, heal" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by Effect">
          <button type="button" className="chip" style={{ minHeight: 34, ...(effect === null ? { color: 'var(--bg-dark)', background: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' } : {}) }} aria-pressed={effect === null} onClick={() => setEffect(null)}>ALL EFFECTS</button>
          {EFFECT_NAMES.map(name => (
            <button type="button" key={name} className="chip" aria-pressed={effect === name} onClick={() => setEffect(effect === name ? null : name)}
              style={{ minHeight: 34, ...(effect === name ? { color: 'var(--bg-dark)', background: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' } : {}) }}>
              {name.toUpperCase()}
            </button>
          ))}
        </div>
        <p className="text-sm" role="status" style={{ color: 'var(--text-muted)' }}>{results.length} of {ACTION_INDEX.length} actions</p>
      </div>

      {CHAPTERS.map(ch => {
        const items = results.filter(a => a.chapter === ch)
        if (!items.length) return null
        const sections = [...new Set(items.map(a => a.section))]
        return (
          <section key={ch} className="mt-8" aria-labelledby={`ch-${ch}`}>
            <h2 id={`ch-${ch}`} className="font-display text-3xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>{ch.toUpperCase()}</h2>
            <p style={{ color: 'var(--text-muted)' }}>{CHAPTER_BLURB[ch]}</p>
            {sections.map(sec => (
              <div key={sec} className="mt-4">
                <h3 className="font-display tracking-[0.18em] text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{sec.toUpperCase()}</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {items.filter(a => a.section === sec).map(a => (
                    <li key={`${a.name}-${a.page}`} className="panel px-3 py-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold leading-tight">{a.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {a.effects.length ? a.effects.map(e => (
                            <span key={e} className="text-xs font-display tracking-wider px-1.5 rounded" style={{ background: '#2a3a1a', color: '#c9e6a8' }}>{e.toUpperCase()}</span>
                          )) : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>see entry</span>}
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-display tracking-widest" style={{ color: 'var(--text-muted)' }}>P.{a.page}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )
      })}
      {results.length === 0 && <p className="mt-8 text-center" style={{ color: 'var(--text-muted)' }}>No actions match. Try a different word, or clear the Effect filter.</p>}
    </div>
  )
}
