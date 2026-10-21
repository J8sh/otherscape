'use client'
import { useState } from 'react'
import * as T from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'

/** One provider for the whole app (mounted in the root layout). */
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <T.Provider delayDuration={250} skipDelayDuration={150}>{children}</T.Provider>
}

interface Props {
  content: React.ReactNode
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Hover/focus tooltip that also works on touch screens: a tap toggles it
 * (Radix tooltips are hover-only by default, which leaves phones with nothing).
 */
export function Tooltip({ content, children, side = 'top' }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <T.Root open={open} onOpenChange={setOpen}>
      <T.Trigger
        asChild
        onPointerDown={e => { if (e.pointerType === 'touch') setOpen(o => !o) }}
        onPointerLeave={e => { if (e.pointerType === 'touch') e.preventDefault() }}
      >
        {children}
      </T.Trigger>
      <T.Portal>
        <T.Content
          side={side}
          sideOffset={6}
          collisionPadding={12}
          onPointerDownOutside={() => setOpen(false)}
          className="z-50 max-w-[min(20rem,calc(100vw-24px))] rounded-lg px-3 py-2 text-sm leading-snug shadow-xl"
          style={{
            background: '#1a2035',
            border: '1px solid #2a3352',
            color: '#e8eaf0',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {content}
          <T.Arrow style={{ fill: '#2a3352' }} />
        </T.Content>
      </T.Portal>
    </T.Root>
  )
}

/**
 * A small ⓘ button that explains a rule. Use next to labels where a
 * plain-text tooltip on the label itself would be hard to discover on a phone.
 */
export function InfoTip({ label, children, size = 15 }: { label: string; children: React.ReactNode; size?: number }) {
  return (
    <Tooltip content={children}>
      <button
        type="button"
        aria-label={`About ${label}`}
        className="inline-flex items-center justify-center rounded-full align-middle shrink-0"
        style={{ width: 28, height: 28, margin: -6, color: 'var(--text-muted)' }}
      >
        <Info size={size} aria-hidden />
      </button>
    </Tooltip>
  )
}
