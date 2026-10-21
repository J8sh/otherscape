/** The twelve Effects you can spend Power on after a hit (core book p.91). */
export interface EffectDef {
  name: string
  group: 'opponent' | 'ally' | 'process' | 'other'
  verbs: string
  description: string
  cost: string
  /** Power per unit, for the roller's spend tracker. */
  unitCost: number
  unit: 'tier' | 'tag' | 'detail' | 'feat'
  altCost?: { unitCost: number; unit: 'tag' }
}

export const EFFECTS: EffectDef[] = [
  { name: 'Attack', group: 'opponent', verbs: 'Slash, punch, shoot, zap', description: 'Give your target a harmful status', cost: '1 Power per tier', unitCost: 1, unit: 'tier' },
  { name: 'Disrupt', group: 'opponent', verbs: 'Blind, confuse, shock, trip, jam, interrupt', description: 'Give your target a hindering tag or status', cost: '1 Power per tier · 2 per tag', unitCost: 1, unit: 'tier', altCost: { unitCost: 2, unit: 'tag' } },
  { name: 'Influence', group: 'opponent', verbs: 'Convince, threaten, provoke, hack, mind-control', description: 'Give your target a compelling status', cost: '1 Power per tier', unitCost: 1, unit: 'tier' },
  { name: 'Weaken', group: 'opponent', verbs: 'Break, sunder, defuse, neutralize, nullify, silence', description: 'Remove a target’s useful tag or status', cost: '1 Power per tier · 2 per tag', unitCost: 1, unit: 'tier', altCost: { unitCost: 2, unit: 'tag' } },
  { name: 'Bestow', group: 'ally', verbs: 'Teach, learn, impart, empower, enchant, equip', description: 'Give yourself or an ally new abilities using tags', cost: '2 Power per tag', unitCost: 2, unit: 'tag' },
  { name: 'Create', group: 'ally', verbs: 'Craft, find, purchase, loot, summon, build, rally', description: 'Create a new object or being using tags', cost: '2 Power per tag', unitCost: 2, unit: 'tag' },
  { name: 'Enhance', group: 'ally', verbs: 'Assist, aim, boost, energize, take cover, gain advantage', description: 'Give yourself or an ally a helpful status', cost: '1 Power per tier', unitCost: 1, unit: 'tier' },
  { name: 'Restore', group: 'ally', verbs: 'Heal, repair, rejuvenate, regain, alleviate, undo', description: 'Reduce a harmful status or recover a burnt power tag', cost: '1 Power per tier · 2 per tag', unitCost: 1, unit: 'tier', altCost: { unitCost: 2, unit: 'tag' } },
  { name: 'Advance', group: 'process', verbs: 'Make progress, get closer, push forward', description: 'Increase a progress status', cost: '1 Power per tier', unitCost: 1, unit: 'tier' },
  { name: 'Set Back', group: 'process', verbs: 'Delay, ruin, sabotage, reverse', description: 'Decrease a progress status', cost: '1 Power per tier', unitCost: 1, unit: 'tier' },
  { name: 'Discover', group: 'other', verbs: 'Sense, recall information, research, converse, reveal', description: 'Discover a valuable detail', cost: '1 Power per detail', unitCost: 1, unit: 'detail' },
  { name: 'Extra Feat', group: 'other', verbs: 'Faster, quieter, cleaner, a bonus achievement', description: 'Add a minor achievement or flourish to the action (after spending on another Effect)', cost: '1 Power per feat', unitCost: 1, unit: 'feat' },
]

export const EFFECT_GROUPS: { key: EffectDef['group']; title: string }[] = [
  { key: 'opponent', title: 'Against an opponent or a target' },
  { key: 'ally', title: 'For yourself or an ally' },
  { key: 'process', title: 'On a process' },
  { key: 'other', title: 'Other effects' },
]
