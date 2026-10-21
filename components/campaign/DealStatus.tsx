'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { api } from '@/lib/api'
import { stackStatus, statusTier } from '@/lib/rules'
import type { ICharacter, StatusType } from '@/types'

/**
 * MC shortcut on Table View: deliver a status Consequence to a character.
 * Re-reads the sheet right before saving and stacks onto a matching status.
 */
export function DealStatus({ characterId, onDone }: { characterId: string; onDone: () => void }) {
  const [name, setName] = useState('')
  const [tier, setTier] = useState(2)
  const [type, setType] = useState<StatusType>('harmful')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function deal(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    setBusy(true)
    setMsg(null)
    try {
      const c = await api<ICharacter>(`/api/characters/${characterId}`)
      const statuses = [...c.statuses]
      const i = statuses.findIndex(s => s.name.trim().toLowerCase() === n.toLowerCase())
      if (i >= 0) {
        const marks = stackStatus(statuses[i].marks?.length ? statuses[i].marks! : [statuses[i].tier], tier)
        statuses[i] = { ...statuses[i], marks, tier: statusTier(marks) }
      } else {
        statuses.push({ name: n, tier, marks: [tier], type })
      }
      await api(`/api/characters/${characterId}`, { method: 'PATCH', json: { statuses } })
      const s = statuses.find(x => x.name.trim().toLowerCase() === n.toLowerCase())!
      setMsg(`${s.name}-${s.tier}`)
      setName('')
      onDone()
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not deal it')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={deal} className="mt-3 flex flex-wrap gap-1.5 items-center" aria-label="Deal a status">
      <input className="input text-sm flex-1 min-w-[110px]" style={{ minHeight: 36 }} placeholder="Deal a status…" value={name} onChange={e => setName(e.target.value)} aria-label="Status name" />
      <select className="input text-sm" style={{ width: 'auto', minHeight: 36 }} value={tier} onChange={e => setTier(Number(e.target.value))} aria-label="Tier">
        {[1, 2, 3, 4, 5, 6].map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select className="input text-sm" style={{ width: 'auto', minHeight: 36 }} value={type} onChange={e => setType(e.target.value as StatusType)} aria-label="Type">
        <option value="harmful">harmful</option><option value="hindering">hindering</option><option value="compelling">compelling</option><option value="helpful">helpful</option>
      </select>
      <button className="btn btn-sm btn-ghost" disabled={busy || !name.trim()} aria-label="Deal status"><Plus size={14} aria-hidden /></button>
      {msg && <span role="status" className="text-sm w-full" style={{ color: 'var(--text-muted)' }}>Now: {msg}</span>}
    </form>
  )
}
