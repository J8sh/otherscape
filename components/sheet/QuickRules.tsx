'use client'
import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { BookOpen, X } from 'lucide-react'
import { TIER_NAMES } from '@/lib/rules'

/** A pocket cheat sheet that opens over the character sheet (our own summary of the core rules). */
export function QuickRules() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-ghost btn-sm" aria-label="Quick rules"><BookOpen size={14} aria-hidden /> <span className="hidden sm:inline">RULES</span></button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: 'rgba(3,6,14,0.8)' }} />
        <Dialog.Content className="fixed z-50 inset-0 md:inset-x-[max(24px,calc(50vw-340px))] md:inset-y-10 md:rounded-2xl overflow-y-auto"
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-card)' }}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3" style={{ background: 'rgba(8,12,24,0.95)', borderBottom: '1px solid var(--border-card)' }}>
            <Dialog.Title className="font-display text-2xl tracking-widest">QUICK RULES</Dialog.Title>
            <Dialog.Close asChild><button type="button" className="btn btn-ghost btn-icon" aria-label="Close"><X size={18} /></button></Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">A short summary of rolling, tags and statuses.</Dialog.Description>
          <div className="p-4 space-y-5 text-[15px]" style={{ color: 'var(--text-soft)' }}>
            <section>
              <h3 className="font-display tracking-widest text-lg" style={{ color: 'var(--accent-lime)' }}>ROLLING</h3>
              <ol className="list-decimal pl-5 space-y-1 mt-1">
                <li>+1 Power for each tag that really helps; −1 for each that gets in the way.</li>
                <li>Burn one helpful tag for +3 instead of +1 (it’s out until recovered).</li>
                <li>Add your best relevant helpful status tier; subtract the worst hindering one.</li>
                <li>Roll 2d6 + Power. <b style={{ color: 'var(--accent-lime)' }}>10+</b> strong hit · <b style={{ color: '#ffd166' }}>7–9</b> mixed hit, with Consequences · <b style={{ color: 'var(--danger)' }}>6 or less</b> miss.</li>
                <li>On a hit, spend Power on Effects when the details matter (at least 1).</li>
              </ol>
            </section>
            <section>
              <h3 className="font-display tracking-widest text-lg" style={{ color: 'var(--accent-lime)' }}>TAGS</h3>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Invoking one of your <b>weakness</b> tags costs −1 but marks an upgrade on its theme.</li>
                <li>A <b>crew</b> power tag burns as soon as anyone uses it; a <b>relationship</b> tag burns when used and comes back at the Credit Roll.</li>
                <li>Act against a theme’s Identity, Ritual or Itch and you mark its <b>Decay</b>.</li>
              </ul>
            </section>
            <section>
              <h3 className="font-display tracking-widest text-lg" style={{ color: 'var(--accent-lime)' }}>STATUSES</h3>
              <p className="mt-1">A status has a tier from 1 to 6; taking more of the same stacks it up. Reach your Limit (usually 5) and you’re overcome — out of the action until it’s dealt with.</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 mt-2">
                {TIER_NAMES.slice(1).map((name, i) => (
                  <div key={name} className="contents">
                    <dt className="font-display" style={{ color: 'var(--text-primary)' }}>{i + 1}</dt>
                    <dd>{name}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/guide" className="btn btn-ghost btn-sm">FULL RULES GUIDE</Link>
              <Link href="/guide/effects" className="btn btn-ghost btn-sm">EFFECTS</Link>
              <Link href="/guide/actions-database" className="btn btn-ghost btn-sm">ACTION IDEAS</Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
