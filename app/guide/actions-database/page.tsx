import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ActionIndex } from '@/components/guide/ActionIndex'

export const metadata = { title: 'Action Ideas · Rules Guide' }

export default function ActionsDatabasePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <Link href="/guide" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> RULES GUIDE
      </Link>
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mt-2">Action Ideas</h1>
      <p className="mt-1 mb-6 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
        An index to the <i>:Otherscape Action Database</i> supplement: find the kind of action you want to take, see which
        Effects it usually calls for, and turn to that page for suggested helpful and hindering tags, extra feats and likely
        Consequences. You never need it to play — any action is fair game — but it’s handy when you’re stuck.
      </p>
      <ActionIndex />
    </div>
  )
}
