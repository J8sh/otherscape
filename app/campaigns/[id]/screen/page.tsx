'use client'
import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Flame, AlertTriangle, Backpack } from 'lucide-react'
import { api } from '@/lib/api'
import { usePolling } from '@/lib/usePolling'
import { CATEGORY_META } from '@/lib/themeMeta'
import { ESSENCE_INFO } from '@/lib/essence'
import { DECAY_BOXES, PC_STATUS_LIMIT, TIER_NAMES, UPGRADE_BOXES, essenceOf, type Category } from '@/lib/rules'
import { STATUS_TYPES } from '@/components/cards/TrackingCard'
import { RollLog } from '@/components/campaign/RollLog'
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

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> {campaign?.name?.toUpperCase() ?? 'CAMPAIGN'}
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-2 mt-1 mb-4">
        <h1 className="font-display text-4xl md:text-5xl tracking-widest">TABLE VIEW</h1>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Updates live · tap a name to open the sheet</span>
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

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {chars.map(c => {
          const cats = c.themes.filter(t => t.themeType).map(t => t.category as Category)
          const essence = essenceOf(cats, c.essence?.mythosSameSource)
          const burned = c.themes.flatMap(t => t.tags.filter(tag => tag.isBurned && tag.text).map(tag => tag.text))
          const atRisk = c.themes.filter(t => t.themeType && (t.decay >= DECAY_BOXES - 1 || t.upgrade >= UPGRADE_BOXES - 1))
          const packed = (c.loadoutTheme?.tags ?? []).filter(t => !t.isBurned && !t.isFlaw && t.text)
          const worst = c.statuses.filter(s => s.type !== 'helpful' && s.type !== 'progress').reduce((m, s) => Math.max(m, s.tier), 0)
          return (
            <li key={c._id} className="panel p-4" style={{ borderColor: worst >= PC_STATUS_LIMIT ? 'var(--danger)' : undefined }}>
              <Link href={`/campaigns/${id}/character/${c._id}`} className="font-display text-2xl tracking-wide hover:underline">{c.name || 'Unnamed'}</Link>
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
                {worst >= PC_STATUS_LIMIT && <p className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--danger)' }}><AlertTriangle size={14} aria-hidden /> Overcome — at or past their Limit</p>}
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
