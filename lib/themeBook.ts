import type { ThemeCategory, ThemeType } from '@/types'

export interface ThemeBookEntry {
  type: ThemeType
  category: ThemeCategory
  description: string
  powerTags: string[]
  weaknessTags: string[]
  motivationExample: string
}

export const THEME_BOOK: ThemeBookEntry[] = [
  // ── SELF ─────────────────────────────────────────────────────────────────
  {
    type: 'Affiliation',
    category: 'self',
    description:
      'You belong to a group, organization, or crew whose backing and codes define a part of who you are.',
    powerTags: [
      'loyal member',
      'inside connections',
      'access to group resources',
      'speaks for the crew',
      'respected among members',
      'backed by numbers',
      'privy to insider information',
      "group's muscle",
    ],
    weaknessTags: [
      "bound by the group's code",
      'answerable to leadership',
      "group's enemies are my enemies",
    ],
    motivationExample: 'My identity within [group name] is…',
  },
  {
    type: 'Assets',
    category: 'self',
    description:
      'You possess material resources — money, gear, property, or contacts — that you leverage to survive and succeed.',
    powerTags: [
      'well-equipped',
      'financial backing',
      'safe house',
      'reliable transport',
      'useful stash',
      'hidden cache',
      'emergency funds',
      'a contact for every need',
    ],
    weaknessTags: [
      'everything has a price',
      'debt to someone dangerous',
      "can't move fast when loaded down",
    ],
    motivationExample: 'My identity as someone with [asset type] is…',
  },
  {
    type: 'Expertise',
    category: 'self',
    description:
      'Years of training and professional experience have made you exceptionally skilled in your field.',
    powerTags: [
      'years of training',
      'professional methodology',
      'technical mastery',
      'calm under pressure',
      'trusted specialist',
      'knows the procedure',
      'reliable results',
      'reads the situation fast',
    ],
    weaknessTags: [
      'by-the-book only',
      'reputation precedes me',
      'skeptical of other approaches',
    ],
    motivationExample: 'My identity as [profession / expert role] is…',
  },
  {
    type: 'Horizon',
    category: 'self',
    description:
      'You are driven by a powerful vision, ideal, or goal that gives your life direction and meaning.',
    powerTags: [
      'unwavering conviction',
      'driven by purpose',
      'inspires others',
      'long-term vision',
      'committed to the cause',
      'idealistic determination',
      'nothing will stop me',
      'rallies those who believe',
    ],
    weaknessTags: [
      'blinded by idealism',
      "others don't share my vision",
      'sacrificed too much for this',
    ],
    motivationExample: 'My identity as someone who believes in [ideal / goal] is…',
  },
  {
    type: 'Personality',
    category: 'self',
    description:
      'Your defining personal traits — your charisma, wit, empathy, or force of will — set you apart.',
    powerTags: [
      'commanding presence',
      'reads people well',
      'silver tongue',
      'adaptable',
      'natural leader',
      'magnetic personality',
      'street smart',
      'quick thinker',
    ],
    weaknessTags: [
      'hot-headed',
      'too trusting',
      'difficulty backing down',
    ],
    motivationExample: 'My identity as someone who is [personality trait] is…',
  },
  {
    type: 'Troubled Past',
    category: 'self',
    description:
      'A dark chapter of your history — trauma, crime, loss — has hardened you and left its mark.',
    powerTags: [
      'street-hardened',
      'done worse before',
      'nothing surprises me',
      'survival instinct',
      'knows how the shadows work',
      'scars that teach',
      'burned bridges still provide light',
      'too stubborn to die',
    ],
    weaknessTags: [
      'haunted by it',
      'enemies from that time',
      'past reputation follows me',
    ],
    motivationExample: 'My identity despite [past event / trauma] is…',
  },

  // ── MYTHOS ───────────────────────────────────────────────────────────────
  {
    type: 'Artifact',
    category: 'mythos',
    description:
      'A powerful object — weapon, relic, or tool — is bound to you and channels your mythic Source.',
    powerTags: [
      'awakened relic',
      'channels the Source',
      'resonates with its wielder',
      'mysterious properties',
      'cannot be destroyed',
      'ancient design',
      'unstoppable force',
      'bound to my hand',
    ],
    weaknessTags: [
      'hungers for use',
      'has its own will',
      'draws unwanted attention',
    ],
    motivationExample: 'My ritual to maintain my bond with [artifact name] is…',
  },
  {
    type: 'Companion',
    category: 'mythos',
    description:
      'A loyal ally, familiar, or spirit partner shares your journey and acts as an extension of your Source.',
    powerTags: [
      'unwavering loyalty',
      'unique abilities of its own',
      'acts independently',
      'always nearby',
      'sixth sense for danger',
      'speaks through the Source',
      'never gives up on me',
      'protects me from the unseen',
    ],
    weaknessTags: [
      'vulnerable to harm',
      'has its own agenda',
      'can be taken from me',
    ],
    motivationExample: 'My ritual to maintain my bond with [companion name] is…',
  },
  {
    type: 'Esoterica',
    category: 'mythos',
    description:
      'You possess hidden knowledge — occult lore, forgotten rites, or forbidden techniques drawn from your Source.',
    powerTags: [
      'hidden knowledge',
      'occult ritual',
      'sees the unseen',
      'manipulates the unreal',
      'ancient lore',
      'forbidden technique',
      'understands the Source',
      'reads the mythic layer',
    ],
    weaknessTags: [
      'dangerous to practice',
      'leaves a mark',
      'attracts attention from beyond',
    ],
    motivationExample: 'My ritual to maintain my connection to [esoteric practice] is…',
  },
  {
    type: 'Exposure',
    category: 'mythos',
    description:
      'A transformative encounter — an event, an entity, or a place — has permanently changed you and left you resonating with a Source.',
    powerTags: [
      'touched by something greater',
      'instinctive resonance',
      'transformed perception',
      'altered senses',
      'channeled power',
      'understands what others cannot',
      'the Source recognizes me',
      'drawn to mythic currents',
    ],
    weaknessTags: [
      'never fully the same',
      'the Source calls to me',
      'the experience resurfaces',
    ],
    motivationExample: 'My ritual to manage my exposure to [Source / event] is…',
  },

  // ── NOISE ────────────────────────────────────────────────────────────────
  {
    type: 'Augmentation',
    category: 'noise',
    description:
      'Your body has been enhanced with cybernetic implants and biological modifications that push you beyond human limits.',
    powerTags: [
      'enhanced strength',
      'neural implants',
      'cybernetic reflexes',
      'reinforced frame',
      'embedded systems',
      'upgraded senses',
      'beyond human limits',
      'integrated hardware',
    ],
    weaknessTags: [
      'maintenance required',
      'glitches under stress',
      'visibly augmented',
    ],
    motivationExample: 'My itch to push my augmentations further is…',
  },
  {
    type: 'Cutting Edge',
    category: 'noise',
    description:
      "You wield prototype and bleeding-edge technology that most people haven't even heard of yet.",
    powerTags: [
      'prototype tech',
      'bleeding-edge gear',
      'custom modifications',
      'superior capability',
      'advanced surveillance',
      'tech that shouldn\'t exist yet',
      'ahead of the curve',
      'next-gen loadout',
    ],
    weaknessTags: [
      'temperamental equipment',
      'needs constant power',
      'one-of-a-kind (hard to replace)',
    ],
    motivationExample: 'My itch for the next advancement in [tech type] is…',
  },
  {
    type: 'Cyberspace',
    category: 'noise',
    description:
      'You navigate the digital realm through a neural interface, wielding code as a weapon and the net as your domain.',
    powerTags: [
      'neural interface',
      'system intrusion',
      'ghost in the network',
      'traces erased',
      'custom exploit',
      'deep net access',
      'controls the data flow',
      'hardened ICE',
    ],
    weaknessTags: [
      'vulnerable in meatspace',
      'leaves digital footprints',
      'the system fights back',
    ],
    motivationExample: 'My itch to dive deeper into [cyberspace aspect] is…',
  },
  {
    type: 'Drones',
    category: 'noise',
    description:
      'You command a fleet of remote-operated machines — aerial, ground, or aquatic — that extend your reach across the city.',
    powerTags: [
      'aerial reconnaissance',
      'autonomous attack capability',
      'remote presence',
      'swarm tactics',
      'sensor array',
      'precision strike',
      'eyes everywhere',
      'silent approach',
    ],
    weaknessTags: [
      'hardware is fragile',
      'susceptible to jamming',
      'collateral risk',
    ],
    motivationExample: 'My itch to expand my drone network for [purpose] is…',
  },
]

export const THEME_BOOK_BY_TYPE = Object.fromEntries(
  THEME_BOOK.map(e => [e.type, e])
) as Record<string, ThemeBookEntry>
