'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Dices, Flame, Minus, Plus, RotateCcw, Check } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { BLAZE_DEGREES, actionPower, blazeResult, rollOutcome, spendablePower, type BlazeDegree, type Outcome } from '@/lib/rules'
import { applyRoll, refKey, rollD6, type TagRef } from '@/lib/roll'
import { CATEGORY_META } from '@/lib/themeMeta'
import type { IChallenge, ICharacter, IOptionalRules, IStatus } from '@/types'
import { ApplyToChallenge } from '@/components/roller/ApplyToChallenge'

interface Props {
  character?: ICharacter
  /** Save sheet changes caused by the roll (burns, upgrade marks). */
  onApply?: (character: ICharacter) => void
  /** Share a finished roll with the campaign (shown as a toggle when provided). */
  onShare?: (roll: { dice: [number, number]; power: number; tags: string[]; note: string }) => void
  /** The campaign's optional rules (power tag cap, Enhance cost). */
  rules?: IOptionalRules
  /** Revealed Challenges this roll can affect. */
  challenges?: IChallenge[]
}

interface Chip { ref: TagRef; text: string; sign: 1 | -1; note?: string; burnable: boolean; group: string; color?: string; covers?: string }

const OUTCOME_TEXT: Record<Outcome, { label: string; color: string; text: string }> = {
  strong: { label: 'STRONG HIT', color: 'var(--accent-lime)', text: 'It works, with no Consequences. You may take Consequences anyway for a greater success (+1 Power for Effects).' },
  mixed: { label: 'MIXED HIT', color: '#ffd166', text: 'It works — but the MC will deliver Consequences.' },
  miss: { label: 'MISS', color: 'var(--danger)', text: 'It fails or backfires, and the MC delivers Consequences. No Effects.' },
}

/** Every invokable tag on the sheet, grouped for display. */
function sheetChips(c: ICharacter): Chip[] {
  const chips: Chip[] = []
  c.themes.forEach((t, ti) => {
    if (!t.themeType) return
    const group = t.name || t.themeType
    const color = CATEGORY_META[t.category].color
    t.tags.forEach((tag, i) => {
      if (!tag.text.trim()) return
      if (tag.isWeakness) chips.push({ ref: { kind: 'theme', theme: ti, tag: i }, text: tag.text, sign: -1, note: 'marks an upgrade', burnable: false, group, color, covers: tag.note?.trim() || undefined })
      else if (!tag.isBurned) chips.push({ ref: { kind: 'theme', theme: ti, tag: i }, text: tag.text, sign: 1, burnable: true, group, color, covers: tag.note?.trim() || undefined })
    })
  })
  ;(c.loadoutTheme?.tags ?? []).forEach((tag, i) => {
    if (!tag.text.trim()) return
    if (tag.isFlaw) chips.push({ ref: { kind: 'loadout', index: i }, text: tag.text, sign: -1, note: 'marks a loadout upgrade', burnable: false, group: 'Loadout (packed)' })
    else if (!tag.isBurned) chips.push({ ref: { kind: 'loadout', index: i }, text: tag.text, sign: 1, burnable: true, group: 'Loadout (packed)' })
  })
  ;(c.storyTags ?? []).forEach((tag, i) => {
    if (!tag.text.trim()) return
    chips.push({ ref: { kind: 'story', index: i }, text: tag.text, sign: tag.isNegative ? -1 : 1, burnable: !tag.isNegative, group: 'Story tags' })
  })
  c.crewRelationships.forEach((r, i) => {
    if (!r.relationshipTag.trim() || r.isBurned) return
    chips.push({ ref: { kind: 'relationship', index: i }, text: r.relationshipTag, sign: 1, note: 'burns when used', burnable: false, group: 'Crew relationships' })
  })
  return chips
}

function Counter({ label, value, onChange, help }: { label: string; value: number; onChange: (v: number) => void; help: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[15px] font-semibold flex items-center gap-2">{label}<InfoTip label={label}>{help}</InfoTip></span>
      <div className="flex items-center gap-1">
        <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 40, minWidth: 40 }} onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Fewer: ${label}`}><Minus size={16} /></button>
        <span className="w-8 text-center font-display text-2xl" aria-live="polite">{value}</span>
        <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 40, minWidth: 40 }} onClick={() => onChange(value + 1)} aria-label={`More: ${label}`}><Plus size={16} /></button>
      </div>
    </div>
  )
}

function TierPicker({ label, value, onChange, help }: { label: string; value: number; onChange: (v: number) => void; help: string }) {
  return (
    <div>
      <span className="text-[15px] font-semibold flex items-center gap-2 mb-1">{label}<InfoTip label={label}>{help}</InfoTip></span>
      <div className="flex gap-1" role="group" aria-label={label}>
        {[0, 1, 2, 3, 4, 5, 6].map(t => (
          <button key={t} type="button" onClick={() => onChange(t)} aria-pressed={value === t}
            className="flex-1 rounded-md font-display text-lg" style={{ minHeight: 40, background: value === t ? 'var(--accent-lime)' : 'var(--bg-inset)', color: value === t ? 'var(--bg-dark)' : 'var(--text-soft)', border: '1px solid var(--border-card)' }}>
            {t === 0 ? '—' : t}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ActionRoller({ character, onApply, onShare, rules, challenges }: Props) {
  const chips = useMemo(() => (character ? sheetChips(character) : []), [character])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [burnKey, setBurnKey] = useState<string | null>(null)
  const [extraPos, setExtraPos] = useState(0)
  const [extraNeg, setExtraNeg] = useState(0)
  const [statusPicks, setStatusPicks] = useState<Set<number>>(new Set())
  const [manualBest, setManualBest] = useState(0)
  const [manualWorst, setManualWorst] = useState(0)
  const [scaleGap, setScaleGap] = useState(0)
  const [dice, setDice] = useState<[number, number] | null>(null)
  // Power is frozen when you roll, so updating the sheet afterwards
  // (which clears the tag picks) doesn't change the result shown.
  const [rolledPower, setRolledPower] = useState(0)
  const [rolling, setRolling] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [applied, setApplied] = useState<string[] | null>(null)
  const [share, setShare] = useState(true)
  // Action rolls drive the story; mitigation rolls soften incoming Consequences.
  const resultRef = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<'action' | 'mitigate' | 'blaze'>('action')
  const [stake, setStake] = useState(() => Math.max(0, character?.themes.findIndex(t => t.themeType) ?? 0))
  const [degree, setDegree] = useState<BlazeDegree>('significant')
  // Roll with Self / Mythos / Noise (p.122): theme count replaces positive tags.
  const [rollWith, setRollWith] = useState<'' | 'self' | 'mythos' | 'noise'>('')

  // A fresh sheet (after applying) invalidates selections by index.
  useEffect(() => { setSelected(new Set()); setBurnKey(null); setStatusPicks(new Set()) }, [character])

  const statuses: IStatus[] = character?.statuses ?? []
  const picked = statuses.filter((_, i) => statusPicks.has(i))
  const best = Math.max(manualBest, ...picked.filter(s => s.type === 'helpful').map(s => s.tier), 0)
  const worst = Math.max(manualWorst, ...picked.filter(s => s.type !== 'helpful' && s.type !== 'progress').map(s => s.tier), 0)
  const chosen = chips.filter(c => selected.has(refKey(c.ref)))
  const rawPositive = chosen.filter(c => c.sign > 0).length + extraPos
  const cap = rules?.powerTagCap ?? null
  const positive = cap != null ? Math.min(rawPositive, cap) : rawPositive
  const negative = chosen.filter(c => c.sign < 0).length + extraNeg
  const burned = burnKey !== null && selected.has(burnKey)
  // Blaze: Power is the number of themes sharing the category of the theme at stake; nothing else counts.
  const stakeTheme = character?.themes[stake]
  const blazePower = stakeTheme?.themeType ? character!.themes.filter(t => t.themeType && t.category === stakeTheme.category).length : 0
  const categoryCount = rollWith && character ? character.themes.filter(t => t.themeType && t.category === rollWith).length : 0
  const power = mode === 'blaze'
    ? blazePower
    : rollWith
      ? actionPower({ positive: categoryCount, negative, bestStatus: best, worstStatus: worst, scaleGap })
      : actionPower({ positive, negative, burned, bestStatus: best, worstStatus: worst, scaleGap })
  const result = dice ? rollOutcome(dice[0], dice[1], rolledPower) : null

  function toggle(c: Chip) {
    const k = refKey(c.ref)
    const wasOn = selected.has(k)
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })
    if (wasOn) setBurnKey(b => (b === k ? null : b))
    setDice(null)
  }

  function roll() {
    setApplied(null)
    setPushed(false)
    setRolledPower(power)
    // The real result is decided up front; the tumbling frames are just for show.
    const final: [number, number] = [rollD6(), rollD6()]
    const usedTags = chosen.map(c => (burned && refKey(c.ref) === burnKey ? `${c.text} (burned)` : c.text))
    const finish = () => {
      setDice(final)
      setRolling(false)
      if (onShare && share) onShare({ dice: final, power, tags: usedTags, note: mode === 'mitigate' ? 'mitigation' : mode === 'blaze' ? 'blaze' : '' })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return }
    setRolling(true)
    let n = 0
    const timer = setInterval(() => {
      if (++n >= 8) { clearInterval(timer); finish() } else setDice([rollD6(), rollD6()])
    }, 60)
  }

  function reset() {
    setSelected(new Set()); setBurnKey(null); setExtraPos(0); setExtraNeg(0)
    setStatusPicks(new Set()); setManualBest(0); setManualWorst(0); setScaleGap(0); setDice(null); setApplied(null)
  }

  function apply() {
    if (!character || !onApply) return
    const sel = {
      positive: chosen.filter(c => c.sign > 0).map(c => c.ref),
      weaknesses: chosen.filter(c => c.sign < 0 && c.ref.kind !== 'story').map(c => c.ref),
      burnedForPower: burned ? chosen.find(c => refKey(c.ref) === burnKey)?.ref ?? null : null,
    }
    const { character: next, changes } = applyRoll(character, sel)
    onApply(next)
    setApplied(changes.length ? changes : ['Nothing to update on the sheet.'])
  }

  const groups = [...new Set(chips.map(c => c.group))]
  const hasSheetChanges = burned || chosen.some(c => c.sign < 0 && c.ref.kind !== 'story') || chosen.some(c => c.ref.kind === 'relationship')

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px] items-start">
      <div className="space-y-5">
        {mode === 'blaze' && character && (
          <section className="panel p-4 space-y-4" aria-labelledby="blaze-heading" style={{ borderColor: '#ff8c42' }}>
            <h2 id="blaze-heading" className="font-display text-xl tracking-widest flex items-center gap-2" style={{ color: '#ff8c42' }}>
              GO OUT IN A BLAZE
              <InfoTip label="Going Out in a Blaze">Push past every limit to achieve something beyond your abilities. Describe the outcome; the MC sets the degree of sacrifice and you agree which theme is at stake. Roll 2d6 + the number of themes you have of that theme’s type — no tags or statuses count (core book p.123).</InfoTip>
            </h2>
            <label className="block">
              <span className="field-label">THEME AT STAKE</span>
              <select className="input" value={stake} onChange={e => { setStake(Number(e.target.value)); setDice(null) }}>
                {character.themes.map((t, i) => t.themeType && <option key={i} value={i}>{t.name || t.themeType} ({t.category})</option>)}
              </select>
            </label>
            <fieldset className="space-y-1.5">
              <legend className="field-label">DEGREE OF SACRIFICE (THE MC DECIDES)</legend>
              {BLAZE_DEGREES.map(d => (
                <label key={d.key} className="flex items-start gap-3 rounded-lg p-2 cursor-pointer" style={{ background: degree === d.key ? 'rgba(255,140,66,0.12)' : 'var(--bg-inset)', border: `1px solid ${degree === d.key ? '#ff8c42' : 'var(--border-card)'}` }}>
                  <input type="radio" name="blaze-degree" className="mt-1" checked={degree === d.key} onChange={() => { setDegree(d.key); setDice(null) }} />
                  <span><b>{d.label}</b> — <span style={{ color: 'var(--text-soft)' }}>{d.examples}</span><br /><span className="text-sm" style={{ color: '#ff8c42' }}>Price: {d.price}</span></span>
                </label>
              ))}
            </fieldset>
          </section>
        )}
        {mode !== 'blaze' && character && (
          <section className="panel p-4" aria-labelledby="roll-tags">
            <h2 id="roll-tags" className="font-display text-xl tracking-widest mb-1">YOUR TAGS</h2>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Tap every tag that’s <b>directly</b> relevant. Burned and unpacked tags aren’t listed.</p>
            {chips.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No tags on this sheet yet.</p>}
            <div className="space-y-3">
              {groups.map(g => (
                <div key={g}>
                  <div className="font-display tracking-widest text-sm mb-1" style={{ color: chips.find(c => c.group === g)?.color ?? 'var(--text-muted)' }}>{g.toUpperCase()}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {chips.filter(c => c.group === g).map(c => {
                      const k = refKey(c.ref)
                      const on = selected.has(k)
                      return (
                        <span key={k} className="inline-flex items-stretch rounded-lg overflow-hidden" style={{ border: `1px solid ${on ? (c.sign > 0 ? 'var(--accent-lime)' : 'var(--danger)') : 'var(--border-card)'}` }}>
                          <button type="button" onClick={() => toggle(c)} aria-pressed={on} className="px-2.5 text-left italic font-semibold"
                            style={{ minHeight: 40, background: on ? (c.sign > 0 ? 'rgba(200,255,0,0.14)' : 'rgba(255,59,92,0.14)') : 'var(--bg-inset)' }}>
                            <span className="not-italic font-display mr-1" style={{ color: c.sign > 0 ? 'var(--accent-lime)' : 'var(--danger)' }}>{c.sign > 0 ? '+1' : '−1'}</span>
                            {c.text}
                            {c.note && <span className="not-italic text-xs ml-1" style={{ color: 'var(--text-muted)' }}>· {c.note}</span>}
                            {c.covers && <span className="block not-italic text-xs" style={{ color: 'var(--text-muted)' }}>↳ {c.covers}</span>}
                          </button>
                          {on && c.burnable && (
                            <button type="button" onClick={() => { setBurnKey(burnKey === k ? null : k); setDice(null) }} aria-pressed={burnKey === k}
                              aria-label={`Burn ${c.text} for +3 Power`} title="Burn for +3 instead of +1"
                              className="px-2 flex items-center" style={{ background: burnKey === k ? '#e07b00' : 'var(--bg-card-alt)', color: burnKey === k ? '#fff' : '#e07b00' }}>
                              <Flame size={15} fill={burnKey === k ? 'currentColor' : 'none'} />
                            </button>
                          )}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {statuses.length > 0 && (
              <div className="mt-4">
                <div className="font-display tracking-widest text-sm mb-1" style={{ color: 'var(--text-muted)' }}>YOUR STATUSES (TAP IF RELEVANT)</div>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((s, i) => {
                    const on = statusPicks.has(i)
                    const good = s.type === 'helpful'
                    return (
                      <button key={i} type="button" aria-pressed={on} onClick={() => { setStatusPicks(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n }); setDice(null) }}
                        className="px-2.5 rounded-lg font-semibold" style={{ minHeight: 40, border: `1px solid ${on ? (good ? 'var(--accent-lime)' : 'var(--danger)') : 'var(--border-card)'}`, background: on ? (good ? 'rgba(200,255,0,0.14)' : 'rgba(255,59,92,0.14)') : 'var(--bg-inset)' }}>
                        {s.name}-{s.tier}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {mode !== 'blaze' && <section className="panel p-4 space-y-3" aria-labelledby="roll-other">
          <h2 id="roll-other" className="font-display text-xl tracking-widest">{character ? 'EVERYTHING ELSE' : 'COUNT YOUR POWER'}</h2>
          {character && mode === 'action' && (
            <label className="block">
              <span className="text-[15px] font-semibold flex items-center gap-2 mb-1">Count Power from
                <InfoTip label="rolling with a theme type">For actions about humanity, the mythic, or technology in general — sensing a Source, figuring out strange tech, resisting a change to who you are — you may use the number of your themes of that type instead of positive tags. Negative tags and statuses still count; you can’t burn a tag for Power.</InfoTip>
              </span>
              <select className="input" value={rollWith} onChange={e => { setRollWith(e.target.value as typeof rollWith); setDice(null) }}>
                <option value="">Positive tags (normal)</option>
                {(['self', 'mythos', 'noise'] as const).map(cat => {
                  const n = character.themes.filter(t => t.themeType && t.category === cat).length
                  return <option key={cat} value={cat} disabled={n === 0}>Roll with {cat[0].toUpperCase() + cat.slice(1)} ({n})</option>
                })}
              </select>
            </label>
          )}
          <Counter label={character ? 'Other helpful tags' : 'Helpful tags'} value={extraPos} onChange={v => { setExtraPos(v); setDice(null) }}
            help="+1 each: tags that directly help — a crewmate’s tag, your target’s weakness, the environment." />
          <Counter label={character ? 'Other hindering tags' : 'Hindering tags'} value={extraNeg} onChange={v => { setExtraNeg(v); setDice(null) }}
            help="−1 each: tags that directly get in the way — the target’s armor, smoke, rough terrain, your own weakness tags." />
          {!character && (
            <label className="flex items-center gap-3 font-semibold" style={{ minHeight: 40 }}>
              <input type="checkbox" className="w-5 h-5 accent-[#e07b00]" checked={burnKey === 'manual'} onChange={e => { setBurnKey(e.target.checked ? 'manual' : null); if (e.target.checked) setSelected(new Set(['manual'])); setDice(null) }} />
              <Flame size={16} style={{ color: '#e07b00' }} aria-hidden /> Burning one of those tags for Power (+2 more)
            </label>
          )}
          <TierPicker label="Best helpful status" value={manualBest} onChange={v => { setManualBest(v); setDice(null) }}
            help="Only your single highest relevant helpful status counts — add its tier." />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-semibold flex items-center gap-2">Scale gap<InfoTip label="Scale gap">When the target (or the effect you want) is bigger than you — a gang, a building, the whole crew — lose 1 Power per Scale step. Gain it when your side is bigger. PCs are Scale 0; a few people or a room is 1, a dozen or a house is 2, dozens or a skyscraper 3, an army or a block 4.</InfoTip></span>
            <div className="flex items-center gap-1">
              <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 40, minWidth: 40 }} onClick={() => { setScaleGap(g => Math.max(-4, g - 1)); setDice(null) }} aria-label="Target is bigger"><Minus size={16} /></button>
              <span className="w-10 text-center font-display text-2xl" aria-live="polite">{scaleGap > 0 ? `+${scaleGap}` : scaleGap}</span>
              <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 40, minWidth: 40 }} onClick={() => { setScaleGap(g => Math.min(4, g + 1)); setDice(null) }} aria-label="Your side is bigger"><Plus size={16} /></button>
            </div>
          </div>
          <TierPicker label="Worst hindering status" value={manualWorst} onChange={v => { setManualWorst(v); setDice(null) }}
            help="Only the single highest relevant negative status counts — yours, or one on the target that stops you (e.g. their behind-cover)." />
        </section>}
      </div>

      {/* Phones: the result column sits below every tag, so keep Power and the roll button in reach. */}
      {!dice && (
        <div className="lg:hidden sticky bottom-0 z-10 -mx-1 px-3 py-2 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(8,12,24,0.95)', border: '1px solid var(--border-card)', boxShadow: '0 -8px 24px rgba(0,0,0,0.5)' }}>
          <div className="font-display leading-none" style={{ fontSize: 36, color: power > 0 ? 'var(--accent-lime)' : power < 0 ? 'var(--danger)' : 'var(--text-soft)' }} aria-hidden>
            {power > 0 ? `+${power}` : power}
          </div>
          <div className="text-xs font-display tracking-widest flex-1" style={{ color: 'var(--text-muted)' }}>POWER</div>
          <button type="button" className="btn btn-primary" style={{ minHeight: 48 }} disabled={rolling}
            onClick={() => { roll(); resultRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }) }}>
            <Dices size={20} aria-hidden /> ROLL 2D6
          </button>
        </div>
      )}

      {/* Result column: sticks in view on desktop */}
      <aside ref={resultRef} className="panel p-4 lg:sticky scroll-mt-4" style={{ top: 'calc(var(--nav-height) + 16px)' }} aria-labelledby="roll-result">
        <div className="flex rounded-lg overflow-hidden mb-3" role="group" aria-label="Roll type" style={{ border: '1px solid var(--border-card)' }}>
          {(character ? (['action', 'mitigate', 'blaze'] as const) : (['action', 'mitigate'] as const)).map(m => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => { setMode(m); setDice(null) }} className="flex-1 font-display tracking-widest"
              style={{ minHeight: 40, background: mode === m ? 'var(--accent-lime)' : 'transparent', color: mode === m ? 'var(--bg-dark)' : 'var(--text-muted)' }}>
              {m === 'action' ? 'ACTION' : m === 'mitigate' ? 'MITIGATE' : 'BLAZE'}
            </button>
          ))}
        </div>
        <h2 id="roll-result" className="font-display text-xl tracking-widest flex items-center gap-2">
          POWER
          {mode === 'mitigate' && <InfoTip label="mitigating">Roll to soften Consequences the MC just dealt you. Count tags that help you resist. On a hit, each point of Power blocks 1 incoming status tier, or 2 Power blocks a tag you’d gain or lose. A strong hit adds +1. You can’t reuse tags or statuses that were part of the action that caused the Consequences.</InfoTip>}
        </h2>
        <div className="font-display leading-none my-1" style={{ fontSize: 64, color: power > 0 ? 'var(--accent-lime)' : power < 0 ? 'var(--danger)' : 'var(--text-soft)' }} aria-live="polite">
          {power > 0 ? `+${power}` : power}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {mode === 'blaze' ? `${blazePower} ${stakeTheme?.category ?? ''} theme${blazePower === 1 ? '' : 's'} — nothing else counts` : rollWith ? `${categoryCount} ${rollWith} theme${categoryCount === 1 ? '' : 's'} · ${negative} hindering${best ? ` · +${best} status` : ''}${worst ? ` · −${worst} status` : ''}` : <>{positive} helpful{cap != null && rawPositive > cap ? ` (capped at ${cap})` : ''}{burned ? ' (one burned: +3)' : ''} · {negative} hindering{best ? ` · +${best} status` : ''}{worst ? ` · −${worst} status` : ''}{scaleGap ? ` · Scale ${scaleGap > 0 ? '+' : ''}${scaleGap}` : ''}
        </>}</p>

        {onShare && (
          <label className="flex items-center gap-2 text-sm mt-3" style={{ minHeight: 36, color: 'var(--text-soft)' }}>
            <input type="checkbox" className="w-4 h-4" checked={share} onChange={e => setShare(e.target.checked)} />
            Share this roll with the crew
          </label>
        )}
        <button type="button" className="btn btn-primary w-full mt-3" style={{ minHeight: 56, fontSize: 22 }} onClick={roll} disabled={rolling}>
          <Dices size={22} aria-hidden /> {dice ? 'ROLL AGAIN' : 'ROLL 2D6'}
        </button>

        {dice && result && (
          <div className="mt-4" aria-live="polite">
            <div className="flex items-center justify-center gap-3">
              {dice.map((d, i) => <div key={i} className="die" aria-label={`Die ${i + 1}: ${d}`}>{d}</div>)}
              <span className="font-display text-2xl" style={{ color: 'var(--text-muted)' }}>{rolledPower >= 0 ? '+' : '−'} {Math.abs(rolledPower)}</span>
              <span className="font-display text-4xl">= {result.total}</span>
            </div>
            {!rolling && (
              <>
                <div className="text-center font-display text-3xl tracking-widest mt-2" style={{ color: OUTCOME_TEXT[result.outcome].color }}>{OUTCOME_TEXT[result.outcome].label}</div>
                {dice[0] === 1 && dice[1] === 1 && <p className="text-center text-sm">Snake eyes always miss.</p>}
                {dice[0] === 6 && dice[1] === 6 && <p className="text-center text-sm">Boxcars always hit strong.</p>}
                <p className="text-[15px] mt-1" style={{ color: 'var(--text-soft)' }}>
                  {mode === 'blaze'
                    ? `${blazeResult(degree, result.outcome).succeeds ? 'You pull it off.' : 'It fails.'} Price: ${blazeResult(degree, result.outcome).price}. These Consequences can’t be mitigated.`
                    : mode === 'mitigate'
                    ? result.outcome === 'miss'
                      ? 'You take the Consequences as dealt.'
                      : `You may spend ${Math.max(rolledPower, 1) + (result.outcome === 'strong' ? 1 : 0)} Power to block them: 1 per status tier, 2 per tag.`
                    : OUTCOME_TEXT[result.outcome].text}
                </p>
                {mode === 'action' && result.outcome !== 'miss' && (
                  <div className="mt-3 rounded-lg p-3" style={{ background: 'var(--bg-inset)' }}>
                    <div className="font-display tracking-widest">POWER FOR EFFECTS: {spendablePower(rolledPower, result.outcome, pushed)}</div>
                    {result.outcome === 'strong' && (
                      <label className="flex items-center gap-2 text-sm mt-1" style={{ minHeight: 36 }}>
                        <input type="checkbox" className="w-4 h-4" checked={pushed} onChange={e => setPushed(e.target.checked)} />
                        Take Consequences for a greater success (+1)
                      </label>
                    )}
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      Only if the MC asks for Effects. <Link href="/guide/effects" className="underline">See Effects</Link>.
                      {rules?.enhanceCost === 2 && ' In this campaign, Enhance costs 2 Power per tier.'}
                    </p>
                  </div>
                )}
                {mode === 'action' && result.outcome !== 'miss' && character && challenges && challenges.length > 0 && (
                  <ApplyToChallenge campaignId={character.campaignId} challenges={challenges} power={spendablePower(rolledPower, result.outcome, pushed)} />
                )}
                {character && onApply && hasSheetChanges && !applied && (
                  <button type="button" className="btn btn-ghost w-full mt-3" onClick={apply}>
                    <Check size={16} aria-hidden /> UPDATE MY SHEET
                  </button>
                )}
                {applied && (
                  <ul className="mt-3 text-sm space-y-1" style={{ color: 'var(--accent-lime)' }}>
                    {applied.map(a => <li key={a}>✓ {a}</li>)}
                  </ul>
                )}
              </>
            )}
          </div>
        )}

        <button type="button" className="btn btn-ghost btn-sm w-full mt-4" onClick={reset}><RotateCcw size={14} aria-hidden /> CLEAR</button>
      </aside>
    </div>
  )
}
