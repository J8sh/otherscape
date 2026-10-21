'use client'
import { useEffect, useState } from 'react'
import { useSession } from '@/components/auth/SessionProvider'
import { api } from '@/lib/api'

export default function AccountPage() {
  const { user, refresh, signOut } = useSession()
  const [displayName, setDisplayName] = useState('')
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => { if (user) setDisplayName(user.displayName) }, [user])

  async function save(body: Record<string, string>, success: string) {
    setMsg(null)
    try {
      await api('/api/auth/me', { method: 'PATCH', json: body })
      await refresh()
      setMsg({ ok: true, text: success })
      return true
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Could not save.' })
      return false
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pw.newPassword !== pw.confirm) return setMsg({ ok: false, text: 'New passwords don’t match.' })
    if (await save({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }, 'Password changed.')) {
      setPw({ currentPassword: '', newPassword: '', confirm: '' })
    }
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <h1 className="font-display text-4xl tracking-widest">ACCOUNT</h1>

      {msg && <div role="status" className={msg.ok ? 'panel p-3' : 'alert-error'} style={msg.ok ? { borderColor: 'var(--accent-lime)' } : undefined}>{msg.text}</div>}

      <form className="panel p-5 space-y-4" onSubmit={e => { e.preventDefault(); save({ displayName }, 'Display name saved.') }}>
        <div>
          <span className="field-label">USERNAME</span>
          <p className="font-semibold">@{user.username}</p>
        </div>
        <div>
          <label htmlFor="dn" className="field-label">DISPLAY NAME</label>
          <input id="dn" className="input" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={40} />
          <p className="field-hint">Shown to your crew and on the characters you own.</p>
        </div>
        <button className="btn btn-primary">SAVE NAME</button>
      </form>

      <form className="panel p-5 space-y-4" onSubmit={changePassword}>
        <h2 className="font-display text-xl tracking-widest">CHANGE PASSWORD</h2>
        {(['currentPassword', 'newPassword', 'confirm'] as const).map(k => (
          <div key={k}>
            <label htmlFor={k} className="field-label">{k === 'currentPassword' ? 'CURRENT PASSWORD' : k === 'newPassword' ? 'NEW PASSWORD' : 'CONFIRM NEW PASSWORD'}</label>
            <input id={k} type="password" className="input" autoComplete={k === 'currentPassword' ? 'current-password' : 'new-password'}
              value={pw[k]} onChange={e => setPw(p => ({ ...p, [k]: e.target.value }))} />
          </div>
        ))}
        <button className="btn btn-primary">CHANGE PASSWORD</button>
      </form>

      <section className="panel p-5 space-y-3" aria-labelledby="devices-heading">
        <h2 id="devices-heading" className="font-display text-xl tracking-widest">DEVICES</h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Signed in on a shared or lost device? End every other session — you stay signed in here.</p>
        <button type="button" className="btn btn-ghost" onClick={async () => {
          setMsg(null)
          try {
            await api('/api/auth/sign-out-others', { method: 'POST' })
            setMsg({ ok: true, text: 'Signed out everywhere else.' })
          } catch (e) {
            setMsg({ ok: false, text: e instanceof Error ? e.message : 'Something went wrong.' })
          }
        }}>SIGN OUT OTHER DEVICES</button>
      </section>
      <button className="btn btn-danger w-full" onClick={signOut}>SIGN OUT</button>
    </div>
  )
}
