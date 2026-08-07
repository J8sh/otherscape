'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, BookOpen, Check, Star } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import {
  THEME_BOOK,
  REQUIRED_SUPPORTING_TAGS,
  REQUIRED_WEAKNESS_TAGS,
  type ThemeBookEntry,
  type ThemeKit,
} from '@/lib/themeBook'
import type { ThemeCategory, ThemeType, ITag } from '@/types'

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

const CATEGORIES: ThemeCategory[] = ['self', 'mythos', 'noise']
const TITLE_COLOR = '#ffcf4d'

// Kit cards default to expanded on tablet/desktop (≥768px) and collapsed on mobile.
const DESKTOP_QUERY = '(min-width: 768px)'

interface Selection {
  entry: ThemeBookEntry
  kit: ThemeKit
  supportingTags: Set<string>
  weaknessTag: string | null
}

interface Props {
  defaultCategory?: ThemeCategory
  /** Edit mode: preselect this theme type + kit and its chosen tags. */
  initialType?: string
  initialKitName?: string
  initialSupportingTags?: string[]
  initialWeaknessTag?: string | null
  onApply: (entry: ThemeBookEntry, kit: ThemeKit, tags: ITag[]) => void
  onClose: () => void
}

export function ThemeBookModal({
  defaultCategory,
  initialType,
  initialKitName,
  initialSupportingTags,
  initialWeaknessTag,
  onApply,
  onClose,
}: Props) {
  const initialEntry = initialType ? THEME_BOOK.find(e => e.type === initialType) : undefined
  const initialKit = initialEntry && initialKitName
    ? initialEntry.kits.find(k => k.name === initialKitName)
    : undefined

  const [activeCategory, setActiveCategory] = useState<ThemeCategory>(
    initialEntry?.category ?? defaultCategory ?? 'self'
  )
  const booksInCategory = THEME_BOOK.filter(e => e.category === activeCategory)
  const [activeType, setActiveType] = useState<ThemeType>(
    initialEntry?.type ?? booksInCategory[0].type
  )
  const activeBook = THEME_BOOK.find(e => e.type === activeType) ?? booksInCategory[0]

  const [selection, setSelection] = useState<Selection | null>(
    initialEntry && initialKit
      ? {
          entry: initialEntry,
          kit: initialKit,
          supportingTags: new Set(initialSupportingTags ?? []),
          weaknessTag: initialWeaknessTag ?? null,
        }
      : null
  )

  // Which kit cards are expanded. Follows the viewport: all open on
  // tablet/desktop, all closed on mobile (except the kit being edited).
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const apply = () =>
      setExpanded(
        mql.matches
          ? new Set(activeBook.kits.map(k => k.name))
          : new Set(selection?.entry.type === activeBook.type ? [selection.kit.name] : [])
      )
    apply()
    mql.addEventListener('change', apply)
    return () => mql.removeEventListener('change', apply)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBook.type])

  function selectCategory(cat: ThemeCategory) {
    setActiveCategory(cat)
    const first = THEME_BOOK.find(e => e.category === cat)
    if (first) setActiveType(first.type)
  }

  function pickKit(entry: ThemeBookEntry, kit: ThemeKit) {
    setSelection(prev => {
      if (prev && prev.kit.name === kit.name && prev.entry.type === entry.type) return null // deselect
      return { entry, kit, supportingTags: new Set(), weaknessTag: null }
    })
  }

  function toggleSupporting(entry: ThemeBookEntry, kit: ThemeKit, tag: string) {
    setSelection(prev => {
      const base = prev && prev.kit.name === kit.name ? prev : { entry, kit, supportingTags: new Set<string>(), weaknessTag: null }
      const supporting = new Set(base.supportingTags)
      if (supporting.has(tag)) {
        supporting.delete(tag)
      } else {
        if (supporting.size >= REQUIRED_SUPPORTING_TAGS) return base // at limit
        supporting.add(tag)
      }
      return { ...base, supportingTags: supporting }
    })
  }

  function toggleWeakness(entry: ThemeBookEntry, kit: ThemeKit, tag: string) {
    setSelection(prev => {
      const base = prev && prev.kit.name === kit.name ? prev : { entry, kit, supportingTags: new Set<string>(), weaknessTag: null }
      return { ...base, weaknessTag: base.weaknessTag === tag ? null : tag }
    })
  }

  function toggleExpanded(kitName: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(kitName)) next.delete(kitName)
      else next.add(kitName)
      return next
    })
  }

  const supportingCount = selection?.supportingTags.size ?? 0
  const canApply = !!selection && supportingCount === REQUIRED_SUPPORTING_TAGS && !!selection.weaknessTag

  const handleApply = useCallback(() => {
    if (!selection || !canApply || !selection.weaknessTag) return
    const tags: ITag[] = [
      { text: selection.kit.name, isPower: true, isTitle: true, isWeakness: false, isBurned: false },
      ...[...selection.supportingTags].map(text => ({ text, isPower: true, isTitle: false, isWeakness: false, isBurned: false })),
      { text: selection.weaknessTag, isPower: false, isTitle: false, isWeakness: true, isBurned: false },
    ]
    onApply(selection.entry, selection.kit, tags)
  }, [selection, canApply, onApply])

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
        <div className="flex flex-col shrink-0" style={{ borderBottom: '1px solid #1e2840', background: '#080c18' }}>
          <div className="flex items-center justify-between px-6 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <BookOpen size={18} style={{ color: '#7a8099' }} />
              <span className="font-display tracking-widest" style={{ fontSize: 20, color: '#e8eaf0' }}>
                THEME BOOK
              </span>
              <span style={{ fontSize: 11, color: '#4a5570', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.1em' }}>
                PICK A KIT · TITLE + {REQUIRED_SUPPORTING_TAGS} POWER + {REQUIRED_WEAKNESS_TAGS} WEAKNESS
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded transition-all"
              style={{ width: 32, height: 32, border: '1px solid #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Level 1: category tabs */}
          <div className="flex items-center gap-2 px-6 pb-3">
            {CATEGORIES.map(cat => {
              const color = CATEGORY_COLOR[cat]
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="font-display tracking-widest transition-all"
                  style={{
                    fontSize: 13,
                    padding: '6px 16px',
                    borderRadius: 6,
                    border: `1px solid ${isActive ? color : '#2a3352'}`,
                    background: isActive ? `${color}18` : 'transparent',
                    color: isActive ? color : '#4a5570',
                    cursor: 'pointer',
                  }}
                >
                  {CATEGORY_LABEL[cat]}
                </button>
              )
            })}
          </div>

          {/* Level 2: themebook tabs within the active category */}
          <div className="flex items-center gap-1.5 px-6 pb-3 flex-wrap">
            {booksInCategory.map(book => {
              const color = CATEGORY_COLOR[book.category]
              const isActive = activeType === book.type
              return (
                <button
                  key={book.type}
                  onClick={() => setActiveType(book.type)}
                  className="tracking-wide transition-all"
                  style={{
                    fontSize: 12,
                    padding: '4px 10px',
                    borderRadius: 4,
                    border: `1px solid ${isActive ? color : '#1e2840'}`,
                    background: isActive ? `${color}22` : '#0f1520',
                    color: isActive ? color : '#7a8099',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {book.type}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarColor: '#2a3352 transparent' }}>
          <div className="mb-4" style={{ fontSize: 13, color: '#7a8099', fontFamily: 'Rajdhani, sans-serif', lineHeight: 1.5 }}>
            {activeBook.description}
          </div>
          <div className="grid gap-4 items-start" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {activeBook.kits.map(kit => (
              <ThemeKitCard
                key={kit.name}
                entry={activeBook}
                kit={kit}
                isSelected={selection?.entry.type === activeBook.type && selection.kit.name === kit.name}
                isExpanded={expanded.has(kit.name)}
                supportingTags={selection?.kit.name === kit.name ? selection.supportingTags : undefined}
                weaknessTag={selection?.kit.name === kit.name ? selection.weaknessTag : null}
                onToggleExpand={() => toggleExpanded(kit.name)}
                onPickKit={() => pickKit(activeBook, kit)}
                onToggleSupporting={tag => toggleSupporting(activeBook, kit, tag)}
                onToggleWeakness={tag => toggleWeakness(activeBook, kit, tag)}
              />
            ))}
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderTop: '1px solid #1e2840', background: '#080c18' }}>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', color: '#7a8099', fontSize: 13 }}>
            {selection ? (
              <>
                <span style={{ color: TITLE_COLOR }}>★ {selection.kit.name}</span>
                {' · '}
                <span style={{ color: supportingCount === REQUIRED_SUPPORTING_TAGS ? '#90ee90' : '#7a8099' }}>
                  {supportingCount}/{REQUIRED_SUPPORTING_TAGS} power
                </span>
                {' · '}
                <span style={{ color: selection.weaknessTag ? '#ee9090' : '#7a8099' }}>
                  {selection.weaknessTag ? 1 : 0}/{REQUIRED_WEAKNESS_TAGS} weakness
                </span>
                {!canApply && (
                  <span style={{ color: '#ffb84d', marginLeft: 8 }}>
                    (pick {REQUIRED_SUPPORTING_TAGS} power + {REQUIRED_WEAKNESS_TAGS} weakness tag)
                  </span>
                )}
              </>
            ) : (
              'Pick a kit — its name becomes your title tag'
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="font-display tracking-widest transition-all"
              style={{ fontSize: 12, padding: '8px 20px', borderRadius: 6, border: '1px solid #2a3352', background: 'transparent', color: '#7a8099', cursor: 'pointer' }}
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

// ── A single theme kit card ─────────────────────────────────────────────

interface CardProps {
  entry: ThemeBookEntry
  kit: ThemeKit
  isSelected: boolean
  isExpanded: boolean
  supportingTags?: Set<string>
  weaknessTag: string | null
  onToggleExpand: () => void
  onPickKit: () => void
  onToggleSupporting: (tag: string) => void
  onToggleWeakness: (tag: string) => void
}

function ThemeKitCard({
  entry,
  kit,
  isSelected,
  isExpanded,
  supportingTags,
  weaknessTag,
  onToggleExpand,
  onPickKit,
  onToggleSupporting,
  onToggleWeakness,
}: CardProps) {
  const color = CATEGORY_COLOR[entry.category]
  const supportingAtLimit = (supportingTags?.size ?? 0) >= REQUIRED_SUPPORTING_TAGS

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: isSelected ? '#141929' : '#0f1520',
        border: `1px solid ${isSelected ? TITLE_COLOR + '77' : '#1e2840'}`,
        boxShadow: isSelected ? `0 0 20px ${TITLE_COLOR}18` : 'none',
      }}
    >
      <div style={{ height: 3, background: isSelected ? TITLE_COLOR : color }} />

      {/* Header — click the star to pick this kit (its name = title tag), click elsewhere to expand */}
      <div className="px-4 pt-3 pb-3 flex items-start justify-between gap-2">
        <div className="flex-1 flex items-start gap-2">
          <Tooltip content="Pick this kit — its name becomes your theme's title tag, the theme's main focus.">
            <button
              onClick={onPickKit}
              aria-pressed={isSelected}
              aria-label={isSelected ? 'Unpick this kit' : 'Pick this kit as your title tag'}
              className="shrink-0 flex items-center justify-center rounded transition-all mt-0.5"
              style={{
                width: 26,
                height: 26,
                border: `1.5px solid ${isSelected ? TITLE_COLOR : '#3a4462'}`,
                background: isSelected ? `${TITLE_COLOR}22` : 'transparent',
                color: isSelected ? TITLE_COLOR : '#4a5570',
                cursor: 'pointer',
              }}
            >
              <Star size={14} fill={isSelected ? TITLE_COLOR : 'none'} />
            </button>
          </Tooltip>
          <button
            onClick={onToggleExpand}
            aria-expanded={isExpanded}
            className="flex-1 text-left transition-all"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <div className="font-display tracking-wide" style={{ fontSize: 19, color: isSelected ? TITLE_COLOR : '#e8eaf0', lineHeight: 1.2 }}>
              {kit.name}
            </div>
          </button>
        </div>
        <div
          className="shrink-0 flex items-center justify-center rounded transition-all mt-0.5"
          style={{
            width: 22,
            height: 22,
            border: `1px solid ${isExpanded ? color : '#2a3352'}`,
            background: isExpanded ? `${color}22` : 'transparent',
            color: isExpanded ? color : '#4a5570',
            cursor: 'pointer',
          }}
          onClick={onToggleExpand}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      {isExpanded && (
        <div style={{ borderTop: '1px solid #1e2840' }}>
          {/* Supporting power tags */}
          <div className="px-4 py-3">
            <div className="font-display text-xs tracking-widest mb-2 flex items-center justify-between" style={{ color: '#90ee90', fontSize: 10 }}>
              <span>POWER TAGS — choose {REQUIRED_SUPPORTING_TAGS}</span>
              <span style={{ color: supportingAtLimit ? '#ffb84d' : '#4a5570' }}>
                {supportingTags?.size ?? 0}/{REQUIRED_SUPPORTING_TAGS}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {kit.powerTags.map(tag => {
                const checked = supportingTags?.has(tag) ?? false
                return (
                  <CheckTagRow
                    key={tag}
                    text={tag}
                    checked={checked}
                    disabled={supportingAtLimit && !checked}
                    activeColor="#90ee90"
                    activeBg="#1a3a1a"
                    activeBorder="#3a6a3a"
                    onToggle={() => onToggleSupporting(tag)}
                  />
                )
              })}
            </div>
          </div>

          {/* Weakness tags */}
          <div className="px-4 pb-3" style={{ borderTop: '1px solid #141929' }}>
            <div className="font-display text-xs tracking-widest mb-2 pt-3 flex items-center justify-between" style={{ color: '#ee9090', fontSize: 10 }}>
              <span>WEAKNESS TAGS — choose {REQUIRED_WEAKNESS_TAGS}</span>
              <span style={{ color: weaknessTag ? '#4a5570' : '#4a5570' }}>
                {weaknessTag ? 1 : 0}/{REQUIRED_WEAKNESS_TAGS}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {kit.weaknessTags.map(tag => (
                <CheckTagRow
                  key={tag}
                  text={tag}
                  checked={weaknessTag === tag}
                  disabled={false}
                  activeColor="#ee9090"
                  activeBg="#3a1a1a"
                  activeBorder="#6a3a3a"
                  onToggle={() => onToggleWeakness(tag)}
                />
              ))}
            </div>
          </div>

          {/* Identity / Ritual / Itch */}
          <div className="mx-4 mb-3 px-3 py-2 rounded" style={{ background: '#0a0f1c', border: '1px solid #1e2840' }}>
            <span className="font-display text-xs tracking-widest" style={{ color, fontSize: 10 }}>
              {MOTIVATION_LABEL[entry.category]}
            </span>
            <div style={{ fontSize: 12, color: '#c8d8e8', fontFamily: 'Rajdhani, sans-serif', marginTop: 2, fontStyle: 'italic' }}>
              {kit.identity}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── A single checkbox tag row ──────────────────────────────────────────

interface CheckTagRowProps {
  text: string
  checked: boolean
  disabled: boolean
  activeColor: string
  activeBg: string
  activeBorder: string
  onToggle: () => void
}

function CheckTagRow({ text, checked, disabled, activeColor, activeBg, activeBorder, onToggle }: CheckTagRowProps) {
  return (
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
      <span style={{ fontSize: 13, color: checked ? activeColor : '#c8d8e8', fontFamily: 'Rajdhani, sans-serif', fontWeight: 500, fontStyle: checked ? 'italic' : 'normal' }}>
        {text}
      </span>
    </div>
  )
}
