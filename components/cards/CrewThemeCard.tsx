'use client'
import { Plus, X } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { BoxTrack, CardStrip, LegendChip, LinedField, PaperCard, TagSlot } from '@/components/sheet/primitives'
import { DECAY_BOXES, UPGRADE_BOXES } from '@/lib/rules'
import { CREW_SPECIALS } from '@/lib/crewBook'
import { CrewKitPicker } from '@/components/cards/CrewKitPicker'
import { ThemeQuestions } from '@/components/cards/ThemeQuestions'
import { CREW_QUESTIONS } from '@/lib/themeQuestions'
import type { ICrewThemeCard, ITag } from '@/types'

interface Props {
  crew: ICrewThemeCard
  onChange: (crew: ICrewThemeCard) => void
  readOnly?: boolean
}

/**
 * The crew theme card: shared by every PC. Anyone can invoke its tags, but a
 * crew power tag burns when used (and can’t be burned for extra Power).
 */
export function CrewThemeCard({ crew, onChange, readOnly = false }: Props) {
  const tags = crew.tags ?? []
  const update = (patch: Partial<ICrewThemeCard>) => onChange({ ...crew, ...patch })
  const updateTag = (i: number, patch: Partial<ITag>) => update({ tags: tags.map((t, idx) => idx === i ? { ...t, ...patch } : t) })
  const rows = tags.map((tag, i) => ({ tag, i }))
  // Older crews stored unflagged tags; treat anything not marked weakness as power.
  const power = rows.filter(r => !r.tag.isWeakness)
  const weak = rows.filter(r => r.tag.isWeakness)

  return (
    <fieldset disabled={readOnly} className="min-w-0">
      <PaperCard accent="#7fe8ff" label="Crew theme card">
        <div className="paper-band flex-wrap" style={{ background: 'linear-gradient(90deg, #5fe0ff, #a8f0ff)' }}>
          <span className="font-display tracking-[0.2em] text-lg">CREW THEME</span>
          <InfoTip label="the crew theme">
            Shared by the whole crew: anyone can invoke these tags, but a crew power tag burns when used. Everyone is bound by the crew’s motivation — any PC acting against it marks Decay here. At the Credit Roll, recover one crew power tag per crew member.
          </InfoTip>
          <input
            className="w-full bg-transparent outline-none font-display tracking-wide"
            style={{ fontSize: 24, color: '#0b2733' }}
            value={crew.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="CREW NAME"
            aria-label="Crew theme name"
          />
        </div>

        {!readOnly && (
          <div className="px-3 pt-3 flex items-center gap-2 flex-wrap">
            <CrewKitPicker crew={crew} onApply={onChange} />
            <span className="text-sm" style={{ color: 'var(--card-ink-soft)' }}>Start from one of the book’s 8 crew kits.</span>
          </div>
        )}
        {crew.decay >= DECAY_BOXES && (
          <div role="alert" className="mx-3 mt-3 rounded-lg p-3" style={{ background: '#fde2e7', border: '1px solid #e8a0b0' }}>
            <div className="font-display tracking-widest" style={{ color: '#a01838' }}>CREW DECAY FULL</div>
            <p className="text-[15px] leading-snug">The crew theme is replaced: the crew breaks up, and has to find a new reason to work together before building a new (nascent) crew theme.</p>
          </div>
        )}
        {crew.upgrade >= UPGRADE_BOXES && !readOnly && (
          <div className="mx-3 mt-3 rounded-lg p-3" style={{ background: '#e3fbff', border: '1px solid #8fdcef' }}>
            <div className="font-display tracking-widest" style={{ color: '#0b5566' }}>CREW UPGRADE — DECIDE TOGETHER</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0, tags: [...tags, { text: '', isPower: true, isWeakness: false, isBurned: false }] })}>POWER TAG</button>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0, tags: [...tags, { text: '', isPower: false, isWeakness: true, isBurned: false }] })}>WEAKNESS TAG</button>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0 })}>CREW SPECIAL (PICK BELOW)</button>
              {crew.decay > 0 && <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0, decay: 0 })}>RESET DECAY</button>}
            </div>
          </div>
        )}
        <CardStrip right={<><LegendChip>POWER</LegendChip><LegendChip>WEAKNESS</LegendChip><LegendChip>BURN</LegendChip></>}>TAGS</CardStrip>
        {power.map(({ tag, i }, n) => (
          <TagSlot
            key={i}
            kind={n === 0 ? 'title' : 'power'}
            text={tag.text}
            burned={tag.isBurned}
            placeholder={n === 0 ? 'what the crew is…' : 'crew power tag…'}
            onText={text => updateTag(i, { text, isPower: true })}
            onBurn={() => updateTag(i, { isBurned: !tag.isBurned })}
            burnHelp="Crew power tags burn whenever someone invokes them. Recover them like your own tags, or one per crew member at the Credit Roll."
            onRemove={() => update({ tags: tags.filter((_, idx) => idx !== i) })}
          />
        ))}
        {weak.map(({ tag, i }) => (
          <TagSlot
            key={i}
            kind="weakness"
            text={tag.text}
            placeholder="crew weakness tag…"
            onText={text => updateTag(i, { text })}
            onRemove={() => update({ tags: tags.filter((_, idx) => idx !== i) })}
          />
        ))}
        <div className="flex gap-2 px-3 edit-only">
          <button type="button" className="flex-1 flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
            onClick={() => update({ tags: [...tags, { text: '', isPower: true, isWeakness: false, isBurned: false }] })}>
            <Plus size={14} aria-hidden /> POWER TAG
          </button>
          <button type="button" className="flex-1 flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #c9a0a8', color: '#7a3a48' }}
            onClick={() => update({ tags: [...tags, { text: '', isPower: false, isWeakness: true, isBurned: false }] })}>
            <Plus size={14} aria-hidden /> WEAKNESS
          </button>
        </div>
        {!readOnly && (
          <ThemeQuestions
            questions={CREW_QUESTIONS}
            label="Crew"
            onAddPower={() => update({ tags: [...tags, { text: '', isPower: true, isWeakness: false, isBurned: false }] })}
            onAddWeakness={() => update({ tags: [...tags, { text: '', isPower: false, isWeakness: true, isBurned: false }] })}
          />
        )}

        <CardStrip>IDENTITY / RITUAL / ITCH</CardStrip>
        <div className="px-3">
          <LinedField label="Crew motivation" value={crew.motivation} onChange={motivation => update({ motivation })} placeholder="What holds this crew together…" />
        </div>

        <CardStrip>CREW THEME SPECIALS</CardStrip>
        <div className="px-3 space-y-1.5">
          {crew.specials.map((name, i) => {
            const book = CREW_SPECIALS.find(sp => sp.name === name)
            return book ? (
              <div key={i} className="rounded-lg px-3 py-2 flex items-start justify-between gap-2" style={{ background: 'var(--card-slot)', borderLeft: '5px solid #29c8f2' }}>
                <div>
                  <div className="font-display tracking-wide text-lg leading-tight">{book.name}</div>
                  <p className="text-[15px] leading-snug" style={{ color: 'var(--card-ink-soft)' }}>{book.summary}</p>
                </div>
                <button type="button" className="slot-btn remove edit-only shrink-0" onClick={() => update({ specials: crew.specials.filter((_, idx) => idx !== i) })} aria-label={`Remove ${name}`}><X size={14} /></button>
              </div>
            ) : (
              <div key={i} className="-mx-3">
                <TagSlot kind="power" text={name} placeholder="custom crew special…"
                  onText={text => update({ specials: crew.specials.map((x, idx) => idx === i ? text : x) })}
                  onRemove={() => update({ specials: crew.specials.filter((_, idx) => idx !== i) })} />
              </div>
            )
          })}
          <div className="edit-only flex gap-2">
            <select
              className="flex-1 rounded-lg px-2 font-semibold"
              style={{ minHeight: 40, border: '2px dashed #a7b0bd', background: 'transparent', color: 'var(--card-ink-soft)' }}
              value=""
              onChange={e => { if (e.target.value) update({ specials: [...crew.specials, e.target.value === '__custom' ? '' : e.target.value] }) }}
              aria-label="Add a crew special"
            >
              <option value="">+ Add a crew special (with a crew upgrade)…</option>
              {CREW_SPECIALS.filter(sp => !crew.specials.includes(sp.name)).map(sp => <option key={sp.name} value={sp.name}>{sp.name}</option>)}
              <option value="__custom">Custom…</option>
            </select>
          </div>
        </div>

        <div className="px-3 mt-3 flex justify-end">
          <div className="track-panel" style={{ background: '#a8f0ff' }}>
            <BoxTrack label="UPGRADE" value={Math.min(crew.upgrade, UPGRADE_BOXES)} max={UPGRADE_BOXES} onChange={upgrade => update({ upgrade })}
              help="Mark when the MC invokes a crew weakness or relationship tag, when someone spends downtime on the crew, or sacrifices for the crew’s motivation. Three = a crew upgrade, chosen together." />
            <BoxTrack label="DECAY" value={Math.min(crew.decay, DECAY_BOXES)} max={DECAY_BOXES} onChange={decay => update({ decay })} color="#a01838"
              help="Mark whenever any crew member acts against the crew’s motivation. Three, and the crew breaks up." />
          </div>
        </div>
      </PaperCard>
    </fieldset>
  )
}
