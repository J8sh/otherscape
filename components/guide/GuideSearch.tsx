'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface Topic { slug: string; title: string; summary: string; group: string }

/** Filter the guide's topics as you type; shows grouped topics when empty. */
export function GuideSearch({ topics, groups }: { topics: Topic[]; groups: { key: string; title: string }[] }) {
  const [q, setQ] = useState('')
  const query = q.trim().toLowerCase()
  const match = (t: Topic) => !query || `${t.title} ${t.summary}`.toLowerCase().includes(query)

  return (
    <div className="mt-8">
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} aria-hidden />
        <input className="input" style={{ paddingLeft: 36 }} placeholder="Search the guide: burn, Limit, loadout, Essence…" value={q} onChange={e => setQ(e.target.value)} aria-label="Search the rules guide" />
      </div>
      {groups.map(g => {
        const items = topics.filter(t => t.group === g.key && match(t))
        if (!items.length) return null
        return (
          <section key={g.key} className="mt-8" aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="font-display tracking-[0.2em] text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{g.title.toUpperCase()}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map(t => (
                <li key={t.slug}>
                  <Link href={`/guide/${t.slug}`} className="panel block h-full p-4 hover:border-[#c8ff00] transition-colors">
                    <span className="font-display text-xl tracking-wide" style={{ color: 'var(--accent-lime)' }}>{t.title}</span>
                    <p className="text-[15px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {query && !topics.some(match) && <p className="mt-6" style={{ color: 'var(--text-muted)' }}>No topics match “{q}”. Try the <Link href="/guide/actions-database" className="underline">Action Ideas</Link> index.</p>}
    </div>
  )
}
