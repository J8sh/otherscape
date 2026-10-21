import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EffectsReference } from '@/components/cards/EffectsReference'

export const metadata = { title: 'Effects · Metro :Otherscape' }

export default function EffectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <Link href="/guide" className="inline-flex items-center gap-1.5 font-display tracking-widest text-sm hover:text-white" style={{ color: 'var(--text-muted)', minHeight: 32 }}>
        <ArrowLeft size={14} aria-hidden /> RULES GUIDE
      </Link>
      <h1 className="font-display text-4xl md:text-5xl tracking-wide mt-2 mb-4">Effects</h1>
      <EffectsReference />
    </div>
  )
}
