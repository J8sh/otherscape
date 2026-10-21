import Link from 'next/link'

export const metadata = { title: 'Rules Guide · Metro :Otherscape' }

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-4xl tracking-widest">RULES GUIDE</h1>
      <p className="mt-2" style={{ color: 'var(--text-muted)' }}>A quick reference for the rules you use at the table.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        <li><Link href="/guide/effects" className="panel block p-4 hover:border-[#c8ff00]"><span className="font-display text-xl tracking-widest" style={{ color: 'var(--accent-lime)' }}>EFFECTS</span><p style={{ color: 'var(--text-muted)' }}>What you can spend Power on.</p></Link></li>
      </ul>
    </div>
  )
}
