import type { ThemeCategory, ThemeType } from '@/types'

/** A single premade tag plus an authored helper hint (UI guidance, not official rulebook text). */
export interface TagDef {
  text: string
  hint: string
}

export interface ThemeBookEntry {
  type: ThemeType
  category: ThemeCategory
  description: string
  powerTags: TagDef[]
  weaknessTags: TagDef[]
  motivationExample: string
}

/**
 * A new theme is built as 1 title (main) power tag + up to 2 supporting power
 * tags + 1 weakness tag — the :OTHERSCAPE themebook structure.
 */
export const MAX_TITLE_TAGS = 1
export const MAX_SUPPORTING_POWER_TAGS = 2
export const MAX_WEAKNESS_TAGS = 1

export const THEME_BOOK: ThemeBookEntry[] = [
  // ── SELF ─────────────────────────────────────────────────────────────────
  {
    type: 'Affiliation',
    category: 'self',
    description:
      'You belong to a group, organization, or crew whose backing and codes define a part of who you are.',
    powerTags: [
      { text: 'loyal member', hint: 'Invoke when your standing in the group opens doors or earns trust.' },
      { text: 'inside connections', hint: 'Invoke to pull strings with someone on the inside.' },
      { text: 'access to group resources', hint: 'Invoke when you need gear, funds, or people the group can supply.' },
      { text: 'speaks for the crew', hint: "Invoke when negotiating or making deals on the group's behalf." },
      { text: 'respected among members', hint: 'Invoke to command cooperation or deference from fellow members.' },
      { text: 'backed by numbers', hint: "Invoke when the threat of the group's collective force matters." },
      { text: 'privy to insider information', hint: 'Invoke to know something only insiders would.' },
      { text: "group's muscle", hint: 'Invoke when intimidation or force tied to the group applies.' },
    ],
    weaknessTags: [
      { text: "bound by the group's code", hint: "The GM can invoke when the group's rules limit your options." },
      { text: 'answerable to leadership', hint: "Expect trouble when you act without leadership's approval." },
      { text: "group's enemies are my enemies", hint: "The group's rivals will come after you too." },
    ],
    motivationExample: 'My identity within [group name] is…',
  },
  {
    type: 'Assets',
    category: 'self',
    description:
      'You possess material resources — money, gear, property, or contacts — that you leverage to survive and succeed.',
    powerTags: [
      { text: 'well-equipped', hint: 'Invoke when having the right gear on hand solves the problem.' },
      { text: 'financial backing', hint: 'Invoke when money can smooth or open the way.' },
      { text: 'safe house', hint: 'Invoke when you need a secure place to lie low or regroup.' },
      { text: 'reliable transport', hint: 'Invoke when getting somewhere fast or unseen matters.' },
      { text: 'useful stash', hint: 'Invoke to produce a stashed item or supply when needed.' },
      { text: 'hidden cache', hint: "Invoke to reveal a secret store others don't know about." },
      { text: 'emergency funds', hint: 'Invoke when you need cash in a pinch.' },
      { text: 'a contact for every need', hint: 'Invoke to know someone who can help with the task at hand.' },
    ],
    weaknessTags: [
      { text: 'everything has a price', hint: 'Favors and gear come with strings the GM can pull.' },
      { text: 'debt to someone dangerous', hint: 'A creditor can call in what you owe at the worst time.' },
      { text: "can't move fast when loaded down", hint: 'Your gear slows you when speed matters.' },
    ],
    motivationExample: 'My identity as someone with [asset type] is…',
  },
  {
    type: 'Expertise',
    category: 'self',
    description:
      'Years of training and professional experience have made you exceptionally skilled in your field.',
    powerTags: [
      { text: 'years of training', hint: 'Invoke when experience in your field gives you the edge.' },
      { text: 'professional methodology', hint: 'Invoke when a disciplined, proven approach pays off.' },
      { text: 'technical mastery', hint: 'Invoke for precise, expert handling of your specialty.' },
      { text: 'calm under pressure', hint: 'Invoke to keep working clearly when stakes are high.' },
      { text: 'trusted specialist', hint: 'Invoke when your reputation earns you access or cooperation.' },
      { text: 'knows the procedure', hint: 'Invoke when following the right steps matters.' },
      { text: 'reliable results', hint: 'Invoke when consistency and dependability count.' },
      { text: 'reads the situation fast', hint: 'Invoke to size up a scene quickly and act first.' },
    ],
    weaknessTags: [
      { text: 'by-the-book only', hint: 'The GM can invoke when rigid methods fail an unconventional problem.' },
      { text: 'reputation precedes me', hint: 'Being known can make you a target or tip off rivals.' },
      { text: 'skeptical of other approaches', hint: 'Dismissing other methods can blind you to a better one.' },
    ],
    motivationExample: 'My identity as [profession / expert role] is…',
  },
  {
    type: 'Horizon',
    category: 'self',
    description:
      'You are driven by a powerful vision, ideal, or goal that gives your life direction and meaning.',
    powerTags: [
      { text: 'unwavering conviction', hint: 'Invoke when steadfast belief carries you through doubt or fear.' },
      { text: 'driven by purpose', hint: 'Invoke when your goal fuels extra effort or resolve.' },
      { text: 'inspires others', hint: 'Invoke to move allies to act toward your vision.' },
      { text: 'long-term vision', hint: 'Invoke when seeing the bigger picture guides a choice.' },
      { text: 'committed to the cause', hint: 'Invoke when dedication to the mission tips the scales.' },
      { text: 'idealistic determination', hint: 'Invoke to push on where others would give up.' },
      { text: 'nothing will stop me', hint: 'Invoke when sheer persistence is what is needed.' },
      { text: 'rallies those who believe', hint: 'Invoke to gather and galvanize supporters.' },
    ],
    weaknessTags: [
      { text: 'blinded by idealism', hint: 'The GM can invoke when your ideals blind you to reality.' },
      { text: "others don't share my vision", hint: 'Expect resistance from those who do not buy in.' },
      { text: 'sacrificed too much for this', hint: 'Past sacrifices can be used against you.' },
    ],
    motivationExample: 'My identity as someone who believes in [ideal / goal] is…',
  },
  {
    type: 'Personality',
    category: 'self',
    description:
      'Your defining personal traits — your charisma, wit, empathy, or force of will — set you apart.',
    powerTags: [
      { text: 'commanding presence', hint: 'Invoke when your presence dominates a room or moment.' },
      { text: 'reads people well', hint: 'Invoke to sense motives, lies, or leverage in others.' },
      { text: 'silver tongue', hint: 'Invoke when persuasion or fast talk can win the day.' },
      { text: 'adaptable', hint: 'Invoke to adjust smoothly when plans change.' },
      { text: 'natural leader', hint: 'Invoke when taking charge rallies people to follow.' },
      { text: 'magnetic personality', hint: 'Invoke to charm, attract, or win someone over.' },
      { text: 'street smart', hint: "Invoke to navigate the city's dangers and unwritten rules." },
      { text: 'quick thinker', hint: 'Invoke when a fast, clever response is what is needed.' },
    ],
    weaknessTags: [
      { text: 'hot-headed', hint: 'The GM can invoke when your temper gets the better of you.' },
      { text: 'too trusting', hint: 'Being too trusting can be exploited against you.' },
      { text: 'difficulty backing down', hint: 'Refusing to back off can escalate trouble.' },
    ],
    motivationExample: 'My identity as someone who is [personality trait] is…',
  },
  {
    type: 'Troubled Past',
    category: 'self',
    description:
      'A dark chapter of your history — trauma, crime, loss — has hardened you and left its mark.',
    powerTags: [
      { text: 'street-hardened', hint: 'Invoke when a rough upbringing prepared you for this.' },
      { text: 'done worse before', hint: 'Invoke when your dark experience makes a grim task easier.' },
      { text: 'nothing surprises me', hint: 'Invoke to stay unshaken by shocking or brutal things.' },
      { text: 'survival instinct', hint: 'Invoke when staying alive against the odds is the goal.' },
      { text: 'knows how the shadows work', hint: 'Invoke to operate in the criminal underworld.' },
      { text: 'scars that teach', hint: 'Invoke when a hard lesson from your past applies now.' },
      { text: 'burned bridges still provide light', hint: 'Invoke when a severed old tie can still be useful.' },
      { text: 'too stubborn to die', hint: 'Invoke to endure punishment that would stop others.' },
    ],
    weaknessTags: [
      { text: 'haunted by it', hint: 'The GM can invoke when your past resurfaces to unsettle you.' },
      { text: 'enemies from that time', hint: 'Old foes can reappear to complicate things.' },
      { text: 'past reputation follows me', hint: 'Your history can precede you and turn people against you.' },
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
      { text: 'awakened relic', hint: "Invoke when the relic's dormant power stirs to act." },
      { text: 'channels the Source', hint: 'Invoke to draw mythic power through the artifact.' },
      { text: 'resonates with its wielder', hint: 'Invoke when your bond with the object amplifies its effect.' },
      { text: 'mysterious properties', hint: 'Invoke to reveal an unexpected, useful power.' },
      { text: 'cannot be destroyed', hint: "Invoke when the artifact's indestructibility protects you." },
      { text: 'ancient design', hint: 'Invoke when its old craftsmanship outmatches modern tech.' },
      { text: 'unstoppable force', hint: 'Invoke when raw, unstoppable power is what is needed.' },
      { text: 'bound to my hand', hint: "Invoke when the artifact can't be taken or dropped." },
    ],
    weaknessTags: [
      { text: 'hungers for use', hint: 'The artifact pushes you to use it, even unwisely.' },
      { text: 'has its own will', hint: 'It may act against your intentions.' },
      { text: 'draws unwanted attention', hint: 'Its power attracts those who want it.' },
    ],
    motivationExample: 'My ritual to maintain my bond with [artifact name] is…',
  },
  {
    type: 'Companion',
    category: 'mythos',
    description:
      'A loyal ally, familiar, or spirit partner shares your journey and acts as an extension of your Source.',
    powerTags: [
      { text: 'unwavering loyalty', hint: 'Invoke when your companion stands by you no matter what.' },
      { text: 'unique abilities of its own', hint: 'Invoke to use a power only your companion has.' },
      { text: 'acts independently', hint: 'Invoke when it can act on its own to help.' },
      { text: 'always nearby', hint: 'Invoke when having your companion present matters.' },
      { text: 'sixth sense for danger', hint: 'Invoke to be warned of a threat in time.' },
      { text: 'speaks through the Source', hint: 'Invoke for mythic insight relayed by your companion.' },
      { text: 'never gives up on me', hint: 'Invoke when its refusal to abandon you saves the day.' },
      { text: 'protects me from the unseen', hint: 'Invoke to be shielded from mythic or hidden harm.' },
    ],
    weaknessTags: [
      { text: 'vulnerable to harm', hint: 'Your companion can be hurt to get to you.' },
      { text: 'has its own agenda', hint: 'It may pursue its own goals over yours.' },
      { text: 'can be taken from me', hint: 'Enemies can capture or separate it from you.' },
    ],
    motivationExample: 'My ritual to maintain my bond with [companion name] is…',
  },
  {
    type: 'Esoterica',
    category: 'mythos',
    description:
      'You possess hidden knowledge — occult lore, forgotten rites, or forbidden techniques drawn from your Source.',
    powerTags: [
      { text: 'hidden knowledge', hint: 'Invoke when secret lore answers the question at hand.' },
      { text: 'occult ritual', hint: 'Invoke to perform a rite that bends the mythic layer.' },
      { text: 'sees the unseen', hint: 'Invoke to perceive spirits, wards, or hidden truths.' },
      { text: 'manipulates the unreal', hint: 'Invoke to reshape mythic forces to your will.' },
      { text: 'ancient lore', hint: 'Invoke when forgotten knowledge proves decisive.' },
      { text: 'forbidden technique', hint: "Invoke for a dangerous method others won't dare." },
      { text: 'understands the Source', hint: 'Invoke when deep insight into your Source guides you.' },
      { text: 'reads the mythic layer', hint: 'Invoke to interpret the hidden reality beneath the mundane.' },
    ],
    weaknessTags: [
      { text: 'dangerous to practice', hint: 'Your arts can backfire on you or others.' },
      { text: 'leaves a mark', hint: 'Using your power leaves traces that can be followed.' },
      { text: 'attracts attention from beyond', hint: 'Mythic entities take notice when you act.' },
    ],
    motivationExample: 'My ritual to maintain my connection to [esoteric practice] is…',
  },
  {
    type: 'Exposure',
    category: 'mythos',
    description:
      'A transformative encounter — an event, an entity, or a place — has permanently changed you and left you resonating with a Source.',
    powerTags: [
      { text: 'touched by something greater', hint: 'Invoke when your transformation grants uncanny ability.' },
      { text: 'instinctive resonance', hint: "Invoke when you act on mythic instinct you can't explain." },
      { text: 'transformed perception', hint: 'Invoke to perceive what your changed senses reveal.' },
      { text: 'altered senses', hint: 'Invoke when heightened or strange senses give an edge.' },
      { text: 'channeled power', hint: 'Invoke to unleash the power that flows through you.' },
      { text: 'understands what others cannot', hint: 'Invoke when your changed mind grasps the impossible.' },
      { text: 'the Source recognizes me', hint: 'Invoke when mythic forces treat you as one of their own.' },
      { text: 'drawn to mythic currents', hint: 'Invoke to sense and follow mythic activity.' },
    ],
    weaknessTags: [
      { text: 'never fully the same', hint: 'Your change unsettles others and complicates normal life.' },
      { text: 'the Source calls to me', hint: 'The GM can invoke when the Source pulls you off course.' },
      { text: 'the experience resurfaces', hint: 'Flashbacks or effects of the event can seize you.' },
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
      { text: 'enhanced strength', hint: 'Invoke when augmented muscle overpowers the problem.' },
      { text: 'neural implants', hint: 'Invoke when direct data or reflex boosts help.' },
      { text: 'cybernetic reflexes', hint: 'Invoke for superhuman speed and reaction.' },
      { text: 'reinforced frame', hint: "Invoke to shrug off damage a normal body couldn't." },
      { text: 'embedded systems', hint: 'Invoke to use a tool or weapon built into your body.' },
      { text: 'upgraded senses', hint: 'Invoke when enhanced sight, hearing, or scanning matters.' },
      { text: 'beyond human limits', hint: 'Invoke when a feat past human capacity is needed.' },
      { text: 'integrated hardware', hint: 'Invoke when built-in tech is always available to you.' },
    ],
    weaknessTags: [
      { text: 'maintenance required', hint: 'Neglected implants can fail when you need them.' },
      { text: 'glitches under stress', hint: 'The GM can invoke when your tech malfunctions under pressure.' },
      { text: 'visibly augmented', hint: 'Your obvious mods can mark you or draw scrutiny.' },
    ],
    motivationExample: 'My itch to push my augmentations further is…',
  },
  {
    type: 'Cutting Edge',
    category: 'noise',
    description:
      "You wield prototype and bleeding-edge technology that most people haven't even heard of yet.",
    powerTags: [
      { text: 'prototype tech', hint: 'Invoke when experimental gear does what nothing else can.' },
      { text: 'bleeding-edge gear', hint: "Invoke for a capability rivals don't have yet." },
      { text: 'custom modifications', hint: 'Invoke when your personal tweaks fit the moment.' },
      { text: 'superior capability', hint: 'Invoke when your tech simply outperforms theirs.' },
      { text: 'advanced surveillance', hint: 'Invoke to watch, track, or gather intel unseen.' },
      { text: "tech that shouldn't exist yet", hint: 'Invoke to pull off the seemingly impossible.' },
      { text: 'ahead of the curve', hint: 'Invoke when being one step ahead technologically wins.' },
      { text: 'next-gen loadout', hint: 'Invoke when your cutting-edge kit has the right tool.' },
    ],
    weaknessTags: [
      { text: 'temperamental equipment', hint: 'Unproven tech can act up at the worst time.' },
      { text: 'needs constant power', hint: 'Your gear can run dry and leave you exposed.' },
      { text: 'one-of-a-kind (hard to replace)', hint: "If it's lost or broken, you can't just buy another." },
    ],
    motivationExample: 'My itch for the next advancement in [tech type] is…',
  },
  {
    type: 'Cyberspace',
    category: 'noise',
    description:
      'You navigate the digital realm through a neural interface, wielding code as a weapon and the net as your domain.',
    powerTags: [
      { text: 'neural interface', hint: 'Invoke when jacking directly into systems gives control.' },
      { text: 'system intrusion', hint: 'Invoke to break into networks, locks, or devices.' },
      { text: 'ghost in the network', hint: 'Invoke to move through the net undetected.' },
      { text: 'traces erased', hint: 'Invoke to cover your digital tracks.' },
      { text: 'custom exploit', hint: 'Invoke to deploy a tailor-made hack.' },
      { text: 'deep net access', hint: 'Invoke to reach restricted or buried data.' },
      { text: 'controls the data flow', hint: 'Invoke to reroute, block, or manipulate information.' },
      { text: 'hardened ICE', hint: 'Invoke when your defenses repel a counter-hack.' },
    ],
    weaknessTags: [
      { text: 'vulnerable in meatspace', hint: 'While jacked in, your body is defenseless.' },
      { text: 'leaves digital footprints', hint: 'Your activity can be traced back to you.' },
      { text: 'the system fights back', hint: 'The GM can invoke when ICE or sysops strike back.' },
    ],
    motivationExample: 'My itch to dive deeper into [cyberspace aspect] is…',
  },
  {
    type: 'Drones',
    category: 'noise',
    description:
      'You command a fleet of remote-operated machines — aerial, ground, or aquatic — that extend your reach across the city.',
    powerTags: [
      { text: 'aerial reconnaissance', hint: 'Invoke to scout an area from above.' },
      { text: 'autonomous attack capability', hint: 'Invoke when a drone can strike on its own.' },
      { text: 'remote presence', hint: "Invoke to act somewhere you aren't physically." },
      { text: 'swarm tactics', hint: 'Invoke when many drones overwhelm together.' },
      { text: 'sensor array', hint: 'Invoke to detect, scan, or track with drone sensors.' },
      { text: 'precision strike', hint: 'Invoke for a pinpoint hit from a drone.' },
      { text: 'eyes everywhere', hint: 'Invoke when wide surveillance coverage matters.' },
      { text: 'silent approach', hint: 'Invoke when a drone gets close undetected.' },
    ],
    weaknessTags: [
      { text: 'hardware is fragile', hint: 'Drones are easily destroyed or disabled.' },
      { text: 'susceptible to jamming', hint: 'Signals can be cut, leaving drones useless.' },
      { text: 'collateral risk', hint: 'Drone action can cause damage that blows back on you.' },
    ],
    motivationExample: 'My itch to expand my drone network for [purpose] is…',
  },
]

export const THEME_BOOK_BY_TYPE = Object.fromEntries(
  THEME_BOOK.map(e => [e.type, e])
) as Record<ThemeType, ThemeBookEntry>
