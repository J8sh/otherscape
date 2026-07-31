'use client'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'
import { CharacterCard } from '@/components/cards/CharacterCard'
import { ThemeSlot } from '@/components/cards/ThemeSlot'
import { LoadoutThemeCard } from '@/components/cards/LoadoutThemeCard'
import { TrackingCards } from '@/components/cards/TrackingCard'
import { Tooltip } from '@/components/ui/Tooltip'
import type { ICharacter } from '@/types'

const SAVE_DELAY = 800

export default function CharacterPage({ params }: { params: Promise<{ id: string; charId: string }> }) {
  const { id, charId } = use(params)
  const [character, setCharacter] = useState<ICharacter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    fetch(`/api/characters/${charId}`)
      .then(r => r.json())
      .then(data => { setCharacter(data); setLoading(false) })
  }, [charId])

  function updateCharacter(updated: ICharacter) {
    setCharacter(updated)
    if (saveTimer) clearTimeout(saveTimer)
    const t = setTimeout(async () => {
      await fetch(`/api/characters/${charId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      setSavedAt(new Date())
    }, SAVE_DELAY)
    setSaveTimer(t)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080c18' }}>
      <div className="font-display text-3xl tracking-widest" style={{ color: '#2a3352' }}>LOADING...</div>
    </div>
  )

  if (!character) return null

  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      {/* Nav */}
      <div className="px-8 py-4" style={{ borderBottom: '1px solid #2a3352' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/campaigns/${id}`} className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em' }}>
              <ArrowLeft size={14} /> CREW
            </Link>
            <span style={{ color: '#2a3352' }}>/</span>
            <input
              className="font-display text-xl tracking-wide bg-transparent border-none outline-none"
              style={{ color: '#e8eaf0', minWidth: 40, width: `${Math.max(character.name.length, 4)}ch` }}
              value={character.name}
              onChange={e => updateCharacter({ ...character, name: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            {savedAt && <span className="text-xs" style={{ color: '#3a4462', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em' }}>SAVED {savedAt.toLocaleTimeString()}</span>}
            <Link href={`/campaigns/${id}/effects`} className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-display tracking-widest transition-all hover:opacity-80" style={{ background: '#1a2a1a', color: '#c8ff00', border: '1px solid #2a4a2a' }}>
              <Zap size={13} /> EFFECTS REF
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Character Card */}
        <CharacterCard character={character} onChange={updateCharacter} />

        {/* Themes */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tooltip content="Each character has exactly 4 themes — their major aspects. Themes hold your power tags, weakness tags, and define your Essence.">
              <h2 className="font-display text-2xl tracking-widest cursor-help" style={{ color: '#e8eaf0' }}>THEMES</h2>
            </Tooltip>
            <span className="font-display text-sm tracking-widest" style={{ color: '#7a8099' }}>({character.themes.filter(t => t.themeType !== '').length}/4)</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {character.themes.map((theme, i) => (
              <ThemeSlot
                key={i}
                theme={theme}
                index={i}
                onChange={updated => updateCharacter({
                  ...character,
                  themes: character.themes.map((t, idx) => idx === i ? updated : t),
                })}
              />
            ))}
          </div>
        </div>

        {/* Loadout */}
        <div>
          <Tooltip content="The Loadout Theme Card records your gear. Tags must be selected before a job and can be invoked for Power when relevant.">
            <h2 className="font-display text-2xl tracking-widest mb-4 cursor-help" style={{ color: '#e8eaf0' }}>LOADOUT</h2>
          </Tooltip>
          <LoadoutThemeCard
            loadout={character.loadoutTheme}
            onChange={loadout => updateCharacter({ ...character, loadoutTheme: loadout })}
          />
        </div>

        {/* Tracking Cards */}
        <div className="rounded-xl p-6" style={{ background: '#141929', border: '1px solid #2a3352' }}>
          <TrackingCards
            statuses={character.statuses}
            onChange={statuses => updateCharacter({ ...character, statuses })}
          />
        </div>
      </div>
    </div>
  )
}
