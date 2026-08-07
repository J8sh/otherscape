'use client'
import { useState } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { Plus, X } from 'lucide-react'
import { THEME_BOOK_BY_TYPE } from '@/lib/themeBook'
import type { ThemeType } from '@/types'

interface Props {
  themeType: ThemeType
  color: string
  specials: string[]
  onChange: (specials: string[]) => void
}

/**
 * Each themebook has 5 named Theme Specials, unlocked as a theme Upgrade
 * (rulebook p.133) and choosable only once each. This picker lets the
 * player select from the real 5 instead of typing free text.
 */
export function ThemeSpecialsPicker({ themeType, color, specials, onChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const book = THEME_BOOK_BY_TYPE[themeType]
  const chosen = specials.filter(Boolean)
  const available = book.specials.filter(s => !chosen.includes(s.name))

  function addSpecial(name: string) {
    onChange([...chosen, name])
    setPickerOpen(false)
  }

  function removeSpecial(name: string) {
    onChange(chosen.filter(s => s !== name))
  }

  return (
    <div className="px-4 pb-4" style={{ borderTop: '1px solid #1e2840' }}>
      <Tooltip content="Theme Specials are unlocked as a theme Upgrade — each themebook has 5, and each can only be chosen once per theme.">
        <div className="font-display text-xs tracking-widest pt-3 pb-2 cursor-help flex items-center gap-2" style={{ color: '#7a8099' }}>
          THEME SPECIALS
          <span style={{ color: '#4a5570', fontFamily: 'Rajdhani, sans-serif', letterSpacing: 'normal', fontWeight: 500, fontSize: 11 }}>
            {chosen.length}/{book.specials.length}
          </span>
        </div>
      </Tooltip>

      <div className="flex flex-col gap-1.5">
        {chosen.map(name => {
          const special = book.specials.find(s => s.name === name)
          return (
            <div key={name} className="rounded px-3 py-2" style={{ background: '#141c26', border: `1px solid ${color}33` }}>
              <div className="flex items-start justify-between gap-2">
                <span className="font-display tracking-wide" style={{ fontSize: 13, color, letterSpacing: '0.03em' }}>
                  {name}
                </span>
                <button
                  onClick={() => removeSpecial(name)}
                  aria-label={`Remove ${name}`}
                  className="shrink-0 flex items-center justify-center rounded transition-all"
                  style={{ width: 18, height: 18, border: '1px solid #2a3352', background: 'transparent', color: '#4a5570', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ff3b5c'; (e.currentTarget as HTMLButtonElement).style.color = '#ff3b5c' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.color = '#4a5570' }}
                >
                  <X size={11} />
                </button>
              </div>
              {special && (
                <div style={{ fontSize: 12, color: '#7a8099', fontFamily: 'Rajdhani, sans-serif', marginTop: 3, lineHeight: 1.4 }}>
                  {special.description}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {available.length > 0 && (
        <div className="mt-1.5">
          <button
            onClick={() => setPickerOpen(o => !o)}
            aria-expanded={pickerOpen}
            className="flex items-center gap-1.5 font-display tracking-widest transition-all"
            style={{ fontSize: 11, padding: '5px 10px', borderRadius: 5, border: `1px dashed ${pickerOpen ? color : '#2a3352'}`, background: 'transparent', color: pickerOpen ? color : '#7a8099', cursor: 'pointer' }}
          >
            <Plus size={11} /> ADD SPECIAL
          </button>

          {pickerOpen && (
            <div className="flex flex-col gap-1 mt-2">
              {available.map(s => (
                <button
                  key={s.name}
                  onClick={() => addSpecial(s.name)}
                  className="text-left rounded px-3 py-2 transition-all"
                  style={{ background: '#0f1520', border: '1px solid #1e2840', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = color }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e2840' }}
                >
                  <div className="font-display tracking-wide" style={{ fontSize: 13, color: '#e8eaf0', letterSpacing: '0.03em' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#7a8099', fontFamily: 'Rajdhani, sans-serif', marginTop: 3, lineHeight: 1.4 }}>
                    {s.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
