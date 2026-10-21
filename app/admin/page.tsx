'use client'
import { useCallback, useEffect, useState } from 'react'
import { KeyRound, ShieldCheck, ShieldOff, UserX, UserCheck } from 'lucide-react'
import { useSession } from '@/components/auth/SessionProvider'
import { api } from '@/lib/api'
import type { IUser } from '@/types'

type AdminUser = IUser & { campaignCount: number }

export default function AdminPage() {
  const { user: me } = useSession()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    api<AdminUser[]>('/api/admin/users').then(setUsers).catch(e => setError(e.message))
  }, [])
  useEffect(() => { load() }, [load])

  async function update(id: string, body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return
    try {
      await api(`/api/admin/users/${id}`, { method: 'PATCH', json: body })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed.')
    }
  }

  function resetPassword(u: AdminUser) {
    const pw = prompt(`New password for @${u.username} (at least 8 characters). They’ll be signed out everywhere.`)
    if (pw) update(u._id, { newPassword: pw })
  }

  if (me && me.role !== 'admin') {
    return <div className="max-w-xl mx-auto px-4 py-16 text-center" style={{ color: 'var(--text-muted)' }}>Admins only.</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-4xl tracking-widest">ADMIN · USERS</h1>
      <p className="mt-1 mb-6" style={{ color: 'var(--text-muted)' }}>
        Admins can see and run every campaign. Disabled users can’t sign in. Campaign roles (MC, player, spectator) are set on each campaign’s Members panel.
      </p>
      {error && <div role="alert" className="alert-error mb-4">{error}</div>}

      <ul className="space-y-3">
        {users.map(u => {
          const isMe = u._id === me?._id
          return (
            <li key={u._id} className="panel p-4 flex flex-col sm:flex-row sm:items-center gap-3" style={{ opacity: u.disabled ? 0.6 : 1 }}>
              <div className="flex-1 min-w-0">
                <div className="font-display text-xl tracking-wide truncate">
                  {u.displayName} <span className="text-base" style={{ color: 'var(--text-muted)' }}>@{u.username}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="chip" style={u.role === 'admin' ? { color: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' } : undefined}>{u.role.toUpperCase()}</span>
                  {u.disabled && <span className="chip" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>DISABLED</span>}
                  <span className="chip">{u.campaignCount} CAMPAIGN{u.campaignCount === 1 ? '' : 'S'}</span>
                  {isMe && <span className="chip">YOU</span>}
                </div>
              </div>
              {!isMe && (
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => update(u._id, { role: u.role === 'admin' ? 'user' : 'admin' }, u.role === 'admin' ? undefined : `Make @${u.username} a site admin?`)}>
                    {u.role === 'admin' ? <><ShieldOff size={14} aria-hidden /> REMOVE ADMIN</> : <><ShieldCheck size={14} aria-hidden /> MAKE ADMIN</>}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => resetPassword(u)}><KeyRound size={14} aria-hidden /> RESET PASSWORD</button>
                  <button className={`btn btn-sm ${u.disabled ? 'btn-ghost' : 'btn-danger'}`} onClick={() => update(u._id, { disabled: !u.disabled }, u.disabled ? undefined : `Disable @${u.username}? They’ll be signed out.`)}>
                    {u.disabled ? <><UserCheck size={14} aria-hidden /> ENABLE</> : <><UserX size={14} aria-hidden /> DISABLE</>}
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
