'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BookOpen, Dices, LayoutGrid, LogOut, Shield, User as UserIcon } from 'lucide-react'
import { useSession } from '@/components/auth/SessionProvider'

const BARE_PATHS = ['/login', '/register']

const NAV = [
  { href: '/campaigns', label: 'Campaigns', icon: LayoutGrid },
  { href: '/guide', label: 'Rules Guide', icon: BookOpen },
  { href: '/roller', label: 'Dice', icon: Dices },
]

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Site chrome. Desktop/tablet: a top bar with links and an account menu.
 * Phone: a slim top bar plus a bottom tab bar within thumb reach.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, signOut } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [menuOpen])

  if (BARE_PATHS.some(p => pathname.startsWith(p))) return <>{children}</>

  const links = user?.role === 'admin' ? [...NAV, { href: '/admin', label: 'Admin', icon: Shield }] : NAV

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-primary">Skip to content</a>
      <header
        className="sticky top-0 z-40 backdrop-blur"
        style={{ background: 'rgba(8,12,24,0.88)', borderBottom: '1px solid var(--border-card)', height: 'var(--nav-height)' }}
      >
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
          <Link href="/campaigns" className="font-display text-2xl tracking-widest shrink-0" style={{ color: 'var(--accent-lime)' }} aria-label=":Otherscape home">
            :OTHERSCAPE
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-1 flex-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className="flex items-center gap-2 px-3 rounded-lg font-display tracking-widest transition-colors"
                  style={{ minHeight: 40, fontSize: 16, color: active ? 'var(--accent-lime)' : 'var(--text-muted)', background: active ? 'rgba(200,255,0,0.08)' : 'transparent' }}
                >
                  <Icon size={16} aria-hidden /> {label}
                </Link>
              )
            })}
          </nav>

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="flex items-center gap-2 rounded-lg px-2"
                style={{ minHeight: 44, color: 'var(--text-soft)' }}
              >
                <span
                  aria-hidden
                  className="flex items-center justify-center rounded-full font-display"
                  style={{ width: 32, height: 32, background: 'var(--bg-card-alt)', border: '1px solid var(--border-card)', color: 'var(--accent-lime)', fontSize: 16 }}
                >
                  {user.displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline font-semibold">{user.displayName}</span>
              </button>
              {menuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 panel p-1 shadow-xl" style={{ background: 'var(--bg-card-alt)' }}>
                  <div className="px-3 py-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Signed in as <b style={{ color: 'var(--text-primary)' }}>@{user.username}</b>
                    {user.role === 'admin' && <span className="chip ml-2" style={{ color: 'var(--accent-lime)' }}>ADMIN</span>}
                  </div>
                  <Link role="menuitem" href="/account" className="flex items-center gap-2 px-3 rounded-md hover:bg-white/5" style={{ minHeight: 44 }}>
                    <UserIcon size={16} aria-hidden /> Account
                  </Link>
                  <button role="menuitem" onClick={signOut} className="w-full flex items-center gap-2 px-3 rounded-md hover:bg-white/5 text-left" style={{ minHeight: 44, color: 'var(--danger)' }}>
                    <LogOut size={16} aria-hidden /> Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main id="main" className="app-main flex-1">{children}</main>

      {/* Phone tab bar */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 flex"
        style={{ background: 'rgba(13,18,32,0.96)', borderTop: '1px solid var(--border-card)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 font-display tracking-wider"
              style={{ height: 'var(--bottom-nav-height)', fontSize: 12, color: active ? 'var(--accent-lime)' : 'var(--text-muted)' }}
            >
              <Icon size={20} aria-hidden />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
