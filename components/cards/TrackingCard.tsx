'use client'
import { useState } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { X, Plus, Shield, Crosshair, Zap } from 'lucide-react'
import type { IStatus } from '@/types'

const TIER_COLORS = [
  '#6b21a8', // 1 - purple
  '#7e22ce', // 2
  '#a21caf', // 3 - fuchsia
  '#be185d', // 4 - pink
  '#e11d48', // 5 - rose
  '#ff2d7a', // 6 - hot pink
]

const TYPE_META: Record<IStatus['type'], { label: string; icon: React.ReactNode; color: string }> = {
  helpful: { label: 'Helpful', icon: <Shield size={12} />, color: '#c8ff00' },
  harmful: { label: 'Harmful', icon: <Crosshair size={12} />, color: '#ff2d7a' },
  hindering: { label: 'Hindering', icon: <Zap size={12} />, color: '#9b4dff' },
  compelling: { label: 'Compelling', icon: <Zap size={12} />, color: '#00d4ff' },
}

interface Props {
  statuses: IStatus[]
  onChange: (statuses: IStatus[]) => void
}

function StatusTracker({ status, onTierChange, onRemove }: {
  status: IStatus
  onTierChange: (tier: number) => void
  onRemove: () => void
}) {
  const meta = TYPE_META[status.type]
  return (
    <div
      className="rounded-lg overflow-hidden card-chamfer"
      style={{ background: '#141929', border: '1px solid #2a3352', minWidth: 110 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1" style={{ background: '#1a2035', borderBottom: '1px solid #2a3352' }}>
        <Tooltip content={`${meta.label} status — tier defines intensity`}>
          <span className="flex items-center gap-1 cursor-help" style={{ color: meta.color, fontSize: 11 }}>
            {meta.icon}
            <span className="font-display tracking-wide">{meta.label}</span>
          </span>
        </Tooltip>
        <button onClick={onRemove} className="hover:text-red-400 transition-colors" style={{ color: '#7a8099' }}>
          <X size={12} />
        </button>
      </div>
      {/* Name */}
      <div className="px-2 pt-1 pb-0.5">
        <span className="font-display tracking-wide text-sm" style={{ color: '#e8eaf0' }}>{status.name}</span>
      </div>
      {/* Tier track 1–6 */}
      <div className="flex gap-0.5 px-2 pb-2 pt-1">
        {[1, 2, 3, 4, 5, 6].map(t => (
          <Tooltip key={t} content={`Tier ${t} — ${t <= 2 ? 'Minor' : t <= 4 ? 'Moderate' : 'Severe'}`}>
            <button
              onClick={() => onTierChange(status.tier === t ? 0 : t)}
              className="tier-btn flex-1"
              style={{
                height: 28,
                background: t <= status.tier ? TIER_COLORS[t - 1] : '#0a0e18',
                border: `1px solid ${t <= status.tier ? TIER_COLORS[t - 1] : '#2a3352'}`,
                color: t <= status.tier ? '#fff' : '#3a4462',
                fontSize: 12,
                fontFamily: 'Bebas Neue, sans-serif',
              }}
            >
              {t}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}

export function TrackingCards({ statuses, onChange }: Props) {
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<IStatus['type']>('harmful')

  function addStatus() {
    if (!newName.trim()) return
    const s: IStatus = { name: newName.trim(), tier: 1, type: newType }
    onChange([...statuses, s])
    setNewName('')
  }

  function updateTier(idx: number, tier: number) {
    const updated = statuses.map((s, i) => i === idx ? { ...s, tier } : s)
    onChange(tier === 0 ? statuses.filter((_, i) => i !== idx) : updated)
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Tooltip content="Tracking cards record active statuses. Each status has a tier (1–6) showing its intensity. Click a tier to set it; click the active tier again to remove the status.">
          <h3 className="font-display text-xl tracking-widest cursor-help" style={{ color: '#c8ff00' }}>
            TRACKING CARDS
          </h3>
        </Tooltip>
      </div>

      {/* Active statuses */}
      {statuses.length > 0 ? (
        <div className="flex flex-wrap gap-3 mb-4">
          {statuses.map((s, i) => (
            <StatusTracker
              key={i}
              status={s}
              onTierChange={tier => updateTier(i, tier)}
              onRemove={() => onChange(statuses.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm mb-4" style={{ color: '#7a8099' }}>No active statuses.</p>
      )}

      {/* Add new status */}
      <div className="flex gap-2 items-center">
        <input
          className="editable-field"
          style={{ maxWidth: 180 }}
          placeholder="Status name..."
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addStatus()}
        />
        <select
          value={newType}
          onChange={e => setNewType(e.target.value as IStatus['type'])}
          style={{
            background: '#141929',
            border: '1px solid #2a3352',
            color: '#e8eaf0',
            borderRadius: 4,
            padding: '2px 6px',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 13,
          }}
        >
          <option value="harmful">Harmful</option>
          <option value="helpful">Helpful</option>
          <option value="hindering">Hindering</option>
          <option value="compelling">Compelling</option>
        </select>
        <button
          onClick={addStatus}
          className="flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold transition-colors"
          style={{ background: '#c8ff00', color: '#080c18', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}
        >
          <Plus size={14} /> ADD
        </button>
      </div>
    </div>
  )
}
