'use client'
import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, X, Users } from 'lucide-react'
import { api } from '@/lib/api'
import { TropePicker } from '@/components/sheet/TropePicker'
import type { ICharacter } from '@/types'

interface Step { done: boolean; label: string; hint: string; href: string }

/**
 * Rapid character creation, as a checklist on new sheets (core book
 * pp. 174–178): name, four themes from the Theme Book, a motivation on each,
 * three loadout tags, and a relationship tag for each crewmate. Disappears
 * once everything's done, or when dismissed.
 */
export function SetupChecklist({ character, onChange }: { character: ICharacter; onChange: (patch: Partial<ICharacter>) => void }) {
  const storageKey = `setup-dismissed:${character._id}`
  const [dismissed, setDismissed] = useState(true)
  const [crewmates, setCrewmates] = useState<string[] | null>(null)

  useEffect(() => {
    try { setDismissed(localStorage.getItem(storageKey) === '1') } catch { setDismissed(false) }
  }, [storageKey])

  useEffect(() => {
    api<ICharacter[]>(`/api/characters?campaignId=${character.campaignId}`)
      .then(list => setCrewmates(list.filter(c => c._id !== character._id).map(c => c.name).filter(Boolean)))
      .catch(() => setCrewmates([]))
  }, [character.campaignId, character._id])

  const themes = character.themes.filter(t => t.themeType)
  const relationships = character.crewRelationships.filter(r => r.relationshipTag.trim())
  const steps: Step[] = [
    { done: !!character.name.trim() && character.name !== 'New Character', label: 'Name your character', hint: 'Tap the name on the character card.', href: '#card' },
    { done: themes.length === 4, label: `Pick 4 themes (${themes.length}/4)`, hint: 'Open each empty slot and choose a kit: its title, 2 more power tags and 1 weakness.', href: '#themes' },
    { done: themes.length === 4 && themes.every(t => t.motivation.trim()), label: 'Give each theme a motivation', hint: 'The Identity / Ritual / Itch line — the kit suggests one.', href: '#themes' },
    { done: character.loadoutTheme.tags.filter(t => t.text.trim()).length >= 3, label: 'Add 3 loadout tags', hint: 'Gear and access you can pack for a job (they start burnt).', href: '#gear' },
    {
      done: crewmates !== null && (crewmates.length === 0 || relationships.length >= crewmates.length),
      label: crewmates?.length ? `Relationship tags for your crew (${relationships.length}/${crewmates.length})` : 'Relationship tags (once your crewmates join)',
      hint: 'One tag for each other player character, describing your bond.',
      href: '#card',
    },
  ]
  const remaining = steps.filter(s => !s.done).length
  if (dismissed || remaining === 0) return null

  const missingRows = (crewmates ?? []).filter(name => !character.crewRelationships.some(r => r.crewMember.trim().toLowerCase() === name.toLowerCase()))

  function dismiss() {
    try { localStorage.setItem(storageKey, '1') } catch { /* private mode: just hide for now */ }
    setDismissed(true)
  }

  return (
    <section className="panel p-4 mb-6 edit-only" aria-labelledby="setup-heading" style={{ borderColor: 'var(--accent-lime)' }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="setup-heading" className="font-display text-2xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>BUILD YOUR CHARACTER</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{remaining} step{remaining === 1 ? '' : 's'} left · <a className="underline" href="/guide/making-a-character">How to make a character</a></p>
        </div>
        <button type="button" className="btn btn-ghost btn-icon" onClick={dismiss} aria-label="Hide the setup checklist"><X size={16} /></button>
      </div>
      {themes.length === 0 && (
        <div className="mt-3 rounded-lg p-3 flex flex-wrap items-center gap-3" style={{ background: 'var(--bg-inset)' }}>
          <TropePicker character={character} onApply={onChange} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>New to the game? Pick an archetype and get all four themes at once.</span>
        </div>
      )}
      <ol className="mt-3 space-y-1.5">
        {steps.map(s => (
          <li key={s.label}>
            <a href={s.href} className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5" style={{ minHeight: 44 }}>
              {s.done ? <CheckCircle2 size={20} style={{ color: 'var(--accent-lime)' }} className="shrink-0 mt-0.5" aria-label="Done" /> : <Circle size={20} style={{ color: 'var(--text-muted)' }} className="shrink-0 mt-0.5" aria-label="To do" />}
              <span>
                <span className="font-semibold" style={{ textDecoration: s.done ? 'line-through' : undefined, color: s.done ? 'var(--text-muted)' : undefined }}>{s.label}</span>
                {!s.done && <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>{s.hint}</span>}
              </span>
            </a>
          </li>
        ))}
      </ol>
      {missingRows.length > 0 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm mt-3"
          onClick={() => onChange({
            crewRelationships: [
              ...character.crewRelationships.filter(r => r.crewMember.trim() || r.relationshipTag.trim()),
              ...missingRows.map(name => ({ crewMember: name, relationshipTag: '', isBurned: false })),
            ],
          })}
        >
          <Users size={15} aria-hidden /> ADD ROWS FOR {missingRows.length === 1 ? missingRows[0].toUpperCase() : `${missingRows.length} CREWMATES`}
        </button>
      )}
    </section>
  )
}
