'use client'
import { useCallback, useEffect, useRef, useState, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Eye, Printer, Redo2, Undo2, Zap } from 'lucide-react'
import { CharacterCard } from '@/components/cards/CharacterCard'
import { ThemeSlot } from '@/components/cards/ThemeSlot'
import { LoadoutThemeCard } from '@/components/cards/LoadoutThemeCard'
import { TrackingCards } from '@/components/cards/TrackingCard'
import { StoryTagsCard } from '@/components/cards/StoryTagsCard'
import { RollerDialog } from '@/components/roller/RollerDialog'
import { CardStrip, LinedField, PaperCard } from '@/components/sheet/primitives'
import { SetupChecklist } from '@/components/sheet/SetupChecklist'
import { DowntimeDialog } from '@/components/sheet/DowntimeDialog'
import { Tooltip } from '@/components/ui/Tooltip'
import { SaveIndicator } from '@/components/ui/SaveIndicator'
import { useToast } from '@/components/ui/Toast'
import { api } from '@/lib/api'
import { useAutosave } from '@/lib/useAutosave'
import { addEvolution } from '@/lib/rules'
import { normalizeCharacter } from '@/lib/normalize'
import { downloadCharacter } from '@/lib/characterFile'
import { isNewer, usePolling } from '@/lib/usePolling'
import { emptyHistory, record, redo, undo, type History } from '@/lib/history'
import type { ICharacter, IOptionalRules } from '@/types'

type CharacterView = ICharacter & { canEdit: boolean; campaignName?: string; rules?: IOptionalRules }

export default function CharacterPage({ params }: { params: Promise<{ id: string; charId: string }> }) {
  const { id, charId } = use(params)
  const [character, setCharacter] = useState<CharacterView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Latest sheet, updated synchronously, so two edits fired in one click
  // (e.g. reset a theme's upgrade track + add an Evolution point) both land.
  const latest = useRef<CharacterView | null>(null)
  const toast = useToast()

  // Server time of the newest version we hold, so polling only applies newer edits.
  const serverStamp = useRef<string | undefined>(undefined)

  // Undo/redo of this device's edits. Cleared when someone else's change
  // arrives, so Undo never silently reverts the MC's edit.
  const history = useRef<History<CharacterView>>(emptyHistory())
  const [, setHistoryVersion] = useState(0)
  const setHistory = (h: History<CharacterView>) => { history.current = h; setHistoryVersion(v => v + 1) }

  const autosave = useAutosave(async (c: ICharacter) => {
    const saved = await api<ICharacter>(`/api/characters/${charId}`, { method: 'PATCH', json: c })
    serverStamp.current = saved.updatedAt
  })

  const load = useCallback(async () => {
    setError(null)
    try {
      const loaded = normalizeCharacter(await api<CharacterView>(`/api/characters/${charId}`))
      serverStamp.current = loaded.updatedAt
      latest.current = loaded
      setCharacter(loaded)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load character')
    } finally {
      setLoading(false)
    }
  }, [charId])

  useEffect(() => { load() }, [load])

  // Pick up changes made by the MC or another device — but never while our
  // own edit is waiting to save.
  usePolling(async () => {
    if (autosave.isBusy()) return
    const remote = await api<CharacterView>(`/api/characters/${charId}`)
    // Campaign rules can change without the sheet changing.
    if (JSON.stringify(remote.rules) !== JSON.stringify(latest.current?.rules)) {
      if (latest.current) latest.current = { ...latest.current, rules: remote.rules }
      setCharacter(c => (c ? { ...c, rules: remote.rules } : c))
    }
    if (!isNewer(remote.updatedAt, serverStamp.current)) return
    if (autosave.isBusy()) return // an edit started while we were fetching
    const next = normalizeCharacter(remote)
    serverStamp.current = remote.updatedAt
    latest.current = next
    setCharacter(next)
    setHistory(emptyHistory())
  }, 8000, !!character)

  function updateCharacter(updated: Partial<ICharacter>) {
    const current = latest.current
    if (!current?.canEdit) return
    const next = { ...current, ...updated }
    setHistory(record(history.current, current, Date.now()))
    latest.current = next
    setCharacter(next)
    autosave.schedule(next)
  }

  function step(direction: 'undo' | 'redo') {
    const current = latest.current
    if (!current?.canEdit) return
    const result = direction === 'undo' ? undo(history.current, current) : redo(history.current, current)
    if (!result) return
    // Keep the live permission/rules; restore only the sheet.
    const next = { ...result.value, canEdit: current.canEdit, rules: current.rules, campaignName: current.campaignName }
    setHistory(result.history)
    latest.current = next
    setCharacter(next)
    autosave.schedule(next)
  }

  // ⌘Z / Ctrl+Z (⇧ to redo) outside text fields — fields keep their own undo.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.key.toLowerCase() !== 'z' && e.key.toLowerCase() !== 'y') return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) return
      e.preventDefault()
      step(e.key.toLowerCase() === 'y' || e.shiftKey ? 'redo' : 'undo')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // Evolution points from replacing a theme or spending an upgrade; five earn a Moment.
  function gainEvolution(points: number) {
    const current = latest.current
    if (!current) return
    const { points: left, momentsEarned } = addEvolution(current.evolution.points ?? 0, points)
    updateCharacter({ evolution: { ...current.evolution, points: left } })
    if (momentsEarned > 0) {
      toast({ kind: 'success', title: 'MOMENT OF EVOLUTION', message: `Check ${momentsEarned > 1 ? `${momentsEarned} Moments` : 'a Moment'} on your character card and talk it over with your MC.` })
    }
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
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-4">
        <Link href={`/campaigns/${id}`} className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
          <ArrowLeft size={14} aria-hidden /> {character.campaignName ? character.campaignName.toUpperCase() : 'CREW'}
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <SaveIndicator state={autosave.state} error={autosave.error} />
          {character.canEdit && (
            <span className="flex gap-1">
              <Tooltip content="Undo your last change (⌘Z / Ctrl+Z)">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => step('undo')} disabled={history.current.past.length === 0} aria-label="Undo last change"><Undo2 size={14} aria-hidden /></button>
              </Tooltip>
              <Tooltip content="Redo (⇧⌘Z / Ctrl+Y)">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => step('redo')} disabled={history.current.future.length === 0} aria-label="Redo"><Redo2 size={14} aria-hidden /></button>
              </Tooltip>
            </span>
          )}
          <span className="hidden md:inline-flex"><button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()} aria-label="Print this sheet"><Printer size={14} aria-hidden /> PRINT</button></span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => downloadCharacter(character)} aria-label="Export this character to a file"><Download size={14} aria-hidden /> <span className="hidden sm:inline">EXPORT</span></button>
          <Link href="/guide/effects" className="btn btn-ghost btn-sm"><Zap size={14} aria-hidden /> <span className="hidden sm:inline">EFFECTS</span><span className="sr-only sm:hidden">Effects</span></Link>
          {character.canEdit && <DowntimeDialog character={character} onApply={c => updateCharacter(c)} />}
          <RollerDialog character={character} rules={character.rules} onApply={character.canEdit ? c => updateCharacter(c) : undefined} />
        </div>
      </div>

      <h1 className="sr-only">{character.name || 'Character'} — character sheet</h1>

      {readOnly && (
        <div className="panel px-4 py-3 mb-4 flex items-center gap-2" style={{ borderColor: 'var(--accent-cyan)' }}>
          <Eye size={16} style={{ color: 'var(--accent-cyan)' }} aria-hidden />
          <span>You’re viewing a crewmate’s sheet. Only its player and the MC can change it.</span>
        </div>
      )}

      <nav aria-label="Sheet sections" className="no-print scroll-row sticky z-30 -mx-4 md:mx-0 px-4 md:px-0 py-2 mb-4 flex gap-2 overflow-x-auto" style={{ top: 'var(--nav-height)', background: 'rgba(8,12,24,0.92)' }}>
        {[['#card', 'CHARACTER'], ['#themes', 'THEMES'], ['#gear', 'LOADOUT & STORY'], ['#statuses', 'STATUSES'], ['#notes', 'NOTES']].map(([href, label]) => (
          <a key={href} href={href} className="chip shrink-0" style={{ minHeight: 36, padding: '0 14px', color: 'var(--text-soft)' }}>{label}</a>
        ))}
      </nav>

      {!readOnly && <SetupChecklist character={character} onChange={updateCharacter} />}

      <fieldset disabled={readOnly} className="space-y-10 min-w-0">
        <section id="card" className="scroll-mt-32">
          <CharacterCard character={character} onChange={updateCharacter} />
        </section>

        <section id="themes" className="scroll-mt-32">
          <div className="flex items-center gap-2 mb-4">
            <Tooltip content="Each character has exactly 4 themes — their major aspects. Themes hold your power tags, weakness tags, and define your Essence.">
              <h2 className="font-display text-2xl tracking-widest cursor-help">THEMES</h2>
            </Tooltip>
            <span className="font-display text-sm tracking-widest" style={{ color: 'var(--text-muted)' }}>({character.themes.filter(t => t.themeType !== '').length}/4)</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {character.themes.map((theme, i) => (
              <ThemeSlot
                key={i}
                theme={theme}
                index={i}
                otherTypes={character.themes.filter((t, j) => j !== i && t.themeType).map(t => t.themeType)}
                onEvolution={gainEvolution}
                onReplaced={(lost, evolution) => updateCharacter({
                  themeHistory: [
                    ...((latest.current ?? character).themeHistory ?? []),
                    { name: lost.name, themeType: lost.themeType, category: lost.category, evolution, replacedAt: new Date().toISOString() },
                  ],
                })}
                onChange={updated => updateCharacter({
                  themes: (latest.current ?? character).themes.map((t, idx) => idx === i ? updated : t),
                })}
              />
            ))}
          </div>
        </section>

        <section id="gear" className="scroll-mt-32">
          <h2 className="font-display text-2xl tracking-widest mb-4">LOADOUT & STORY TAGS</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            <LoadoutThemeCard
              loadout={character.loadoutTheme}
              onChange={loadout => updateCharacter({ loadoutTheme: loadout })}
            />
            <StoryTagsCard
              tags={character.storyTags ?? []}
              onChange={storyTags => updateCharacter({ storyTags })}
              onKeep={(tag, index) => {
                const cur = latest.current ?? character
                updateCharacter({
                  storyTags: (cur.storyTags ?? []).filter((_, i) => i !== index),
                  loadoutTheme: { ...cur.loadoutTheme, tags: [...(cur.loadoutTheme.tags ?? []), { text: tag.text, isFlaw: false, isBurned: false }] },
                })
              }}
            />
          </div>
        </section>

        <section id="statuses" className="panel p-4 md:p-6 scroll-mt-32">
          <TrackingCards
            statuses={character.statuses}
            onChange={statuses => updateCharacter({ statuses })}
            limit={character.rules?.pcLimit}
          />
        </section>

        <section id="notes" className="scroll-mt-32">
          <PaperCard label="Notes">
            <div className="paper-band"><span className="font-display tracking-[0.2em] text-lg">NOTES</span></div>
            <CardStrip>BACKSTORY · CONTACTS · LEADS · LOOT</CardStrip>
            <div className="px-3">
              <LinedField
                label="Character notes"
                rows={6}
                value={character.notes ?? ''}
                onChange={notes => updateCharacter({ notes })}
                placeholder="Anything worth remembering between sessions…"
              />
            </div>
          </PaperCard>
        </section>
      </fieldset>
    </div>
  )
}
