'use client'
import { useId, useState } from 'react'
import { Plus, Minus, X, Shield, Crosshair, Ban, Magnet, Hourglass } from 'lucide-react'
import { Tooltip, InfoTip } from '@/components/ui/Tooltip'
import { PC_STATUS_LIMIT, TIER_NAMES, reduceStatus, stackStatus, statusTier } from '@/lib/rules'
import type { IStatus, StatusType } from '@/types'

/** Common statuses (core book pp. 103–109 and the Action Database), offered as you type. */
const STATUS_SUGGESTIONS = [
  'wounded', 'bleeding', 'bruised', 'burned', 'stunned', 'exhausted', 'poisoned', 'prone', 'restrained', 'scared',
  'shamed', 'humiliated', 'cursed', 'hacked', 'tagged', 'jammed', 'malfunctioning', 'bad-rap', 'wanted',
  'charmed', 'convinced', 'enraged', 'hypnotized', 'controlled',
  'alert', 'shielded', 'warded', 'firewalled', 'behind-cover', 'aiming', 'confident', 'hidden', 'boosted',
]

// Tier boxes shade from purple (1) to hot pink (6), like the printed tracking cards.
const TIER_COLORS = ['#7c4dff', '#9446f0', '#ad3fdc', '#c938c2', '#e1329e', '#f72d78']

export const STATUS_TYPES: Record<StatusType, { label: string; icon: React.ReactNode; color: string; help: string }> = {
  harmful: { label: 'Harmful', icon: <Crosshair size={14} />, color: '#ff4f8b', help: 'Harm or damage (wounded, shamed, cursed). Counts against you; at your Limit (5) you’re overcome.' },
  hindering: { label: 'Hindering', icon: <Ban size={14} />, color: '#a66bff', help: 'Something in your way (blinded, restrained, jammed). Subtracts from actions it hinders.' },
  compelling: { label: 'Compelling', icon: <Magnet size={14} />, color: '#29c8f2', help: 'A directive you’re pushed to follow (charmed, enraged, hacked). Hinders every action against it; at 5 you can’t even try.' },
  helpful: { label: 'Helpful', icon: <Shield size={14} />, color: '#c8ff00', help: 'A boost (alert, shielded, aiming). Your best helpful status adds its tier to a relevant action.' },
  progress: { label: 'Progress', icon: <Hourglass size={14} />, color: '#ffb347', help: 'Tracks a process — a ritual, a chase, a countdown. Something happens when it reaches its Limit.' },
}

function marksOf(s: IStatus) {
  return s.marks?.length ? s.marks : s.tier > 0 ? [s.tier] : []
}

function withMarks(s: IStatus, marks: number[]): IStatus | null {
  const tier = statusTier(marks)
  return tier > 0 ? { ...s, marks, tier } : null
}

function StatusCard({ status, onChange, onRemove, limit }: {
  status: IStatus
  onChange: (s: IStatus | null) => void
  onRemove: () => void
  limit: number
}) {
  const meta = STATUS_TYPES[status.type] ?? STATUS_TYPES.harmful
  const marks = marksOf(status)
  const tier = statusTier(marks)
  const [incoming, setIncoming] = useState(1)
  const incomingId = useId()

  function toggleBox(t: number) {
    const next = marks.includes(t) ? marks.filter(m => m !== t) : [...marks, t].sort((a, b) => a - b)
    onChange(withMarks(status, next))
  }

  const limitNote = status.type === 'progress' || status.type === 'helpful'
    ? null
    : tier > limit ? 'Permanent — beyond your Limit' : tier === limit ? `Overcome — at your Limit (${limit})` : null

  return (
    <div className="tracking-card" style={{ ['--status-color' as string]: meta.color }}>
      <div className="tracking-card-head">
        <Tooltip content={meta.help}>
          <span className="flex items-center gap-1.5 font-display tracking-widest cursor-help">{meta.icon}{meta.label.toUpperCase()}</span>
        </Tooltip>
        <button type="button" onClick={onRemove} className="slot-btn remove edit-only" style={{ color: '#203040', width: 32, height: 32 }} aria-label={`Remove ${status.name}`}>
          <X size={15} />
        </button>
      </div>
      <div className="tracking-card-body">
        <div className="tracking-card-name">
          <input
            value={status.name}
            onChange={e => onChange({ ...status, name: e.target.value })}
            aria-label="Status name"
            className="w-full bg-transparent outline-none font-display tracking-wide"
            style={{ fontSize: 22, color: '#1a2400' }}
          />
          <div className="text-sm font-semibold" style={{ color: '#3d4d10' }}>
            {status.name || 'status'}-{tier} · {TIER_NAMES[tier]}
          </div>
          {limitNote && <div className="text-xs font-display tracking-widest mt-0.5" style={{ color: '#a01838' }}>{limitNote}</div>}
        </div>
        <div className="tracking-tiers" role="group" aria-label={`${status.name} tier boxes`}>
          {[1, 2, 3, 4, 5, 6].map(t => {
            const on = marks.includes(t)
            return (
              <Tooltip key={t} content={`Tier ${t} — ${TIER_NAMES[t]}. Tap to ${on ? 'clear' : 'mark'} this box.`}>
                <button
                  type="button"
                  onClick={() => toggleBox(t)}
                  aria-pressed={on}
                  aria-label={`Tier ${t}${on ? ', marked' : ''}`}
                  className={`tier-box ${on ? 'is-on' : ''} ${t === tier ? 'is-top' : ''}`}
                  style={{ ['--tier-color' as string]: TIER_COLORS[t - 1] }}
                >
                  <span className="font-display">{t}</span>
                  {on && <span className="tier-x" aria-hidden>×</span>}
                </button>
              </Tooltip>
            )
          })}
        </div>
      </div>
      <div className="tracking-card-actions edit-only">
        <label className="sr-only" htmlFor={incomingId}>Tiers to stack or reduce</label>
        <select id={incomingId} value={incoming} onChange={e => setIncoming(Number(e.target.value))} className="tracking-select">
          {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <Tooltip content="Take this status again at the chosen tier: it stacks — marking that box, or the next free box above it.">
          <button type="button" className="tracking-btn" onClick={() => onChange(withMarks(status, stackStatus(marks, incoming)))}>
            <Plus size={14} aria-hidden /> STACK
          </button>
        </Tooltip>
        <Tooltip content="Reduce by the chosen number of tiers (Restore, Weaken or Set Back): every mark shifts down; marks below 1 disappear.">
          <button type="button" className="tracking-btn" onClick={() => onChange(withMarks(status, reduceStatus(marks, incoming)))}>
            <Minus size={14} aria-hidden /> REDUCE
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

interface Props {
  statuses: IStatus[]
  onChange: (statuses: IStatus[]) => void
  /** This campaign's PC status Limit (book default 5). */
  limit?: number
}

export function TrackingCards({ statuses, onChange, limit = PC_STATUS_LIMIT }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<StatusType>('harmful')
  const [tier, setTier] = useState(1)

  // Taking a status you already have (same name) stacks onto it.
  function addStatus(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    const existing = statuses.findIndex(s => s.name.trim().toLowerCase() === n.toLowerCase())
    if (existing >= 0) {
      const s = statuses[existing]
      const next = withMarks(s, stackStatus(marksOf(s), tier))!
      onChange(statuses.map((x, i) => i === existing ? next : x))
    } else {
      onChange([...statuses, { name: n, type, tier, marks: [tier] }])
    }
    setName('')
  }

  const worst = statuses.filter(s => s.type !== 'helpful' && s.type !== 'progress').reduce((m, s) => Math.max(m, s.tier), 0)
  const best = statuses.filter(s => s.type === 'helpful').reduce((m, s) => Math.max(m, s.tier), 0)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
        <h2 className="font-display text-2xl tracking-widest flex items-center gap-2">
          STATUSES
          <InfoTip label="statuses">
            Statuses are temporary conditions with a tier from 1 (mild) to 6 (lethal or permanent). On a roll, add your best relevant helpful status and subtract your worst relevant negative one. At your Limit ({limit} in this campaign) you’re overcome by it; beyond it is permanent.
          </InfoTip>
        </h2>
        {(best > 0 || worst > 0) && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {best > 0 && <>Best helpful <b style={{ color: 'var(--accent-lime)' }}>+{best}</b>{worst > 0 ? ' · ' : ''}</>}
            {worst > 0 && <>worst negative <b style={{ color: '#ff4f8b' }}>−{worst}</b></>} (when relevant to the action)
          </span>
        )}
      </div>

      {statuses.length > 0 ? (
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
          {statuses.map((s, i) => (
            <StatusCard
              key={s._id ?? `${s.name}-${i}`}
              status={s}
              onChange={next => onChange(next ? statuses.map((x, idx) => idx === i ? next : x) : statuses.filter((_, idx) => idx !== i))}
              onRemove={() => onChange(statuses.filter((_, idx) => idx !== i))}
              limit={limit}
            />
          ))}
        </div>
      ) : (
        <p className="mb-2" style={{ color: 'var(--text-muted)' }}>No statuses right now.</p>
      )}

      <form onSubmit={addStatus} className="edit-only mt-4 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <label htmlFor="new-status" className="field-label">NEW STATUS</label>
          <input id="new-status" className="input" placeholder="e.g. wounded, alert, hacked" value={name} onChange={e => setName(e.target.value)} list="status-suggestions" autoComplete="off" />
          <datalist id="status-suggestions">
            {[...new Set([...statuses.map(s => s.name), ...STATUS_SUGGESTIONS])].map(n => <option key={n} value={n} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="new-status-type" className="field-label">TYPE</label>
          <select id="new-status-type" className="input" style={{ width: 'auto' }} value={type} onChange={e => setType(e.target.value as StatusType)}>
            {(Object.keys(STATUS_TYPES) as StatusType[]).map(t => <option key={t} value={t}>{STATUS_TYPES[t].label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="new-status-tier" className="field-label">TIER</label>
          <select id="new-status-tier" className="input" style={{ width: 'auto' }} value={tier} onChange={e => setTier(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} · {TIER_NAMES[n]}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}><Plus size={16} aria-hidden /> ADD</button>
      </form>
    </div>
  )
}
