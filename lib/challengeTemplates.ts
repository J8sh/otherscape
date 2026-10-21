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
  {
    label: 'Cult zealot',
    challenge: {
      name: 'Cult Zealot', role: 'temptation',
      description: 'A true believer wreathed in incense and AR halos, preaching that the Source chose this block.',
      limits: [{ name: 'convince', max: 4 }, { name: 'hurt-or-subdue', max: 2 }, { name: 'banish', max: null }],
      statuses: [{ name: 'fervent', tier: 2, marks: [2], type: 'helpful' }], tags: [{ text: 'a crowd that listens' }, { text: 'blessed amulet' }], specials: [],
      threats: [
        { threat: 'Raises their arms and the crowd turns toward you', consequence: 'The crowd closes in (surrounded-2)' },
        { threat: 'Starts naming your sins', consequence: 'Doubt creeps in (shaken-2)' },
      ],
    },
  },
  {
    label: 'Rogue AI',
    challenge: {
      name: 'Rogue AI', role: 'attacker',
      description: 'A self-modifying intelligence nesting in a corporate Domain, rendering itself as a cathedral of mirrored code.',
      limits: [{ name: 'crash', max: 4 }, { name: 'take-over', max: 5 }, { name: 'hurt-or-subdue', max: null }],
      statuses: [{ name: 'firewalled', tier: 3, marks: [3], type: 'helpful' }], tags: [{ text: 'predicts your moves' }, { text: 'copies itself' }], specials: [
        { name: 'Backup Instance', text: 'The first time crash is maxed out, it reboots elsewhere with crash cleared and firewalled-2.' },
      ],
      threats: [
        { threat: 'The mirrors begin reflecting your avatar’s code', consequence: 'Your avatar is tagged-3' },
        { threat: 'A countdown appears in every display', consequence: 'Lockout: burn a cyberware or app tag' },
      ],
    },
  },
  {
    label: 'Pursuit (chase)',
    challenge: {
      name: 'Pursuit', role: 'pursuer',
      description: 'Something is chasing the crew. Whichever side fills its Limit first wins the chase.',
      limits: [
        { name: 'outrun', max: 4, progress: true, onMax: 'The crew gets away clean.' },
        { name: 'catch', max: 4, progress: true, onMax: 'The pursuer cuts them off — they have to fight or surrender.' },
      ],
      statuses: [], tags: [{ text: 'knows the streets' }, { text: 'faster vehicle' }], specials: [],
      threats: [{ threat: 'Headlights flare in the mirror, closing fast', consequence: 'catch +2' }],
    },
  },
  {
    label: 'Corporate security squad',
    challenge: {
      name: 'Security Squad', role: 'attacker',
      description: 'Five professionals in matching armor with comms discipline and a sergeant who doesn’t panic. A Scale 1 group.',
      limits: [{ name: 'hurt-or-subdue', max: 4 }, { name: 'scatter', max: 3 }],
      statuses: [{ name: 'coordinated', tier: 2, marks: [2], type: 'helpful' }], tags: [{ text: 'body armor' }, { text: 'tactical comms' }, { text: 'Scale 1 (a squad)' }], specials: [],
      threats: [
        { threat: 'They fan out and take firing positions', consequence: 'Suppressing fire (pinned-3)' },
        { threat: 'The sergeant calls it in', consequence: 'Reinforcements in two beats (narrative)' },
      ],
    },
  },
  {
    label: 'Hazardous zone',
    challenge: {
      name: 'Toxic Underpass', role: 'barrier',
      description: 'Flooded tunnels under the old highway, thick with chemical runoff and something that glows.',
      limits: [{ name: 'cross', max: 3, progress: true, onMax: 'Through to the other side.' }],
      statuses: [], tags: [{ text: 'toxic water' }, { text: 'pitch dark' }, { text: 'unstable ceiling' }], specials: [],
      threats: [{ threat: 'The water starts to bubble', consequence: 'Fumes (poisoned-2)' }],
    },
  },
]
