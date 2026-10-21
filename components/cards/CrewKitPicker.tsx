'use client'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { BookOpen, Check, X } from 'lucide-react'
import { CREW_KITS, type CrewKit } from '@/lib/crewBook'
import type { ICrewThemeCard } from '@/types'

const PICK_POWER = 2
const PICK_WEAKNESS = 1

/**
 * Rapid crew creation: choose a crew kit, then its title tag plus two more
 * power tags and one weakness tag, and adopt (or rewrite) its Identity.
 */
export function CrewKitPicker({ crew, onApply }: { crew: ICrewThemeCard; onApply: (crew: ICrewThemeCard) => void }) {
  const [open, setOpen] = useState(false)
  const [kit, setKit] = useState<CrewKit | null>(null)
  const [power, setPower] = useState<string[]>([])
  const [weak, setWeak] = useState<string[]>([])
  const [identity, setIdentity] = useState('')

  function choose(k: CrewKit) {
    setKit(k); setPower([]); setWeak([]); setIdentity(k.identity)
  }
  const toggle = (list: string[], set: (v: string[]) => void, t: string) => set(list.includes(t) ? list.filter(x => x !== t) : [...list, t])

  function apply() {
    if (!kit) return
    const hasContent = crew.tags.some(t => t.text.trim())
    if (hasContent && !confirm('Replace the crew’s current tags and motivation with this kit?')) return
    onApply({
      ...crew,
      name: crew.name || kit.name,
      motivation: identity,
      tags: [
        { text: kit.name, isPower: true, isWeakness: false, isBurned: false },
        ...power.map(text => ({ text, isPower: true, isWeakness: false, isBurned: false })),
        ...weak.map(text => ({ text, isPower: false, isWeakness: true, isBurned: false })),
      ],
    })
    setOpen(false)
  }

  const chip = (on: boolean, color: string) => ({
    minHeight: 40, border: `1px solid ${on ? color : 'var(--border-card)'}`, background: on ? `${color}22` : 'var(--bg-inset)',
  })

  return (
    <Dialog.Root open={open} onOpenChange={o => { setOpen(o); if (!o) setKit(null) }}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-ghost btn-sm edit-only"><BookOpen size={15} aria-hidden /> CREW KITS</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content className="fixed z-50 inset-0 md:inset-x-[max(24px,calc(50vw-420px))] md:inset-y-8 md:rounded-2xl overflow-y-auto" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">{kit ? kit.name.toUpperCase() : 'CREW THEME KITS'}</Dialog.Title>
            <Dialog.Close asChild><button type="button" className="btn btn-ghost btn-icon" aria-label="Close"><X size={18} /></button></Dialog.Close>
          </div>
          <Dialog.Description className="px-4 pt-3" style={{ color: 'var(--text-muted)' }}>
            {kit
              ? `The kit’s name is your title tag. Pick ${PICK_POWER} more power tags and ${PICK_WEAKNESS} weakness tag as a group — the rest can come later with crew upgrades.`
              : 'Pick the kit closest to your crew concept (core book pp. 156–157). You can edit everything afterwards.'}
          </Dialog.Description>

          {!kit ? (
            <ul className="grid gap-3 sm:grid-cols-2 p-4">
              {CREW_KITS.map(k => (
                <li key={k.name}>
                  <button type="button" onClick={() => choose(k)} className="panel w-full text-left p-4 h-full hover:border-[#7fe8ff]">
                    <div className="font-display text-xl tracking-wide" style={{ color: '#7fe8ff' }}>{k.name}</div>
                    <div className="text-sm italic mt-0.5" style={{ color: 'var(--text-soft)' }}>“{k.identity}”</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{k.powerTags.slice(0, 4).join(' · ')}…</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 space-y-5">
              <section>
                <h3 className="font-display tracking-widest mb-2" style={{ color: 'var(--accent-lime)' }}>POWER TAGS · {power.length}/{PICK_POWER}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {kit.powerTags.map(t => (
                    <button key={t} type="button" aria-pressed={power.includes(t)} onClick={() => toggle(power, setPower, t)} className="px-3 rounded-lg italic font-semibold" style={chip(power.includes(t), '#c8ff00')}>
                      {power.includes(t) && <Check size={13} className="inline mr-1" aria-hidden />}{t}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="font-display tracking-widest mb-2" style={{ color: '#ff9fb2' }}>WEAKNESS TAG · {weak.length}/{PICK_WEAKNESS}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {kit.weaknessTags.map(t => (
                    <button key={t} type="button" aria-pressed={weak.includes(t)} onClick={() => toggle(weak, setWeak, t)} className="px-3 rounded-lg italic font-semibold" style={chip(weak.includes(t), '#ff4f6e')}>
                      {weak.includes(t) && <Check size={13} className="inline mr-1" aria-hidden />}{t}
                    </button>
                  ))}
                </div>
              </section>
              <section>
                <label htmlFor="crew-identity" className="field-label">IDENTITY · RITUAL · ITCH</label>
                <input id="crew-identity" className="input" value={identity} onChange={e => setIdentity(e.target.value)} />
                <p className="field-hint">The statement that holds the crew together. Rewrite it in your own words if you like.</p>
              </section>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary" onClick={apply} disabled={power.length < 1 || weak.length < 1}>USE THIS KIT</button>
                <button type="button" className="btn btn-ghost" onClick={() => setKit(null)}>BACK TO KITS</button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
