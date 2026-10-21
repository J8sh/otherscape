'use client'
import { useState } from 'react'
import { Swords } from 'lucide-react'
import { api } from '@/lib/api'
import type { IChallenge } from '@/types'

const EFFECTS = [
  { name: 'Attack', op: 'add', hint: 'wounded' },
  { name: 'Disrupt', op: 'add', hint: 'off-balance' },
  { name: 'Influence', op: 'add', hint: 'convinced' },
  { name: 'Set Back / Weaken', op: 'reduce', hint: '' },
] as const

/** After a hit: spend Power to put (or strip) a status on a revealed Challenge. */
export function ApplyToChallenge({ campaignId, challenges, power }: { campaignId: string; challenges: IChallenge[]; power: number }) {
  const [cid, setCid] = useState(challenges[0]?._id ?? '')
  const [effect, setEffect] = useState(0)
  const [name, setName] = useState('')
  const [tier, setTier] = useState(Math.min(6, Math.max(1, power)))
  const [limit, setLimit] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const challenge = challenges.find(c => c._id === cid)
  const e = EFFECTS[effect]

  async function apply(ev: React.FormEvent) {
    ev.preventDefault()
    const status = name.trim() || e.hint
    if (!challenge || !status) return
    try {
      const r = await api<{ challenge: string; status: string }>(`/api/campaigns/${campaignId}/challenges/${challenge._id}/status`, {
        method: 'POST', json: { name: status, tier, op: e.op, limit },
      })
      setMsg(`✓ ${r.challenge}: ${r.status}`)
      setName('')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not apply')
    }
  }

  const input = 'input text-sm'
  return (
    <form onSubmit={apply} className="mt-3 rounded-lg p-3 space-y-2" style={{ background: 'var(--bg-inset)', border: '1px solid #3a2232' }}>
      <div className="font-display tracking-widest flex items-center gap-2" style={{ color: '#ff9fb2' }}><Swords size={15} aria-hidden /> APPLY TO A CHALLENGE</div>
      <select className={input} value={cid} onChange={ev => { setCid(ev.target.value); setLimit('') }} aria-label="Challenge">
        {challenges.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <select className={input} value={effect} onChange={ev => setEffect(Number(ev.target.value))} aria-label="Effect">
          {EFFECTS.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
        </select>
        <select className={input} value={tier} onChange={ev => setTier(Number(ev.target.value))} aria-label="Tiers">
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} disabled={n > Math.max(power, 1)}>{e.op === 'add' ? `tier ${n}` : `−${n} tier${n > 1 ? 's' : ''}`} ({n} Power)</option>)}
        </select>
      </div>
      <input className={input} value={name} onChange={ev => setName(ev.target.value)} aria-label="Status"
        placeholder={e.op === 'add' ? `status, e.g. ${e.hint}` : 'which of its statuses?'} list="challenge-statuses" />
      <datalist id="challenge-statuses">{challenge?.statuses.map(s => <option key={s.name} value={s.name} />)}</datalist>
      {e.op === 'add' && (challenge?.limits.length ?? 0) > 0 && (
        <select className={input} value={limit} onChange={ev => setLimit(ev.target.value)} aria-label="Counts toward Limit">
          <option value="">(MC decides which Limit)</option>
          {challenge!.limits.map(l => <option key={l.name} value={l.name}>→ {l.name}</option>)}
        </select>
      )}
      <button className="btn btn-sm w-full" style={{ background: '#ff4f6e', color: '#fff' }} disabled={!challenge || (!name.trim() && !e.hint)}>APPLY</button>
      {msg && <p role="status" className="text-sm" style={{ color: msg.startsWith('✓') ? 'var(--accent-lime)' : 'var(--danger)' }}>{msg}</p>}
    </form>
  )
}
