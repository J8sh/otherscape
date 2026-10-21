'use client'
import { useState } from 'react'
import { Check, Copy, LogOut, RefreshCw, UserMinus } from 'lucide-react'
import { api } from '@/lib/api'
import { ROLE_HELP, ROLE_LABEL } from '@/lib/roles'
import { InfoTip } from '@/components/ui/Tooltip'
import type { CampaignRole, ICampaign } from '@/types'
import { InviteQr } from '@/components/campaign/InviteQr'

interface Props {
  campaign: ICampaign
  currentUserId: string
  onChanged: () => void
  onLeft: () => void
}

/** Who's in the campaign. MCs also get the invite link and role controls. */
export function MembersPanel({ campaign, currentUserId, onChanged, onLeft }: Props) {
  const me = campaign.me
  const [inviteCode, setInviteCode] = useState(campaign.inviteCode)
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inviteUrl = inviteCode && typeof window !== 'undefined' ? `${window.location.origin}/join/${inviteCode}` : ''

  async function run(fn: () => Promise<unknown>) {
    setError(null)
    try { await fn(); onChanged() } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong.') }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setError('Couldn’t copy — select the link and copy it manually.')
    }
  }

  async function regenerate() {
    if (!confirm('Make a new invite link? The current link and code will stop working.')) return
    await run(async () => setInviteCode((await api<{ inviteCode: string }>(`/api/campaigns/${campaign._id}/invite`, { method: 'POST' })).inviteCode))
  }

  return (
    <section className="panel p-4" aria-labelledby="members-heading">
      <div className="flex items-center gap-2 mb-3">
        <h2 id="members-heading" className="font-display text-xl tracking-widest" style={{ color: 'var(--accent-cyan)' }}>MEMBERS</h2>
        <InfoTip label="campaign roles">
          <b>MC</b>: {ROLE_HELP.mc}<br /><b>Player</b>: {ROLE_HELP.player}<br /><b>Spectator</b>: {ROLE_HELP.spectator}
        </InfoTip>
      </div>

      {me?.canManage && inviteCode && (
        <div className="mb-4 rounded-lg p-3" style={{ background: 'var(--bg-inset)', border: '1px dashed var(--border-card)' }}>
          <div className="field-label">INVITE LINK</div>
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Anyone with this link joins as a player. You can change roles below.</p>
          <div className="flex gap-2">
            <input className="input text-sm" readOnly value={inviteUrl} onFocus={e => e.currentTarget.select()} aria-label="Invite link" />
            <button className="btn btn-ghost btn-icon" onClick={copy} aria-label="Copy invite link">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            <button className="btn btn-ghost btn-icon" onClick={regenerate} aria-label="Make a new invite link"><RefreshCw size={16} /></button>
          </div>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Code: <b className="font-display tracking-[0.2em] text-base" style={{ color: 'var(--text-primary)' }}>{inviteCode}</b>
          </p>
          <details className="mt-1" onToggle={e => setShowQr((e.currentTarget as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer text-sm font-display tracking-widest flex items-center" style={{ minHeight: 36, color: 'var(--accent-cyan)' }}>SHOW QR CODE</summary>
            {showQr && inviteUrl && <InviteQr url={inviteUrl} />}
          </details>
        </div>
      )}

      {error && <div role="alert" className="alert-error text-sm mb-3">{error}</div>}

      <ul className="space-y-2">
        {campaign.members?.map(m => {
          const isOwner = m.userId === campaign.ownerId
          const isMe = m.userId === currentUserId
          return (
            <li key={m.userId} className="flex items-center gap-2 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{m.displayName}{isMe && <span style={{ color: 'var(--text-muted)' }}> (you)</span>}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>@{m.username}{isOwner && ' · owner'}</div>
              </div>
              {me?.canManage && !isOwner ? (
                <>
                  <select
                    className="input text-sm"
                    style={{ width: 'auto', minHeight: 36, padding: '4px 8px' }}
                    value={m.role}
                    aria-label={`Role for ${m.displayName}`}
                    onChange={e => run(() => api(`/api/campaigns/${campaign._id}/members/${m.userId}`, { method: 'PATCH', json: { role: e.target.value as CampaignRole } }))}
                  >
                    <option value="mc">MC</option>
                    <option value="player">Player</option>
                    <option value="spectator">Spectator</option>
                  </select>
                  {!isMe && (
                    <button
                      className="btn btn-danger btn-icon"
                      style={{ minHeight: 36, minWidth: 36 }}
                      aria-label={`Remove ${m.displayName}`}
                      onClick={() => confirm(`Remove ${m.displayName} from the campaign? Their characters stay.`) && run(() => api(`/api/campaigns/${campaign._id}/members/${m.userId}`, { method: 'DELETE' }))}
                    >
                      <UserMinus size={15} />
                    </button>
                  )}
                </>
              ) : (
                <span className="chip">{ROLE_LABEL[m.role]}</span>
              )}
            </li>
          )
        })}
      </ul>

      {me && !me.isOwner && (
        <button
          className="btn btn-danger btn-sm w-full mt-4"
          onClick={async () => {
            if (!confirm('Leave this campaign? Your characters stay with the crew.')) return
            try {
              await api(`/api/campaigns/${campaign._id}/members/${currentUserId}`, { method: 'DELETE' })
              onLeft()
            } catch (e) { setError(e instanceof Error ? e.message : 'Could not leave.') }
          }}
        >
          <LogOut size={14} aria-hidden /> LEAVE CAMPAIGN
        </button>
      )}
    </section>
  )
}
