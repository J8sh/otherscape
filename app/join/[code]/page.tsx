'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { api } from '@/lib/api'

interface Preview { _id: string; name: string; megacity: string; description: string }

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const [preview, setPreview] = useState<Preview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api<Preview>(`/api/join/${encodeURIComponent(code)}`).then(setPreview).catch(e => setError(e.message))
  }, [code])

  async function join() {
    setBusy(true)
    try {
      const { campaignId } = await api<{ campaignId: string }>(`/api/join/${encodeURIComponent(code)}`, { method: 'POST' })
      router.push(`/campaigns/${campaignId}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join.')
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="panel p-6 text-center">
        <Users size={32} className="mx-auto mb-3" style={{ color: 'var(--accent-cyan)' }} aria-hidden />
        {error ? (
          <>
            <h1 className="font-display text-2xl tracking-widest mb-2" style={{ color: 'var(--danger)' }}>INVITE NOT FOUND</h1>
            <p style={{ color: 'var(--text-soft)' }}>{error}</p>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Ask your MC for a fresh link.</p>
          </>
        ) : !preview ? (
          <p className="font-display tracking-widest" style={{ color: 'var(--text-muted)' }}>CHECKING INVITE…</p>
        ) : (
          <>
            <p className="font-display tracking-widest text-sm" style={{ color: 'var(--text-muted)' }}>YOU’VE BEEN INVITED TO</p>
            <h1 className="font-display text-3xl tracking-wide mt-1">{preview.name}</h1>
            {preview.megacity && <p className="font-display tracking-widest" style={{ color: 'var(--accent-cyan)' }}>{preview.megacity}</p>}
            {preview.description && <p className="mt-3" style={{ color: 'var(--text-soft)' }}>{preview.description}</p>}
            <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>You’ll join as a <b>player</b>: you can create and edit your own characters and see the rest of the crew.</p>
            <button className="btn btn-primary w-full mt-5" onClick={join} disabled={busy}>{busy ? 'JOINING…' : 'JOIN THE CREW'}</button>
          </>
        )}
      </div>
    </div>
  )
}
