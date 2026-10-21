import { EffectsReference } from '@/components/cards/EffectsReference'

export const metadata = { title: 'Effects · Metro :Otherscape' }

export default function EffectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-4xl tracking-widest mb-6" style={{ color: 'var(--accent-lime)' }}>EFFECTS REFERENCE</h1>
      <EffectsReference />
    </div>
  )
}
