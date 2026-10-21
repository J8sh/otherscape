'use client'
import { useCallback, useEffect, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Zap } from 'lucide-react'
import { CharacterCard } from '@/components/cards/CharacterCard'
import { ThemeSlot } from '@/components/cards/ThemeSlot'
import { LoadoutThemeCard } from '@/components/cards/LoadoutThemeCard'
import { TrackingCards } from '@/components/cards/TrackingCard'
import { Tooltip } from '@/components/ui/Tooltip'
import { SaveIndicator } from '@/components/ui/SaveIndicator'
import { api } from '@/lib/api'
import { useAutosave } from '@/lib/useAutosave'
import type { ICharacter } from '@/types'

type CharacterView = ICharacter & { canEdit: boolean; campaignName?: string }

export default function CharacterPage({ params }: { params: Promise<{ id: string; charId: string }> }) {
  const { id, charId } = use(params)
  const [character, setCharacter] = useState<CharacterView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const autosave = useAutosave((c: ICharacter) =>
    api(`/api/characters/${charId}`, { method: 'PATCH', json: c }))

  const load = useCallback(async () => {
    setError(null)
    try {
      setCharacter(await api<CharacterView>(`/api/characters/${charId}`))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load character')
    } finally {
      setLoading(false)
    }
  }, [charId])

  useEffect(() => { load() }, [load])

  function updateCharacter(updated: ICharacter) {
    if (!character?.canEdit) return
    setCharacter({ ...character, ...updated })
    autosave.schedule(updated)
  }

  if (loading) return <p className="font-display text-3xl tracking-widest text-center py-24" style={{ color: 'var(--border-card)' }}>LOADING…</p>

  if (!character) return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div role="alert" className="alert-error text-center">
        <div className="font-display tracking-widest mb-2" style={{ color: 'var(--danger)' }}>COULDN’T LOAD CHARACTER</div>
        <p className="mb-4">{error ?? 'Failed to load character.'}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={load} className="btn btn-danger btn-sm">RETRY</button>
          <Link href={`/campaigns/${id}`} className="btn btn-ghost btn-sm">BACK TO CREW</Link>
        </div>
      </div>
    </div>
  )

  const readOnly = !character.canEdit

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
          <ArrowLeft size={14} aria-hidden /> {character.campaignName ? character.campaignName.toUpperCase() : 'CREW'}
        </Link>
        <div className="flex items-center gap-3">
          <SaveIndicator state={autosave.state} error={autosave.error} />
          <Link href="/guide/effects" className="btn btn-ghost btn-sm"><Zap size={14} aria-hidden /> EFFECTS</Link>
        </div>
      </div>

      {readOnly && (
        <div className="panel px-4 py-3 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--accent-cyan)' }}>
          <Eye size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden />
          <span>You’re viewing a crewmate’s sheet. Only its player and the MC can change it.</span>
        </div>
      )}

      <fieldset disabled={readOnly} className="space-y-8 min-w-0">
        <CharacterCard character={character} onChange={updateCharacter} />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Tooltip content="Each character has exactly 4 themes — their major aspects. Themes hold your power tags, weakness tags, and define your Essence.">
              <h2 className="font-display text-2xl tracking-widest cursor-help">THEMES</h2>
            </Tooltip>
            <span className="font-display text-sm tracking-widest" style={{ color: 'var(--text-muted)' }}>({character.themes.filter(t => t.themeType !== '').length}/4)</span>
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
        </section>

        <section>
          <Tooltip content="The Loadout Theme Card records your gear. Tags must be loaded up before a job and can be invoked for Power when relevant.">
            <h2 className="font-display text-2xl tracking-widest mb-4 cursor-help">LOADOUT</h2>
          </Tooltip>
          <LoadoutThemeCard
            loadout={character.loadoutTheme}
            onChange={loadout => updateCharacter({ ...character, loadoutTheme: loadout })}
          />
        </section>

        <section className="panel p-4 md:p-6">
          <TrackingCards
            statuses={character.statuses}
            onChange={statuses => updateCharacter({ ...character, statuses })}
          />
        </section>
      </fieldset>
    </div>
  )
}
