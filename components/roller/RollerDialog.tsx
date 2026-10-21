'use client'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Dices, X } from 'lucide-react'
import { ActionRoller } from '@/components/roller/ActionRoller'
import { api } from '@/lib/api'
import { UPGRADE_BOXES } from '@/lib/rules'
import type { ICampaign, IChallenge, ICharacter, ICrewThemeCard, IOptionalRules } from '@/types'

/** “Roll” from a character sheet: the roller in a dialog, full-screen on phones. */
export function RollerDialog({ character, onApply, rules }: { character: ICharacter; onApply?: (c: ICharacter) => void; rules?: IOptionalRules }) {
  const [challenges, setChallenges] = useState<IChallenge[]>([])
  const [crew, setCrew] = useState<ICrewThemeCard | null>(null)
  // Load the Challenges this player can see, and the crew card, each time the roller opens.
  const [open, setOpen] = useState(false)
  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next || !onApply) return
    api<ICampaign>(`/api/campaigns/${character.campaignId}`)
      .then(c => {
        setChallenges((c.challenges ?? []).filter(ch => ch.revealed || c.me?.canManage))
        setCrew(c.crewTheme ?? null)
      })
      .catch(() => { setChallenges([]); setCrew(null) })
  }

  // Burned crew tags and crew upgrade marks go to the shared crew card.
  // Only this roll's changes are applied on top of a fresh copy, so a
  // crewmate's edit since the roller opened isn't overwritten.
  async function applyCrew(next: ICrewThemeCard): Promise<string[] | void> {
    const before = crew
    setCrew(next)
    if (!before) return
    try {
      const fresh = (await api<ICampaign>(`/api/campaigns/${character.campaignId}`)).crewTheme
      const newlyBurned = new Set(next.tags.filter((t, i) => t.isBurned && !before.tags[i]?.isBurned).map(t => t.text))
      const merged: ICrewThemeCard = {
        ...fresh,
        tags: fresh.tags.map(t => (newlyBurned.has(t.text) ? { ...t, isBurned: true } : t)),
        upgrade: Math.min(UPGRADE_BOXES, (fresh.upgrade ?? 0) + Math.max(0, next.upgrade - before.upgrade)),
      }
      await api(`/api/campaigns/${character.campaignId}`, { method: 'PATCH', json: { crewTheme: merged } })
      setCrew(merged)
      const added = merged.upgrade - (fresh.upgrade ?? 0)
      return [
        ...[...newlyBurned].map(t => `Burned crew tag “${t}”`),
        ...(added > 0 ? [`Marked crew upgrade ×${added} (${merged.upgrade}/${UPGRADE_BOXES})`] : []),
      ]
    } catch { /* the sheet update still landed; the crew card can be fixed by hand */ }
  }

  // Press R on the sheet (outside text fields) to open the roller.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== 'r' || e.metaKey || e.ctrlKey || e.altKey || open) return
      const el = e.target as HTMLElement | null
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.closest('[role=dialog]'))) return
      e.preventDefault()
      onOpenChange(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-primary btn-sm" title="Open the dice roller (R)" aria-keyshortcuts="R"><Dices size={16} aria-hidden /> ROLL</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content
          className="fixed z-50 inset-0 md:inset-6 lg:inset-x-[max(24px,calc(50vw-620px))] md:rounded-2xl overflow-y-auto"
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">ROLL · {character.name || 'CHARACTER'}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="btn btn-ghost btn-icon" aria-label="Close roller"><X size={18} /></button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Pick the tags and statuses that apply, then roll two dice plus Power.</Dialog.Description>
          <div className="p-4 md:p-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
            <ActionRoller
              character={character}
              rules={rules}
              challenges={challenges}
              onApply={onApply}
              crew={crew}
              onApplyCrew={onApply ? applyCrew : undefined}
              onShare={onApply ? roll => { api(`/api/campaigns/${character.campaignId}/rolls`, { method: 'POST', json: { characterId: character._id, ...roll } }).catch(() => {}) } : undefined}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
