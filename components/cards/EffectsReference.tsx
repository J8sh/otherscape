import { Tooltip } from '@/components/ui/Tooltip'

interface Effect {
  name: string
  verbs: string
  description: string
  cost: string
}

const AGAINST_OPPONENT: Effect[] = [
  { name: 'ATTACK', verbs: 'Slash, punch, shoot, zap', description: 'Give your target a harmful status', cost: '1 Power per tier' },
  { name: 'DISRUPT', verbs: 'Blind, confuse, shock, trip, jam, interrupt', description: 'Give your target a hindering tag or status', cost: '1 Power per tier · 2 Power per tag' },
  { name: 'INFLUENCE', verbs: 'Convince, threaten, provoke, hack, mind-control', description: 'Give your target a compelling status', cost: '1 Power per tier' },
  { name: 'WEAKEN', verbs: 'Break, sunder, defuse, neutralize, nullify, silence', description: "Remove a target's useful tag or status", cost: '1 Power per tier · 2 Power per tag' },
]

const FOR_ALLY: Effect[] = [
  { name: 'BESTOW', verbs: 'Teach, learn, impart, empower, enchant, equip', description: 'Give yourself or an ally new abilities using tags', cost: '2 Power per tag' },
  { name: 'CREATE', verbs: 'Craft, find, purchase, loot, summon, build, rally', description: 'Create a new object or being using tags', cost: '2 Power per tag' },
  { name: 'ENHANCE', verbs: 'Assist, aim, boost, energize, take cover, gain advantage', description: 'Give yourself or an ally a helpful status', cost: '1 Power per tier' },
  { name: 'RESTORE', verbs: 'Heal, repair, rejuvenate, regain, alleviate, undo', description: 'Reduce a harmful status or recover a burnt power tag', cost: '1 Power per tier · 2 Power per tag' },
]

const OTHER: Effect[] = [
  { name: 'ADVANCE', verbs: 'Make progress, get closer, push forward', description: 'Increase a progress status', cost: '1 Power per tier' },
  { name: 'SET BACK', verbs: 'Delay, ruin, sabotage, reverse', description: 'Decrease a progress status', cost: '1 Power per tier' },
  { name: 'DISCOVER', verbs: 'Sense, recall information, research, converse, reveal', description: 'Discover a valuable detail', cost: '1 Power per detail' },
  { name: 'EXTRA FEAT', verbs: '', description: '1 Power per additional feature or minor achievement included in the action', cost: '1 Power per feature' },
]

function EffectCard({ effect }: { effect: Effect }) {
  return (
    <Tooltip content={effect.verbs || effect.description}>
      <div
        className="rounded-lg p-3 cursor-help transition-all hover:scale-[1.02]"
        style={{ background: '#1a2a1a', border: '1px solid #2a4a2a' }}
      >
        <div className="font-display text-base tracking-widest mb-1" style={{ color: '#c8ff00' }}>
          {effect.name}
        </div>
        {effect.verbs && (
          <div className="text-xs italic mb-1.5 leading-snug" style={{ color: '#90b890' }}>
            {effect.verbs}
          </div>
        )}
        <div className="text-xs leading-snug mb-2" style={{ color: '#c8d8c8' }}>
          {effect.description}
        </div>
        <div
          className="text-xs font-semibold tracking-wide px-2 py-0.5 rounded inline-block"
          style={{ background: '#0d1d0d', color: '#80c880', border: '1px solid #2a4a2a', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em' }}
        >
          {effect.cost}
        </div>
      </div>
    </Tooltip>
  )
}

function EffectGroup({ title, effects }: { title: string; effects: Effect[] }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 pb-1" style={{ color: '#7a8099', borderBottom: '1px solid #2a3352' }}>
        {title}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {effects.map(e => <EffectCard key={e.name} effect={e} />)}
      </div>
    </div>
  )
}

export function EffectsReference() {
  return (
    <div className="rounded-xl p-6" style={{ background: '#141929', border: '1px solid #2a3352' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="font-display text-3xl tracking-widest" style={{ color: '#c8ff00' }}>EFFECTS</div>
        <Tooltip content="Effects are what you can do with your Power when you take action. Each effect costs Power points to achieve.">
          <span className="text-xs cursor-help px-2 py-0.5 rounded" style={{ background: '#1a2035', border: '1px solid #2a3352', color: '#7a8099' }}>
            ? what is this
          </span>
        </Tooltip>
      </div>
      <EffectGroup title="Against an Opponent or Target" effects={AGAINST_OPPONENT} />
      <EffectGroup title="For Yourself or an Ally" effects={FOR_ALLY} />
      <EffectGroup title="On a Process / Other Effects" effects={OTHER} />
    </div>
  )
}
