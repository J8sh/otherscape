'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ThemeCard } from '@/components/cards/ThemeCard'
import { ThemeBookModal } from '@/components/modals/ThemeBookModal'
import type { ThemeBookEntry, ThemeKit } from '@/lib/themeBook'
import type { IThemeCard, ITag } from '@/types'

interface Props {
  theme: IThemeCard
  index: number
  onChange: (theme: IThemeCard) => void
}

const EMPTY_TAG: ITag = { text: '', isPower: false, isWeakness: false, isBurned: false }

/** Reset a slot back to the model's empty-theme defaults. */
function emptyTheme(): IThemeCard {
  return {
    name: '',
    category: 'self',
    themeType: '',
    motivation: '',
    tags: Array.from({ length: 8 }, () => ({ ...EMPTY_TAG })),
    decay: 0,
    upgrade: 0,
    specials: Array.from({ length: 4 }, () => ''),
  }
}

export function ThemeSlot({ theme, index, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const isConfigured = theme.themeType !== ''

  // Preselect current kit + tags when editing (the kit's name is the title tag)
  const currentKitName = theme.tags.find(t => t.isTitle && t.text)?.text ?? null
  const currentSupporting = theme.tags
    .filter(t => t.isPower && !t.isTitle && t.text)
    .map(t => t.text)
  const currentWeakness = theme.tags.find(t => t.isWeakness && t.text)?.text ?? null

  function handleApply(entry: ThemeBookEntry, kit: ThemeKit, selectedTags: ITag[]) {
    const filled = selectedTags.slice(0, 8)
    const blanks: ITag[] = Array.from({ length: 8 - filled.length }, () => ({ ...EMPTY_TAG }))
    // Keep any inline-edited fields (name/motivation/decay/upgrade/specials);
    // for an empty slot those are already blank, so one path covers create + edit.
    // Only default name/motivation from the kit when the player hasn't set their own.
    onChange({
      ...theme,
      category: entry.category,
      themeType: entry.type,
      name: theme.name || kit.name,
      motivation: theme.motivation || kit.identity,
      tags: [...filled, ...blanks],
    })
    setModalOpen(false)
  }

  function handleDelete() {
    if (!confirm('Delete this theme? The card will be cleared back to an empty slot.')) return
    onChange(emptyTheme())
  }

  return (
    <>
      {modalOpen && (
        <ThemeBookModal
          defaultCategory={theme.category}
          initialType={isConfigured ? theme.themeType : undefined}
          initialKitName={isConfigured ? currentKitName ?? undefined : undefined}
          initialSupportingTags={isConfigured ? currentSupporting : undefined}
          initialWeaknessTag={isConfigured ? currentWeakness : undefined}
          onApply={handleApply}
          onClose={() => setModalOpen(false)}
        />
      )}

      {isConfigured ? (
        <ThemeCard
          theme={theme}
          index={index}
          onChange={onChange}
          onEdit={() => setModalOpen(true)}
          onDelete={handleDelete}
        />
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          className="group w-full rounded-xl card-chamfer flex flex-col items-center justify-center gap-3 transition-all"
          style={{
            minHeight: 220,
            background: '#0f1520',
            border: '1.5px dashed #2a3352',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8ff00'; (e.currentTarget as HTMLButtonElement).style.background = '#141c26' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3352'; (e.currentTarget as HTMLButtonElement).style.background = '#0f1520' }}
        >
          <div
            className="flex items-center justify-center rounded-full transition-all"
            style={{ width: 64, height: 64, border: '2px solid #2a3352', color: '#4a5570' }}
          >
            <Plus size={34} className="transition-colors group-hover:text-[#c8ff00]" />
          </div>
          <div className="text-center">
            <div className="font-display tracking-widest transition-colors group-hover:text-[#c8ff00]" style={{ fontSize: 18, color: '#7a8099' }}>
              ADD THEME
            </div>
            <div style={{ fontSize: 12, color: '#4a5570', fontFamily: 'Rajdhani, sans-serif', marginTop: 2 }}>
              Slot #{index + 1} · pick from the Theme Book
            </div>
          </div>
        </button>
      )}
    </>
  )
}
