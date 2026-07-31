'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, BookOpen, Check, Star } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import {
  THEME_BOOK,
  MAX_SUPPORTING_POWER_TAGS,
  MAX_WEAKNESS_TAGS,
  type ThemeBookEntry,
  type TagDef,
} from '@/lib/themeBook'
import type { ThemeCategory, ITag } from '@/types'

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

const TITLE_COLOR = '#ffcf4d'

// Cards default to expanded on tablet/desktop (≥768px) and collapsed on mobile.
const DESKTOP_QUERY = '(min-width: 768px)'

// What the user has chosen: one title (main) power tag, up to two supporting
// power tags, and one weakness tag. A slot holds exactly one theme.
interface Selection {
  entry: ThemeBookEntry
  titleTag: string | null
  supportingTags: Set<string>
  weaknessTags: Set<string>
}

interface Props {
  defaultCategory?: ThemeCategory
  /** Edit mode: preselect this theme type and its chosen tags. */
  initialType?: string
  initialTitleTag?: string | null
  initialSupportingTags?: string[]
  initialWeaknessTags?: string[]
  onApply: (entry: ThemeBookEntry, tags: ITag[]) => void
  onClose: () => void
}

export function ThemeBookModal({
  defaultCategory,
  initialType,
  initialTitleTag,
  initialSupportingTags,
  initialWeaknessTags,
  onApply,
  onClose,
}: Props) {
  const initialEntry = initialType
    ? THEME_BOOK.find(e => e.type === initialType)
    : undefined

  const [activeCategory, setActiveCategory] = useState<ThemeCategory | 'all'>(
    initialEntry?.category ?? defaultCategory ?? 'all'
  )
  const [selection, setSelection] = useState<Selection | null>(
    initialEntry
      ? {
          entry: initialEntry,
          titleTag: initialTitleTag ?? null,
          supportingTags: new Set(initialSupportingTags ?? []),
          weaknessTags: new Set(initialWeaknessTags ?? []),
        }
      : null
  )

  // Which theme cards are expanded (showing their tags). Follows the viewport:
  // all open on tablet/desktop, all closed on mobile (except the edited theme).
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const apply = () =>
      setExpanded(
        mql.matches
          ? new Set(THEME_BOOK.map(e => e.type))
          : new Set(initialType ? [initialType] : [])
      )
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
  }, [initialType])

  const filtered =
    activeCategory === 'all'
      ? THEME_BOOK
      : THEME_BOOK.filter(e => e.category === activeCategory)

  const hasTitle = !!selection?.titleTag
  const supportingCount = selection?.supportingTags.size ?? 0
  const weaknessCount = selection?.weaknessTags.size ?? 0
  const canApply = hasTitle && weaknessCount >= 1

  function toggleExpanded(type: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  // Starting from the current selection, or a fresh one when switching themes.
  function baseFor(entry: ThemeBookEntry, prev: Selection | null): Selection {
    return prev && prev.entry.type === entry.type
      ? prev
      : { entry, titleTag: null, supportingTags: new Set(), weaknessTags: new Set() }
  }

  function setTitle(entry: ThemeBookEntry, tag: string) {
    setSelection(prev => {
      const base = baseFor(entry, prev)
      if (base.titleTag === tag) return { ...base, titleTag: null } // toggle off
      // Promote to title; a tag can't be title and supporting at once.
      const supporting = new Set(base.supportingTags)
      supporting.delete(tag)
      return { ...base, titleTag: tag, supportingTags: supporting }
    })
  }

  function toggleSupporting(entry: ThemeBookEntry, tag: string) {
    setSelection(prev => {
      const base = baseFor(entry, prev)
      if (base.titleTag === tag) return base // it's the title — use the star to change
      const supporting = new Set(base.supportingTags)
      if (supporting.has(tag)) {
        supporting.delete(tag)
      } else {
        if (supporting.size >= MAX_SUPPORTING_POWER_TAGS) return base // at limit
        supporting.add(tag)
      }
      return { ...base, supportingTags: supporting }
    })
  }

  function toggleWeakness(entry: ThemeBookEntry, tag: string) {
    setSelection(prev => {
      const base = baseFor(entry, prev)
      const weakness = new Set(base.weaknessTags)
      if (weakness.has(tag)) {
        weakness.delete(tag)
      } else {
        if (weakness.size >= MAX_WEAKNESS_TAGS) return base // at limit
        weakness.add(tag)
      }
      return { ...base, weaknessTags: weakness }
    })
  }

  const handleApply = useCallback(() => {
    if (!selection || !selection.titleTag) return
    const tags: ITag[] = [
      {
        text: selection.titleTag,
        isPower: true,
        isTitle: true,
        isWeakness: false,
        isBurned: false,
      },
      ...[...selection.supportingTags].map(text => ({
        text,
        isPower: true,
        isTitle: false,
        isWeakness: false,
        isBurned: false,
      })),
      ...[...selection.weaknessTags].map(text => ({
        text,
        isPower: false,
        isTitle: false,
        isWeakness: true,
        isBurned: false,
      })),
    ]
    onApply(selection.entry, tags)
  }, [selection, onApply])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(4, 7, 18, 0.92)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex flex-col rounded-xl overflow-hidden"
        style={{
          width: '92vw',
          maxWidth: 1100,
          height: '90vh',
          background: '#0d1222',
          border: '1px solid #2a3352',
          boxShadow: '0 0 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid #1e2840', background: '#080c18' }}
        >
          <div className="flex items-center gap-3">
            <BookOpen size={18} style={{ color: '#7a8099' }} />
            <span
              className="font-display tracking-widest"
              style={{ fontSize: 20, color: '#e8eaf0' }}
            >
              THEME BOOK
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#4a5570',
                fontFamily: 'Rajdhani, sans-serif',
                letterSpacing: '0.1em',
              }}
            >
              PICK A THEME · 1 TITLE + {MAX_SUPPORTING_POWER_TAGS} POWER + {MAX_WEAKNESS_TAGS} WEAKNESS
            </span>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2">
            {(['all', 'self', 'mythos', 'noise'] as const).map(cat => {
              const color = cat === 'all' ? '#7a8099' : CATEGORY_COLOR[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="font-display tracking-widest transition-all"
                  style={{
                    fontSize: 12,
                    padding: '4px 12px',
                    borderRadius: 4,
                    border: `1px solid ${isActive ? color : '#2a3352'}`,
                    background: isActive ? `${color}18` : 'transparent',
                    color: isActive ? color : '#4a5570',
                    cursor: 'pointer',
                  }}
                >
                  {cat === 'all' ? 'ALL' : CATEGORY_LABEL[cat]}
                </button>
              )
            })}
            <button
              onClick={onClose}
              className="ml-2 flex items-center justify-center rounded transition-all"
              style={{
                width: 32,
                height: 32,
                border: '1px solid #2a3352',
                background: 'transparent',
                color: '#7a8099',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarColor: '#2a3352 transparent' }}>
          <div
            className="grid gap-4 items-start"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
          >
            {filtered.map(entry => {
              const isSel = selection?.entry.type === entry.type
              return (
                <ThemeBookCard
                  key={entry.type}
                  entry={entry}
                  isSelected={isSel}
                  isExpanded={expanded.has(entry.type)}
                  titleTag={isSel ? selection!.titleTag : null}
                  supportingTags={isSel ? selection!.supportingTags : undefined}
                  weaknessTags={isSel ? selection!.weaknessTags : undefined}
                  onToggleExpand={() => toggleExpanded(entry.type)}
                  onSetTitle={tag => setTitle(entry, tag)}
                  onToggleSupporting={tag => toggleSupporting(entry, tag)}
                  onToggleWeakness={tag => toggleWeakness(entry, tag)}
                />
              )
            })}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderTop: '1px solid #1e2840', background: '#080c18' }}
        >
          <div style={{ fontFamily: 'Rajdhani, sans-serif', color: '#7a8099', fontSize: 13 }}>
            {selection ? (
              <>
                <span style={{ color: '#e8eaf0' }}>{selection.entry.type}</span>
                {' · '}
                <span style={{ color: hasTitle ? TITLE_COLOR : '#7a8099' }}>
                  {hasTitle ? 'title ✓' : 'no title'}
                </span>
                {' · '}
                <span style={{ color: supportingCount > 0 ? '#90ee90' : '#7a8099' }}>
                  {supportingCount}/{MAX_SUPPORTING_POWER_TAGS} power
                </span>
                {' · '}
                <span style={{ color: weaknessCount >= 1 ? '#ee9090' : '#7a8099' }}>
                  {weaknessCount}/{MAX_WEAKNESS_TAGS} weakness
                </span>
                {!canApply && (
                  <span style={{ color: '#ffb84d', marginLeft: 8 }}>
                    (pick a title tag + 1 weakness)
                  </span>
                )}
              </>
            ) : (
              'Star a title tag, then check supporting power & weakness tags'
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="font-display tracking-widest transition-all"
              style={{
                fontSize: 12,
                padding: '8px 20px',
                borderRadius: 6,
                border: '1px solid #2a3352',
                background: 'transparent',
                color: '#7a8099',
                cursor: 'pointer',
              }}
            >
              CANCEL
            </button>
            <button
              onClick={handleApply}
              disabled={!canApply}
              className="font-display tracking-widest transition-all"
              style={{
                fontSize: 12,
                padding: '8px 20px',
                borderRadius: 6,
                border: `1px solid ${canApply ? '#c8ff00' : '#2a3352'}`,
                background: canApply ? '#c8ff0018' : 'transparent',
                color: canApply ? '#c8ff00' : '#3a4462',
                cursor: canApply ? 'pointer' : 'not-allowed',
              }}
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Individual theme card ─────────────────────────────────────────────────

interface CardProps {
  entry: ThemeBookEntry
  isSelected: boolean
  isExpanded: boolean
  titleTag: string | null
  supportingTags?: Set<string>
  weaknessTags?: Set<string>
  onToggleExpand: () => void
  onSetTitle: (tag: string) => void
  onToggleSupporting: (tag: string) => void
  onToggleWeakness: (tag: string) => void
}

function ThemeBookCard({
  entry,
  isSelected,
  isExpanded,
  titleTag,
  supportingTags,
  weaknessTags,
  onToggleExpand,
  onSetTitle,
  onToggleSupporting,
  onToggleWeakness,
}: CardProps) {
  const color = CATEGORY_COLOR[entry.category]
  const supportingAtLimit = (supportingTags?.size ?? 0) >= MAX_SUPPORTING_POWER_TAGS
  const weaknessAtLimit = (weaknessTags?.size ?? 0) >= MAX_WEAKNESS_TAGS

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isSelected ? '#141929' : '#0f1520',
        border: `1px solid ${isSelected ? color + '55' : '#1e2840'}`,
        boxShadow: isSelected ? `0 0 20px ${color}18` : 'none',
      }}
    >
      {/* Color bar */}
      <div style={{ height: 3, background: color }} />

      {/* Clickable header — toggles expand/collapse */}
      <button
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
        className="w-full text-left px-4 pt-3 pb-3 flex items-start justify-between gap-2 transition-all"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-display text-xs tracking-widest px-2 py-0.5 rounded"
              style={{
                background: `${color}18`,
                color,
                border: `1px solid ${color}33`,
                fontSize: 10,
              }}
            >
              {CATEGORY_LABEL[entry.category]}
            </span>
            {isSelected && (
              <span
                className="font-display text-xs tracking-widest px-2 py-0.5 rounded"
                style={{ background: `${color}22`, color, border: `1px solid ${color}55`, fontSize: 10 }}
              >
                SELECTED
              </span>
            )}
          </div>
          <div
            className="font-display tracking-wide"
            style={{ fontSize: 22, color: '#e8eaf0', lineHeight: 1.1 }}
          >
            {entry.type.toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#7a8099',
              fontFamily: 'Rajdhani, sans-serif',
              marginTop: 4,
              lineHeight: 1.4,
            }}
          >
            {entry.description}
          </div>
        </div>

        {/* Expand indicator */}
        <div
          className="shrink-0 flex items-center justify-center rounded transition-all mt-1"
          style={{
            width: 24,
            height: 24,
            border: `1px solid ${isExpanded ? color : '#2a3352'}`,
            background: isExpanded ? `${color}22` : 'transparent',
            color: isExpanded ? color : '#4a5570',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>{isExpanded ? '−' : '+'}</span>
        </div>
      </button>

      {/* Expanded tag list */}
      {isExpanded && (
        <div style={{ borderTop: `1px solid #1e2840` }}>
          {/* Power tags */}
          <div className="px-4 py-3">
            <div
              className="font-display text-xs tracking-widest mb-1 flex items-center justify-between"
              style={{ color: '#90ee90', fontSize: 10 }}
            >
              <span>POWER TAGS</span>
              <span style={{ color: '#4a5570' }}>
                <span style={{ color: titleTag ? TITLE_COLOR : '#4a5570' }}>
                  ★ {titleTag ? 1 : 0}/1
                </span>
                {'  ·  '}
                <span style={{ color: supportingAtLimit ? '#ffb84d' : '#4a5570' }}>
                  {supportingTags?.size ?? 0}/{MAX_SUPPORTING_POWER_TAGS}
                </span>
              </span>
            </div>
            <div style={{ fontSize: 10, color: '#4a5570', fontFamily: 'Rajdhani, sans-serif', marginBottom: 6 }}>
              Star (★) one title tag — your theme&apos;s main focus — then check up to {MAX_SUPPORTING_POWER_TAGS} more.
            </div>
            <div className="flex flex-col gap-1">
              {entry.powerTags.map(tag => {
                const isTitle = titleTag === tag.text
                const isSupporting = supportingTags?.has(tag.text) ?? false
                return (
                  <PowerTagRow
                    key={tag.text}
                    tag={tag}
                    isTitle={isTitle}
                    isSupporting={isSupporting}
                    supportDisabled={!isSupporting && supportingAtLimit}
                    onSetTitle={() => onSetTitle(tag.text)}
                    onToggleSupporting={() => onToggleSupporting(tag.text)}
                  />
                )
              })}
            </div>
          </div>

          {/* Weakness tags */}
          <div className="px-4 pb-3" style={{ borderTop: '1px solid #141929' }}>
            <div
              className="font-display text-xs tracking-widest mb-2 pt-3 flex items-center justify-between"
              style={{ color: '#ee9090', fontSize: 10 }}
            >
              <span>WEAKNESS TAGS</span>
              <span style={{ color: weaknessAtLimit ? '#ffb84d' : '#4a5570' }}>
                {weaknessTags?.size ?? 0}/{MAX_WEAKNESS_TAGS}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {entry.weaknessTags.map(tag => (
                <CheckTagRow
                  key={tag.text}
                  tag={tag}
                  checked={weaknessTags?.has(tag.text) ?? false}
                  disabled={weaknessAtLimit && !(weaknessTags?.has(tag.text) ?? false)}
                  activeColor="#ee9090"
                  activeBg="#3a1a1a"
                  activeBorder="#6a3a3a"
                  onToggle={() => onToggleWeakness(tag.text)}
                />
              ))}
            </div>
          </div>

          {/* Motivation example */}
          <div
            className="mx-4 mb-3 px-3 py-2 rounded"
            style={{ background: '#0a0f1c', border: '1px solid #1e2840' }}
          >
            <span
              className="font-display text-xs tracking-widest"
              style={{ color, fontSize: 10 }}
            >
              {MOTIVATION_LABEL[entry.category]} EXAMPLE
            </span>
            <div
              style={{
                fontSize: 11,
                color: '#7a8099',
                fontFamily: 'Rajdhani, sans-serif',
                marginTop: 2,
                fontStyle: 'italic',
              }}
            >
              {entry.motivationExample}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── A power tag row: star for title, check for supporting ─────────────────

interface PowerTagRowProps {
  tag: TagDef
  isTitle: boolean
  isSupporting: boolean
  supportDisabled: boolean
  onSetTitle: () => void
  onToggleSupporting: () => void
}

function PowerTagRow({ tag, isTitle, isSupporting, supportDisabled, onSetTitle, onToggleSupporting }: PowerTagRowProps) {
  const active = isTitle || isSupporting
  const activeColor = isTitle ? TITLE_COLOR : '#90ee90'
  return (
    <Tooltip content={tag.hint}>
      <div
        className="flex items-center gap-2 rounded px-2 py-1.5 transition-all"
        style={{
          background: isTitle ? '#3a2f10' : isSupporting ? '#1a3a1a' : 'transparent',
          border: `1px solid ${isTitle ? '#6b5320' : isSupporting ? '#3a6a3a' : 'transparent'}`,
        }}
      >
        {/* Title (★) */}
        <button
          onClick={onSetTitle}
          aria-pressed={isTitle}
          aria-label={isTitle ? 'Unset title tag' : 'Set as title tag'}
          title="Title tag — the theme's main focus"
          className="shrink-0 flex items-center justify-center rounded transition-all"
          style={{
            width: 20,
            height: 20,
            border: `1.5px solid ${isTitle ? TITLE_COLOR : '#3a4462'}`,
            background: isTitle ? `${TITLE_COLOR}22` : 'transparent',
            color: isTitle ? TITLE_COLOR : '#4a5570',
            cursor: 'pointer',
          }}
        >
          <Star size={11} fill={isTitle ? TITLE_COLOR : 'none'} />
        </button>
        {/* Supporting (✓) */}
        <button
          onClick={() => !supportDisabled && onToggleSupporting()}
          aria-pressed={isSupporting}
          aria-disabled={supportDisabled}
          aria-label={isSupporting ? 'Remove supporting power tag' : 'Add supporting power tag'}
          title="Supporting power tag"
          className="shrink-0 flex items-center justify-center rounded transition-all"
          style={{
            width: 18,
            height: 18,
            border: `1.5px solid ${isSupporting ? '#90ee90' : '#3a4462'}`,
            background: isSupporting ? '#3a6a3a' : 'transparent',
            cursor: supportDisabled ? 'not-allowed' : 'pointer',
            opacity: isTitle || supportDisabled ? 0.4 : 1,
          }}
        >
          {isSupporting && <Check size={10} color="#90ee90" />}
        </button>
        <span
          style={{
            fontSize: 13,
            color: active ? activeColor : '#c8d8e8',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 500,
            fontStyle: active ? 'italic' : 'normal',
          }}
        >
          {tag.text}
          {isTitle && (
            <span
              className="font-display tracking-widest"
              style={{ color: TITLE_COLOR, fontSize: 9, marginLeft: 6 }}
            >
              TITLE
            </span>
          )}
        </span>
      </div>
    </Tooltip>
  )
}

// ── A simple single-checkbox tag row (weakness) with its helper hint ──────

interface CheckTagRowProps {
  tag: TagDef
  checked: boolean
  disabled: boolean
  activeColor: string
  activeBg: string
  activeBorder: string
  onToggle: () => void
}

function CheckTagRow({ tag, checked, disabled, activeColor, activeBg, activeBorder, onToggle }: CheckTagRowProps) {
  return (
    <Tooltip content={tag.hint}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={checked}
        aria-disabled={disabled}
        onClick={() => !disabled && onToggle()}
        onKeyDown={e => {
          if (disabled) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        className="flex items-center gap-2 rounded px-2 py-1.5 transition-all"
        style={{
          background: checked ? activeBg : 'transparent',
          border: `1px solid ${checked ? activeBorder : 'transparent'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <div
          className="shrink-0 flex items-center justify-center rounded transition-all"
          style={{
            width: 16,
            height: 16,
            border: `1.5px solid ${checked ? activeColor : '#3a4462'}`,
            background: checked ? activeBorder : 'transparent',
          }}
        >
          {checked && <Check size={10} color={activeColor} />}
        </div>
        <span
          style={{
            fontSize: 13,
            color: checked ? activeColor : '#c8d8e8',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 500,
            fontStyle: checked ? 'italic' : 'normal',
          }}
        >
          {tag.text}
        </span>
      </div>
    </Tooltip>
  )
}
