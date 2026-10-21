'use client'
import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Flame, AlertTriangle, Backpack, Spotlight, RotateCcw } from 'lucide-react'
import { api } from '@/lib/api'
import { usePolling } from '@/lib/usePolling'
import { CATEGORY_META } from '@/lib/themeMeta'
import { ESSENCE_INFO } from '@/lib/essence'
import { DECAY_BOXES, PC_STATUS_LIMIT, TIER_NAMES, UPGRADE_BOXES, essenceOf, limitProgress, type Category } from '@/lib/rules'
import { STATUS_TYPES } from '@/components/cards/TrackingCard'
import { RollLog } from '@/components/campaign/RollLog'
import { DealStatus } from '@/components/campaign/DealStatus'
import type { ICampaign, ICharacter } from '@/types'

/**
 * The table at a glance: every character's statuses, burned tags, tracks
 * about to tip over, and packed gear. Read-only and live-updating — keep it
 * open on the MC's laptop or a shared screen.
 */
export default function ScreenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [chars, setChars] = useState<ICharacter[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [c, list] = await Promise.all([api<ICampaign>(`/api/campaigns/${id}`), api<ICharacter[]>(`/api/characters?campaignId=${id}`)])
    setCampaign(c)
    setChars(list)
  }, [id])
  useEffect(() => { load().catch(e => setError(e.message)) }, [load])
  usePolling(load, 6000)

  const crewBurned = campaign?.crewTheme.tags.filter(t => t.isBurned && t.text) ?? []

  // Spotlight tracker (the rule of thumb from pp. 76–83: nobody acts twice before everyone
  // has acted once). Kept on this device only — it's the MC's scratchpad.
  const spotKey = `spotlight:${id}`
  const [acted, setActed] = useState<Set<string>>(new Set())
  useEffect(() => {
    try { setActed(new Set(JSON.parse(localStorage.getItem(spotKey) ?? '[]'))) } catch { /* storage unavailable */ }
  }, [spotKey])
  function updateActed(change: (prev: Set<string>) => Set<string>) {
    setActed(prev => {
      const next = change(prev)
      try { localStorage.setItem(spotKey, JSON.stringify([...next])) } catch { /* storage unavailable */ }
      return next
    })
  }
  const toggleActed = (charId: string) => updateActed(prev => {
    const next = new Set(prev)
    if (next.has(charId)) next.delete(charId)
    else next.add(charId)
    return next
  })
  const actedCount = chars.filter(c => acted.has(c._id)).length

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> {campaign?.name?.toUpperCase() ?? 'CAMPAIGN'}
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-2 mt-1 mb-4">
        <h1 className="font-display text-4xl md:text-5xl tracking-widest">TABLE VIEW</h1>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Updates live · tap a name to open the sheet{campaign?.me?.canManage ? ' · deal Consequences right from the cards' : ''}</span>
      </div>
      {error && <div role="alert" className="alert-error mb-4">{error}</div>}

      {campaign && (
        <section className="panel p-4 mb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-display text-xl tracking-widest" style={{ color: '#7fe8ff' }}>{campaign.crewTheme.name || 'CREW'}</span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Upgrade {campaign.crewTheme.upgrade}/{UPGRADE_BOXES} · Decay {campaign.crewTheme.decay}/{DECAY_BOXES}</span>
            {crewBurned.length > 0 && <span className="text-sm flex items-center gap-1" style={{ color: '#ffb347' }}><Flame size={14} aria-hidden /> burned: {crewBurned.map(t => t.text).join(', ')}</span>}
          </div>
        </section>
      )}

      <div className="mb-4"><RollLog campaignId={id} limit={5} /></div>

      {(campaign?.challenges?.length ?? 0) > 0 && (
        <section className="mb-4" aria-labelledby="tv-challenges">
          <h2 id="tv-challenges" className="font-display tracking-widest text-xl mb-2" style={{ color: '#ff4f6e' }}>CHALLENGES</h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {campaign!.challenges!.map((ch, i) => (
              <li key={ch._id ?? i} className="challenge-card p-3" style={{ opacity: campaign?.me?.canManage && !ch.revealed ? 0.6 : 1 }}>
                <div className="font-display text-lg tracking-wide">{ch.name}{campaign?.me?.canManage && !ch.revealed ? ' (hidden)' : ''}</div>
                {ch.statuses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ch.statuses.map((st, j) => <span key={j} className="text-sm px-1.5 rounded" style={{ background: '#2a1630', border: '1px solid #5a2a5a' }}>{st.name}-{st.tier}</span>)}
                  </div>
                )}
                {ch.limits.length > 0 && (
                  <ul className="mt-1 text-sm">
                    {ch.limits.map((l, j) => {
                      const p = limitProgress(l.max, ch.statuses, l.name)
                      return <li key={j} style={{ color: p.state === 'maxed' || p.state === 'exceeded' ? 'var(--accent-lime)' : 'var(--text-muted)' }}>{l.name}: {l.max == null ? 'immune' : `${p.current}/${l.max}`}{p.state === 'maxed' ? (l.progress ? ' — triggered' : ' — overcome') : p.state === 'exceeded' ? ' — permanent' : ''}</li>
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {chars.length > 0 && (
        <section className="panel px-4 py-3 mb-4 flex flex-wrap items-center gap-3" aria-labelledby="tv-spotlight">
          <h2 id="tv-spotlight" className="font-display tracking-widest text-lg flex items-center gap-2" style={{ color: 'var(--accent-lime)' }}>
            <Spotlight size={18} aria-hidden /> SPOTLIGHT
          </h2>
          <span className="text-sm flex-1" style={{ color: 'var(--text-soft)' }} aria-live="polite">
            {actedCount === chars.length
              ? 'Everyone has had a turn — start a new round.'
              : `${actedCount} of ${chars.length} acted this round · next: ${chars.filter(c => !acted.has(c._id)).map(c => c.name || 'Unnamed').join(', ')}`}
          </span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateActed(() => new Set())} disabled={actedCount === 0}>
            <RotateCcw size={14} aria-hidden /> NEW ROUND
          </button>
        </section>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {chars.map(c => {
          const cats = c.themes.filter(t => t.themeType).map(t => t.category as Category)
          const essence = essenceOf(cats, c.essence?.mythosSameSource)
          const burned = c.themes.flatMap(t => t.tags.filter(tag => tag.isBurned && tag.text).map(tag => tag.text))
          const atRisk = c.themes.filter(t => t.themeType && (t.decay >= DECAY_BOXES - 1 || t.upgrade >= UPGRADE_BOXES - 1))
          const packed = (c.loadoutTheme?.tags ?? []).filter(t => !t.isBurned && !t.isFlaw && t.text)
          const limit = campaign?.optionalRules?.pcLimit ?? PC_STATUS_LIMIT
          const worst = c.statuses.filter(s => s.type !== 'helpful' && s.type !== 'progress').reduce((m, s) => Math.max(m, s.tier), 0)
          return (
            <li key={c._id} className="panel p-4" style={{ borderColor: worst >= limit ? 'var(--danger)' : undefined, opacity: acted.has(c._id) ? 0.7 : 1 }}>
              <div className="flex items-start justify-between gap-2">
                <Link href={`/campaigns/${id}/character/${c._id}`} className="font-display text-2xl tracking-wide hover:underline">{c.name || 'Unnamed'}</Link>
                <button type="button" className="chip shrink-0" aria-pressed={acted.has(c._id)} onClick={() => toggleActed(c._id)}
                  style={{ minHeight: 36, color: acted.has(c._id) ? 'var(--accent-lime)' : 'var(--text-muted)', borderColor: acted.has(c._id) ? 'var(--accent-lime)' : undefined }}
                  aria-label={`${c.name || 'Unnamed'} ${acted.has(c._id) ? 'has acted this round' : 'has not acted yet'}`}>
                  {acted.has(c._id) ? '✓ ACTED' : 'MARK ACTED'}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {essence && <span title={ESSENCE_INFO[essence].special}>{essence}</span>}
                {(['self', 'mythos', 'noise'] as const).map(cat => {
                  const n = cats.filter(x => x === cat).length
                  return n ? <span key={cat} style={{ color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label} {n}</span> : null
                })}
              </div>

              <div className="mt-3">
                <div className="font-display tracking-widest text-xs mb-1" style={{ color: 'var(--text-muted)' }}>STATUSES</div>
                {c.statuses.length === 0 ? <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span> : (
                  <div className="flex flex-wrap gap-1.5">
                    {[...c.statuses].sort((a, b) => b.tier - a.tier).map((s, i) => (
                      <span key={i} title={`${STATUS_TYPES[s.type]?.label ?? ''} · ${TIER_NAMES[s.tier]}`} className="px-2 py-0.5 rounded font-semibold text-sm"
                        style={{ background: `${STATUS_TYPES[s.type]?.color ?? '#ff4f8b'}22`, border: `1px solid ${STATUS_TYPES[s.type]?.color ?? '#ff4f8b'}`, color: 'var(--text-primary)' }}>
                        {s.name}-{s.tier}
                      </span>
                    ))}
                  </div>
                )}
                {worst >= limit && <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--danger)' }}><AlertTriangle size={14} aria-hidden /> Overcome — at or past their Limit</p>}
              </div>

              {c.storyTags && c.storyTags.length > 0 && (
                <div className="mt-3">
                  <div className="font-display tracking-widest text-xs mb-1" style={{ color: 'var(--text-muted)' }}>STORY TAGS</div>
                  <p className="text-sm italic">{c.storyTags.map(t => t.text).filter(Boolean).join(' · ')}</p>
                </div>
              )}

              {burned.length > 0 && (
                <p className="text-sm mt-3 flex items-start gap-1" style={{ color: '#ffb347' }}><Flame size={14} className="mt-0.5 shrink-0" aria-hidden /> {burned.join(', ')}</p>
              )}
              {packed.length > 0 && (
                <p className="text-sm mt-2 flex items-start gap-1" style={{ color: 'var(--text-soft)' }}><Backpack size={14} className="mt-0.5 shrink-0" aria-hidden /> {packed.map(t => t.text).join(', ')}</p>
              )}
              {atRisk.length > 0 && (
                <ul className="text-sm mt-2 space-y-0.5">
                  {atRisk.map((t, i) => (
                    <li key={i} style={{ color: t.decay >= DECAY_BOXES - 1 ? 'var(--danger)' : 'var(--accent-lime)' }}>
                      {t.name || t.themeType}: {t.decay >= DECAY_BOXES - 1 ? `decay ${t.decay}/${DECAY_BOXES}` : `upgrade ${t.upgrade}/${UPGRADE_BOXES}`}
                    </li>
                  ))}
                </ul>
              )}
              {campaign?.me?.canManage && <DealStatus characterId={c._id} onDone={load} />}
              {c.crewRelationships.some(r => r.relationshipTag) && (
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                  {c.crewRelationships.filter(r => r.relationshipTag).map(r => `${r.crewMember}: ${r.relationshipTag}${r.isBurned ? ' (burned)' : ''}`).join(' · ')}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
