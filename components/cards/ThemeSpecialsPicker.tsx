'use client'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CardStrip } from '@/components/sheet/primitives'
import { InfoTip } from '@/components/ui/Tooltip'
import { THEME_BOOK_BY_TYPE } from '@/lib/themeBook'
import type { ThemeType } from '@/types'

interface Props {
  themeType: ThemeType
  color: string
  specials: string[]
  onChange: (specials: string[]) => void
}

/**
 * The back of a theme card. Each themebook has 5 named Theme Specials,
 * unlocked as a theme Upgrade (rulebook p.133) and choosable once each.
 */
export function ThemeSpecialsPicker({ themeType, color, specials, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const book = THEME_BOOK_BY_TYPE[themeType]
  const chosen = specials.filter(Boolean)
  const available = book?.specials.filter(s => !chosen.includes(s.name)) ?? []

  function addSpecial(name: string) {
    onChange([...chosen, name])
    setPickerOpen(false)
  }

  return (
    <div>
      <CardStrip right={<span className="text-xs">{chosen.length}/{book?.specials.length ?? 5}</span>}>
        THEME SPECIALS{' '}
        <InfoTip label="theme specials">
          Specials are unlocked with a theme Upgrade (fill all 3 upgrade boxes). Each {themeType} theme can take each of its 5 Specials once.
        </InfoTip>
      </CardStrip>

      <div className="px-3 space-y-2">
        {chosen.length === 0 && (
          <p className="text-sm px-1" style={{ color: 'var(--card-ink-soft)' }}>
            No Specials yet. Earn one by filling this theme’s Upgrade track.
          </p>
        )}
        {chosen.map(name => {
          const special = book?.specials.find(s => s.name === name)
          return (
            <div key={name} className="rounded-lg px-3 py-2" style={{ background: 'var(--card-slot)', borderLeft: `5px solid ${color}` }}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-display tracking-wide text-lg leading-tight">{name}</span>
                <button
                  type="button"
                  onClick={() => onChange(chosen.filter(s => s !== name))}
                  aria-label={`Remove ${name}`}
                  className="slot-btn remove edit-only shrink-0"
                  style={{ width: 32, height: 32 }}
                >
                  <X size={14} />
                </button>
              </div>
              {special && <p className="text-[15px] leading-snug mt-0.5" style={{ color: 'var(--card-ink-soft)' }}>{special.description}</p>}
            </div>
          )
        })}

        {available.length > 0 && (
          <div className="edit-only">
            <button
              type="button"
              onClick={() => setPickerOpen(o => !o)}
              aria-expanded={pickerOpen}
              className="w-full flex items-center justify-center gap-1.5 font-display tracking-widest rounded-lg"
              style={{ minHeight: 44, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
            >
              <Plus size={14} aria-hidden /> ADD SPECIAL
            </button>
            {pickerOpen && (
              <div className="mt-2 space-y-1.5">
                {available.map(s => (
                  <button
                    type="button"
                    key={s.name}
                    onClick={() => addSpecial(s.name)}
                    className="w-full text-left rounded-lg px-3 py-2 hover:brightness-95"
                    style={{ background: '#fff', border: '1px solid #c3cad4' }}
                  >
                    <div className="font-display tracking-wide text-lg leading-tight">{s.name}</div>
                    <div className="text-[15px] leading-snug" style={{ color: 'var(--card-ink-soft)' }}>{s.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
