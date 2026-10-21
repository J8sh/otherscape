'use client'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Sparkles, X } from 'lucide-react'
import { TROPES, type CharacterTrope } from '@/lib/tropes'
import { THEME_BOOK_BY_TYPE } from '@/lib/themeBook'
import { CATEGORY_META } from '@/lib/themeMeta'
import type { ICharacter, IThemeCard, ThemeType } from '@/types'

function kitTheme(type: ThemeType, kitName: string): IThemeCard | null {
  const entry = THEME_BOOK_BY_TYPE[type]
  const kit = entry?.kits.find(k => k.name.toLowerCase() === kitName.toLowerCase())
  if (!entry || !kit) return null
  return {
    name: kit.name,
    category: entry.category,
    themeType: entry.type,
    motivation: kit.identity,
    // Title tag + the kit's first two power tags and first weakness — swap any via ✎ Edit.
    tags: [
      { text: kit.name, isPower: true, isWeakness: false, isBurned: false, isTitle: true },
      ...kit.powerTags.slice(0, 2).map(text => ({ text, isPower: true, isWeakness: false, isBurned: false, isTitle: false })),
      { text: kit.weaknessTags[0], isPower: false, isWeakness: true, isBurned: false, isTitle: false },
    ],
    decay: 0,
    upgrade: 0,
    specials: [],
  }
}

/**
 * Rapid creation from a character trope: three defining theme kits plus a
 * fourth chosen from three, filled in with sensible default tags.
 */
export function TropePicker({ character, onApply }: { character: ICharacter; onApply: (patch: Partial<ICharacter>) => void }) {
  const [open, setOpen] = useState(false)
  const [trope, setTrope] = useState<CharacterTrope | null>(null)
  const [fourth, setFourth] = useState(0)
  const [query, setQuery] = useState('')

  function apply() {
    if (!trope) return
    const picks = [...trope.kits, trope.choose[fourth]]
    const themes = picks.map(p => kitTheme(p.type, p.kit)).filter((t): t is IThemeCard => !!t)
    if (themes.length !== 4) { alert('Couldn’t find all four kits in the Theme Book.'); return }
    if (character.themes.some(t => t.themeType) && !confirm('Replace this character’s current themes with the trope?')) return
    const hasLoadout = (character.loadoutTheme.tags ?? []).some(t => t.text.trim())
    onApply({
      themes,
      ...(trope.loadout.length && !hasLoadout
        ? { loadoutTheme: { ...character.loadoutTheme, tags: trope.loadout.map(text => ({ text, isFlaw: false, isBurned: true })) } }
        : {}),
    })
    setOpen(false)
    setTrope(null)
  }

  const shown = TROPES.filter(t => !query.trim() || `${t.name} ${[...t.kits, ...t.choose].map(k => `${k.kit} ${k.type}`).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
  const typeColor = (type: ThemeType) => CATEGORY_META[THEME_BOOK_BY_TYPE[type]?.category ?? 'self'].color

  return (
    <Dialog.Root open={open} onOpenChange={o => { setOpen(o); if (!o) setTrope(null) }}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-primary btn-sm"><Sparkles size={15} aria-hidden /> START FROM A TROPE</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content className="fixed z-50 inset-0 md:inset-x-[max(24px,calc(50vw-460px))] md:inset-y-8 md:rounded-2xl overflow-y-auto" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">{trope ? trope.name.toUpperCase() : 'CHARACTER TROPES'}</Dialog.Title>
            <Dialog.Close asChild><button type="button" className="btn btn-ghost btn-icon" aria-label="Close"><X size={18} /></button></Dialog.Close>
          </div>
          <Dialog.Description className="px-4 pt-3 text-[15px]" style={{ color: 'var(--text-muted)' }}>
            {trope
              ? 'These three kits define the trope; pick the fourth. Each theme starts with its title tag, two power tags and one weakness — use ✎ on a theme to swap in others from its kit.'
              : 'A quick start for new players (core book pp. 177–189): pick an archetype and get four themes at once.'}
          </Dialog.Description>
          {!trope ? (
            <div className="p-4">
              <input className="input mb-3" placeholder="Search: hacker, gun, spirit, drone…" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search tropes" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {shown.map(t => (
                  <li key={t.name}>
                    <button type="button" onClick={() => { setTrope(t); setFourth(0) }} className="panel w-full h-full text-left p-3 hover:border-[#c8ff00]">
                      <div className="font-display text-xl tracking-wide" style={{ color: 'var(--accent-lime)' }}>{t.name}</div>
                      <div className="text-sm" style={{ color: 'var(--text-soft)' }}>{t.kits.map(k => k.kit).join(' · ')}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <ul className="space-y-1.5">
                {trope.kits.map(k => (
                  <li key={k.kit} className="panel px-3 py-2 flex items-center justify-between">
                    <span className="font-semibold">{k.kit}</span>
                    <span className="chip" style={{ color: typeColor(k.type), borderColor: typeColor(k.type) }}>{k.type.toUpperCase()}</span>
                  </li>
                ))}
              </ul>
              <fieldset>
                <legend className="font-display tracking-widest mb-2">FOURTH THEME — CHOOSE ONE</legend>
                <div className="space-y-1.5">
                  {trope.choose.map((k, i) => (
                    <label key={k.kit} className="panel px-3 py-2 flex items-center gap-3 cursor-pointer" style={{ borderColor: fourth === i ? 'var(--accent-lime)' : undefined, minHeight: 48 }}>
                      <input type="radio" name="fourth" checked={fourth === i} onChange={() => setFourth(i)} className="w-4 h-4" />
                      <span className="flex-1 font-semibold">{k.kit}</span>
                      <span className="chip" style={{ color: typeColor(k.type), borderColor: typeColor(k.type) }}>{k.type.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {trope.loadout.length > 0 && (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Starter loadout (added if your loadout is empty): {trope.loadout.join(', ')}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary" onClick={apply}>USE THIS TROPE</button>
                <button type="button" className="btn btn-ghost" onClick={() => setTrope(null)}>ALL TROPES</button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
