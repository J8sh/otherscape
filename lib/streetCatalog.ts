/**
 * The Street Catalog's general items (core book pp. 252–271): for each
 * category, typical item tags plus features and flaws to mix and match.
 * The book also lists specific named products with descriptions — look
 * those up there. Loadout Specials (p. 253) are summarized in our own words.
 */
export interface CatalogCategory {
  name: string
  page: number
  groups: { label: string; tags: string[] }[]
  features: string[]
  flaws: string[]
}

export const STREET_CATALOG: CatalogCategory[] = [
  {
    name: 'Access & Perks', page: 254,
    groups: [{ label: 'Items', tags: ['blackmail material', 'bribed bouncer', 'building schematics', 'VIP area access'] }],
    features: ['group pass', 'hard-to-trace source', 'status symbol'],
    flaws: ['conspicuous', 'recurring fees', 'unverified'],
  },
  {
    name: 'Ammo', page: 255,
    groups: [{ label: 'Items', tags: ['adhesive rounds', 'armor-piercing ammo', 'explosive cartridges', 'extra clip', 'high stopping power ammo', 'hollow points', 'non-lethal rounds', 'speed loader', 'tracer rounds'] }],
    features: [],
    flaws: ['contains duds', 'easy to misplace', 'heavy', 'highly volatile', 'slow to reload'],
  },
  {
    name: 'Apps, Chips & Databases', page: 256,
    groups: [{ label: 'Items', tags: ['cheap Harnessing app', 'Epis office tools', 'KOCMOC [mundane skill] chip', 'most wanted database'] }],
    features: ['adaptive design', 'insta-loader', 'memory saver', 'smart search'],
    flaws: ['distracting notifications', 'doesn’t play well with others', 'glitchy', 'memory guzzler'],
  },
  {
    name: 'Armor', page: 257,
    groups: [{ label: 'Items', tags: ['arctic survival jumpsuit', 'bullet-proof vest', 'corpwear armored suit', 'fire-retardant suit', 'reinforced duster', 'threat scanner'] }],
    features: ['armored gloves', 'ballistic inserts', 'helmet', 'hidden pouch', 'inconspicuous', 'riot shield'],
    flaws: ['ablative', 'heavy', 'susceptible to [attack type]'],
  },
  {
    name: 'Body Attachments & Cybernetics', page: 258,
    groups: [{ label: 'Items', tags: ['aesthetic appendage', 'blood toxin filters', 'boosted nervous system', 'brain accelerator', 'built-in Harnessing console', 'comms implant', 'cyber ears', 'cyber eyes', 'cyber legs', 'cyber tail', 'cyber wings', 'cyberarm', 'exo-skeleton', 'extra limbs', 'face-altering mesh', 'hand-eye link', 'internal scanner array', 'neural link', 'neural visor'] }],
    features: ['appears organic', 'durable materials', 'EMP shielding', 'firmware updates', 'high-end software', 'impressive', 'internal firewall', 'long battery life', 'powerful servo-motors', 'reliable', 'retractable [weapon or device]'],
    flaws: ['draws attention', 'glitchy', 'heavy', 'neural noise', 'scar tissue', 'unwieldy'],
  },
  {
    name: 'Cyberspace', page: 260,
    groups: [
      { label: 'Software', tags: ['brute force app crasher', 'code analyzer', 'comms tap', 'credentials forger', 'decryptor app', 'deepfake app', 'firewall', 'firewall buster', 'hacker brain-fryer', 'malcode remover', 'proxy service', 'security-disabling virus', 'source tracer & locator'] },
      { label: 'VR models', tags: ['[object]-shaped VR construct', '[persona]-shaped avatar', 'environment editor', 'VR clone tool', 'VR invisibility app', 'VR shield', 'VR weapon'] },
      { label: 'Hardware', tags: ['“anywhere” satlink', 'comms implant', 'computing device', 'crystal-state datadrive', 'custom carryall', 'datapad', 'electronics workbench', 'Harnessing console', 'neural net', 'signal jammer', 'surge protector', 'VR goggles'] },
    ],
    features: ['fast loading', 'innocuous signature', 'low requirements', 'robust coding', 'burner', 'EMP shielding', 'heatsink coolant rig', 'integrated firewall', 'lots of RAM'],
    flaws: ['consumes resources', 'easily traced', 'glitchy', 'illegal', 'signature code', 'takes a moment to load', 'easily overheats', 'janky graphics', 'one generation behind', 'phantom signals', 'weak battery'],
  },
  {
    name: 'Drones', page: 262,
    groups: [{ label: 'Items', tags: ['android assistant', 'carrier drone', 'surveillance drone'] }],
    features: ['anthroform', 'auto-stabilization', 'long battery life'],
    flaws: ['easily damaged', 'hardcoded', 'stiff controls'],
  },
  {
    name: 'Enhancers', page: 263,
    groups: [{ label: 'Items', tags: ['downer', 'focuser', 'upper'] }],
    features: ['heightened reflexes', 'numbing', 'undetectable'],
    flaws: ['addictive', 'illegal', 'trippy'],
  },
  {
    name: 'Garments & Fashion', page: 264,
    groups: [{ label: 'Items', tags: ['[corp] uniform', '[subculture garment]', 'electrifying cape', 'fashionable outfit', 'gang jacket', 'hoverboots', 'nightlife wardrobe', 'security uniform', 'telescopic eyewear', 'video-rig necklace'] }],
    features: ['authentic', 'blend in the crowd', 'grab attention', 'hidden pockets', 'integrated scanner', 'luxurious', 'weather-resistant'],
    flaws: ['expensive', 'flimsy', 'limited motion', 'requires recharging'],
  },
  {
    name: 'Merc Gear', page: 265,
    groups: [{ label: 'Items', tags: ['army knife', 'concealed holster', 'corrosive acid canister', 'first aid kit', 'gas mask', 'holo projector', 'kitbag', 'polymer rope', 'rebreather', 'repair kit', 'secured data stick', 'structural scanner'] }],
    features: ['durable', 'easily concealable', 'extra supplies', 'light'],
    flaws: ['breaks easily', 'cumbersome', 'exhausting', 'poor quality', 'requires setup', 'runs out easily', 'slow operation', 'unwieldy'],
  },
  {
    name: 'Source-Touched Items', page: 266,
    groups: [{ label: 'Items', tags: ['blessed water', 'flight-giving feather', 'ghost-appeasing chant', 'girdle of giant’s strength', 'good luck talisman', 'invisibility ring', 'ironskin salve', 'locator spell', 'lulling lyre', 'magebane dagger', 'monster-slaying ointment', 'silent-kill whetstone', 'spider-climbing charm', 'spirit-binding salt', 'suit of beguilement', 'wristband of flames', 'wyvern blood rejuvenating shot'] }],
    features: ['discreet', 'long lasting', 'stronger [at time / in place / if condition]', 'stronger against [being]', 'stronger against mundane', 'stronger against tech'],
    flaws: ['activated with blood', 'attracts [being]', 'easy to dispel', 'needs recharging', 'noticeable', 'only works [at time / in place / if condition]'],
  },
  {
    name: 'Vehicles', page: 268,
    groups: [{ label: 'Items', tags: ['chopper', 'gyrocycle', 'hand glider', 'hover car', 'hoverboard', 'jet ski', 'parachute', 'personal aircraft', 'rusty ground car'] }],
    features: ['armored', 'firewalled', 'jet fuel injection system', 'neural piloting'],
    flaws: ['accident-prone', 'guzzler', 'poor handling', 'stolen'],
  },
  {
    name: 'Weapons', page: 269,
    groups: [
      { label: 'Firearms', tags: ['assault rifle', 'heavy pistol', 'hunting rifle', 'machine-pistol', 'minigun', 'pocket pistol', 'rail gun', 'revolver', 'shotgun', 'sniper rifle', 'submachine gun', 'tactical rifle', 'taser'] },
      { label: 'Cold weapons', tags: ['army knife', 'baton', 'bayonet', 'broadsword', 'ceremonial dagger', 'composite bow', 'crossbow', 'garrote', 'katana', 'knucklebuster', 'morningstar', 'rescue ax', 'shurikens', 'spear', 'staff', 'whip'] },
      { label: 'Explosives', tags: ['[frag/stun/smoke/sleep gas] grenades', 'airstrike laser pointer', 'anti-personnel mine', 'grenade launcher', 'rocket launcher'] },
    ],
    features: ['custom-made', 'defensive', 'easily concealed', 'extreme range', 'full-auto', 'hairtrigger', 'high caliber bullet', 'intimidating', 'IR sight', 'large magazine', 'mono-molecule edge', 'quick reload', 'smart targeting', 'telescopic sight', 'unarmored targets', 'untraceable', 'wide spread'],
    flaws: ['cheap make', 'cumbersome', 'inaccurate', 'often jams', 'tends to rust', 'unwieldy'],
  },
]

export const LOADOUT_SPECIALS: { name: string; summary: string }[] = [
  { name: 'Deeply Customizable', summary: 'Pick one item. Once per downtime, add a loadout tag for a feature or add-on of that item that helps in specific situations.' },
  { name: 'Fully Decked', summary: 'Pick a Street Catalog category: all of its tags go into your loadout theme, ready to Load Up. Can be taken again for other categories.' },
  { name: 'Got A Spare?', summary: 'Once per session, copy a Loaded Up tag for a non-unique item and hand the copy to a crewmate or ally, keeping yours.' },
  { name: 'Modded Out', summary: 'Once per session, when you roll with 3+ positive loadout tags from the same item, upgrade the result one step (miss → mixed, mixed → strong).' },
  { name: 'Repurpose', summary: 'Once per job (between Loading Up and Loading Off), rewrite one Loaded Up tag; the new version sticks.' },
  { name: 'Return Policy', summary: 'Once per downtime, swap one loadout tag for a different one.' },
  { name: 'Spread the Wealth', summary: 'Crewmates can use your relevant power tags when they act to procure new loadout items (not the same tag in simultaneous procurements).' },
  { name: 'Synergetic Gear', summary: 'Once per session, when you roll with 3+ positive loadout tags from different items, upgrade the result one step (miss → mixed, mixed → strong).' },
]
