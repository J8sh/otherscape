'use client'
import * as T from '@radix-ui/react-tooltip'

interface Props {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: Props) {
  return (
    <T.Provider delayDuration={300}>
      <T.Root>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            side="top"
            sideOffset={6}
            className="z-50 max-w-xs rounded px-3 py-2 text-sm leading-snug shadow-lg"
            style={{
              background: '#1a2035',
              border: '1px solid #2a3352',
              color: '#e8eaf0',
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 500,
            }}
          >
            {content}
            <T.Arrow style={{ fill: '#2a3352' }} />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  )
}
