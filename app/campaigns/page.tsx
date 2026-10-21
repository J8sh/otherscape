'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronRight, KeyRound, BookOpen, Dices } from 'lucide-react'
import { api } from '@/lib/api'
import { ROLE_LABEL } from '@/lib/roles'
import type { ICampaign } from '@/types'

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', megacity: '' })
  const [code, setCode] = useState('')

  async function load() {
    setError(null)
    try {
      setCampaigns(await api<ICampaign[]>('/api/campaigns'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setError(null)
    try {
      const c = await api<ICampaign>('/api/campaigns', { method: 'POST', json: form })
      router.push(`/campaigns/${c._id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create campaign')
    }
  }

  function joinByCode(e: React.FormEvent) {
    e.preventDefault()
    // Accept either a bare code or a pasted invite link.
    const trimmed = code.trim()
    const fromLink = trimmed.match(/\/join\/([A-Za-z0-9-]+)/)?.[1]
    const c = (fromLink ?? trimmed).replace(/[^A-Za-z0-9]/g, '')
    if (c) router.push(`/join/${c}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl tracking-widest">CAMPAIGNS</h1>
          <p style={{ color: 'var(--text-muted)' }}>Your crews across the Megacity. Start one as MC, or join with an invite code.</p>
        </div>
        <button onClick={() => setCreating(c => !c)} className="btn btn-primary" aria-expanded={creating}>
          <Plus size={18} aria-hidden /> NEW CAMPAIGN
        </button>
      </div>

      {creating && (
        <form onSubmit={create} className="panel p-5 mb-6" style={{ borderColor: 'var(--accent-lime)' }}>
          <h2 className="font-display text-xl tracking-widest mb-4" style={{ color: 'var(--accent-lime)' }}>NEW CAMPAIGN</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="c-name" className="field-label">CAMPAIGN NAME *</label>
              <input id="c-name" className="input" required maxLength={80} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Neon Detroit Run" />
            </div>
            <div>
              <label htmlFor="c-city" className="field-label">MEGACITY</label>
              <input id="c-city" className="input" maxLength={80} value={form.megacity} onChange={e => setForm(f => ({ ...f, megacity: e.target.value }))} placeholder="e.g. New Detroit" />
            </div>
            <div>
              <label htmlFor="c-desc" className="field-label">DESCRIPTION</label>
              <input id="c-desc" className="input" maxLength={500} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief synopsis…" />
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>You’ll be the MC. You’ll get an invite link to share with your players.</p>
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary">CREATE</button>
            <button type="button" onClick={() => setCreating(false)} className="btn btn-ghost">CANCEL</button>
          </div>
        </form>
      )}

      <form onSubmit={joinByCode} className="panel p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <label htmlFor="invite" className="field-label">HAVE AN INVITE CODE?</label>
          <input id="invite" className="input" value={code} onChange={e => setCode(e.target.value)} placeholder="Paste the code or invite link" autoCapitalize="characters" spellCheck={false} />
        </div>
        <button type="submit" className="btn btn-ghost" disabled={!code.trim()}><KeyRound size={16} aria-hidden /> JOIN</button>
      </form>

      {error && (
        <div role="alert" className="alert-error mb-6 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button onClick={load} className="btn btn-danger btn-sm">RETRY</button>
        </div>
      )}

      {loading ? (
        <p className="font-display text-2xl tracking-widest text-center py-16" style={{ color: 'var(--border-card)' }}>LOADING…</p>
      ) : campaigns.length === 0 ? (
        <div className="py-10">
          <p className="font-display text-3xl tracking-widest mb-2 text-center" style={{ color: 'var(--border-card)' }}>NO CAMPAIGNS YET</p>
          <div className="panel p-5 max-w-2xl mx-auto mt-4">
            <h2 className="font-display text-2xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>NEW TO THE MEGACITY?</h2>
            <ol className="list-decimal pl-5 mt-2 space-y-1.5" style={{ color: 'var(--text-soft)' }}>
              <li><b>Running the game?</b> Hit <b>NEW CAMPAIGN</b>. You’ll be its MC and get an invite link for your players.</li>
              <li><b>Playing?</b> Paste the invite code or link your MC sent you into the box above.</li>
              <li>Build your character from the Theme Book’s ready-made kits — every rule on the sheet has a ⓘ tip.</li>
            </ol>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link href="/guide/how-to-play" className="btn btn-ghost btn-sm"><BookOpen size={15} aria-hidden /> HOW TO PLAY</Link>
              <Link href="/roller" className="btn btn-ghost btn-sm"><Dices size={15} aria-hidden /> TRY THE DICE</Link>
            </div>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <li key={c._id}>
              <Link
                href={`/campaigns/${c._id}`}
                className="block h-full rounded-xl card-chamfer overflow-hidden transition-colors hover:border-[#c8ff00]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
              >
                <div style={{ height: 3, background: 'var(--accent-lime)' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-2xl tracking-wide truncate">{c.name}</div>
                      {c.megacity && <div className="font-display tracking-widest text-sm" style={{ color: 'var(--accent-cyan)' }}>{c.megacity}</div>}
                    </div>
                    <ChevronRight size={20} className="shrink-0 mt-1" style={{ color: 'var(--accent-lime)' }} aria-hidden />
                  </div>
                  {c.description && <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{c.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {c.me && <span className="chip" style={{ color: 'var(--accent-lime)', borderColor: '#3d4d10' }}>YOU: {ROLE_LABEL[c.me.role]}</span>}
                    <span className="chip">{c.members?.length ?? 0} MEMBER{c.members?.length === 1 ? '' : 'S'}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
