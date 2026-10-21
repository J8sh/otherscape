import type { Metadata, Viewport } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/auth/SessionProvider'
import { AppShell } from '@/components/layout/AppShell'
import { TooltipProvider } from '@/components/ui/Tooltip'

export const metadata: Metadata = {
  title: 'Metro :Otherscape',
  description: 'Campaign and character tracker for the Metro :Otherscape RPG',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080c18',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <SessionProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
