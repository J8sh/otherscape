'use client'
import { useCallback, useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Zap, ArrowLeft, Trash2, Pencil, Eye } from 'lucide-react'
import { CrewThemeCard } from '@/components/cards/CrewThemeCard'
import { MembersPanel } from '@/components/campaign/MembersPanel'
import { SaveIndicator } from '@/components/ui/SaveIndicator'
import { useSession } from '@/components/auth/SessionProvider'
import { api } from '@/lib/api'
import { useAutosave } from '@/lib/useAutosave'
import { ROLE_HELP, ROLE_LABEL } from '@/lib/roles'
import { CATEGORY_META } from '@/lib/themeMeta'
import type { ICampaign, ICharacter, ICrewThemeCard } from '@/types'

type CharacterRow = ICharacter & { canEdit: boolean }

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useSession()
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [characters, setCharacters] = useState<CharacterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingDetails, setEditingDetails] = useState(false)
  const [details, setDetails] = useState({ name: '', megacity: '', description: '' })
  const [newFor, setNewFor] = useState('')

  const crewSave = useAutosave((crewTheme: ICrewThemeCard) =>
    api(`/api/campaigns/${id}`, { method: 'PATCH', json: { crewTheme } }))

  const load = useCallback(async () => {
    setError(null)
    try {
      const [c, chars] = await Promise.all([
        api<ICampaign>(`/api/campaigns/${id}`),
        api<CharacterRow[]>(`/api/characters?campaignId=${id}`),
      ])
      setCampaign(c)
      setCharacters(chars)
      setDetails({ name: c.name, megacity: c.megacity, description: c.description })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load campaign')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  function updateCrew(crewTheme: ICrewThemeCard) {
    if (!campaign) return
    setCampaign({ ...campaign, crewTheme })
    crewSave.schedule(crewTheme)
  }

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault()
    try {
      const c = await api<ICampaign>(`/api/campaigns/${id}`, { method: 'PATCH', json: details })
      setCampaign(c)
      setEditingDetails(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save')
    }
  }

  async function addCharacter() {
    try {
      const char = await api<ICharacter>('/api/characters', {
        method: 'POST',
        json: { campaignId: id, name: 'New Character', ...(newFor ? { ownerId: newFor } : {}) },
      })
      router.push(`/campaigns/${id}/character/${char._id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create character')
    }
  }

  async function deleteCharacter(charId: string, name: string) {
    if (!confirm(`Delete ${name || 'this character'}? This can’t be undone.`)) return
    try {
      await api(`/api/characters/${charId}`, { method: 'DELETE' })
      setCharacters(prev => prev.filter(c => c._id !== charId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete')
    }
  }

  async function deleteCampaign() {
    if (!campaign || !confirm(`Delete “${campaign.name}” and all its characters? This can’t be undone.`)) return
    try {
      await api(`/api/campaigns/${id}`, { method: 'DELETE' })
      router.push('/campaigns')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete')
    }
  }

  if (loading) return <p className="font-display text-3xl tracking-widest text-center py-24" style={{ color: 'var(--border-card)' }}>LOADING…</p>

  if (!campaign) return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div role="alert" className="alert-error text-center">
        <div className="font-display tracking-widest mb-2" style={{ color: 'var(--danger)' }}>COULDN’T LOAD CAMPAIGN</div>
        <p className="mb-4">{error ?? 'Failed to load campaign.'}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={load} className="btn btn-danger btn-sm">RETRY</button>
          <Link href="/campaigns" className="btn btn-ghost btn-sm">ALL CAMPAIGNS</Link>
        </div>
      </div>
    </div>
  )

  const me = campaign.me
  const ownerName = (ownerId?: string) => campaign.members?.find(m => m.userId === ownerId)?.displayName

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <Link href="/campaigns" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm mb-3 hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> ALL CAMPAIGNS
      </Link>

      {/* Header */}
      {editingDetails ? (
        <form onSubmit={saveDetails} className="panel p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><label className="field-label" htmlFor="d-name">NAME</label><input id="d-name" className="input" required maxLength={80} value={details.name} onChange={e => setDetails(d => ({ ...d, name: e.target.value }))} /></div>
          <div><label className="field-label" htmlFor="d-city">MEGACITY</label><input id="d-city" className="input" maxLength={80} value={details.megacity} onChange={e => setDetails(d => ({ ...d, megacity: e.target.value }))} /></div>
          <div><label className="field-label" htmlFor="d-desc">DESCRIPTION</label><input id="d-desc" className="input" maxLength={500} value={details.description} onChange={e => setDetails(d => ({ ...d, description: e.target.value }))} /></div>
          <div className="md:col-span-3 flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm">SAVE</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingDetails(false)}>CANCEL</button>
            {(me?.isOwner || user?.role === 'admin') && (
              <button type="button" className="btn btn-danger btn-sm ml-auto" onClick={deleteCampaign}><Trash2 size={14} aria-hidden /> DELETE CAMPAIGN</button>
            )}
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="font-display text-4xl md:text-5xl tracking-wide break-words">{campaign.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {campaign.megacity && <span className="font-display tracking-widest" style={{ color: 'var(--accent-cyan)' }}>{campaign.megacity}</span>}
              {me && <span className="chip" title={ROLE_HELP[me.role]} style={{ color: 'var(--accent-lime)', borderColor: '#3d4d10' }}>YOU: {ROLE_LABEL[me.role]}</span>}
            </div>
            {campaign.description && <p className="mt-2 max-w-2xl" style={{ color: 'var(--text-muted)' }}>{campaign.description}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/guide/effects" className="btn btn-ghost btn-sm"><Zap size={14} aria-hidden /> EFFECTS</Link>
            {me?.canManage && <button className="btn btn-ghost btn-sm" onClick={() => setEditingDetails(true)}><Pencil size={14} aria-hidden /> EDIT</button>}
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="alert-error mb-4 flex items-center justify-between gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn btn-danger btn-sm">DISMISS</button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
        {/* Characters */}
        <section className="xl:col-span-2 order-1" aria-labelledby="chars-heading">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 id="chars-heading" className="font-display text-2xl tracking-widest">CHARACTERS</h2>
            {me?.canCreateCharacter && (
              <div className="flex gap-2">
                {me.canManage && (campaign.members?.length ?? 0) > 1 && (
                  <select className="input text-sm" style={{ width: 'auto', minHeight: 36 }} value={newFor} onChange={e => setNewFor(e.target.value)} aria-label="Create character for">
                    <option value="">For me</option>
                    {campaign.members?.filter(m => m.userId !== user?._id && m.role !== 'spectator').map(m => (
                      <option key={m.userId} value={m.userId}>For {m.displayName}</option>
                    ))}
                  </select>
                )}
                <button onClick={addCharacter} className="btn btn-primary btn-sm"><Plus size={16} aria-hidden /> ADD CHARACTER</button>
              </div>
            )}
          </div>

          {characters.length === 0 ? (
            <div className="rounded-xl p-10 text-center" style={{ background: 'var(--bg-card)', border: '1px dashed var(--border-card)' }}>
              <p className="font-display text-2xl tracking-widest mb-2" style={{ color: 'var(--border-card)' }}>NO CHARACTERS YET</p>
              <p style={{ color: 'var(--text-muted)' }}>
                {me?.canCreateCharacter ? 'Add your character to the crew.' : 'Players haven’t created characters yet.'}
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characters.map(char => {
                const counts = (['self', 'mythos', 'noise'] as const).map(cat => ({ cat, n: char.themes?.filter(t => t.themeType && t.category === cat).length ?? 0 }))
                const mine = char.ownerId === user?._id
                return (
                  <li key={char._id} className="relative">
                    <Link
                      href={`/campaigns/${id}/character/${char._id}`}
                      className="block rounded-xl card-chamfer overflow-hidden transition-colors hover:border-[#c8ff00]"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                    >
                      <div style={{ height: 3, background: mine ? 'var(--accent-lime)' : 'var(--border-card)' }} />
                      <div className="p-4 pr-14">
                        <div className="font-display text-2xl tracking-wide truncate">{char.name || 'Unnamed'}</div>
                        <div className="text-sm flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                          {ownerName(char.ownerId) ?? char.player ?? 'Unassigned'}
                          {mine && <span className="chip" style={{ color: 'var(--accent-lime)', borderColor: '#3d4d10' }}>YOURS</span>}
                          {!char.canEdit && <span className="chip"><Eye size={11} aria-hidden /> VIEW ONLY</span>}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-3" aria-label="Theme balance">
                          {counts.map(({ cat, n }) => (
                            <div key={cat} className="flex items-center gap-1.5">
                              <span className="font-display tracking-wider text-xs" style={{ color: 'var(--text-muted)' }}>{CATEGORY_META[cat].label}</span>
                              <div className="flex gap-0.5" aria-label={`${n} ${CATEGORY_META[cat].label} themes`}>
                                {[1, 2, 3, 4].map(i => (
                                  <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: i <= n ? CATEGORY_META[cat].color : '#1e2840' }} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {char.statuses?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {char.statuses.slice(0, 4).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#2a1630', color: '#f0a8d0', border: '1px solid #5a2a5a' }}>
                                {s.name}-{s.tier}
                              </span>
                            ))}
                            {char.statuses.length > 4 && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>+{char.statuses.length - 4} more</span>}
                          </div>
                        )}
                      </div>
                    </Link>
                    {char.canEdit && (
                      <button
                        onClick={() => deleteCharacter(char._id, char.name)}
                        className="absolute top-3 right-2 btn-icon flex items-center justify-center rounded-lg hover:text-red-400"
                        style={{ color: '#4a5570' }}
                        aria-label={`Delete ${char.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Crew + members */}
        <aside className="xl:col-span-1 order-2 space-y-6">
          <section aria-labelledby="crew-heading">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 id="crew-heading" className="flex items-center gap-2 font-display text-2xl tracking-widest" style={{ color: 'var(--accent-cyan)' }}>
                <Users size={18} aria-hidden /> CREW
              </h2>
              <SaveIndicator state={crewSave.state} error={crewSave.error} />
            </div>
            <CrewThemeCard crew={campaign.crewTheme} onChange={updateCrew} readOnly={!me?.canEditCrew} />
          </section>
          {user && <MembersPanel campaign={campaign} currentUserId={user._id} onChanged={load} onLeft={() => router.push('/campaigns')} />}
        </aside>
      </div>
    </div>
  )
}
