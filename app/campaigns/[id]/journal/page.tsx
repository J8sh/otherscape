'use client'
import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Pencil, Pin, PinOff, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { usePolling } from '@/lib/usePolling'
import type { ICampaign } from '@/types'

type Kind = 'recap' | 'lead' | 'npc' | 'loot' | 'note'
interface Entry { _id: string; title: string; body: string; kind: Kind; pinned: boolean; authorName: string; canEdit: boolean; createdAt: string; updatedAt: string }

const KIND_META: Record<Kind, { label: string; color: string; hint: string }> = {
  recap: { label: 'Session recap', color: '#c8ff00', hint: 'What happened this session?' },
  lead: { label: 'Lead', color: '#29c8f2', hint: 'A clue, rumor or job worth chasing' },
  npc: { label: 'NPC', color: '#a66bff', hint: 'Who you met — and what they want' },
  loot: { label: 'Loot', color: '#ffb347', hint: 'What the crew picked up' },
  note: { label: 'Note', color: '#8a91a8', hint: 'Anything else' },
}

export default function JournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const [draft, setDraft] = useState({ title: '', body: '', kind: 'recap' as Kind })
  const [editing, setEditing] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ title: '', body: '' })
  const [error, setError] = useState<string | null>(null)

  const loadEntries = useCallback(() => api<Entry[]>(`/api/campaigns/${id}/journal`).then(setEntries), [id])
  useEffect(() => {
    api<ICampaign>(`/api/campaigns/${id}`).then(setCampaign).catch(e => setError(e.message))
    loadEntries().catch(e => setError(e.message))
  }, [id, loadEntries])
  usePolling(() => (editing ? undefined : loadEntries()), 15000)

  async function post(e: React.FormEvent) {
    e.preventDefault()
    if (!draft.body.trim()) return
    try {
      await api(`/api/campaigns/${id}/journal`, { method: 'POST', json: draft })
      setDraft(d => ({ ...d, title: '', body: '' }))
      await loadEntries()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not post') }
  }

  async function patch(entryId: string, body: Record<string, unknown>) {
    try {
      await api(`/api/campaigns/${id}/journal/${entryId}`, { method: 'PATCH', json: body })
      setEditing(null)
      await loadEntries()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save') }
  }

  async function remove(entryId: string) {
    if (!confirm('Delete this entry?')) return
    try {
      await api(`/api/campaigns/${id}/journal/${entryId}`, { method: 'DELETE' })
      await loadEntries()
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not delete') }
  }

  const canWrite = !!campaign?.me?.canCreateCharacter
  const shown = entries.filter(e => filter === 'all' || e.kind === filter)

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
      <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> {campaign?.name?.toUpperCase() ?? 'CAMPAIGN'}
      </Link>
      <h1 className="font-display text-4xl md:text-5xl tracking-widest mt-1">JOURNAL</h1>
      <p style={{ color: 'var(--text-muted)' }}>The crew’s shared memory: recaps, leads, people and loot. Everyone in the campaign can read it.</p>

      {error && <div role="alert" className="alert-error my-4">{error}</div>}

      {canWrite && (
        <form onSubmit={post} className="panel p-4 mt-5 space-y-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Entry type">
            {(Object.keys(KIND_META) as Kind[]).map(k => (
              <button key={k} type="button" aria-pressed={draft.kind === k} onClick={() => setDraft(d => ({ ...d, kind: k }))} className="chip"
                style={{ minHeight: 34, ...(draft.kind === k ? { color: '#080c18', background: KIND_META[k].color, borderColor: KIND_META[k].color } : {}) }}>
                {KIND_META[k].label.toUpperCase()}
              </button>
            ))}
          </div>
          <input className="input" placeholder="Title (optional)" value={draft.title} maxLength={120} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} aria-label="Title" />
          <textarea className="input" rows={4} placeholder={KIND_META[draft.kind].hint} value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} aria-label="Entry" style={{ resize: 'vertical' }} />
          <button className="btn btn-primary" disabled={!draft.body.trim()}>POST</button>
        </form>
      )}

      <div className="flex flex-wrap gap-1.5 mt-6" role="group" aria-label="Filter entries">
        {(['all', ...Object.keys(KIND_META)] as (Kind | 'all')[]).map(k => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)} className="chip"
            style={{ minHeight: 34, ...(filter === k ? { color: '#080c18', background: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' } : {}) }}>
            {k === 'all' ? 'ALL' : KIND_META[k].label.toUpperCase()}
          </button>
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {shown.length === 0 && <li style={{ color: 'var(--text-muted)' }}>No entries yet.</li>}
        {shown.map(e => (
          <li key={e._id} className="panel p-4" style={{ borderLeft: `4px solid ${KIND_META[e.kind].color}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="chip" style={{ color: KIND_META[e.kind].color, borderColor: `${KIND_META[e.kind].color}66` }}>{KIND_META[e.kind].label.toUpperCase()}</span>
                  {e.pinned && <span className="chip"><Pin size={11} aria-hidden /> PINNED</span>}
                </div>
                {editing !== e._id && e.title && <h2 className="font-display text-2xl tracking-wide mt-1">{e.title}</h2>}
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{e.authorName} · {new Date(e.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
              </div>
              <div className="flex shrink-0">
                {campaign?.me?.canManage && (
                  <button type="button" className="btn-icon flex items-center justify-center rounded-lg hover:bg-white/5" onClick={() => patch(e._id, { pinned: !e.pinned })} aria-label={e.pinned ? 'Unpin' : 'Pin to top'}>
                    {e.pinned ? <PinOff size={16} /> : <Pin size={16} />}
                  </button>
                )}
                {e.canEdit && editing !== e._id && (
                  <>
                    <button type="button" className="btn-icon flex items-center justify-center rounded-lg hover:bg-white/5" onClick={() => { setEditing(e._id); setEditDraft({ title: e.title, body: e.body }) }} aria-label="Edit entry"><Pencil size={16} /></button>
                    <button type="button" className="btn-icon flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-[#ff3b5c]" onClick={() => remove(e._id)} aria-label="Delete entry"><Trash2 size={16} /></button>
                  </>
                )}
              </div>
            </div>
            {editing === e._id ? (
              <div className="space-y-2 mt-2">
                <input className="input" value={editDraft.title} onChange={ev => setEditDraft(d => ({ ...d, title: ev.target.value }))} aria-label="Title" />
                <textarea className="input" rows={5} value={editDraft.body} onChange={ev => setEditDraft(d => ({ ...d, body: ev.target.value }))} aria-label="Entry" />
                <div className="flex gap-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => patch(e._id, editDraft)}>SAVE</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(null)}>CANCEL</button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap" style={{ color: 'var(--text-soft)', fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.6 }}>{e.body}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
