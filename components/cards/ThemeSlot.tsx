'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ThemeCard } from '@/components/cards/ThemeCard'
import { ThemeBookModal } from '@/components/modals/ThemeBookModal'
import { THEME_BOOK_BY_TYPE, type ThemeBookEntry, type ThemeKit } from '@/lib/themeBook'
import type { IThemeCard, ITag, ThemeType } from '@/types'

interface Props {
  theme: IThemeCard
  index: number
  onChange: (theme: IThemeCard) => void
}

/** Reset a slot back to the model's empty-theme defaults. */
function emptyTheme(): IThemeCard {
  return {
    name: '',
    category: 'self',
    themeType: '',
    motivation: '',
    tags: [],
    decay: 0,
    upgrade: 0,
    specials: [],
  }
}

export function ThemeSlot({ theme, index, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const isConfigured = theme.themeType !== ''

  // Preselect current kit + tags when editing (the kit's name is the title tag)
  const currentKitName = theme.tags.find(t => t.isTitle && t.text)?.text ?? null
  const currentKit = isConfigured && currentKitName
    ? THEME_BOOK_BY_TYPE[theme.themeType as ThemeType]?.kits.find(k => k.name === currentKitName)
    : undefined
  // Only preselect tags the picker can actually show (the kit's own tags);
  // custom tags typed on the card are preserved separately in handleApply.
  const currentSupporting = theme.tags
    .filter(t => t.isPower && !t.isTitle && currentKit?.powerTags.includes(t.text))
    .map(t => t.text)
  const currentWeakness = theme.tags
    .filter(t => t.isWeakness && currentKit?.weaknessTags.includes(t.text))
    .map(t => t.text)

  function handleApply(entry: ThemeBookEntry, kit: ThemeKit, selectedTags: ITag[]) {
    // Keep burn state on tags that stay selected, and keep custom tags the
    // player typed on the card (not from the old kit) — the picker can't show
    // or deselect those, so re-applying must not silently drop them.
    const burned = new Set(theme.tags.filter(t => t.isBurned).map(t => t.text))
    const oldKitTags = new Set([...(currentKit?.powerTags ?? []), ...(currentKit?.weaknessTags ?? [])])
    const picked = selectedTags.map(t => ({ ...t, isBurned: burned.has(t.text) }))
    const pickedTexts = new Set(picked.map(t => t.text))
    const custom = theme.tags.filter(
      t => t.text.trim() && !t.isTitle && !oldKitTags.has(t.text) && !pickedTexts.has(t.text)
    )
    // Only default name/motivation from the kit when the player hasn't set their own.
    onChange({
      ...theme,
      category: entry.category,
      themeType: entry.type,
      name: theme.name || kit.name,
      motivation: theme.motivation || kit.identity,
      tags: [...picked, ...custom],
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
          initialWeaknessTags={isConfigured ? currentWeakness : undefined}
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
