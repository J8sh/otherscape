import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { THEME_BOOK } from '@/lib/themeBook'
import { THEME_QUESTIONS } from '@/lib/themeQuestions'
import { CATEGORY_META } from '@/lib/themeMeta'
import type { ThemeCategory } from '@/types'

export const metadata = { title: 'Themebooks · Rules Guide' }

const ORDER: ThemeCategory[] = ['self', 'mythos', 'noise']

/** Browse every themebook, its kits and Specials — handy before building a character. */
export default function ThemebooksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <Link href="/guide" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> RULES GUIDE
      </Link>
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mt-2">Themebooks</h1>
      <p className="mt-1 mb-6 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
        All 14 theme types with their ready-made kits (core book pp. 196–251). A kit’s name is its title tag; take two more
        power tags and one weakness, and its motivation. Specials are unlocked later with upgrades.
      </p>

      <nav aria-label="Jump to a themebook" className="flex flex-wrap gap-1.5 mb-8">
        {THEME_BOOK.map(b => (
          <a key={b.type} href={`#${b.type.replace(/\s+/g, '-').toLowerCase()}`} className="chip" style={{ minHeight: 34, color: CATEGORY_META[b.category].color, borderColor: `${CATEGORY_META[b.category].color}66` }}>
            {b.type.toUpperCase()}
          </a>
        ))}
      </nav>

      {ORDER.map(cat => (
        <section key={cat} className="mb-10" aria-labelledby={`cat-${cat}`}>
          <h2 id={`cat-${cat}`} className="font-display text-3xl tracking-widest" style={{ color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</h2>
          <p className="mb-3" style={{ color: 'var(--text-muted)' }}>{CATEGORY_META[cat].blurb} Motivation: <b>{CATEGORY_META[cat].motivation.toLowerCase()}</b>.</p>
          {THEME_BOOK.filter(b => b.category === cat).map(b => (
            <article key={b.type} id={b.type.replace(/\s+/g, '-').toLowerCase()} className="panel p-4 mb-4 scroll-mt-20" style={{ borderLeft: `4px solid ${CATEGORY_META[cat].color}` }}>
              <h3 className="font-display text-2xl tracking-wide">{b.type}</h3>
              <p style={{ color: 'var(--text-soft)' }}>{b.description}</p>
              <details className="mt-3">
                <summary className="cursor-pointer font-display tracking-widest" style={{ minHeight: 36, color: 'var(--accent-lime)' }}>{b.kits.length} KITS</summary>
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  {b.kits.map(k => (
                    <div key={k.name} className="rounded-lg p-3" style={{ background: 'var(--bg-inset)' }}>
                      <div className="font-display text-lg tracking-wide">{k.name}</div>
                      <p className="text-sm italic" style={{ color: CATEGORY_META[cat].color }}>“{k.identity}”</p>
                      <p className="text-sm mt-1"><b style={{ color: 'var(--accent-lime)' }}>+</b> {k.powerTags.join(' · ')}</p>
                      <p className="text-sm mt-1"><b style={{ color: 'var(--danger)' }}>−</b> {k.weaknessTags.join(' · ')}</p>
                    </div>
                  ))}
                </div>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer font-display tracking-widest" style={{ minHeight: 36, color: 'var(--accent-lime)' }}>QUESTIONS FOR A CUSTOM THEME</summary>
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  <div className="rounded-lg p-3" style={{ background: 'var(--bg-inset)' }}>
                    <div className="font-display tracking-widest text-sm" style={{ color: 'var(--accent-lime)' }}>POWER — FIRST ONE + ANY TWO</div>
                    <ol className="list-[upper-alpha] pl-5 text-sm space-y-0.5 mt-1">{THEME_QUESTIONS[b.type].power.map((q, i) => <li key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>{q}</li>)}</ol>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: 'var(--bg-inset)' }}>
                    <div className="font-display tracking-widest text-sm" style={{ color: 'var(--danger)' }}>WEAKNESS — ANY ONE</div>
                    <ol className="list-[upper-alpha] pl-5 text-sm space-y-0.5 mt-1">{THEME_QUESTIONS[b.type].weakness.map((q, i) => <li key={i}>{q}</li>)}</ol>
                  </div>
                </div>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer font-display tracking-widest" style={{ minHeight: 36, color: 'var(--accent-lime)' }}>{b.specials.length} THEME SPECIALS</summary>
                <ul className="space-y-2 mt-2">
                  {b.specials.map(sp => (
                    <li key={sp.name} className="rounded-lg p-3" style={{ background: 'var(--bg-inset)' }}>
                      <div className="font-display tracking-wide">{sp.name}</div>
                      <p className="text-sm" style={{ color: 'var(--text-soft)' }}>{sp.description}</p>
                    </li>
                  ))}
                </ul>
              </details>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}
