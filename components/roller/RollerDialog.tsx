'use client'
import * as Dialog from '@radix-ui/react-dialog'
import { Dices, X } from 'lucide-react'
import { ActionRoller } from '@/components/roller/ActionRoller'
import { api } from '@/lib/api'
import type { ICharacter, IOptionalRules } from '@/types'

/** “Roll” from a character sheet: the roller in a dialog, full-screen on phones. */
export function RollerDialog({ character, onApply, rules }: { character: ICharacter; onApply?: (c: ICharacter) => void; rules?: IOptionalRules }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-primary btn-sm"><Dices size={16} aria-hidden /> ROLL</button>
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
              onApply={onApply}
              onShare={onApply ? roll => { api(`/api/campaigns/${character.campaignId}/rolls`, { method: 'POST', json: { characterId: character._id, ...roll } }).catch(() => {}) } : undefined}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
