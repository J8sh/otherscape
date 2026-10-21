import type { IChallenge } from '@/types'

/**
 * Starter Challenges to edit, so an MC doesn't begin from a blank profile.
 * Original examples written for this site — the core book's Challenge
 * Database (pp. 301–333) has many more.
 */
type Template = Omit<IChallenge, 'revealed' | 'limitsRevealed'>

export const CHALLENGE_TEMPLATES: { label: string; challenge: Template }[] = [
  {
    label: 'Blank Challenge',
    challenge: { name: 'New Challenge', role: 'attacker', description: '', limits: [{ name: 'hurt-or-subdue', max: 3 }], statuses: [], tags: [], specials: [], threats: [] },
  },
  {
    label: 'Street muscle',
    challenge: {
      name: 'Street Muscle', role: 'attacker',
      description: 'A hired heavy with chrome knuckles and a short temper. Alone, a nuisance; in a pack, trouble.',
      limits: [{ name: 'hurt-or-subdue', max: 3 }, { name: 'intimidate', max: 3 }],
      statuses: [], tags: [{ text: 'chrome knuckles' }, { text: 'knows the alleys' }], specials: [],
      threats: [
        { threat: 'Cracks their knuckles and steps in close', consequence: 'Haymaker (bruised-2)' },
        { threat: 'Whistles for backup', consequence: 'More muscle arrives (add Scale 1)' },
      ],
    },
  },
  {
    label: 'Security drone',
    challenge: {
      name: 'Security Drone', role: 'watcher',
      description: 'A humming quadrotor with a stun-dart turret and a live uplink to building security.',
      limits: [{ name: 'wreck', max: 2 }, { name: 'take-over', max: 3 }, { name: 'alarm', max: 3, progress: true, onMax: 'Building lockdown: every exit is sealed and guards are dispatched.' }],
      statuses: [{ name: 'firewalled', tier: 2, marks: [2], type: 'helpful' }], tags: [{ text: 'thermal camera' }, { text: 'evasive flight' }], specials: [],
      threats: [
        { threat: 'Its red scanning light sweeps toward you', consequence: 'You’re spotted (alarm +1)' },
        { threat: 'The dart turret swivels and locks on', consequence: 'Stun dart (dazed-2)' },
      ],
    },
  },
  {
    label: 'Locked vault door',
    challenge: {
      name: 'Vault Door', role: 'barrier',
      description: 'Thirty centimeters of layered alloy with a maglock and a warded seal.',
      limits: [{ name: 'breach', max: 4 }, { name: 'hurt-or-subdue', max: null }],
      statuses: [], tags: [{ text: 'maglock' }, { text: 'warded seal' }, { text: 'reinforced alloy' }], specials: [],
      threats: [{ threat: 'A tamper counter starts blinking', consequence: 'Silent alarm tripped (narrative)' }],
    },
  },
  {
    label: 'Countdown',
    challenge: {
      name: 'Countdown', role: 'countdown',
      description: 'Something terrible happens when this fills — a bomb, a ritual, a server wipe.',
      limits: [{ name: 'countdown', max: 5, progress: true, onMax: 'It happens.' }],
      statuses: [], tags: [], specials: [],
      threats: [{ threat: 'The timer ticks audibly / the chant rises', consequence: 'countdown +1' }],
    },
  },
  {
    label: 'Corporate negotiator',
    challenge: {
      name: 'Corporate Negotiator', role: 'temptation',
      description: 'Polished, patient, recording everything. Wants the crew on retainer — on the company’s terms.',
      limits: [{ name: 'convince', max: 4 }, { name: 'hurt-or-subdue', max: 2 }],
      statuses: [{ name: 'composed', tier: 2, marks: [2], type: 'helpful' }], tags: [{ text: 'legal team on call' }, { text: 'reads micro-expressions' }], specials: [],
      threats: [
        { threat: 'Slides a contract across the table', consequence: 'A clause you missed (bad-deal-2)' },
        { threat: 'Mentions your family by name', consequence: 'Rattled-2' },
      ],
    },
  },
]
