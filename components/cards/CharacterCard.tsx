'use client'
import { Plus } from 'lucide-react'
import { Tooltip, InfoTip } from '@/components/ui/Tooltip'
import { BoxTrack, CardStrip, PaperCard, TagSlot } from '@/components/sheet/primitives'
import { EssenceWeb } from '@/components/cards/EssenceWeb'
import { ESSENCE_INFO, MOMENTS, VETERAN_SPECIALS } from '@/lib/essence'
import { EVOLUTION_TRACK, essenceOf, type Category } from '@/lib/rules'
import type { ICharacter, ICrewRelationship, IEvolution } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface Props {
  character: ICharacter
  onChange: (character: ICharacter) => void
}

const VETERAN_KEYS: (keyof IEvolution)[] = ['veteranSpecial1', 'veteranSpecial2', 'veteranSpecial3']

/** Example relationship tags from the core book (p.177). */
const RELATIONSHIP_IDEAS = [
  'admiring', 'amused', 'angry', 'appreciative', 'bad blood', 'bossing them around', 'casual lover', 'communication failure',
  'crushing', 'friendly', 'good vibes', 'hatred', 'have their back', 'in love', 'indebted', 'indifferent', 'jealous',
  'leverage on them', 'look down on them', 'mentoring', 'mocking', 'need them for…', 'offended', 'painful to watch',
  'party together', 'pining', 'protective', 'remind me of…', 'resentful', 'rival', 'soulmates', 'submissive', 'supportive',
  'tandem', 'work well together',
]

/**
 * The character card, front and back, as on the printed sheet. Front: name,
 * player, the Essence hexagon and crew relationship tags. Back: Evolution
 * track and Moments of Evolution, plus Specials.
 */
export function CharacterCard({ character, onChange }: Props) {
  const categories = character.themes.filter(t => t.themeType).map(t => t.category as Category)
  const mythosSameSource = character.essence?.mythosSameSource ?? false
  const essence = essenceOf(categories, mythosSameSource)
  const info = essence ? ESSENCE_INFO[essence] : null
  const mythosOnly = categories.length > 0 && categories.every(c => c === 'mythos')
  const evo = character.evolution
  const points = evo.points ?? 0
  const veterans = evo.veteranSpecials ?? []
  const veteranSlots = VETERAN_KEYS.filter(k => evo[k]).length

  const toast = useToast()
  const update = (patch: Partial<ICharacter>) => onChange({ ...character, ...patch })
  const updateEvolution = (patch: Partial<IEvolution>) => update({ evolution: { ...evo, ...patch } })

  function updateRelationship(i: number, patch: Partial<ICrewRelationship>) {
    update({ crewRelationships: character.crewRelationships.map((r, idx) => idx === i ? { ...r, ...patch } : r) })
  }

  function setPoints(v: number) {
    if (v >= EVOLUTION_TRACK) {
      toast({ kind: 'success', title: 'MOMENT OF EVOLUTION', message: 'Your Evolution track resets — check one Moment below and work out what it means with your MC.' })
      updateEvolution({ points: 0 })
    } else {
      updateEvolution({ points: v })
    }
  }

  function toggleVeteran(name: string) {
    const has = veterans.includes(name)
    if (!has && veterans.length >= veteranSlots) {
      toast({ kind: 'warning', message: 'Each “Gain a Veteran Special” Moment unlocks one Veteran Special. Check one of those Moments first.' })
      return
    }
    updateEvolution({ veteranSpecials: has ? veterans.filter(v => v !== name) : [...veterans, name] })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* FRONT */}
      <PaperCard label="Character card">
        <div className="paper-band"><span className="font-display tracking-[0.2em] text-lg">CHARACTER CARD</span></div>

        <div className="px-3 pt-3">
          <input
            className="w-full rounded-lg px-3 font-display tracking-wide outline-none"
            style={{ background: 'var(--card-slot)', fontSize: 34, lineHeight: '52px', minHeight: 52 }}
            value={character.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="CHARACTER NAME"
            aria-label="Character name"
          />
        </div>
        <CardStrip>PLAYER</CardStrip>
        <div className="px-3">
          <input
            className="w-full rounded-lg px-3 outline-none font-semibold"
            style={{ background: 'var(--card-slot)', fontSize: 18, minHeight: 44 }}
            value={character.player}
            onChange={e => update({ player: e.target.value })}
            placeholder="Player name"
            aria-label="Player"
          />
        </div>

        <CardStrip>
          ESSENCE{' '}
          <InfoTip label="Essence">
            Your Essence comes from which theme categories you have — Self, Mythos, Noise — and grants one Essence Special. It changes when you replace themes.
          </InfoTip>
        </CardStrip>
        <div className="px-3 flex flex-col sm:flex-row items-center gap-3">
          <EssenceWeb categories={categories} essence={essence} />
          <div className="flex-1 min-w-0">
            {info ? (
              <>
                <div className="font-display text-2xl tracking-widest leading-none">{essence}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--card-ink-soft)' }}>{info.mix}</div>
                <p className="text-[15px] leading-snug">{info.summary}</p>
                <div className="mt-2 rounded-lg p-2" style={{ background: 'var(--card-slot)', borderLeft: '5px solid var(--accent-lime)' }}>
                  <div className="font-display tracking-widest text-sm">ESSENCE SPECIAL</div>
                  <p className="text-[15px] leading-snug">{info.special}</p>
                </div>
              </>
            ) : (
              <p className="text-[15px]" style={{ color: 'var(--card-ink-soft)' }}>Add themes to see your Essence.</p>
            )}
            {mythosOnly && (
              <label className="flex items-center gap-2 mt-2 text-[15px] font-semibold cursor-pointer" style={{ minHeight: 40 }}>
                <input type="checkbox" className="w-5 h-5 accent-[#a66bff]" checked={mythosSameSource} onChange={e => update({ essence: { mythosSameSource: e.target.checked } })} />
                All my Mythos themes share one Source (Avatar)
              </label>
            )}
          </div>
        </div>

        <CardStrip>
          CREW RELATIONSHIPS{' '}
          <InfoTip label="crew relationships">
            One tag for each other player character. Use it like any tag — but it’s burned when you invoke it, and it can’t be burned for extra Power. The MC can invoke it against you (mark an upgrade on the crew theme). Burned ones come back at the Credit Roll.
          </InfoTip>
        </CardStrip>
        <div className="space-y-1">
          {character.crewRelationships.map((rel, i) => (
            <div key={i}>
              <input
                className="mx-3 mb-0.5 bg-transparent outline-none font-display tracking-widest text-sm w-[calc(100%-24px)]"
                value={rel.crewMember}
                onChange={e => updateRelationship(i, { crewMember: e.target.value })}
                placeholder="CREW MEMBER"
                aria-label={`Crew member ${i + 1}`}
              />
              <TagSlot
                kind="story"
                text={rel.relationshipTag}
                burned={rel.isBurned}
                placeholder="relationship tag…"
                onText={relationshipTag => updateRelationship(i, { relationshipTag })}
                list="relationship-ideas"
                onBurn={() => updateRelationship(i, { isBurned: !rel.isBurned })}
                burnHelp="Crew relationship tags burn whenever you invoke them. They’re restored at the Credit Roll at the end of the session."
                onRemove={() => update({ crewRelationships: character.crewRelationships.filter((_, idx) => idx !== i) })}
              />
            </div>
          ))}
          <datalist id="relationship-ideas">{RELATIONSHIP_IDEAS.map(r => <option key={r} value={r} />)}</datalist>
          <div className="px-3 edit-only">
            <button type="button" className="w-full flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
              onClick={() => update({ crewRelationships: [...character.crewRelationships, { crewMember: '', relationshipTag: '', isBurned: false }] })}>
              <Plus size={14} aria-hidden /> RELATIONSHIP
            </button>
          </div>
        </div>
      </PaperCard>

      {/* BACK */}
      <PaperCard label="Character card — evolution and specials">
        <div className="paper-band"><span className="font-display tracking-[0.2em] text-lg">CHARACTER CARD</span></div>

        <CardStrip>
          EVOLUTION{' '}
          <InfoTip label="Evolution">
            Gain Evolution points by replacing a theme (1, plus 1 per extra power tag, extra weakness tag and Special it had) or by spending a theme upgrade. Five points = a Moment of Evolution; the track then resets.
          </InfoTip>
        </CardStrip>
        <div className="px-3">
          <div className="track-panel inline-flex">
            <BoxTrack label="POINTS" value={points} max={EVOLUTION_TRACK} onChange={setPoints} round />
          </div>
          <div className="font-display tracking-widest text-sm mt-3 mb-1">MOMENTS OF EVOLUTION <span style={{ color: 'var(--card-ink-soft)' }}>(each once)</span></div>
          <ul className="space-y-0.5">
            {MOMENTS.map(m => (
              <li key={m.key}>
                <Tooltip content={m.help}>
                  <label className="flex items-center gap-3 cursor-pointer rounded-md px-1 hover:bg-black/5" style={{ minHeight: 40 }}>
                    <input
                      type="checkbox"
                      className="w-5 h-5 shrink-0 accent-[#10140a]"
                      checked={!!evo[m.key]}
                      onChange={e => updateEvolution({ [m.key]: e.target.checked })}
                    />
                    <span className="text-[16px] font-semibold leading-tight">{m.label}</span>
                  </label>
                </Tooltip>
              </li>
            ))}
          </ul>

          {veteranSlots > 0 && (
            <div className="mt-3">
              <div className="font-display tracking-widest text-sm mb-1">VETERAN SPECIALS <span style={{ color: 'var(--card-ink-soft)' }}>({veterans.length}/{veteranSlots})</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {VETERAN_SPECIALS.map(v => {
                  const on = veterans.includes(v.name)
                  return (
                    <button
                      type="button"
                      key={v.name}
                      onClick={() => toggleVeteran(v.name)}
                      aria-pressed={on}
                      className="text-left rounded-lg px-2.5 py-1.5"
                      style={{ background: on ? 'var(--accent-lime)' : 'var(--card-slot)', border: `1px solid ${on ? '#8ab000' : '#d0d6de'}`, opacity: !on && veterans.length >= veteranSlots ? 0.55 : 1 }}
                    >
                      <div className="font-display tracking-wide">{v.name}</div>
                      <div className="text-sm leading-snug" style={{ color: 'var(--card-ink-soft)' }}>{v.summary}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {(character.themeHistory?.length ?? 0) > 0 && (
          <>
            <CardStrip>
              LOST THEMES{' '}
              <InfoTip label="lost themes">Themes replaced after their Decay track filled — your character’s ghost memories. Talk with your MC about the fallout.</InfoTip>
            </CardStrip>
            <ul className="px-3 space-y-1">
              {character.themeHistory!.map((h, i) => (
                <li key={i} className="text-[15px] flex justify-between gap-2" style={{ color: 'var(--card-ink-soft)' }}>
                  <span><b style={{ color: 'var(--card-ink)' }}>{h.name || h.themeType}</b> · {h.themeType}</span>
                  <span className="shrink-0">+{h.evolution} Evolution · {new Date(h.replacedAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <CardStrip>
          SPECIALS{' '}
          <InfoTip label="specials">
            Record special abilities here — your Essence Special is shown on the front automatically. Theme Specials live on the back of each theme card.
          </InfoTip>
        </CardStrip>
        <div className="space-y-1">
          {character.specials.map((s, i) => (
            <TagSlot
              key={i}
              kind="power"
              text={s}
              placeholder="special…"
              onText={text => update({ specials: character.specials.map((x, idx) => idx === i ? text : x) })}
              onRemove={() => update({ specials: character.specials.filter((_, idx) => idx !== i) })}
            />
          ))}
          <div className="px-3 edit-only">
            <button type="button" className="w-full flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
              onClick={() => update({ specials: [...character.specials, ''] })}>
              <Plus size={14} aria-hidden /> SPECIAL
            </button>
          </div>
        </div>
      </PaperCard>
    </div>
  )
}
