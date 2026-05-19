'use client'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Zap, ArrowLeft, Trash2 } from 'lucide-react'
import { CrewThemeCard } from '@/components/cards/CrewThemeCard'
import type { ICampaign, ICharacter } from '@/types'

const SAVE_DELAY = 800

export default function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [characters, setCharacters] = useState<ICharacter[]>([])
  const [loading, setLoading] = useState(true)
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function load() {
      const [cRes, chRes] = await Promise.all([
        fetch(`/api/campaigns/${id}`),
        fetch(`/api/characters?campaignId=${id}`),
      ])
      setCampaign(await cRes.json())
      setCharacters(await chRes.json())
      setLoading(false)
    }
    load()
  }, [id])

  function updateCampaign(updated: ICampaign) {
    setCampaign(updated)
    if (saveTimer) clearTimeout(saveTimer)
    const t = setTimeout(() => {
      fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
    }, SAVE_DELAY)
    setSaveTimer(t)
  }

  async function addCharacter() {
    const res = await fetch('/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: id, name: 'New Character' }),
    })
    const char = await res.json()
    router.push(`/campaigns/${id}/character/${char._id}`)
  }

  async function deleteCharacter(charId: string, e: React.MouseEvent) {
    e.preventDefault()
    if (!confirm('Delete this character?')) return
    await fetch(`/api/characters/${charId}`, { method: 'DELETE' })
    setCharacters(prev => prev.filter(c => c._id !== charId))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080c18' }}>
      <div className="font-display text-3xl tracking-widest" style={{ color: '#2a3352' }}>LOADING...</div>
    </div>
  )

  if (!campaign) return null

  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      {/* Nav */}
      <div className="px-8 py-4" style={{ borderBottom: '1px solid #2a3352' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/campaigns" className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em' }}>
              <ArrowLeft size={14} /> CAMPAIGNS
            </Link>
            <span style={{ color: '#2a3352' }}>/</span>
            <span className="font-display text-lg tracking-wide" style={{ color: '#e8eaf0' }}>{campaign.name}</span>
            {campaign.megacity && <span className="font-display text-sm tracking-widest" style={{ color: '#00d4ff' }}>{campaign.megacity}</span>}
          </div>
          <Link
            href={`/campaigns/${id}/effects`}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-display tracking-widest transition-all hover:opacity-80"
            style={{ background: '#1a2a1a', color: '#c8ff00', border: '1px solid #2a4a2a' }}
          >
            <Zap size={13} /> EFFECTS REF
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left: Crew Theme */}
          <div className="xl:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} style={{ color: '#00d4ff' }} />
              <span className="font-display text-xl tracking-widest" style={{ color: '#00d4ff' }}>CREW</span>
            </div>
            <CrewThemeCard
              crew={campaign.crewTheme}
              onChange={crew => updateCampaign({ ...campaign, crewTheme: crew })}
            />
          </div>

          {/* Right: Characters */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl tracking-widest" style={{ color: '#e8eaf0' }}>CHARACTERS</span>
              <button
                onClick={addCharacter}
                className="flex items-center gap-2 px-3 py-1.5 rounded font-display tracking-widest text-sm transition-all hover:opacity-80"
                style={{ background: '#c8ff00', color: '#080c18' }}
              >
                <Plus size={14} /> ADD CHARACTER
              </button>
            </div>

            {characters.length === 0 ? (
              <div className="rounded-xl p-12 text-center" style={{ background: '#141929', border: '1px dashed #2a3352' }}>
                <div className="font-display text-2xl tracking-widest mb-2" style={{ color: '#2a3352' }}>NO CHARACTERS YET</div>
                <div className="text-sm mb-4" style={{ color: '#7a8099' }}>Add your first character to the crew.</div>
                <button onClick={addCharacter} className="px-4 py-2 rounded font-display tracking-widest text-sm" style={{ background: '#c8ff00', color: '#080c18' }}>
                  ADD CHARACTER
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {characters.map(char => {
                  const selfCount = char.themes?.filter(t => t.category === 'self').length ?? 0
                  const mythosCount = char.themes?.filter(t => t.category === 'mythos').length ?? 0
                  const noiseCount = char.themes?.filter(t => t.category === 'noise').length ?? 0
                  return (
                    <Link
                      key={char._id}
                      href={`/campaigns/${id}/character/${char._id}`}
                      className="block rounded-xl card-chamfer overflow-hidden transition-all hover:scale-[1.02] hover:border-[#c8ff00]"
                      style={{ background: '#141929', border: '1px solid #2a3352' }}
                    >
                      <div style={{ height: 3, background: '#c8ff00' }} />
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-display text-xl tracking-wide" style={{ color: '#e8eaf0' }}>{char.name}</div>
                            {char.player && <div className="text-xs" style={{ color: '#7a8099' }}>Player: {char.player}</div>}
                          </div>
                          <button
                            onClick={e => deleteCharacter(char._id, e)}
                            className="p-1.5 rounded transition-colors hover:text-red-400"
                            style={{ color: '#3a4462' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {/* Theme pips */}
                        <div className="flex gap-3 mt-3">
                          {[
                            { label: 'SELF', count: selfCount, color: '#00d4ff' },
                            { label: 'MYTHOS', count: mythosCount, color: '#9b4dff' },
                            { label: 'NOISE', count: noiseCount, color: '#c8ff00' },
                          ].map(({ label, count, color }) => (
                            <div key={label} className="flex items-center gap-1.5">
                              <span style={{ color: '#7a8099', fontSize: 9, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em' }}>{label}</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4].map(i => (
                                  <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i <= count ? color : '#1e2840' }} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Active statuses */}
                        {char.statuses && char.statuses.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {char.statuses.slice(0, 4).map((s, i) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#3a1a1a', color: '#ee9090', border: '1px solid #6a3a3a' }}>
                                {s.name}-{s.tier}
                              </span>
                            ))}
                            {char.statuses.length > 4 && <span className="text-xs" style={{ color: '#7a8099' }}>+{char.statuses.length - 4} more</span>}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
