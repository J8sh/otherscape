import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EffectsReference } from '@/components/cards/EffectsReference'

export default async function EffectsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="min-h-screen" style={{ background: '#080c18' }}>
      <div className="px-8 py-4" style={{ borderBottom: '1px solid #2a3352' }}>
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href={`/campaigns/${id}`} className="flex items-center gap-1.5 text-sm transition-colors hover:text-white" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em' }}>
            <ArrowLeft size={14} /> BACK TO CREW
          </Link>
          <span style={{ color: '#2a3352' }}>/</span>
          <span className="font-display text-lg tracking-widest" style={{ color: '#c8ff00' }}>EFFECTS REFERENCE</span>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-8 py-8">
        <EffectsReference />
      </div>
    </div>
  )
}
