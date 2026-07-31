'use client'
import { useState, useEffect } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { Flame, Pencil, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react'
import type { IThemeCard, ThemeCategory } from '@/types'

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

export function ThemeCard({ theme, index, onChange, onEdit, onDelete }: Props) {
  const color = CATEGORY_COLOR[theme.category]
  const [collapsed, setCollapsed] = useState(false)

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

  function updateTag(i: number, field: string, value: string | boolean) {
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

  function updateSpecial(i: number, value: string) {
    const specials = theme.specials.map((s, idx) => idx === i ? value : s)
    onChange({ ...theme, specials })
  }

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
            <Tooltip content="Edit this theme — reopen the Theme Book to change the theme type or its power/weakness tags.">
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

      {/* Tags */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Tooltip content="Tags are short descriptors. Power tags (+1 Power) help you succeed. Weakness tags (−1 Power) create narrative trouble. BURN a tag for a one-time major effect — it's unavailable until recovered.">
            <span className="font-display text-xs tracking-widest cursor-help" style={{ color: '#7a8099' }}>TAGS</span>
          </Tooltip>
          <div className="flex gap-3.5 text-xs" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', fontSize: 10 }}>
            <span style={{ color: '#ffcf4d' }}>TITLE</span>
            <span>PWR</span>
            <span>WKN</span>
            <span>BURN</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {theme.tags.map((tag, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex-1 rounded px-2 py-1"
                style={{
                  background: tag.isBurned ? '#3d2800' : tag.isTitle ? '#3a2f10' : tag.isPower ? '#1a3a1a' : tag.isWeakness ? '#3a1a1a' : '#0f1520',
                  border: `1px solid ${tag.isBurned ? '#6b3d00' : tag.isTitle ? '#6b5320' : tag.isPower ? '#3a6a3a' : tag.isWeakness ? '#6a3a3a' : '#1e2840'}`,
                  opacity: tag.isBurned ? 0.7 : 1,
                }}
              >
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  style={{
                    color: tag.isBurned ? '#cc7700' : tag.isTitle ? '#ffcf4d' : tag.isPower ? '#90ee90' : tag.isWeakness ? '#ee9090' : '#e8eaf0',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 500,
                    fontStyle: tag.isPower || tag.isWeakness ? 'italic' : 'normal',
                  }}
                  value={tag.text}
                  onChange={e => updateTag(i, 'text', e.target.value)}
                  placeholder={`tag ${i + 1}...`}
                />
              </div>
              {/* Title */}
              <Tooltip content="Title tag — the theme's main power tag (its central focus). Only one per theme.">
                <button
                  onClick={() => toggleTitle(i)}
                  aria-label="Mark as title tag"
                  aria-pressed={!!tag.isTitle}
                  className="w-5 h-5 flex items-center justify-center rounded border transition-all"
                  style={{
                    background: tag.isTitle ? '#6b532022' : 'transparent',
                    borderColor: tag.isTitle ? '#ffcf4d' : '#2a3352',
                    color: tag.isTitle ? '#ffcf4d' : '#3a4462',
                  }}
                >
                  <Star size={11} fill={tag.isTitle ? '#ffcf4d' : 'none'} />
                </button>
              </Tooltip>
              {/* Power */}
              <Tooltip content="Mark as Power tag — adds +1 Power when invoked">
                <button
                  onClick={() => updateTag(i, 'isPower', !tag.isPower)}
                  className="w-5 h-5 rounded border transition-all"
                  style={{
                    background: tag.isPower ? '#3a6a3a' : 'transparent',
                    borderColor: tag.isPower ? '#90ee90' : '#2a3352',
                  }}
                />
              </Tooltip>
              {/* Weakness */}
              <Tooltip content="Mark as Weakness tag — subtracts −1 Power but helps character grow">
                <button
                  onClick={() => updateTag(i, 'isWeakness', !tag.isWeakness)}
                  className="w-5 h-5 rounded border transition-all"
                  style={{
                    background: tag.isWeakness ? '#6a3a3a' : 'transparent',
                    borderColor: tag.isWeakness ? '#ee9090' : '#2a3352',
                  }}
                />
              </Tooltip>
              {/* Burn */}
              <Tooltip content="Burn this tag — use it for a major one-time effect. Unavailable until recovered.">
                <button
                  onClick={() => updateTag(i, 'isBurned', !tag.isBurned)}
                  className="w-5 h-5 flex items-center justify-center rounded border transition-all"
                  style={{
                    background: tag.isBurned ? '#6b3d00' : 'transparent',
                    borderColor: tag.isBurned ? '#cc7700' : '#2a3352',
                    color: tag.isBurned ? '#cc7700' : '#3a4462',
                  }}
                >
                  <Flame size={11} />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Specials */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid #1e2840' }}>
        <Tooltip content="Theme Specials are unique abilities or rules specific to this theme, unlocked through play or theme type.">
          <div className="font-display text-xs tracking-widest pt-3 pb-2 cursor-help" style={{ color: '#7a8099' }}>
            THEME SPECIALS
          </div>
        </Tooltip>
        <div className="flex flex-col gap-1">
          {theme.specials.map((s, i) => (
            <input
              key={i}
              className="editable-field"
              style={{ fontSize: 13 }}
              value={s}
              onChange={e => updateSpecial(i, e.target.value)}
              placeholder={`special ${i + 1}...`}
            />
          ))}
        </div>
      </div>
      </>
      )}
    </div>
  )
}
