'use client'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { Flame, Pencil, Trash2, ChevronDown, ChevronUp, Star, Plus, X } from 'lucide-react'
import { ThemeSpecialsPicker } from '@/components/cards/ThemeSpecialsPicker'
import type { IThemeCard, ITag, ThemeCategory, ThemeType } from '@/types'

// Cards default to expanded on tablet/desktop (≥768px) and collapsed on mobile.
const DESKTOP_QUERY = '(min-width: 768px)'

const CATEGORY_COLOR: Record<ThemeCategory, string> = {
  self: '#00d4ff',
  mythos: '#9b4dff',
  noise: '#c8ff00',
}

const CATEGORY_LABEL: Record<ThemeCategory, string> = {
  self: 'SELF',
  mythos: 'MYTHOS',
  noise: 'NOISE',
}

const MOTIVATION_LABEL: Record<ThemeCategory, string> = {
  self: 'IDENTITY',
  mythos: 'RITUAL',
  noise: 'ITCH',
}

const MOTIVATION_TOOLTIP: Record<ThemeCategory, string> = {
  self: 'Identity — the core of who you are that you must uphold. Acting against it marks Decay.',
  mythos: 'Ritual — what you must perform to maintain your connection with your Source. Neglecting it marks Decay.',
  noise: 'Itch — the impulse you must satisfy to stay integrated with your tech. Resisting it marks Decay.',
}

const TITLE_COLOR = '#ffcf4d'
const POWER_STYLE = { bg: '#1a3a1a', border: '#3a6a3a', text: '#90ee90' }
const TITLE_STYLE = { bg: '#3a2f10', border: '#6b5320', text: TITLE_COLOR }
const BURNED_STYLE = { bg: '#3d2800', border: '#6b3d00', text: '#cc7700' }
const WEAKNESS_STYLE = { bg: '#3a1a1a', border: '#6a3a3a', text: '#ee9090' }

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
  onEdit: () => void
  onDelete: () => void
}

function TrackDots({
  value, max, filledColor, label, tooltip, onChange,
}: {
  value: number; max: number; filledColor: string; label: string; tooltip: string; onChange: (v: number) => void
}) {
  return (
    <Tooltip content={tooltip}>
      <div className="flex flex-col items-center gap-1 cursor-help">
        <span style={{ color: '#7a8099', fontSize: 10, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em' }}>{label}</span>
        <div className="flex gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              onClick={() => onChange(value === i + 1 ? i : i + 1)}
              style={{
                width: 16, height: 16,
                borderRadius: 3,
                border: `1.5px solid ${i < value ? filledColor : '#2a3352'}`,
                background: i < value ? filledColor : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
      </div>
    </Tooltip>
  )
}

function TagInput({
  tag, style, placeholder, autoFocus, onFocus, onChange,
}: {
  tag: ITag; style: typeof POWER_STYLE; placeholder: string; autoFocus: boolean; onFocus: () => void; onChange: (text: string) => void
}) {
  return (
    <div
      className="flex-1 rounded px-2 py-1"
      style={{ background: style.bg, border: `1px solid ${style.border}`, opacity: tag.isBurned ? 0.7 : 1 }}
    >
      <input
        className="w-full bg-transparent outline-none text-sm"
        style={{ color: style.text, fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontStyle: 'italic' }}
        value={tag.text}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

function ToggleButton({
  label, tooltip, pressed, color, onClick, children,
}: {
  label: string; tooltip: string; pressed: boolean; color: string; onClick: () => void; children: React.ReactNode
}) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
        className="w-5 h-5 shrink-0 flex items-center justify-center rounded border transition-all"
        style={{
          background: pressed ? `${color}22` : 'transparent',
          borderColor: pressed ? color : '#2a3352',
          color: pressed ? color : '#3a4462',
        }}
      >
        {children}
      </button>
    </Tooltip>
  )
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-5 h-5 shrink-0 flex items-center justify-center rounded border transition-all"
      style={{ borderColor: '#2a3352', background: 'transparent', color: '#3a4462', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3b5c'; (e.currentTarget as HTMLButtonElement).style.color = '#ff3b5c' }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#3a4462' }}
    >
      <X size={11} />
    </button>
  )
}

function AddTagButton({ label, tooltip, color, onClick }: { label: string; tooltip: string; color: string; onClick: () => void }) {
  return (
    <Tooltip content={tooltip}>
      <button
        onClick={onClick}
        className="mt-1.5 flex items-center gap-1.5 font-display tracking-widest transition-all"
        style={{ fontSize: 11, padding: '5px 10px', borderRadius: 5, border: '1px dashed #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#7a8099' }}
      >
        <Plus size={11} /> {label}
      </button>
    </Tooltip>
  )
}

export function ThemeCard({ theme, index, onChange, onEdit, onDelete }: Props) {
  const color = CATEGORY_COLOR[theme.category]
  const [collapsed, setCollapsed] = useState(false)
  // Index of a just-added blank tag, so its input takes focus on mount.
  const [focusIndex, setFocusIndex] = useState<number | null>(null)

  // Follow the viewport: expanded on tablet/desktop, collapsed on mobile.
  // Runs after mount (viewport settled) and on each breakpoint crossing;
  // manual toggles via the chevron persist until the breakpoint changes.
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const apply = () => setCollapsed(!mql.matches)
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [])

  function updateField<K extends keyof IThemeCard>(key: K, value: IThemeCard[K]) {
    onChange({ ...theme, [key]: value })
  }

  function updateTag(i: number, field: keyof ITag, value: string | boolean) {
    const tags = theme.tags.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    onChange({ ...theme, tags })
  }

  // The title tag is the theme's single main power tag; only one per theme.
  function toggleTitle(i: number) {
    const makeTitle = !theme.tags[i].isTitle
    const tags = theme.tags.map((t, idx) => {
      if (idx === i) {
        return makeTitle
          ? { ...t, isTitle: true, isPower: true, isWeakness: false }
          : { ...t, isTitle: false }
      }
      return makeTitle ? { ...t, isTitle: false } : t // enforce a single title
    })
    onChange({ ...theme, tags })
  }

  function addTag(tag: ITag) {
    setFocusIndex(theme.tags.length)
    onChange({ ...theme, tags: [...theme.tags, { ...tag }] })
  }

  function removeTag(i: number) {
    setFocusIndex(null)
    onChange({ ...theme, tags: theme.tags.filter((_, idx) => idx !== i) })
  }

  // Keep each tag's index into theme.tags so edits hit the right entry.
  const rows = theme.tags.map((tag, i) => ({ tag, i }))
  const powerRows = rows
    .filter(r => isPowerTag(r.tag))
    .sort((a, b) => Number(!!b.tag.isTitle) - Number(!!a.tag.isTitle)) // title first
  const weaknessRows = rows.filter(r => r.tag.isWeakness)

  return (
    <div className="rounded-xl overflow-hidden card-chamfer" style={{ background: '#141929', border: `1px solid #2a3352` }}>
      {/* Color bar top */}
      <div style={{ height: 4, background: color }} />

      {/* Header */}
      <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2" style={{ borderBottom: collapsed ? 'none' : '1px solid #1e2840' }}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Tooltip content={`This is a ${CATEGORY_LABEL[theme.category]} theme. ${theme.category === 'self' ? 'Represents your personal identity.' : theme.category === 'mythos' ? 'Represents your connection to a mythical Source.' : 'Represents your superhuman technological abilities.'}`}>
              <span
                className="font-display text-xs tracking-widest px-2 py-0.5 rounded cursor-help"
                style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
              >
                {CATEGORY_LABEL[theme.category]}
              </span>
            </Tooltip>
            {theme.themeType && (
              <span
                className="tracking-wide"
                style={{ color: '#9aa4bf', fontSize: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}
              >
                {theme.themeType}
              </span>
            )}
            <span style={{ color: '#7a8099', fontSize: 11, fontFamily: 'Rajdhani, sans-serif' }}>#{index + 1}</span>
          </div>
          <input
            className="editable-field font-display"
            style={{ fontSize: 20, letterSpacing: '0.05em', color: '#e8eaf0' }}
            value={theme.name}
            onChange={e => updateField('name', e.target.value)}
            placeholder="THEME NAME"
          />
        </div>
        {/* Actions + Decay/Upgrade */}
        <div className="flex items-start gap-3 pt-1 shrink-0">
          <div className="flex gap-3">
            <TrackDots
              value={theme.decay} max={3} filledColor="#ff2d7a" label="DECAY"
              tooltip="Decay (0–3): Mark when you act against your motivation. At 3, replace this theme."
              onChange={v => updateField('decay', v)}
            />
            <TrackDots
              value={theme.upgrade} max={2} filledColor="#c8ff00" label="UPGRADE"
              tooltip="Upgrade (0–2): Mark when you fully embrace your motivation. Upgrades unlock new options."
              onChange={v => updateField('upgrade', v)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Tooltip content={collapsed ? 'Expand theme — show tags, motivation, and specials.' : 'Collapse theme — hide the details, keep the header.'}>
              <button
                onClick={() => setCollapsed(c => !c)}
                aria-label={collapsed ? 'Expand theme' : 'Collapse theme'}
                aria-expanded={!collapsed}
                className="flex items-center justify-center rounded transition-all"
                style={{ width: 26, height: 26, border: '1px solid #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#7a8099' }}
              >
                {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
            </Tooltip>
            <Tooltip content="Edit this theme — reopen the Theme Book to change the kit or pick more of its power/weakness tags.">
              <button
                onClick={onEdit}
                aria-label="Edit theme"
                className="flex items-center justify-center rounded transition-all"
                style={{ width: 26, height: 26, border: '1px solid #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color; (e.currentTarget as HTMLButtonElement).style.color = color }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#7a8099' }}
              >
                <Pencil size={13} />
              </button>
            </Tooltip>
            <Tooltip content="Delete this theme — clears the card back to an empty slot.">
              <button
                onClick={onDelete}
                aria-label="Delete theme"
                className="flex items-center justify-center rounded transition-all"
                style={{ width: 26, height: 26, border: '1px solid #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3b5c'; (e.currentTarget as HTMLButtonElement).style.color = '#ff3b5c' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#7a8099' }}
              >
                <Trash2 size={13} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {!collapsed && (
      <>
      {/* Motivation */}
      <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #1e2840', background: '#0f1520' }}>
        <Tooltip content={MOTIVATION_TOOLTIP[theme.category]}>
          <span className="font-display text-xs tracking-widest shrink-0 cursor-help" style={{ color }}>
            {MOTIVATION_LABEL[theme.category]}
          </span>
        </Tooltip>
        <input
          className="editable-field"
          style={{ fontSize: 13, color: '#c8d8e8' }}
          value={theme.motivation}
          onChange={e => updateField('motivation', e.target.value)}
          placeholder={`Your ${MOTIVATION_LABEL[theme.category].toLowerCase()}...`}
        />
      </div>

      {/* Power tags */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Tooltip content="Power tags add Power to actions they help with. The title tag (★) is the theme's main focus. BURN a power tag for a big one-time boost — it's unavailable until recovered.">
            <span className="font-display text-xs tracking-widest cursor-help" style={{ color: '#90ee90' }}>POWER TAGS</span>
          </Tooltip>
          <div className="flex gap-3 text-xs" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', fontSize: 10, paddingRight: 28 }}>
            <span style={{ color: TITLE_COLOR }}>TITLE</span>
            <span>BURN</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {powerRows.map(({ tag, i }) => (
            <div key={i} className="flex items-center gap-2">
              <TagInput
                tag={tag}
                style={tag.isBurned ? BURNED_STYLE : tag.isTitle ? TITLE_STYLE : POWER_STYLE}
                placeholder="power tag..."
                autoFocus={i === focusIndex}
                onFocus={() => focusIndex !== null && setFocusIndex(null)}
                onChange={text => updateTag(i, 'text', text)}
              />
              <ToggleButton
                label="Mark as title tag"
                tooltip="Title tag — the theme's main power tag (its central focus). Only one per theme."
                pressed={!!tag.isTitle}
                color={TITLE_COLOR}
                onClick={() => toggleTitle(i)}
              >
                <Star size={11} fill={tag.isTitle ? TITLE_COLOR : 'none'} />
              </ToggleButton>
              <ToggleButton
                label="Burn tag"
                tooltip="Burn this tag — use it for a major one-time effect. Unavailable until recovered."
                pressed={tag.isBurned}
                color="#cc7700"
                onClick={() => updateTag(i, 'isBurned', !tag.isBurned)}
              >
                <Flame size={11} />
              </ToggleButton>
              <RemoveButton label={`Remove power tag ${tag.text || '(blank)'}`} onClick={() => removeTag(i)} />
            </div>
          ))}
        </div>
        <AddTagButton
          label="ADD POWER TAG"
          tooltip="Add a custom power tag. To add another tag from this theme's kit (e.g. from an upgrade), use Edit (✎)."
          color="#90ee90"
          onClick={() => addTag(NEW_POWER_TAG)}
        />
      </div>

      {/* Weakness tags */}
      <div className="px-4 py-3" style={{ borderTop: '1px solid #1e2840' }}>
        <div className="mb-2">
          <Tooltip content="Weakness tags subtract Power when they get in your way — but each time one is invoked, you mark an upgrade box on this theme.">
            <span className="font-display text-xs tracking-widest cursor-help" style={{ color: '#ee9090' }}>WEAKNESS TAGS</span>
          </Tooltip>
        </div>
        <div className="flex flex-col gap-1">
          {weaknessRows.map(({ tag, i }) => (
            <div key={i} className="flex items-center gap-2">
              <TagInput
                tag={tag}
                style={WEAKNESS_STYLE}
                placeholder="weakness tag..."
                autoFocus={i === focusIndex}
                onFocus={() => focusIndex !== null && setFocusIndex(null)}
                onChange={text => updateTag(i, 'text', text)}
              />
              <RemoveButton label={`Remove weakness tag ${tag.text || '(blank)'}`} onClick={() => removeTag(i)} />
            </div>
          ))}
        </div>
        <AddTagButton
          label="ADD WEAKNESS TAG"
          tooltip="Add a custom weakness tag. To add another from this theme's kit, use Edit (✎)."
          color="#ee9090"
          onClick={() => addTag(NEW_WEAKNESS_TAG)}
        />
      </div>

      {/* Theme Specials */}
      <ThemeSpecialsPicker
        themeType={theme.themeType as ThemeType}
        color={color}
        specials={theme.specials}
        onChange={specials => updateField('specials', specials)}
      />
      </>
      )}
    </div>
  )
}
