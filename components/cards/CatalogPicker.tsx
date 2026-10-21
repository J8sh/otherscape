'use client'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, ShoppingBag, X } from 'lucide-react'
import { STREET_CATALOG, type CatalogCategory } from '@/lib/streetCatalog'
import type { ILoadoutTag } from '@/types'

/**
 * Add gear from the Street Catalog: one item tag, any features, and at most
 * one flaw — each becomes a (burnt) loadout tag. In play, getting new gear
 * usually takes an action (buy, craft, hire) or comes from loot.
 */
export function CatalogPicker({ onAdd }: { onAdd: (tags: ILoadoutTag[]) => void }) {
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState<CatalogCategory | null>(null)
  const [item, setItem] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [flaw, setFlaw] = useState('')

  function reset() { setCat(null); setItem(''); setFeatures([]); setFlaw('') }

  function add() {
    if (!item) return
    onAdd([
      { text: item, isFlaw: false, isBurned: true },
      ...features.map(text => ({ text, isFlaw: false, isBurned: true })),
      ...(flaw ? [{ text: flaw, isFlaw: true, isBurned: true }] : []),
    ])
    setOpen(false)
    reset()
  }

  const chip = (on: boolean, color: string) => ({ minHeight: 40, border: `1px solid ${on ? color : 'var(--border-card)'}`, background: on ? `${color}22` : 'var(--bg-inset)' })

  return (
    <Dialog.Root open={open} onOpenChange={o => { setOpen(o); if (!o) reset() }}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-ghost btn-sm edit-only"><ShoppingBag size={15} aria-hidden /> STREET CATALOG</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content className="fixed z-50 inset-0 md:inset-x-[max(24px,calc(50vw-440px))] md:inset-y-8 md:rounded-2xl overflow-y-auto" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">{cat ? cat.name.toUpperCase() : 'STREET CATALOG'}</Dialog.Title>
            <Dialog.Close asChild><button type="button" className="btn btn-ghost btn-icon" aria-label="Close"><X size={18} /></button></Dialog.Close>
          </div>
          <Dialog.Description className="px-4 pt-3 text-[15px]" style={{ color: 'var(--text-muted)' }}>
            {cat
              ? `Pick one item, add any features that describe it, and optionally one flaw. Replace [brackets] with specifics after adding. Named products are in the core book, p. ${cat.page}.`
              : 'Common gear of the Megacity. New gear normally comes from an action (buying, crafting, hiring) or loot — check with your MC. Added tags start unpacked (burnt).'}
          </Dialog.Description>

          {!cat ? (
            <ul className="grid gap-2 sm:grid-cols-2 p-4">
              {STREET_CATALOG.map(c => (
                <li key={c.name}>
                  <button type="button" onClick={() => setCat(c)} className="panel w-full text-left p-3 h-full hover:border-[#c8ff00]">
                    <div className="font-display text-xl tracking-wide" style={{ color: 'var(--accent-lime)' }}>{c.name}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{c.groups.flatMap(g => g.tags).slice(0, 4).join(' · ')}…</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 space-y-5">
              {cat.groups.map(g => (
                <section key={g.label}>
                  <h3 className="font-display tracking-widest mb-2" style={{ color: 'var(--accent-lime)' }}>{g.label.toUpperCase()} {item && g.tags.includes(item) ? '· ✓' : ''}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map(t => (
                      <button key={t} type="button" aria-pressed={item === t} onClick={() => setItem(item === t ? '' : t)} className="px-3 rounded-lg italic font-semibold" style={chip(item === t, '#c8ff00')}>
                        {item === t && <Check size={13} className="inline mr-1" aria-hidden />}{t}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
              {cat.features.length > 0 && (
                <section>
                  <h3 className="font-display tracking-widest mb-2" style={{ color: '#29c8f2' }}>FEATURES · {features.length}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.features.map(t => (
                      <button key={t} type="button" aria-pressed={features.includes(t)} onClick={() => setFeatures(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t])} className="px-3 rounded-lg italic font-semibold" style={chip(features.includes(t), '#29c8f2')}>
                        {features.includes(t) && <Check size={13} className="inline mr-1" aria-hidden />}{t}
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h3 className="font-display tracking-widest mb-2" style={{ color: '#ff9fb2' }}>FLAW (OPTIONAL, ONE)</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.flaws.map(t => (
                    <button key={t} type="button" aria-pressed={flaw === t} onClick={() => setFlaw(flaw === t ? '' : t)} className="px-3 rounded-lg italic font-semibold" style={chip(flaw === t, '#ff4f6e')}>
                      {flaw === t && <Check size={13} className="inline mr-1" aria-hidden />}{t}
                    </button>
                  ))}
                </div>
              </section>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary" onClick={add} disabled={!item}>ADD {1 + features.length + (flaw ? 1 : 0)} TAG{features.length || flaw ? 'S' : ''}</button>
                <button type="button" className="btn btn-ghost" onClick={reset}>ALL CATEGORIES</button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
