'use client'

import { useState, useCallback } from 'react'
import { X, BookOpen, Check } from 'lucide-react'
import { THEME_BOOK, type ThemeBookEntry } from '@/lib/themeBook'
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

// What the user has checked in the modal
interface Selection {
  entry: ThemeBookEntry
  powerTags: Set<string>
  weaknessTags: Set<string>
}

interface Props {
  defaultCategory?: ThemeCategory
  onApply: (entry: ThemeBookEntry, tags: ITag[]) => void
  onClose: () => void
}

export function ThemeBookModal({ defaultCategory, onApply, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory | 'all'>(
    defaultCategory ?? 'all'
  )
  const [selection, setSelection] = useState<Selection | null>(null)

  const filtered =
    activeCategory === 'all'
      ? THEME_BOOK
      : THEME_BOOK.filter(e => e.category === activeCategory)

  const totalSelected =
    (selection?.powerTags.size ?? 0) + (selection?.weaknessTags.size ?? 0)

  function selectEntry(entry: ThemeBookEntry) {
    // Clicking same entry deselects it
    if (selection?.entry.type === entry.type) {
      setSelection(null)
      return
    }
    setSelection({ entry, powerTags: new Set(), weaknessTags: new Set() })
  }

  function togglePower(tag: string) {
    if (!selection) return
    const next = new Set(selection.powerTags)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    setSelection({ ...selection, powerTags: next })
  }

  function toggleWeakness(tag: string) {
    if (!selection) return
    const next = new Set(selection.weaknessTags)
    next.has(tag) ? next.delete(tag) : next.add(tag)
    setSelection({ ...selection, weaknessTags: next })
  }

  const handleApply = useCallback(() => {
    if (!selection) return
    const tags: ITag[] = [
      ...[...selection.powerTags].map(text => ({
        text,
        isPower: true,
        isWeakness: false,
        isBurned: false,
      })),
      ...[...selection.weaknessTags].map(text => ({
        text,
        isPower: false,
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
              SELECT TAGS TO IMPORT
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
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}
          >
            {filtered.map(entry => (
              <ThemeBookCard
                key={entry.type}
                entry={entry}
                isSelected={selection?.entry.type === entry.type}
                selectedPower={selection?.entry.type === entry.type ? selection.powerTags : undefined}
                selectedWeakness={selection?.entry.type === entry.type ? selection.weaknessTags : undefined}
                onSelect={() => selectEntry(entry)}
                onTogglePower={togglePower}
                onToggleWeakness={toggleWeakness}
              />
            ))}
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
                <span style={{ color: '#90ee90' }}>{selection.powerTags.size} power</span>
                {' · '}
                <span style={{ color: '#ee9090' }}>{selection.weaknessTags.size} weakness</span>
                {' · '}
                <span>{totalSelected} tag{totalSelected !== 1 ? 's' : ''} selected</span>
                {totalSelected > 8 && (
                  <span style={{ color: '#ff6b6b', marginLeft: 8 }}>
                    (only first 8 will be applied)
                  </span>
                )}
              </>
            ) : (
              'Click a theme to expand and select tags'
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
              disabled={totalSelected === 0}
              className="font-display tracking-widest transition-all"
              style={{
                fontSize: 12,
                padding: '8px 20px',
                borderRadius: 6,
                border: `1px solid ${totalSelected > 0 ? '#c8ff00' : '#2a3352'}`,
                background: totalSelected > 0 ? '#c8ff0018' : 'transparent',
                color: totalSelected > 0 ? '#c8ff00' : '#3a4462',
                cursor: totalSelected > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              APPLY TO THEME
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
  selectedPower?: Set<string>
  selectedWeakness?: Set<string>
  onSelect: () => void
  onTogglePower: (tag: string) => void
  onToggleWeakness: (tag: string) => void
}

function ThemeBookCard({
  entry,
  isSelected,
  selectedPower,
  selectedWeakness,
  onSelect,
  onTogglePower,
  onToggleWeakness,
}: CardProps) {
  const color = CATEGORY_COLOR[entry.category]

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

      {/* Clickable header */}
      <button
        onClick={onSelect}
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
            border: `1px solid ${isSelected ? color : '#2a3352'}`,
            background: isSelected ? `${color}22` : 'transparent',
            color: isSelected ? color : '#4a5570',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1 }}>{isSelected ? '−' : '+'}</span>
        </div>
      </button>

      {/* Expanded tag list */}
      {isSelected && (
        <div style={{ borderTop: `1px solid #1e2840` }}>
          {/* Power tags */}
          <div className="px-4 py-3">
            <div
              className="font-display text-xs tracking-widest mb-2"
              style={{ color: '#90ee90', fontSize: 10 }}
            >
              POWER TAGS
            </div>
            <div className="flex flex-col gap-1">
              {entry.powerTags.map(tag => {
                const checked = selectedPower?.has(tag) ?? false
                return (
                  <label
                    key={tag}
                    className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-all"
                    style={{
                      background: checked ? '#1a3a1a' : 'transparent',
                      border: `1px solid ${checked ? '#3a6a3a' : 'transparent'}`,
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center rounded transition-all"
                      style={{
                        width: 16,
                        height: 16,
                        border: `1.5px solid ${checked ? '#90ee90' : '#3a4462'}`,
                        background: checked ? '#3a6a3a' : 'transparent',
                      }}
                      onClick={() => onTogglePower(tag)}
                    >
                      {checked && <Check size={10} color="#90ee90" />}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: checked ? '#90ee90' : '#c8d8e8',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 500,
                        fontStyle: checked ? 'italic' : 'normal',
                      }}
                      onClick={() => onTogglePower(tag)}
                    >
                      {tag}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Weakness tags */}
          <div className="px-4 pb-3" style={{ borderTop: '1px solid #141929' }}>
            <div
              className="font-display text-xs tracking-widest mb-2 pt-3"
              style={{ color: '#ee9090', fontSize: 10 }}
            >
              WEAKNESS TAGS
            </div>
            <div className="flex flex-col gap-1">
              {entry.weaknessTags.map(tag => {
                const checked = selectedWeakness?.has(tag) ?? false
                return (
                  <label
                    key={tag}
                    className="flex items-center gap-2 rounded px-2 py-1.5 cursor-pointer transition-all"
                    style={{
                      background: checked ? '#3a1a1a' : 'transparent',
                      border: `1px solid ${checked ? '#6a3a3a' : 'transparent'}`,
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center rounded transition-all"
                      style={{
                        width: 16,
                        height: 16,
                        border: `1.5px solid ${checked ? '#ee9090' : '#3a4462'}`,
                        background: checked ? '#6a3a3a' : 'transparent',
                      }}
                      onClick={() => onToggleWeakness(tag)}
                    >
                      {checked && <Check size={10} color="#ee9090" />}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        color: checked ? '#ee9090' : '#c8d8e8',
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 500,
                        fontStyle: checked ? 'italic' : 'normal',
                      }}
                      onClick={() => onToggleWeakness(tag)}
                    >
                      {tag}
                    </span>
                  </label>
                )
              })}
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
              {entry.category === 'self'
                ? 'IDENTITY'
                : entry.category === 'mythos'
                ? 'RITUAL'
                : 'ITCH'}
              {' '}
              EXAMPLE
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
