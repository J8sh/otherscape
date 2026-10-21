'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Dices, Flame, Minus, Plus, RotateCcw, Check } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { actionPower, rollOutcome, spendablePower, type Outcome } from '@/lib/rules'
import { applyRoll, refKey, rollD6, type TagRef } from '@/lib/roll'
import { CATEGORY_META } from '@/lib/themeMeta'
import type { ICharacter, IStatus } from '@/types'

interface Props {
  character?: ICharacter
  /** Save sheet changes caused by the roll (burns, upgrade marks). */
  onApply?: (character: ICharacter) => void
}

interface Chip { ref: TagRef; text: string; sign: 1 | -1; note?: string; burnable: boolean; group: string; color?: string }

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
      if (tag.isWeakness) chips.push({ ref: { kind: 'theme', theme: ti, tag: i }, text: tag.text, sign: -1, note: 'marks an upgrade', burnable: false, group, color })
      else if (!tag.isBurned) chips.push({ ref: { kind: 'theme', theme: ti, tag: i }, text: tag.text, sign: 1, burnable: true, group, color })
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

export function ActionRoller({ character, onApply }: Props) {
  const chips = useMemo(() => (character ? sheetChips(character) : []), [character])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [burnKey, setBurnKey] = useState<string | null>(null)
  const [extraPos, setExtraPos] = useState(0)
  const [extraNeg, setExtraNeg] = useState(0)
  const [statusPicks, setStatusPicks] = useState<Set<number>>(new Set())
  const [manualBest, setManualBest] = useState(0)
  const [manualWorst, setManualWorst] = useState(0)
  const [dice, setDice] = useState<[number, number] | null>(null)
  // Power is frozen when you roll, so updating the sheet afterwards
  // (which clears the tag picks) doesn't change the result shown.
  const [rolledPower, setRolledPower] = useState(0)
  const [rolling, setRolling] = useState(false)
  const [pushed, setPushed] = useState(false)
  const [applied, setApplied] = useState<string[] | null>(null)

  // A fresh sheet (after applying) invalidates selections by index.
  useEffect(() => { setSelected(new Set()); setBurnKey(null); setStatusPicks(new Set()) }, [character])

  const statuses: IStatus[] = character?.statuses ?? []
  const picked = statuses.filter((_, i) => statusPicks.has(i))
  const best = Math.max(manualBest, ...picked.filter(s => s.type === 'helpful').map(s => s.tier), 0)
  const worst = Math.max(manualWorst, ...picked.filter(s => s.type !== 'helpful' && s.type !== 'progress').map(s => s.tier), 0)
  const chosen = chips.filter(c => selected.has(refKey(c.ref)))
  const positive = chosen.filter(c => c.sign > 0).length + extraPos
  const negative = chosen.filter(c => c.sign < 0).length + extraNeg
  const burned = burnKey !== null && selected.has(burnKey)
  const power = actionPower({ positive, negative, burned, bestStatus: best, worstStatus: worst })
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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDice([rollD6(), rollD6()]); return }
    setRolling(true)
    let n = 0
    const timer = setInterval(() => {
      setDice([rollD6(), rollD6()])
      if (++n >= 8) { clearInterval(timer); setRolling(false) }
    }, 60)
  }

  function reset() {
    setSelected(new Set()); setBurnKey(null); setExtraPos(0); setExtraNeg(0)
    setStatusPicks(new Set()); setManualBest(0); setManualWorst(0); setDice(null); setApplied(null)
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
        {character && (
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

        <section className="panel p-4 space-y-3" aria-labelledby="roll-other">
          <h2 id="roll-other" className="font-display text-xl tracking-widest">{character ? 'EVERYTHING ELSE' : 'COUNT YOUR POWER'}</h2>
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
          <TierPicker label="Worst hindering status" value={manualWorst} onChange={v => { setManualWorst(v); setDice(null) }}
            help="Only the single highest relevant negative status counts — yours, or one on the target that stops you (e.g. their behind-cover)." />
        </section>
      </div>

      {/* Result column: sticks in view on desktop */}
      <aside className="panel p-4 lg:sticky" style={{ top: 'calc(var(--nav-height) + 16px)' }} aria-labelledby="roll-result">
        <h2 id="roll-result" className="font-display text-xl tracking-widest">POWER</h2>
        <div className="font-display leading-none my-1" style={{ fontSize: 64, color: power > 0 ? 'var(--accent-lime)' : power < 0 ? 'var(--danger)' : 'var(--text-soft)' }} aria-live="polite">
          {power > 0 ? `+${power}` : power}
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {positive} helpful{burned ? ' (one burned: +3)' : ''} · {negative} hindering{best ? ` · +${best} status` : ''}{worst ? ` · −${worst} status` : ''}
        </p>

        <button type="button" className="btn btn-primary w-full mt-4" style={{ minHeight: 56, fontSize: 22 }} onClick={roll} disabled={rolling}>
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
                <p className="text-[15px] mt-1" style={{ color: 'var(--text-soft)' }}>{OUTCOME_TEXT[result.outcome].text}</p>
                {result.outcome !== 'miss' && (
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
                    </p>
                  </div>
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
