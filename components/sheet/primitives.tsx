'use client'
import { useId, useState } from 'react'
import { Flame, NotebookPen, Star, X } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'

/**
 * Building blocks for the printed-card look of the :Otherscape character
 * sheet: light "paper" cards with a lime header band, slanted tag slots with a
 * flame burn toggle, striped weakness slots, box tracks, and the swooping
 * bottom corner with the :OTHERSCAPE logo.
 */

export function PaperCard({
  children, accent = 'var(--accent-lime)', className = '', label,
}: { children: React.ReactNode; accent?: string; className?: string; label?: string }) {
  return (
    <section
      aria-label={label}
      className={`paper-card relative overflow-hidden ${className}`}
      style={{ ['--card-accent' as string]: accent }}
    >
      {children}
      <div className="paper-card-foot" aria-hidden>
        <span className="font-display tracking-widest">:OTHERSCAPE</span>
      </div>
    </section>
  )
}

/** The lime band across the top of a card. */
export function CardBand({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`paper-band ${className}`}>{children}</div>
}

/** A grey label strip like "TAGS" / "IDENTITY / RITUAL / ITCH" / "SPECIALS". */
export function CardStrip({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="paper-strip">
      <span className="font-display tracking-[0.18em]">{children}</span>
      {right && <span className="flex items-center gap-1.5">{right}</span>}
    </div>
  )
}

/** Little angled legend chip ("POWER", "WEAKNESS", "BURN"). */
export function LegendChip({ children }: { children: React.ReactNode }) {
  return <span className="paper-legend font-display tracking-wider">{children}</span>
}

type SlotKind = 'title' | 'power' | 'weakness' | 'story' | 'flaw'

interface TagSlotProps {
  kind: SlotKind
  text: string
  burned?: boolean
  placeholder?: string
  autoFocus?: boolean
  onText: (text: string) => void
  onBurn?: () => void
  onTitle?: () => void
  onRemove?: () => void
  onFocus?: () => void
  burnHelp?: string
  /** Extra controls rendered between the input and the burn toggle. */
  extra?: React.ReactNode
  /** id of a <datalist> with suggestions. */
  list?: string
  /** What the tag covers (agreed with the MC); shown under the tag. */
  note?: string
  /** Enables the note button. */
  onNote?: (note: string) => void
}

const KIND_LABEL: Record<SlotKind, string> = {
  title: 'Title tag', power: 'Power tag', weakness: 'Weakness tag', story: 'Story tag', flaw: 'Flaw tag',
}

/**
 * One tag slot: a slanted white field (striped for weaknesses), with the
 * title-star, burn-flame and remove controls on the right.
 */
export function TagSlot({
  kind, text, burned = false, placeholder, autoFocus, onText, onBurn, onTitle, onRemove, onFocus, burnHelp, extra, list, note, onNote,
}: TagSlotProps) {
  const label = KIND_LABEL[kind]
  const [editingNote, setEditingNote] = useState(false)
  const noteId = useId()
  return (
    <>
    <div className={`tag-slot tag-slot-${kind} ${burned ? 'is-burned' : ''}`}>
      <input
        className="tag-slot-input"
        value={text}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onChange={e => onText(e.target.value)}
        list={list}
        autoComplete={list ? 'off' : undefined}
        aria-label={`${label}${burned ? ' (burned)' : ''}`}
        aria-describedby={note ? noteId : undefined}
      />
      <div className="tag-slot-controls">
        {extra}
        {onNote && (
          <Tooltip content="Note what this tag covers — the actions it helps with, as agreed with your MC.">
            <button type="button" className={`slot-btn edit-only ${note ? 'is-on' : ''}`} onClick={() => setEditingNote(e => !e)} aria-expanded={editingNote} aria-label={`${note ? 'Edit' : 'Add'} note for ${label.toLowerCase()}`}>
              <NotebookPen size={14} />
            </button>
          </Tooltip>
        )}
        {onTitle && (
          <Tooltip content="Title tag — the theme’s first power tag. It names the theme and defines everything else on it. One per theme.">
            <button type="button" className={`slot-btn ${kind === 'title' ? 'is-on star' : ''}`} onClick={onTitle} aria-pressed={kind === 'title'} aria-label="Mark as title tag">
              <Star size={14} fill={kind === 'title' ? 'currentColor' : 'none'} />
            </button>
          </Tooltip>
        )}
        {onBurn && (
          <Tooltip content={burnHelp ?? 'Burn: a burned tag can’t be used until it’s recovered. Burn one positive tag in an action for +3 Power instead of +1.'}>
            <button type="button" className={`slot-btn flame ${burned ? 'is-on' : ''}`} onClick={onBurn} aria-pressed={burned} aria-label={burned ? `Recover ${label.toLowerCase()}` : `Burn ${label.toLowerCase()}`}>
              <Flame size={15} fill={burned ? 'currentColor' : 'none'} />
            </button>
          </Tooltip>
        )}
        {onRemove && (
          <button type="button" className="slot-btn remove" onClick={onRemove} aria-label={`Remove ${label.toLowerCase()} ${text || '(blank)'}`}>
            <X size={14} />
          </button>
        )}
      </div>
    </div>
    {editingNote && onNote ? (
      <input
        className="tag-slot-note-input"
        value={note ?? ''}
        maxLength={200}
        autoFocus
        placeholder="What does this tag cover? e.g. sneaking, lock-picking…"
        aria-label={`Note for ${label.toLowerCase()} ${text}`}
        onChange={e => onNote(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setEditingNote(false) }}
        onBlur={() => setEditingNote(false)}
      />
    ) : note ? (
      <p id={noteId} className="tag-slot-note">{note}</p>
    ) : null}
    </>
  )
}

/**
 * A row of checkboxes for a track (Upgrade, Decay, Evolution…). Clicking box
 * n sets the value to n; clicking the last filled box clears it.
 */
export function BoxTrack({
  label, value, max, onChange, help, color = 'var(--card-ink)', round = false,
}: { label: string; value: number; max: number; onChange: (v: number) => void; help?: React.ReactNode; color?: string; round?: boolean }) {
  const content = (
    <div className="flex items-center gap-1.5" role="group" aria-label={`${label}: ${value} of ${max}`}>
      <span className="font-display tracking-[0.14em] text-[13px] mr-0.5" style={{ color: 'var(--card-ink)' }}>{label}</span>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < value
        return (
          <button
            key={i}
            type="button"
            className={`track-box ${round ? 'round' : ''} ${filled ? 'is-on' : ''}`}
            style={{ ['--track-color' as string]: color }}
            onClick={() => onChange(value === i + 1 ? i : i + 1)}
            aria-label={`${label} box ${i + 1}${filled ? ' (marked)' : ''}`}
            aria-pressed={filled}
          />
        )
      })}
    </div>
  )
  return help ? <Tooltip content={help}>{content}</Tooltip> : content
}

/** Plain lined writing area (motivation, specials). */
export function LinedField({
  value, onChange, placeholder, rows = 2, label,
}: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; label: string }) {
  return (
    <textarea
      className="lined-field"
      rows={rows}
      value={value}
      placeholder={placeholder}
      aria-label={label}
      onChange={e => onChange(e.target.value)}
    />
  )
}

/**
 * A button for view-only controls (expand, flip) that keeps working inside a
 * read-only sheet. Sheets are made read-only with <fieldset disabled>, which
 * disables real <button>s — so this is a span with button semantics.
 */
export function ViewButton({
  onClick, label, expanded, children, className = '', style, ref, ...rest
}: {
  onClick: () => void; label: string; expanded?: boolean; children: React.ReactNode; className?: string; style?: React.CSSProperties
  ref?: React.Ref<HTMLSpanElement>
} & Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'>) {
  // `ref` and `rest` let it sit inside <Tooltip> (Radix passes its trigger props through).
  return (
    <span
      {...rest}
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-expanded={expanded}
      className={`cursor-pointer select-none ${className}`}
      style={style}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
    >
      {children}
    </span>
  )
}
