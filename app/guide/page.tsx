import Link from 'next/link'
import { Dices, ListTree } from 'lucide-react'
import { GUIDE, GUIDE_GROUPS } from '@/lib/guide'
import { GuideSearch } from '@/components/guide/GuideSearch'

export const metadata = { title: 'Rules Guide · Metro :Otherscape' }

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-4xl md:text-5xl tracking-widest">RULES GUIDE</h1>
      <p className="mt-1 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
        A plain-language reference for Metro :Otherscape. It summarizes the core rules for quick lookup at the table — the core book
        has the complete text and many more examples.
      </p>

      {/* Cheat sheet */}
      <section className="panel p-5 mt-6" aria-labelledby="cheat">
        <h2 id="cheat" className="font-display text-2xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>THE ROLL IN 20 SECONDS</h2>
        <ol className="mt-2 space-y-1 list-decimal pl-5" style={{ color: 'var(--text-soft)' }}>
          <li>+1 Power per relevant helpful tag, −1 per hindering tag. Burn one tag for +3 instead.</li>
          <li>+ your best relevant helpful status tier, − your worst hindering status tier.</li>
          <li>Roll 2d6 + Power. <b style={{ color: 'var(--accent-lime)' }}>10+</b> strong hit · <b style={{ color: '#ffd166' }}>7–9</b> mixed hit (with Consequences) · <b style={{ color: 'var(--danger)' }}>6−</b> miss.</li>
          <li>On a hit, if the MC asks, spend Power on <Link href="/guide/effects" className="underline">Effects</Link> (at least 1).</li>
        </ol>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/roller" className="btn btn-primary btn-sm"><Dices size={16} aria-hidden /> OPEN THE DICE ROLLER</Link>
          <Link href="/guide/actions-database" className="btn btn-ghost btn-sm"><ListTree size={16} aria-hidden /> ACTION IDEAS</Link>
        </div>
      </section>

      <GuideSearch topics={GUIDE.map(t => ({ slug: t.slug, title: t.title, summary: t.summary, group: t.group }))} groups={GUIDE_GROUPS} />
    </div>
  )
}
