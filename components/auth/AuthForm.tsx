'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface Props { mode: 'login' | 'register' }

/** Where to go after signing in: the `next` param, if it's a local path. */
function nextPath() {
  const next = new URLSearchParams(window.location.search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/campaigns'
}

export function AuthForm({ mode }: Props) {
  const isLogin = mode === 'login'
  const [form, setForm] = useState({ username: '', displayName: '', password: '', confirm: '' })
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isLogin && form.password !== form.confirm) {
      setError('Passwords don’t match.')
      return
    }
    setBusy(true)
    try {
      await api(isLogin ? '/api/auth/login' : '/api/auth/register', {
        method: 'POST',
        json: isLogin
          ? { username: form.username, password: form.password }
          : { username: form.username, displayName: form.displayName, password: form.password },
      })
      // Full navigation so every component picks up the new session.
      window.location.href = nextPath()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setBusy(false)
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))
  // Carry ?next= over to the other form — read after mount so server and
  // client render the same link (avoids a hydration mismatch).
  const [search, setSearch] = useState('')
  useEffect(() => setSearch(window.location.search), [])
  const otherHref = (base: string) => `${base}${search}`

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'radial-gradient(ellipse at top, #121a33 0%, #080c18 60%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="font-display text-5xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>:OTHERSCAPE</div>
          <div className="font-display tracking-[0.3em] mt-1" style={{ color: 'var(--text-muted)' }}>CAMPAIGN TRACKER</div>
        </div>

        <form onSubmit={submit} className="panel p-6 space-y-4" noValidate>
          <h1 className="font-display text-2xl tracking-widest">{isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}</h1>

          <div>
            <label htmlFor="username" className="field-label">USERNAME</label>
            <input id="username" className="input" autoComplete="username" autoCapitalize="none" spellCheck={false}
              value={form.username} onChange={set('username')} required />
            {!isLogin && <p className="field-hint">3–24 characters: letters, numbers, dot, dash or underscore.</p>}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="displayName" className="field-label">DISPLAY NAME</label>
              <input id="displayName" className="input" autoComplete="nickname" value={form.displayName}
                onChange={set('displayName')} placeholder="How the crew sees you" maxLength={40} />
            </div>
          )}

          <div>
            <label htmlFor="password" className="field-label">PASSWORD</label>
            <input id="password" type="password" className="input" autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={form.password} onChange={set('password')} required />
            {!isLogin && <p className="field-hint">At least 8 characters.</p>}
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="confirm" className="field-label">CONFIRM PASSWORD</label>
              <input id="confirm" type="password" className="input" autoComplete="new-password"
                value={form.confirm} onChange={set('confirm')} required />
            </div>
          )}

          {error && <div role="alert" className="alert-error text-sm">{error}</div>}

          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? 'ONE MOMENT…' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center mt-5" style={{ color: 'var(--text-muted)' }}>
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link href={otherHref(isLogin ? '/register' : '/login')} className="font-semibold underline underline-offset-4" style={{ color: 'var(--accent-lime)' }}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </Link>
        </p>
        {!isLogin && (
          <p className="text-center mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Got an invite link from your MC? Create an account, and you’ll land right in their campaign.
          </p>
        )}
      </div>
    </div>
  )
}
