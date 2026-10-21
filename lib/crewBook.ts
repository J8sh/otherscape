/**
 * Crew theme kits for rapid crew creation (core book pp. 156–157): pick a
 * kit, take its title tag plus two more power tags and one weakness tag,
 * and adopt (or rewrite) its Identity. Crew Specials (p. 155) are
 * summarized in our own words.
 */
export interface CrewKit {
  name: string
  powerTags: string[]
  weaknessTags: string[]
  identity: string
}

export const CREW_KITS: CrewKit[] = [
  {
    name: 'All-Around Fixers',
    powerTags: ['Minerva’s Diner', 'identifying supernatural intrusions', 'powerful clients', 'nondescript sedan', 'tense negotiations', 'the exclusive fixer-only VR domain', 'problem solvers', 'everyone knows their job', 'spectral ammunition'],
    weaknessTags: ['argumentative', 'overly curious', 'Metro Police Detective Unit', 'undercity depths'],
    identity: 'Problems should be solved with minimal blowback.',
  },
  {
    name: 'Elite Specialists',
    powerTags: ['secure apartment base', 'infiltration/exfiltration', 'our handler in a suit', 'Hawk-2 VTOL flier', 'gunning for gunfights', 'old military contacts', 'best of the best', 'follow the leader', 'favors from past clients'],
    weaknessTags: ['overconfidence', 'too quick to act', 'failing core objective', 'fancy parties'],
    identity: 'Do the job, no questions asked.',
  },
  {
    name: 'Community Protectors',
    powerTags: ['Bush St. Library', 'patrol these streets', 'the people who live here', 'know the back alleys by heart', 'home turf', 'nosey neighbors', 'pillars of the community', 'diplomacy first', 'borrowed equipment'],
    weaknessTags: ['small scale operation', 'local rivalries', 'letting down the community', 'the national stage'],
    identity: 'It’s up to us to protect the neighborhood and its people.',
  },
  {
    name: 'Found Family',
    powerTags: ['our shared apartment base', 'handle everyday issues', 'friends and colleagues', 'a converted army van', 'thinking on the spot', 'heard it through the grapevine', 'they won’t see this coming', 'I’m here for you', 'pile of mementos from previous jobs'],
    weaknessTags: ['no common background', 'far too spontaneous', 'old trouble come back to bite you', 'being apart'],
    identity: 'We’re in this together.',
  },
  {
    name: 'Rebellious Street Gang',
    powerTags: ['seedy bar', 'mark our territory', 'underworld suppliers', 'souped up vehicles', 'gang-controlled area', 'word on the street', 'ambitious gangsters', 'gang pride', 'illegal weapons'],
    weaknessTags: ['territorial', 'everyone thinks they’re the boss', 'out of our league', 'wrath of underworld bosses'],
    identity: 'Dominate the streets or be dominated by others.',
  },
  {
    name: 'Source-Hunting Privateers',
    powerTags: ['converted cargo freighter', 'take down Conjurations', 'local contacts & guides', 'bushwhacking', 'hunting down a Source', 'antiquities databases', 'daring', 'haggle our way out of it', 'magic containment box'],
    weaknessTags: ['individual ambitions', 'I think I just stepped on a pressure plate', 'curses', 'firefights vs superior foes'],
    identity: 'Get the Source, get paid!',
  },
  {
    name: 'Source Cabal',
    powerTags: ['forgotten temple', 'researching Mythoi', 'guidance of a deity', 'flight-bestowing Source', 'encounters with gods', 'commune with the beyond', 'protectors of relics', 'collection of Sources', 'blessing of the Source'],
    weaknessTags: ['power hungry', 'distracted by old things', 'Source-snuffing magic', 'Noise-ridden places'],
    identity: 'We must follow the tenets of our Source(s).',
  },
  {
    name: 'Wanted',
    powerTags: ['find temporary accommodation', 'build makeshift weapons', 'enemies of our enemies', 'public transport', 'escape plans', 'stolen databases', 'elusive', 'vigilant', 'counterfeit IDs'],
    weaknessTags: ['always on the move', 'no secure channel of communication', 'the authorities', 'physical restraints'],
    identity: 'Never. Get. Caught.',
  },
]

export const CREW_SPECIALS: { name: string; summary: string }[] = [
  { name: 'Huddle', summary: 'Once per session, one crew member can apply an action that would affect one target to the whole crew instead, ignoring the crew’s Scale.' },
  { name: 'Last Second Leap', summary: 'Once per session, when someone misses, a crewmate who could plausibly help jumps in: the roll becomes a mixed hit, and the helper shares the Consequences (both may mitigate).' },
  { name: 'Sacrifice', summary: 'When several of you face the same Consequences, anyone who could reasonably shield a crewmate may spend their mitigation Power on that crewmate instead of themselves.' },
  { name: 'Strong Bonds', summary: 'In downtime, spending Power on relationship story tags with crewmates gives you 1 extra Power.' },
  { name: 'United By The Cause', summary: 'At the Credit Roll, if the whole crew worked together in one scene in line with the crew’s motivation, remove one Decay from the crew theme.' },
]
