'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronRight } from 'lucide-react'
import type { ICampaign } from '@/types'

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', megacity: '' })

  async function load() {
    const res = await fetch('/api/campaigns')
    setCampaigns(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    if (!form.name.trim()) return
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const c = await res.json()
    router.push(`/campaigns/${c._id}`)
  }

  async function deleteCampaign(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Delete this campaign and all its characters?')) return
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(prev => prev.filter(c => c._id !== id))
  }

  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      {/* Header */}
      <div className="px-8 py-6" style={{ borderBottom: '1px solid #2a3352' }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="font-display text-4xl tracking-widest" style={{ color: '#c8ff00' }}>:OTHERSCAPE</div>
            <div className="text-sm tracking-widest mt-0.5" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.3em' }}>CAMPAIGN TRACKER</div>
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded font-display tracking-widest transition-all hover:opacity-80"
            style={{ background: '#c8ff00', color: '#080c18', fontSize: 16 }}
          >
            <Plus size={16} /> NEW CAMPAIGN
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Create form */}
        {creating && (
          <div className="rounded-xl p-6 mb-8" style={{ background: '#141929', border: '1px solid #c8ff00' }}>
            <div className="font-display text-xl tracking-widest mb-4" style={{ color: '#c8ff00' }}>NEW CAMPAIGN</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="font-display text-xs tracking-widest block mb-1" style={{ color: '#7a8099' }}>CAMPAIGN NAME *</label>
                <input className="editable-field" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Neon Detroit Run" />
              </div>
              <div>
                <label className="font-display text-xs tracking-widest block mb-1" style={{ color: '#7a8099' }}>MEGACITY</label>
                <input className="editable-field" value={form.megacity} onChange={e => setForm(f => ({ ...f, megacity: e.target.value }))} placeholder="e.g. New Detroit" />
              </div>
              <div>
                <label className="font-display text-xs tracking-widest block mb-1" style={{ color: '#7a8099' }}>DESCRIPTION</label>
                <input className="editable-field" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief synopsis..." />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={create} className="px-4 py-2 rounded font-display tracking-widest text-sm transition-all hover:opacity-80" style={{ background: '#c8ff00', color: '#080c18' }}>CREATE</button>
              <button onClick={() => setCreating(false)} className="px-4 py-2 rounded font-display tracking-widest text-sm transition-all" style={{ background: '#1a2035', color: '#7a8099', border: '1px solid #2a3352' }}>CANCEL</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="font-display text-2xl tracking-widest text-center py-16" style={{ color: '#2a3352' }}>LOADING...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-display text-3xl tracking-widest mb-3" style={{ color: '#2a3352' }}>NO CAMPAIGNS YET</div>
            <div className="text-sm" style={{ color: '#7a8099' }}>Create your first campaign to get started.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(c => (
              <div
                key={c._id}
                onClick={() => router.push(`/campaigns/${c._id}`)}
                className="rounded-xl card-chamfer overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border-[#c8ff00]"
                style={{ background: '#141929', border: '1px solid #2a3352' }}
              >
                <div style={{ height: 3, background: '#c8ff00' }} />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-display text-2xl tracking-wide" style={{ color: '#e8eaf0' }}>{c.name}</div>
                      {c.megacity && <div className="text-xs tracking-widest mt-0.5" style={{ color: '#00d4ff', fontFamily: 'Bebas Neue, sans-serif' }}>{c.megacity}</div>}
                      {c.description && <div className="text-sm mt-2" style={{ color: '#7a8099' }}>{c.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e => deleteCampaign(c._id, e)} className="p-1.5 rounded transition-colors hover:text-red-400" style={{ color: '#3a4462' }}>
                        <Trash2 size={15} />
                      </button>
                      <ChevronRight size={18} style={{ color: '#c8ff00' }} />
                    </div>
                  </div>
                  <div className="text-xs mt-3" style={{ color: '#3a4462', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}>
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
