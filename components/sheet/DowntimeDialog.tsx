'use client'
import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Coffee, Minus, Plus, X } from 'lucide-react'
import { DOWNTIME_POWER, applyDowntimePower, applyDowntimeUpgrade, downtimeCost, type DowntimeSpend } from '@/lib/downtime'
import { UPGRADE_BOXES } from '@/lib/rules'
import type { ICharacter } from '@/types'

/**
 * Downtime (core book p.124): describe what your character does, then take
 * one benefit — an upgrade box on a theme, or 3 Power to recover (burned
 * tags cost just 1 each in downtime) and heal statuses.
 */
export function DowntimeDialog({ character, onApply }: { character: ICharacter; onApply: (c: ICharacter) => void }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'power' | 'upgrade'>('power')
  const [spend, setSpend] = useState<DowntimeSpend>({ recover: [], heal: {} })
  const [theme, setTheme] = useState(character.themes.findIndex(t => t.themeType))
  const cost = downtimeCost(spend)
  const left = DOWNTIME_POWER - cost

  const burned = character.themes.flatMap((t, ti) => t.tags.map((tag, i) => ({ t, ti, tag, i }))).filter(x => x.tag.isBurned && x.tag.text && !x.tag.isWeakness)
  const negative = character.statuses.map((s, i) => ({ s, i })).filter(x => x.s.type !== 'helpful' && x.s.type !== 'progress')

  function toggleRecover(ti: number, i: number) {
    setSpend(sp => {
      const on = sp.recover.some(r => r.theme === ti && r.tag === i)
      return { ...sp, recover: on ? sp.recover.filter(r => !(r.theme === ti && r.tag === i)) : [...sp.recover, { theme: ti, tag: i }] }
    })
  }
  function heal(i: number, delta: number, max: number) {
    setSpend(sp => ({ ...sp, heal: { ...sp.heal, [i]: Math.max(0, Math.min(max, (sp.heal[i] ?? 0) + delta)) } }))
  }

  function apply() {
    onApply(mode === 'upgrade' ? applyDowntimeUpgrade(character, theme) : applyDowntimePower(character, spend))
    setOpen(false)
    setSpend({ recover: [], heal: {} })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-ghost btn-sm"><Coffee size={14} aria-hidden /> <span className="hidden sm:inline">DOWNTIME</span></button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content className="fixed z-50 inset-0 md:inset-x-[max(24px,calc(50vw-320px))] md:inset-y-10 md:rounded-2xl overflow-y-auto" style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">DOWNTIME</Dialog.Title>
            <Dialog.Close asChild><button type="button" className="btn btn-ghost btn-icon" aria-label="Close"><X size={18} /></button></Dialog.Close>
          </div>
          <Dialog.Description className="px-4 pt-3 text-[15px]" style={{ color: 'var(--text-soft)' }}>
            Narrate what {character.name || 'your character'} does while the crew catches its breath, then take <b>one</b> benefit.
            (Spending downtime on Loading Up, a relationship tag, or research? Do that on the sheet — talk it over with your MC.)
          </Dialog.Description>
          <div className="p-4 space-y-4">
            <div className="flex rounded-lg overflow-hidden" role="group" aria-label="Benefit" style={{ border: '1px solid var(--border-card)' }}>
              {(['power', 'upgrade'] as const).map(m => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className="flex-1 font-display tracking-widest"
                  style={{ minHeight: 44, background: mode === m ? 'var(--accent-lime)' : 'transparent', color: mode === m ? 'var(--bg-dark)' : 'var(--text-muted)' }}>
                  {m === 'power' ? `${DOWNTIME_POWER} POWER` : 'MARK AN UPGRADE'}
                </button>
              ))}
            </div>

            {mode === 'upgrade' ? (
              <fieldset className="space-y-1.5">
                <legend className="font-display tracking-widest mb-1">WHICH THEME?</legend>
                {character.themes.map((t, i) => t.themeType && (
                  <label key={i} className="panel px-3 flex items-center gap-3 cursor-pointer" style={{ minHeight: 48, borderColor: theme === i ? 'var(--accent-lime)' : undefined }}>
                    <input type="radio" name="dt-theme" checked={theme === i} onChange={() => setTheme(i)} className="w-4 h-4" />
                    <span className="flex-1 font-semibold">{t.name || t.themeType}</span>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>upgrade {t.upgrade}/{UPGRADE_BOXES}</span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <>
                <p className="font-display tracking-widest" style={{ color: left < 0 ? 'var(--danger)' : 'var(--accent-lime)' }}>{left} OF {DOWNTIME_POWER} POWER LEFT</p>
                <section>
                  <h3 className="font-display tracking-widest text-sm mb-1" style={{ color: 'var(--text-muted)' }}>RECOVER BURNED TAGS · 1 EACH</h3>
                  {burned.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Nothing burned.</p> : (
                    <div className="flex flex-wrap gap-1.5">
                      {burned.map(({ t, ti, tag, i }) => {
                        const on = spend.recover.some(r => r.theme === ti && r.tag === i)
                        return (
                          <button key={`${ti}-${i}`} type="button" aria-pressed={on} onClick={() => toggleRecover(ti, i)} className="px-3 rounded-lg italic font-semibold"
                            style={{ minHeight: 40, border: `1px solid ${on ? 'var(--accent-lime)' : 'var(--border-card)'}`, background: on ? 'rgba(200,255,0,0.12)' : 'var(--bg-inset)' }}
                            title={t.name || t.themeType}>
                            {tag.text}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </section>
                <section>
                  <h3 className="font-display tracking-widest text-sm mb-1" style={{ color: 'var(--text-muted)' }}>HEAL & RECOVER · 1 PER TIER</h3>
                  {negative.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No negative statuses.</p> : (
                    <ul className="space-y-1.5">
                      {negative.map(({ s, i }) => (
                        <li key={i} className="flex items-center justify-between gap-2 panel px-3" style={{ minHeight: 48 }}>
                          <span className="font-semibold">{s.name}-{s.tier}</span>
                          <span className="flex items-center gap-1">
                            <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 36, minWidth: 36 }} onClick={() => heal(i, -1, s.tier)} aria-label={`Heal ${s.name} one tier less`}><Minus size={14} /></button>
                            <span className="w-14 text-center text-sm">−{spend.heal[i] ?? 0} tier</span>
                            <button type="button" className="btn btn-ghost btn-icon" style={{ minHeight: 36, minWidth: 36 }} onClick={() => heal(i, 1, s.tier)} aria-label={`Heal ${s.name} one tier more`}><Plus size={14} /></button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </>
            )}
            <button type="button" className="btn btn-primary w-full" onClick={apply} disabled={mode === 'power' ? cost === 0 || left < 0 : theme < 0}>TAKE THIS BENEFIT</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
