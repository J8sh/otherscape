import type { EssenceKey } from '@/lib/rules'
import type { IEvolution } from '@/types'

/**
 * Reference text for Essence, Moments of Evolution and Veteran Specials —
 * summarized in our own words from the core book (pp. 134–141), so look
 * there for the exact wording.
 */
export const ESSENCE_INFO: Record<EssenceKey, { mix: string; summary: string; special: string }> = {
  NEXUS: {
    mix: 'Self + Mythos + Noise',
    summary: 'You’ve touched every force of the age and adapt to change faster than anyone.',
    special: 'If you’re still a Nexus after you next replace a theme, the new theme starts as a full theme instead of a nascent one.',
  },
  SPIRITUALIST: {
    mix: 'Self + Mythos, no Noise',
    summary: 'You keep tech away from your soul and value the human spirit and its bond with the mythic.',
    special: 'Once per session: add your Mythos to an action powered by Self themes (or Self to a Mythos action) — or, if already rolling with Self or Mythos, roll with both.',
  },
  CYBORG: {
    mix: 'Self + Noise, no Mythos',
    summary: 'Flesh, wires and data — you trust human ingenuity over gods and monsters.',
    special: 'To resist or shake off intangible mythic effects (curses, illusions, mind influence), add your Self and/or your Noise to the Power — each once per session.',
  },
  TRANSHUMAN: {
    mix: 'Mythos + Noise, no Self',
    summary: 'Magic and tech fused, with little humanity left. You live where legend meets cyber.',
    special: 'Once per scene, when an action uses both mythic and technological tags, turn a miss into a mixed hit.',
  },
  REAL: {
    mix: 'Self only',
    summary: 'You stayed yourself. No myth or machine gets to say who you are.',
    special: 'When you act to directly uphold or protect one of your Identities, you may roll with Self instead of counting positive tags.',
  },
  AVATAR: {
    mix: 'Mythos only, one Source',
    summary: 'You and your Source have become one — a living beacon of its legend.',
    special: 'Your Rituals are replaced by a single Agenda; defy it even once and all your themes are replaced. Meanwhile you can recover burned power tags instantly.',
  },
  CONDUIT: {
    mix: 'Mythos only, several Sources',
    summary: 'A vessel for many mythic forces that harmonize and clash inside you.',
    special: 'You may replace themes at will, as long as the new theme is Mythos. Any Source you hold or are near can become a new, full (not nascent) Mythos theme.',
  },
  SINGULARITY: {
    mix: 'Noise only',
    summary: 'You left humanity behind for an existence of pure information.',
    special: 'Psychological and intangible mythic effects don’t affect you. You can interface with any information and roll with Noise to search it — and to change it, if it’s recorded.',
  },
}

export const MOMENTS: { key: keyof IEvolution; label: string; help: string }[] = [
  { key: 'newEssenceType', label: 'Create a new type of Essence', help: 'With the MC, invent a new Essence (and its Special) that fits what your character has become.' },
  { key: 'broadPowerTag', label: 'Create another broad power tag', help: 'Add a second broad tag (one that applies in many situations) to one of your themes. Two is the most a character can have.' },
  { key: 'veteranSpecial1', label: 'Gain a Veteran Special', help: 'Pick a Veteran Special — hard-won expertise only veterans have.' },
  { key: 'veteranSpecial2', label: 'Gain a Veteran Special', help: 'Pick a second Veteran Special.' },
  { key: 'veteranSpecial3', label: 'Gain a Veteran Special', help: 'Pick a third Veteran Special.' },
  { key: 'retirement', label: 'Ride off into the sunset (Retirement)', help: 'Your character leaves the series on terms you choose. Your next character may inherit their upgrades.' },
  { key: 'sunderCosmology', label: 'Sunder the cosmology (Narrative development)', help: 'Make a discovery or change that redefines the series’ world — work it out with the MC.' },
  { key: 'totalReconstitution', label: 'Total Reconstitution (Respec)', help: 'Replace all four themes at once and rebuild; you keep upgrades earned, Evolution points and Moments.' },
]

export const VETERAN_SPECIALS: { name: string; summary: string }[] = [
  { name: 'Backpack Beast', summary: 'Wildcard loadout tags cost you 1 Power instead of 2.' },
  { name: 'Backup Clones', summary: 'Shake off a status that exceeded your Limit — first by next scene, then next downtime, then end of job. Then this Special is spent.' },
  { name: 'Customizable Gear', summary: 'Once per scene, burn one loadout tag to recover another.' },
  { name: 'Experienced Efficiency', summary: 'Once per session, take 5 Power instead of 3 from the downtime Power benefit.' },
  { name: 'God-Slayer', summary: 'Ignore a Scale gap of up to 3 in one kind of interaction (combat, social, magical…), chosen with the MC.' },
  { name: 'Interfacer', summary: 'Learn one useful detail the first time you meet a piece of tech, and recognize anything related to it later.' },
  { name: 'Larger Than Life', summary: 'Ignore a Scale gap of 1 in every action.' },
  { name: 'Level Up Your Game', summary: 'Take 7 upgrades spread across your themes.' },
  { name: 'Not My First Rodeo', summary: 'Once per session, turn a miss into a mixed hit (not on snake eyes).' },
  { name: 'Saw That Coming', summary: 'Once per session, treat incoming Consequences or a Challenge Special as a Threat and take one action to answer it first.' },
  { name: 'Slow & Steady', summary: 'Your upgrade tracks get 5 boxes; filling all 5 grants two upgrades.' },
  { name: 'Source-Sensitive', summary: 'Learn one useful detail the first time you meet a Source, and recognize its Mythos later.' },
  { name: 'The Harder You Fall', summary: 'When one of your weakness tags is invoked, you may take −2 Power instead of −1 and mark 2 upgrade boxes.' },
  { name: 'Willpower Over Chance', summary: 'Snake eyes no longer automatically miss.' },
]
