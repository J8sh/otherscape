'use client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, RotateCcw, Sparkles, Trash2, AlertTriangle } from 'lucide-react'
import { Tooltip, InfoTip } from '@/components/ui/Tooltip'
import { BoxTrack, CardStrip, LegendChip, LinedField, PaperCard, TagSlot, ViewButton } from '@/components/sheet/primitives'
import { ThemeSpecialsPicker } from '@/components/cards/ThemeSpecialsPicker'
import { ThemeQuestions } from '@/components/cards/ThemeQuestions'
import { THEME_QUESTIONS } from '@/lib/themeQuestions'
import { CATEGORY_META } from '@/lib/themeMeta'
import { DECAY_BOXES, UPGRADE_BOXES } from '@/lib/rules'
import type { IThemeCard, ITag, ThemeType } from '@/types'

// Cards start expanded on tablet/desktop (≥768px) and collapsed on phones.
const DESKTOP_QUERY = '(min-width: 768px)'

const NEW_POWER_TAG: ITag = { text: '', isPower: true, isWeakness: false, isBurned: false, isTitle: false }
const NEW_WEAKNESS_TAG: ITag = { text: '', isPower: false, isWeakness: true, isBurned: false, isTitle: false }

/** Unflagged tags with text (typed before power/weakness were split) count as power. */
function isPowerTag(t: ITag) {
  return !t.isWeakness && (t.isPower || !!t.isTitle || t.text.trim() !== '')
}

interface Props {
  theme: IThemeCard
  index: number
  onChange: (theme: IThemeCard) => void
  /** Reopen the Theme Book to change kit or pick more of its tags. */
  onEdit: () => void
  onDelete: () => void
  /** Decay is full: lose this theme (the slot handles Evolution points). */
  onReplace?: () => void
  /** Spend an upgrade on Evolution. */
  onMarkEvolution?: () => void
}

/**
 * A theme card laid out like the printed :Otherscape card: lime band, tag
 * slots with burn flames (weaknesses striped), the motivation lines, and the
 * Upgrade / Decay tracks. Its back holds the Theme Specials.
 */
export function ThemeCard({ theme, index, onChange, onEdit, onDelete, onReplace, onMarkEvolution }: Props) {
  const meta = CATEGORY_META[theme.category]
  const [collapsed, setCollapsed] = useState(false)
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [focusIndex, setFocusIndex] = useState<number | null>(null)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const apply = () => setCollapsed(!mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  const update = (patch: Partial<IThemeCard>) => onChange({ ...theme, ...patch })

  function updateTag(i: number, patch: Partial<ITag>) {
    update({ tags: theme.tags.map((t, idx) => idx === i ? { ...t, ...patch } : t) })
  }

  // The title tag is the theme's single main power tag.
  function toggleTitle(i: number) {
    const makeTitle = !theme.tags[i].isTitle
    update({
      tags: theme.tags.map((t, idx) => {
        if (idx === i) return makeTitle ? { ...t, isTitle: true, isPower: true, isWeakness: false } : { ...t, isTitle: false }
        return makeTitle ? { ...t, isTitle: false } : t
      }),
    })
  }

  function addTag(tag: ITag, patch: Partial<IThemeCard> = {}) {
    setFocusIndex(theme.tags.length)
    setCollapsed(false)
    setSide('front')
    onChange({ ...theme, ...patch, tags: [...theme.tags, { ...tag }] })
  }

  function removeTag(i: number) {
    setFocusIndex(null)
    update({ tags: theme.tags.filter((_, idx) => idx !== i) })
  }

  const rows = theme.tags.map((tag, i) => ({ tag, i }))
  const powerRows = rows.filter(r => isPowerTag(r.tag)).sort((a, b) => Number(!!b.tag.isTitle) - Number(!!a.tag.isTitle))
  const weaknessRows = rows.filter(r => r.tag.isWeakness)
  const burnedCount = powerRows.filter(r => r.tag.isBurned).length
  const nascent = !!theme.nascent && powerRows.length < 3
  const upgradeReady = theme.upgrade >= UPGRADE_BOXES
  const decayFull = theme.decay >= DECAY_BOXES

  // Marking the upgrade track on a nascent theme grants a power tag instead.
  function setUpgrade(v: number) {
    if (nascent && v > theme.upgrade) {
      addTag(NEW_POWER_TAG, { nascent: powerRows.length + 1 < 3 })
      return
    }
    update({ upgrade: v })
  }

  const iconBtn = 'flex items-center justify-center rounded-lg transition-colors hover:bg-black/10'

  return (
    <PaperCard accent="var(--accent-lime)" label={`Theme ${index + 1}: ${theme.name || theme.themeType}`}>
      {/* Band: category, type and actions on top; the name gets the full width below */}
      <div className="paper-band flex-col" style={{ alignItems: 'stretch', gap: 2 }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Tooltip content={meta.blurb}>
              <span className="font-display tracking-widest text-sm px-2 rounded-full cursor-help" style={{ background: meta.color, color: '#fff', lineHeight: '22px' }}>
                {meta.label}
              </span>
            </Tooltip>
            <span className="font-semibold text-sm">{theme.themeType}</span>
            {nascent && (
              <Tooltip content="Nascent theme: a replacement theme starts with only its title tag. Until it has 3 power tags, each upgrade mark gives a new power tag instead.">
                <span className="chip cursor-help" style={{ color: '#10140a', borderColor: '#10140a55' }}>NASCENT</span>
              </Tooltip>
            )}
            {burnedCount > 0 && <span className="chip" style={{ color: '#8a4b00', borderColor: '#8a4b0055' }}>{burnedCount} BURNED</span>}
          </div>
          <div className="flex items-center gap-0.5 -mr-1">
          <Tooltip content={side === 'front' ? 'Flip to the back: Theme Specials' : 'Flip to the front: tags & tracks'}>
            <ViewButton onClick={() => { setSide(s => s === 'front' ? 'back' : 'front'); setCollapsed(false) }} className={iconBtn} style={{ width: 40, height: 40 }} label={side === 'front' ? 'Show Theme Specials' : 'Show tags'}>
              {side === 'front' ? <Sparkles size={17} /> : <RotateCcw size={17} />}
            </ViewButton>
          </Tooltip>
          <Tooltip content="Edit with the Theme Book: change the kit or add more of its tags.">
            <button type="button" onClick={onEdit} className={`${iconBtn} edit-only`} style={{ width: 40, height: 40 }} aria-label="Edit theme">
              <Pencil size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Clear this theme back to an empty slot.">
            <button type="button" onClick={onDelete} className={`${iconBtn} edit-only`} style={{ width: 40, height: 40 }} aria-label="Delete theme">
              <Trash2 size={16} />
            </button>
          </Tooltip>
          <ViewButton onClick={() => setCollapsed(c => !c)} className={iconBtn} style={{ width: 40, height: 40 }} expanded={!collapsed} label={collapsed ? 'Expand theme' : 'Collapse theme'}>
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </ViewButton>
        </div>
        </div>
        <input
          className="w-full bg-transparent outline-none font-display tracking-wide"
          style={{ fontSize: 26, lineHeight: 1.1, color: '#10140a' }}
          value={theme.name}
          onChange={e => update({ name: e.target.value })}
          placeholder="THEME NAME"
          aria-label="Theme name"
        />
      </div>

      {collapsed ? (
        <div className="px-3 pt-3 flex flex-wrap gap-1.5">
          {powerRows.filter(r => r.tag.text).map(({ tag, i }) => (
            <span key={i} className="text-sm font-semibold italic px-2 py-0.5 rounded" style={{ background: tag.isBurned ? '#fbe9d4' : 'var(--card-slot)', textDecoration: tag.isBurned ? 'line-through' : undefined, borderLeft: tag.isTitle ? '3px solid #b88a00' : undefined }}>
              {tag.text}
            </span>
          ))}
          {weaknessRows.filter(r => r.tag.text).map(({ tag, i }) => (
            <span key={i} className="text-sm font-semibold italic px-2 py-0.5 rounded" style={{ background: '#ecdfe2', color: '#7a3a48' }}>{tag.text}</span>
          ))}
          <span className="w-full text-xs font-display tracking-widest mt-1" style={{ color: 'var(--card-ink-soft)' }}>
            UPGRADE {theme.upgrade}/{UPGRADE_BOXES} · DECAY {theme.decay}/{DECAY_BOXES}
          </span>
        </div>
      ) : side === 'back' ? (
        <div className="pt-1">
          <ThemeSpecialsPicker
            themeType={theme.themeType as ThemeType}
            color={meta.color}
            specials={theme.specials}
            onChange={specials => update({ specials })}
          />
        </div>
      ) : (
        <>
          {decayFull && (
            <div role="alert" className="mx-3 mt-3 rounded-lg p-3" style={{ background: '#fde2e7', border: '1px solid #e8a0b0' }}>
              <div className="flex items-center gap-2 font-display tracking-widest" style={{ color: '#a01838' }}><AlertTriangle size={16} aria-hidden /> DECAY FULL</div>
              <p className="text-[15px] leading-snug my-1">You’ve turned your back on this theme’s {meta.motivation.toLowerCase()} three times. It’s replaced: you lose it, gain Evolution points, and start a new nascent theme.</p>
              {onReplace && <button type="button" className="btn btn-sm edit-only" style={{ background: '#a01838', color: '#fff' }} onClick={onReplace}>REPLACE THIS THEME</button>}
            </div>
          )}

          {upgradeReady && (
            <div className="mx-3 mt-3 rounded-lg p-3 edit-only" style={{ background: '#f3ffd0', border: '1px solid #b8d860' }}>
              <div className="font-display tracking-widest" style={{ color: '#3d5200' }}>UPGRADE EARNED — CHOOSE ONE</div>
              <p className="text-sm mb-2" style={{ color: 'var(--card-ink-soft)' }}>The track resets once you choose.</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => { update({ upgrade: 0 }); onEdit() }}>POWER TAG FROM KIT</button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => addTag(NEW_POWER_TAG, { upgrade: 0 })}>CUSTOM POWER TAG</button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => addTag(NEW_WEAKNESS_TAG, { upgrade: 0 })}>WEAKNESS TAG</button>
                <button type="button" className="btn btn-sm btn-ghost" onClick={() => { update({ upgrade: 0 }); setSide('back') }}>THEME SPECIAL</button>
                {theme.decay > 0 && <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0, decay: 0 })}>RESET DECAY</button>}
                {onMarkEvolution && <button type="button" className="btn btn-sm btn-ghost" onClick={() => { update({ upgrade: 0 }); onMarkEvolution() }}>MARK EVOLUTION</button>}
              </div>
            </div>
          )}

          <CardStrip right={<><LegendChip>POWER</LegendChip><LegendChip>WEAKNESS</LegendChip><LegendChip>BURN</LegendChip></>}>
            TAGS{' '}
            <InfoTip label="tags">
              Each power tag that helps an action adds +1 Power. The ★ title tag names the theme. Burn a tag (flame) for +3 Power once — it’s unusable until recovered. Each weakness tag that gets in the way is −1 Power, but marks an upgrade box on this theme.
            </InfoTip>
          </CardStrip>

          {powerRows.map(({ tag, i }) => (
            <TagSlot
              key={i}
              kind={tag.isTitle ? 'title' : 'power'}
              text={tag.text}
              burned={tag.isBurned}
              placeholder={tag.isTitle ? 'title tag…' : 'power tag…'}
              autoFocus={i === focusIndex}
              onFocus={() => focusIndex !== null && setFocusIndex(null)}
              onText={text => updateTag(i, { text })}
              onTitle={() => toggleTitle(i)}
              onBurn={() => updateTag(i, { isBurned: !tag.isBurned })}
              onRemove={() => removeTag(i)}
            />
          ))}
          {weaknessRows.map(({ tag, i }) => (
            <TagSlot
              key={i}
              kind="weakness"
              text={tag.text}
              placeholder="weakness tag…"
              autoFocus={i === focusIndex}
              onFocus={() => focusIndex !== null && setFocusIndex(null)}
              onText={text => updateTag(i, { text })}
              onRemove={() => removeTag(i)}
            />
          ))}

          <div className="flex gap-2 px-3 edit-only">
            <button type="button" className="flex-1 flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }} onClick={() => addTag(NEW_POWER_TAG)}>
              <Plus size={14} aria-hidden /> POWER TAG
            </button>
            <button type="button" className="flex-1 flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #c9a0a8', color: '#7a3a48' }} onClick={() => addTag(NEW_WEAKNESS_TAG)}>
              <Plus size={14} aria-hidden /> WEAKNESS TAG
            </button>
          </div>
          <ThemeQuestions questions={THEME_QUESTIONS[theme.themeType as ThemeType]} label={theme.themeType} onAddPower={() => addTag(NEW_POWER_TAG)} onAddWeakness={() => addTag(NEW_WEAKNESS_TAG)} />

          <CardStrip>
            IDENTITY / RITUAL / ITCH{' '}
            <InfoTip label={meta.motivation.toLowerCase()}>{meta.motivationHelp}</InfoTip>
          </CardStrip>
          <div className="px-3">
            <div className="font-display tracking-widest text-sm mb-0.5" style={{ color: meta.color }}>{meta.motivation}</div>
            <LinedField
              label={meta.motivation}
              value={theme.motivation}
              onChange={motivation => update({ motivation })}
              placeholder={`Your ${meta.motivation.toLowerCase()}…`}
            />
          </div>

          <div className="px-3 mt-3 flex justify-end">
            <div className="track-panel">
              <BoxTrack
                label="UPGRADE" value={Math.min(theme.upgrade, UPGRADE_BOXES)} max={UPGRADE_BOXES} onChange={setUpgrade}
                help="Mark when a weakness tag on this theme is invoked, when you sacrifice for its motivation, or in downtime. Three marks = an upgrade."
              />
              <BoxTrack
                label="DECAY" value={Math.min(theme.decay, DECAY_BOXES)} max={DECAY_BOXES} onChange={decay => update({ decay })} color="#a01838"
                help={`Mark when you act against this theme’s ${meta.motivation.toLowerCase()}. Three marks and the theme is replaced.`}
              />
            </div>
          </div>
        </>
      )}
    </PaperCard>
  )
}
