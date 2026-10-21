import { EFFECTS, EFFECT_GROUPS, type EffectDef } from '@/lib/effects'

/** An Effect card in the style of the book's green Effects sheet. */
export function EffectCard({ effect, compact = false }: { effect: EffectDef; compact?: boolean }) {
  return (
    <div className="effect-card">
      <div className="effect-card-name font-display">{effect.name.toUpperCase()}</div>
      {!compact && <div className="effect-card-verbs">{effect.verbs}</div>}
      <div className="effect-card-desc">{effect.description}</div>
      <div className="effect-card-cost font-display">{effect.cost.toUpperCase()}</div>
    </div>
  )
}

export function EffectsReference() {
  return (
    <div className="space-y-6">
      <p style={{ color: 'var(--text-soft)' }}>
        On a hit (7+), when the MC wants to track how well your action worked, you spend its <b>Power</b> on Effects that match
        what you described. Zero or negative Power still buys 1 (the Rule of Minimum One). On a strong hit you may accept
        Consequences for +1 Power.
      </p>
      {EFFECT_GROUPS.map(g => (
        <section key={g.key}>
          <h2 className="font-display tracking-[0.2em] text-sm mb-2 pb-1" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-card)' }}>
            {g.title.toUpperCase()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EFFECTS.filter(e => e.group === g.key).map(e => <EffectCard key={e.name} effect={e} />)}
          </div>
        </section>
      ))}
      <div className="panel p-4">
        <h2 className="font-display tracking-widest text-lg">UNDER THE HOOD</h2>
        <p style={{ color: 'var(--text-soft)' }}>
          Every Effect comes down to three moves: add or remove a <b>status tier</b> (1 Power each), add or remove a
          <b> story tag</b> — including burning or recovering a power tag (2 Power each), or learn a <b>valuable detail</b> (1 Power).
          Effects hit one human-sized target unless the action is Scaled up.
        </p>
      </div>
    </div>
  )
}
