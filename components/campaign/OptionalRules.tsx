'use client'
import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { api } from '@/lib/api'
import { DEFAULT_RULES, type IOptionalRules } from '@/types'

/** The book's optional rules for this campaign. MCs change them; everyone can see what's in play. */
export function OptionalRules({ campaignId, rules, canManage, onSaved }: { campaignId: string; rules?: IOptionalRules; canManage: boolean; onSaved: (r: IOptionalRules) => void }) {
  const current = { ...DEFAULT_RULES, ...rules }
  const [error, setError] = useState<string | null>(null)

  async function set(patch: Partial<IOptionalRules>) {
    const next = { ...current, ...patch }
    setError(null)
    onSaved(next)
    try { await api(`/api/campaigns/${campaignId}`, { method: 'PATCH', json: { optionalRules: next } }) }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not save'); onSaved(current) }
  }

  const changed = JSON.stringify(current) !== JSON.stringify(DEFAULT_RULES)
  if (!canManage && !changed) return null

  const row = 'flex items-center justify-between gap-3 flex-wrap'
  return (
    <section className="panel p-4" aria-labelledby="rules-heading">
      <h2 id="rules-heading" className="font-display text-xl tracking-widest mb-3 flex items-center gap-2"><SlidersHorizontal size={17} aria-hidden /> OPTIONAL RULES</h2>
      <div className="space-y-3 text-[15px]">
        <div className={row}>
          <span className="flex items-center gap-2">PC status Limit <InfoTip label="PC Limit">How much of a status overcomes a player character (book default 5, with 6 permanent). Lower it for grittier, deadlier play (core book p.107).</InfoTip></span>
          {canManage ? (
            <select className="input" style={{ width: 'auto', minHeight: 36 }} value={current.pcLimit} onChange={e => set({ pcLimit: Number(e.target.value) as 3 | 4 | 5 })} aria-label="PC status Limit">
              <option value={5}>5 (default)</option><option value={4}>4 (gritty)</option><option value={3}>3 (deadly)</option>
            </select>
          ) : <b>{current.pcLimit}</b>}
        </div>
        <div className={row}>
          <span className="flex items-center gap-2">Enhance cost <InfoTip label="Enhance cost">Power per tier when giving yourself or an ally a helpful status. 2 stops players stacking big buffs (p.95).</InfoTip></span>
          {canManage ? (
            <select className="input" style={{ width: 'auto', minHeight: 36 }} value={current.enhanceCost} onChange={e => set({ enhanceCost: Number(e.target.value) as 1 | 2 })} aria-label="Enhance cost">
              <option value={1}>1 per tier (default)</option><option value={2}>2 per tier</option>
            </select>
          ) : <b>{current.enhanceCost} per tier</b>}
        </div>
        <div className={row}>
          <span className="flex items-center gap-2">Power tag cap <InfoTip label="Power tag cap">The most positive tags that count in one roll. Off by default (p.89).</InfoTip></span>
          {canManage ? (
            <select className="input" style={{ width: 'auto', minHeight: 36 }} value={current.powerTagCap ?? ''} onChange={e => set({ powerTagCap: e.target.value ? Number(e.target.value) : null })} aria-label="Power tag cap">
              <option value="">No cap (default)</option>
              {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n} tags</option>)}
            </select>
          ) : <b>{current.powerTagCap ?? 'none'}</b>}
        </div>
        <label className={row}>
          <span className="flex items-center gap-2">No death spiral <InfoTip label="death spiral">A status counting toward a Limit can’t make it easier to add more to that Limit (or harder to mitigate it), so getting hurt doesn’t snowball (p.109).</InfoTip></span>
          {canManage
            ? <input type="checkbox" className="w-5 h-5" checked={current.noDeathSpiral} onChange={e => set({ noDeathSpiral: e.target.checked })} />
            : <b>{current.noDeathSpiral ? 'on' : 'off'}</b>}
        </label>
      </div>
      {error && <p role="alert" className="text-sm mt-2" style={{ color: 'var(--danger)' }}>{error}</p>}
    </section>
  )
}
