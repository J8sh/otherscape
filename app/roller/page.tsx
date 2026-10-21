import { ActionRoller } from '@/components/roller/ActionRoller'

export const metadata = { title: 'Dice Roller · Metro :Otherscape' }

export default function RollerPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-display text-4xl md:text-5xl tracking-widest">DICE ROLLER</h1>
      <p className="mt-1 mb-6 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
        Count your Power and roll 2d6. To roll straight from your character’s tags, open your sheet and tap <b>ROLL</b>.
      </p>
      <ActionRoller />
    </div>
  )
}
