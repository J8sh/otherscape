import type { ThemeCategory, ThemeType } from '@/types'

/**
 * A Theme Kit is a ready-made preset for a themebook: its name doubles as
 * the theme's title tag (the theme's main focus), plus a curated set of
 * supporting power tags, weakness tags, and a premade Identity / Ritual /
 * Itch line — transcribed from the :OTHERSCAPE core book's rapid character
 * creation theme kit lists (112 kits across 14 themebooks).
 */
export interface ThemeKit {
  /** Doubles as the theme's title tag. */
  name: string
  powerTags: string[]
  weaknessTags: string[]
  /** Premade Identity (self) / Ritual (mythos) / Itch (noise) line. */
  identity: string
}

export interface ThemeBookEntry {
  type: ThemeType
  category: ThemeCategory
  description: string
  kits: ThemeKit[]
}

/** A theme is built as: 1 title tag (the chosen kit) + exactly this many
 * supporting power tags + exactly this many weakness tags. */
export const REQUIRED_SUPPORTING_TAGS = 2
export const REQUIRED_WEAKNESS_TAGS = 1

export const THEME_BOOK: ThemeBookEntry[] = [
  // ── SELF ─────────────────────────────────────────────────────────────────
  {
    type: 'Affiliation',
    category: 'self',
    description:
      'You belong to a group, organization, or crew whose backing and codes define a part of who you are.',
    kits: [
      {
        name: 'Criminal Syndicate',
        powerTags: ['respect in the underworld', 'body disposal', 'shady dealings', 'bust a few kneecaps', 'stolen or illegal equipment', 'police payoffs', 'mentored by the boss', 'underground clubs', 'professional bruiser'],
        weaknessTags: ['keep pulling me back in', 'surveilled by the police', 'questioning the violence', 'ostentatious with money'],
        identity: 'Keep it in the family.',
      },
      {
        name: 'Corporate Citizenship',
        powerTags: ['expense account', 'PR training', 'tight-lipped', 'managing a team', 'company vehicle', 'legal protection', 'high social status', 'water cooler rumors', 'brand loyalty'],
        weaknessTags: ['monitored by the company', 'work rival', 'fake smile', 'corporate logo tattoo'],
        identity: 'The company is always right.',
      },
      {
        name: 'Forbidden Cult',
        powerTags: ['access to occult tomes', 'hide my intentions', 'mysterious air', 'quiet contemplation', 'room and board', 'ancient fighting techniques', 'spiritual conviction', 'herb garden', 'self-sacrifice'],
        weaknessTags: ['defer to cult leaders', 'rival cult', 'overzealous', 'known spiritual mark'],
        identity: 'Trust in the creed.',
      },
      {
        name: 'Counterculture',
        powerTags: ['tight-knit clique', 'expressive art', 'defiance of the mainstream', 'looking cool', 'underground VR/AR technology', 'couch surfing', 'artistic conviction', 'knows the coolest hangouts', 'courage to be myself'],
        weaknessTags: ['mainstream activities', 'too weird for most people', 'reject newcomers', 'obvious affectations'],
        identity: 'Mainstream is for the mindless.',
      },
      {
        name: 'Neighborhood Hero',
        powerTags: ['everyone knows my name', 'back alley brawler', 'standing up for the little people', 'patrol the streets', 'borrowed tools', 'unassailable reputation', 'kin in these parts', 'knows how to party', 'role model for kids'],
        weaknessTags: ['nosy neighbors', 'gang members', 'constantly lending money', 'too many admirers'],
        identity: 'Never forget your roots.',
      },
      {
        name: 'Hacker Collective',
        powerTags: ['tech support', 'cracking software', 'synchronized hacking runs', 'constantly online', 'custom-built harness rig', 'anonymous cyberspace avatar', 'fellow nerds', 'pirate gaming domains', 'here for the underdog'],
        weaknessTags: ['constant alerts', 'hacker rival', 'obsessed with security', 'on cybersecurity watchlists'],
        identity: 'Information wants to be free.',
      },
      {
        name: 'Law Enforcement',
        powerTags: ['position of authority', 'weapons training', 'cooperate with corps', 'patrolling', 'badge and gun', 'friends on the force', 'driven to investigate', 'cop bars', 'look the other way'],
        weaknessTags: ['domineering captain', 'targeted by criminals', 'excessive use of force', 'in uniform'],
        identity: 'Serve and protect.',
      },
      {
        name: 'Street Gang',
        powerTags: ['street cred', 'streetwise instincts', 'we control these streets', 'moving illicit goods', 'high capacity weapons', 'gang up on rivals', 'lifelong criminal', 'flashy vehicle', 'willing to kill'],
        weaknessTags: ['addicted to our own merchandise', 'police investigations', 'pointless rivalries', 'gang colors'],
        identity: 'Snitches get stitches.',
      },
    ],
  },
  {
    type: 'Assets',
    category: 'self',
    description:
      'You possess material resources — money, gear, property, or contacts — that you leverage to survive and succeed.',
    kits: [
      {
        name: 'Explosives',
        powerTags: ['programmable detonator', 'corrosive gel', 'anti-personnel shrapnel', 'design bigger shockwave', 'precision demolition', 'disarming bombs', 'stable-state container', 'unsuspecting target', 'grenade belt'],
        weaknessTags: ['takes time to set up', 'draws a lot of attention', 'faulty detonator', 'flexible structures'],
        identity: 'Being loud is the only way to be heard.',
      },
      {
        name: 'Code Arsenal',
        powerTags: ['firewall crasher', 'howitzer distributed attack', 'streamlined to run fast', 'rapid code writing', 'onslaught a domain', 'quick to reload', 'fortified personal firewall', 'first use against this target', 'feedback barrier software'],
        weaknessTags: ['requires powerful hardware', 'using the same exploit twice', 'overlooked bugs', 'not very sneaky'],
        identity: 'Off-the-shelf solutions are for amateurs.',
      },
      {
        name: 'Guns & More Guns',
        powerTags: ['zephyr assault rifle', 'sawed-off shotgun', 'extended magazines', 'firearm marksmanship', 'source-harming ammo', 'gun cleaning kit', 'hidden firearm', 'prolonged shootouts', 'two guns at once'],
        weaknessTags: ['obviously armed', 'weapon jam', 'innocent bystanders', 'silent kills are harder'],
        identity: 'Good offense begins with self defense.',
      },
      {
        name: 'Heist Gear',
        powerTags: ['safe-cracking device', 'rappelling equipment', 'frictionless and silent', 'avoid being noticed', 'security system override', 'no-evidence self-melting tools', 'pocket-packed utility suit', 'had good intel', 'holographic map projector'],
        weaknessTags: ['expensive equipment', 'unintended signature', 'rappelling rope breaks', 'delicate and fragile'],
        identity: 'Never return to the scene of the crime.',
      },
      {
        name: 'Money to Burn',
        powerTags: ['lavish real-estate', 'tradable finance info', 'untraceable transactions', 'impeccable taste', 'bedazzle with luxury', 'lawyers and accountants', 'cutting-edge security system', "it's only money", 'flashy vehicle'],
        weaknessTags: ['illiquid funds', 'no concept of hardship', 'target of a heist', "things money can't buy"],
        identity: 'Money can solve any problem.',
      },
      {
        name: 'Junk Collection',
        powerTags: ['20th century memorabilia', 'bygone gizmos', 'designed to distract', 'eye for quality', 'historic lore dump', 'bring life to old tech', 'antiquities shop', 'too old to hack', 'rube goldberg machine'],
        weaknessTags: ['unexpectedly breaks down', 'hoarder', 'greedy & envious', "can't be taken seriously"],
        identity: 'Treasure the lost and the forgotten.',
      },
      {
        name: 'Motorcycle',
        powerTags: ['powerful engine', 'high-traction wheels', 'armored windshield', 'stunt driving', 'slide under obstacles', 'mechanic friend', 'wheel blades', 'speed advantage', 'jumps & flips'],
        weaknessTags: ['noisy vehicle', 'obnoxious showoff', 'low on fuel', 'slippery road'],
        identity: 'I slow down for no one.',
      },
      {
        name: 'Safehouse',
        powerTags: ['one in every city', 'surveillance system', 'escape hatch', 'lay low', 'lose a tail', 'trustworthy staff', 'inconspicuous location', 'a place to heal and recover', 'sniper nest'],
        weaknessTags: ['requires subtlety', 'neglected for too long', 'too remote for backup', 'easily overwhelmed'],
        identity: "There's no place like home.",
      },
    ],
  },
  {
    type: 'Expertise',
    category: 'self',
    description:
      'Years of training and professional experience have made you exceptionally skilled in your field.',
    kits: [
      {
        name: 'Gunslinger',
        powerTags: ['quickdraw', 'trusty sidearm', 'trick shots', 'suppressive fire', 'weapons dealers', 'legendary reputation', 'always packing a gun', 'study my target', 'smart weapon'],
        weaknessTags: ['trigger-happy', 'no line of sight', "don't get too close", 'not enough firepower'],
        identity: 'I have to be the best in the game.',
      },
      {
        name: 'Covert Agent',
        powerTags: ['read a room', 'lockbreaker device', 'extract information', 'backup cover', 'access to intel database', 'high level clearances', 'emotional detachment', 'don a disguise', 'surveillance takeover device'],
        weaknessTags: ['paranoid', 'going "off script"', 'personal attachment', 'doublecrossed'],
        identity: "Don't get attached.",
      },
      {
        name: 'Impressive Physique',
        powerTags: ['brute strength', 'form-fitting clothing', 'peak human stamina', 'avoid an injury', 'my gymrats', 'gold medal winner', 'no pain no gain', 'training regime', 'bioware muscle enhancers'],
        weaknessTags: ['easily bruised ego', 'unsteady footing', 'alternative beauty ideals', 'my strength used against me'],
        identity: 'My body is my temple.',
      },
      {
        name: 'Investigator',
        powerTags: ['notice small details', 'voice analysis software', 'read body language', 'better on my own', 'bribed street informants', 'P.I license', 'trust my gut', 'research suspects', 'analytical brain aug'],
        weaknessTags: ['cynical', 'red tape', 'fall for sob stories', 'too nosy for my own good'],
        identity: "Everyone's a rat, if you know where to squeeze.",
      },
      {
        name: 'Ruthless Executive',
        powerTags: ['business instincts', 'bulletproof business suit', 'project confidence', 'divert blame', 'stakeholder network', 'company perks', 'exploit leverage', 'focus-enhancing pills', 'hostile takeover'],
        weaknessTags: ['utility focused', 'my superiors', 'underestimated upstart', 'mistrusted by the have-nots'],
        identity: 'Keep your eyes on the bottom line.',
      },
      {
        name: 'Med Techie',
        powerTags: ['stabilize the wounded', 'high tech doc bag', 'resuscitate the flatlined', 'grace under pressure', 'back alley clinics', 'medical services pass', 'diagnose symptoms on sight', 'stock up on med supplies', '3D organ printer'],
        weaknessTags: ['overlook danger', 'too many patients', 'sloppy patch job', 'violent patients'],
        identity: 'Only subscribed customers get medical help!',
      },
      {
        name: 'Tinkerer',
        powerTags: ['modifying devices', 'toolbox', 'reverse engineering', 'spare parts', 'tech suppliers', 'certified technician', 'anything can be rebuilt', 'study a piece of tech', 'nanite circuitry reconstructor spray'],
        weaknessTags: ['obsessed with technology', 'too little to work with', "fixes what's not broken", 'unexpected side effects'],
        identity: 'I can make it work, trust me.',
      },
      {
        name: 'Trained Killer',
        powerTags: ['stealthy attacks', 'favorite weapon', 'clean kills', 'disarming attack', 'organized criminals', 'professional reputation', 'finish the job', 'take aim', 'AR shadow bomb'],
        weaknessTags: ['nihilistic', 'well-guarded targets', 'downplay collateral damage', 'the undead and undying'],
        identity: 'Honor the contract to the letter.',
      },
    ],
  },
  {
    type: 'Horizon',
    category: 'self',
    description:
      'You are driven by a powerful vision, ideal, or goal that gives your life direction and meaning.',
    kits: [
      {
        name: 'Attain Enlightenment',
        powerTags: ['enter a trance state', 'pure intentions', 'question physical appearances', 'philosophical discussions', 'unseen by demons', 'martial arts training', 'open to new experiences', 'pray to angels or devas', 'find nonviolent solutions'],
        weaknessTags: ['vow of [poverty, chastity, etc.]', 'demons of desire', 'soft-hearted', 'no social circles'],
        identity: 'I seek nothing but the truth.',
      },
      {
        name: 'Eliminate Corruption',
        powerTags: ['follow the money', 'surveillance van', 'garner media attention', 'healthy paranoia', 'too inconsequential to find', 'voice modulator', 'strong moral compass', 'victims and witnesses', 'remain distant and obscure'],
        weaknessTags: ['angry power players', 'bribed officials', 'tunnel vision', 'failing love life'],
        identity: 'Corruption is a disease, and it must be cured.',
      },
      {
        name: 'Break the System',
        powerTags: ['spot systemic failures', 'online activism', 'exploit bureaucracy', 'intervene against oppression', 'one voice out of many', 'implanted recording devices', 'unwavering determination', 'fellow malcontents', 'persistence pays'],
        weaknessTags: ['outside the system', 'collaborators and informers', 'easily riled up', 'lack of sleep'],
        identity: 'Our only hope is to bring the system down.',
      },
      {
        name: 'Exact Revenge',
        powerTags: ['dogged pursuit', 'meticulously detailed enemy list', 'make it hurt', 'outsmart their defenses', 'weapons room', 'subdermal armor implants', 'burning fury', 'other victims', 'fear is a potent weapon'],
        weaknessTags: ['death wish', 'innocent bystanders', 'driven mad by wrath', 'lonely'],
        identity: "I'll only have peace when they're dead.",
      },
      {
        name: 'Get Rich & Famous',
        powerTags: ['think big', 'notable online presence', "piggyback off other's success", 'lie when necessary', 'opulent residence', 'surgically enhanced beauty', 'desire for dominance', 'assistants and proteges', 'image is everything'],
        weaknessTags: ['humiliation is guaranteed', 'haters', 'sociopath', 'stressful lifestyle'],
        identity: 'Do what it takes to get to the top.',
      },
      {
        name: 'Explore the Hidden Places',
        powerTags: ['climbing and rappelling', 'old maps', 'take the plunge', 'make local allies', 'nooks and crevices', 'dark-vision cybereyes', 'insatiable curiosity', 'scholars and collectors', 'recognize environmental warning signs'],
        weaknessTags: ['often gets lost', 'rival delvers', 'eccentric', 'aching joints'],
        identity: 'Every dark corner hides a secret worth discovering.',
      },
      {
        name: 'Live Honorably',
        powerTags: ['strong moral sense', 'book of proverbs', 'help those in need', 'challenge the dishonorable', 'meditative space', 'anti-toxin blood filters', 'lead by example', "people I've helped", 'we can talk it out'],
        weaknessTags: ['no fun', 'no clear moral answer', 'inflexible', 'intolerant of the dishonorable'],
        identity: 'I must do the right thing.',
      },
      {
        name: 'Push Technology Further',
        powerTags: ['elevator pitch', 'scan & design holo-drone', 'turn things up to 11', 'override manufacturer safeties', 'keep inventions secret', 'toolkit cyberhand', 'laser-focused process', 'interdisciplinary engineers', 'build on past failures'],
        weaknessTags: ['overreliance on technology', 'my own lack of foresight', 'sentimental about certain devices', 'downplays safety'],
        identity: 'Nothing should stand in the way of progress.',
      },
    ],
  },
  {
    type: 'Personality',
    category: 'self',
    description:
      'Your defining personal traits — your charisma, wit, empathy, or force of will — set you apart.',
    kits: [
      {
        name: 'Meticulous Planner',
        powerTags: ['minimize risks', 'pleasantries & formalities', 'alert to emergencies', 'keen eye for weaknesses', 'well-maintained gear', 'dependable', 'contingency plans', 'definitely packed a spare', 'ready to handle chaos'],
        weaknessTags: ['agents of chaos', "can't change course", 'no time to think', 'slobs'],
        identity: 'Plan your work and work your plan.',
      },
      {
        name: 'Caregiver',
        powerTags: ['strong sense of empathy', 'natural mentor', 'notice the needy', 'pillar of the community', 'carries delicious snacks', 'always where needed', 'history of adversity', 'dermal medicine injector', 'righteous anger'],
        weaknessTags: ['selfish people', 'patronizing', "can't help them all", 'places devoid of humanity'],
        identity: "I'm here for you.",
      },
      {
        name: 'Keeper of Secrets',
        powerTags: ['naturally inquisitive', 'knows something about everyone', "can tell when they're lying", 'secret passages and codes', 'mysterious', 'files full of evidence', 'secretly compassionate', 'truth serum', 'closed off'],
        weaknessTags: ['people feel invaded', 'evokes distrust', 'when they hold my secrets', 'people without secrets'],
        identity: 'A secret is a trophy and a currency in one.',
      },
      {
        name: 'Performer',
        powerTags: ['fake it till you make it', 'entertaining', "see others' masks", 'fans and followers', 'gorgeous outfits', 'captivating presence', 'highly athletic', 'make-up kit', 'controlled composure'],
        weaknessTags: ['critics', 'a well-known face', 'honest interactions', 'paparazzi'],
        identity: 'They will see what I want them to see.',
      },
      {
        name: 'Thrillseeker',
        powerTags: ['thrive on fear', 'stories to tell', 'remarkable instincts', 'always get out alive', 'well-used helmet', 'exciting to be around', 'plan my stunts', 'grappling gun', 'laugh maniacally'],
        weaknessTags: ['cowards', 'in too deep', 'the game is rigged', 'sitting still'],
        identity: 'I only feel alive on the edge.',
      },
      {
        name: 'Rebel Without a Cause',
        powerTags: ["couldn't care less", 'stir up trouble', 'see through the bullshit', 'stand up for myself', 'dangerous vehicle', "say what others can't", 'has a soft side', 'leather jacket', 'never back down'],
        weaknessTags: ['authority figures', 'big mouth', 'fancy social engagements', 'loss of freedom'],
        identity: "I'll never be another cog in the machine!",
      },
      {
        name: 'Tough as Nails',
        powerTags: ['been through it all', 'intimidating', 'expecting the worst', 'ultimate survivor', 'padded clothing', 'rugged charm', 'worked unusual jobs', 'electro knuckle buster', 'brace for the pain'],
        weaknessTags: ['peppy and chipper people', 'underestimate threats', 'gentleness', 'naivete'],
        identity: "I've been through so much nothing can defeat me now.",
      },
      {
        name: 'Trendsetter',
        powerTags: ['free thinker', 'inspirational speeches', 'analyze popularity potential', 'keep others on their toes', 'latest gadget', 'magnetic charisma', 'draws confidence from the crowd', 'newsfeed implant', 'first to jump in'],
        weaknessTags: ['those who fear change', 'premature statements', 'lack of competition', 'banality'],
        identity: "What's big is what I say is big.",
      },
    ],
  },
  {
    type: 'Troubled Past',
    category: 'self',
    description:
      'A dark chapter of your history — trauma, crime, loss — has hardened you and left its mark.',
    kits: [
      {
        name: 'Disaster Survivor',
        powerTags: ['endure the elements', 'squeeze through tight spaces', 'cut losses', 'careful footing', 'affinity to first responders', 'oxygen mask', 'keep my cool', 'disaster alertness', 'eco-terrorist'],
        weaknessTags: ['phobic of [fire, water, heights, etc.]', 'trouble breathing', 'overly cautious', 'extreme environmental conditions'],
        identity: 'Nature should be respected and feared.',
      },
      {
        name: 'Escaped Servitude',
        powerTags: ['resilient', 'bypass security systems', 'makeshift weapons', "laborer's strength", 'camaraderie with the oppressed', 'my old bindings', 'speak truth to power', 'see unspoken power structures', 'liberate others'],
        weaknessTags: ['bounty hunters', 'laser fence burns', 'mistrustful of leaders', 'being bound'],
        identity: 'Remain free.',
      },
      {
        name: 'Tragic Loss',
        powerTags: ['nothing hurts more than this', 'sorrowful kindness', 'bringer of retribution', 'shield others with my body', 'found family', 'inherited weapon', 'remember the good times', 'family secrets', 'make myself the target'],
        weaknessTags: ['pangs of longing', 'haunted by their ghost (literally)', 'recklessness', 'ending a life'],
        identity: "I'll never feel the way I did with them.",
      },
      {
        name: 'Raised in Cyberspace',
        powerTags: ['master of multitasking', 'always online', 'cyberspace combatant', 'micro-transmitter implant', 'my hivemind community', 'a million avatar skins', 'try new experiences', 'navigate the spirals', 'resist neural impulses'],
        weaknessTags: ['they call to me via AR', 'meatspace nausea', 'short attention span', 'seeing someone jacked in'],
        identity: 'I only know my virtual self.',
      },
      {
        name: 'Survived the Streets',
        powerTags: ['situational awareness', 'dealmaker', 'pickpocketing', 'savage when cornered', 'illegally-modified [choose cybernetic]', 'underworld mentor', 'intimidating facial scar', 'de-escalate with humor', 'gang politics'],
        weaknessTags: ['the gang wants me back', 'malfunctioning replacement organs', "won't back down", 'back in the old neighborhood'],
        identity: 'Life is hard – learn to survive.',
      },
      {
        name: 'Science Experiment',
        powerTags: ['resistance to pain', 'designed to [choose purpose]', 'psychic blast', 'cybernetic [choose limb/organ]', 'abnormal outcasts', 'a picture of me from before', 'let out the rage', 'body modification methods', 'rescue missions'],
        weaknessTags: ['chased by the corp', 'programmed to [choose purpose]', 'afraid of my own strength', 'clinical locations'],
        identity: "I'm a freak, I'm a monster.",
      },
      {
        name: 'Target of the Government',
        powerTags: ['navigate bureaucracies', 'cautious in cyberspace', 'dangerously desperate', 'facial reconstruction', 'friends in low places', 'government secrets', 'smoke break', 'blackmail material', 'hide my identity'],
        weaknessTags: ['hunted', 'nervous twitch', 'no trust in authority', 'vehicle chases'],
        identity: "I'm a dead man walking.",
      },
      {
        name: 'Victim of Otherworldly Forces',
        powerTags: ['unfazed by the unnatural', 'recognise the supernatural', 'press on their vulnerabilities', 'covered in warding tattoos', 'exorcism', 'monster hunter allies', 'finger of a fae lord', 'my mind is my own', 'knowledge of the occult'],
        weaknessTags: ['curse of bad luck', "scars that won't heal", 'superstitious', 'creatures like the one who took me'],
        identity: 'These monsters need to be put down.',
      },
    ],
  },

  // ── MYTHOS ───────────────────────────────────────────────────────────────
  {
    type: 'Artifact',
    category: 'mythos',
    description:
      'A powerful object — weapon, relic, or tool — is bound to you and channels your mythic Source.',
    kits: [
      {
        name: "Hero's Sword",
        powerTags: ['cuts through anything', 'unbreakable steel', 'unflinching', 'masterful swordplay', 'cut through barriers', 'intuitive parry', 'wreathed in [choose type of energy]', "hero's physique", 'heroic soul'],
        weaknessTags: ["won't attack the innocent", 'bound to the will of the gods', 'showing indecisiveness', 'easy to provoke'],
        identity: 'I must stand up to the forces of evil.',
      },
      {
        name: "Risk-Taker's Luck Charm",
        powerTags: ['games of luck', 'protection from accidents', 'devil may care attitude', 'lucky shot', 'last minute escape', 'steadiness and grace', 'share the luck', 'turn rags to riches', 'fearless'],
        weaknessTags: ['fortunate foe', 'hexes and curses', "people to whom I'm indebted", 'capricious'],
        identity: 'I must take a chance when it presents itself.',
      },
      {
        name: 'Invisibility Helm',
        powerTags: ['pierce illusions', 'incorporeality', "spy's insights", 'backstabber', 'slip through crowds', 'turns on when in danger', 'hide my thoughts', 'disguised as headgear', 'sneaky'],
        weaknessTags: ['supernatural senses', 'direct sunlight', 'authentic expression', 'feels invincible when invisible'],
        identity: 'I must cleverly disguise my motives and ways.',
      },
      {
        name: 'Mask of the Trickster God',
        powerTags: ["steal someone's visage", 'appear as their loved ones', 'godly cleverness', 'baffle with riddles', 'create a distraction', "fool's retort", 'curse the arrogant', 'melds with my face', 'thrives in chaos'],
        weaknessTags: ['agents of law', 'retribution of other gods', 'taking responsibility', 'too messy'],
        identity: 'I must spread chaos wherever I go.',
      },
      {
        name: 'Possessed Vehicle',
        powerTags: ['impossible stunts', 'make the rider undead', 'sense the sinful', 'spew fire & brimstone', 'unnatural speed', 'self-driving murder machine', 'unleash a soul-chilling shriek', 'transform into a nightmare steed', 'daredevil attitude'],
        weaknessTags: ['the dead', 'anything holy', 'squirmish rider', 'trail of burnt debris'],
        identity: 'I must refuel it with devoured souls.',
      },
      {
        name: "War God's Armor",
        powerTags: ['aura of glory', 'impervious to mundane weapons', "warrior's instincts", 'juggernaut of destruction', 'unimpeded in the battlefield', 'reflexive block', 'sustains my body', 'become a weapon', 'battlefield bravery'],
        weaknessTags: ['treacherous allies', 'weak spot', 'showing cowardice', 'violent reputation'],
        identity: 'I must spatter my armor with the blood of my foes.',
      },
      {
        name: 'Scrying Crystals',
        powerTags: ['visions from afar', 'see incoming threats', 'perfect spatial sense', 'I saw your secret', 'divine a path', 'stand watch for me', 'peer into the past', 'open my third eye', 'see the bigger picture'],
        weaknessTags: ['places beyond this earth', 'disrupted by noise', 'refusing to see', 'all is not as it seems'],
        identity: 'I must recharge these crystals at an open place of great altitude.',
      },
      {
        name: "Wizard's Staff",
        powerTags: ['stores magical energies', 'reflexive magic shield', 'magic sensitivity', 'magical explosion', 'flight spell', 'cast spells by itself', 'dragon form', 'astral projection', 'vast magical knowledge'],
        weaknessTags: ['magical beasts', 'overloaded', 'showing ignorance', 'uncontrolled power'],
        identity: 'I must continue to grow my power.',
      },
    ],
  },
  {
    type: 'Companion',
    category: 'mythos',
    description:
      'A loyal ally, familiar, or spirit partner shares your journey and acts as an extension of your Source.',
    kits: [
      {
        name: 'Arcane Construct',
        powerTags: ['impossibly strong', 'heavy lifting', 'armored body', 'provide shelter', 'aggressive punching', 'self-repair', 'anti-magic field', 'inspires mental resolve', 'gentle giant'],
        weaknessTags: ['unclear instructions', 'looks like a weapon', 'unstable terrain', 'indiscriminate force'],
        identity: 'I must feed my creation raw magical energy.',
      },
      {
        name: 'Legendary Sidekick',
        powerTags: ['daredevil', 'scout ahead', 'easy to ignore', 'watches my back', 'coordinated attacks', 'care for my gear', 'a magical backpack', 'serves as my herald', 'eternal loyalty'],
        weaknessTags: ['sulky and cross', 'reflects badly on me', 'weaker when separated', 'overenthusiastic'],
        identity: 'We must leap into danger together.',
      },
      {
        name: 'Guardian Spirit',
        powerTags: ['watchful of danger', 'frightening presence', 'invisible assistant', 'spectral body', 'hex my enemies', 'mend and heal', 'aura of protection', 'link to the spirit world', 'immense spiritual knowledge'],
        weaknessTags: ['fear of inadequacy', 'eerie chill', "another spirit's domain", 'overly protective'],
        identity: 'I must never fail to make a daily offering.',
      },
      {
        name: 'Magical Guide',
        powerTags: ['occult insights', 'magical research', 'unseen and unheard by others', 'deflect spells', 'charge with magical power', 'remove curse or affliction', 'casts minor spells', 'teach me a new spell', 'portal to other realms'],
        weaknessTags: ['insubordination', 'distrust of the occult', 'easily exhausted', 'exacting and critical'],
        identity: "I must follow this guide's instruction to be worthy of their tutelage.",
      },
      {
        name: 'Nature Spirit',
        powerTags: ["nature's vengeance", 'ensnaring foes', 'elemental form [choose an element]', 'destroy man-made objects', "nature's bounty", 'merge with the environment', 'extreme localized weather', 'inspires harmony', 'talk to plants and animals'],
        weaknessTags: ['harming nature', 'predatory countenance', 'pollution', 'about as predictable as the weather'],
        identity: 'I must commune with nature before every major decision.',
      },
      {
        name: 'Tech Gremlin',
        powerTags: ['cause malfunctions', 'analyze machinery', 'invisible to tech', 'weapon misfire', 'knows how to fix too', 'hide inside vehicles', 'electrical overload', 'clever pranks', 'spawn siblings'],
        weaknessTags: ['easily distracted', 'incites malfunction rage', 'biotech', 'tampers with my stuff'],
        identity: 'I must let it tamper with a machine at least once a day.',
      },
      {
        name: 'Supernatural Pet',
        powerTags: ['magically nimble', 'growl at my foes', 'adaptive camouflage', 'natural weapons', 'attack alongside me', 'creature hutch', 'stink spray', 'animal handling', 'enviable companionship'],
        weaknessTags: ['oblivious to my goals', 'poachers', 'neglected care', 'bad time to play'],
        identity: 'I must train my pet dutifully.',
      },
      {
        name: 'Trained Monsters',
        powerTags: ['wreak havoc', 'follow my commands', 'swarm', 'safety in numbers', 'horns, claws, and fangs', 'monster den', 'shapeshifting', 'leader of the pack', 'merge into a big monster'],
        weaknessTags: ['challenged authority', 'vandalism fines', 'pack infighting', 'too many to manage'],
        identity: 'I must maintain the prayers / chant / scrolls that bind them.',
      },
    ],
  },
  {
    type: 'Esoterica',
    category: 'mythos',
    description:
      'You possess hidden knowledge — occult lore, forgotten rites, or forbidden techniques drawn from your Source.',
    kits: [
      {
        name: 'Corpse Animation',
        powerTags: ['command undead servitors', 'forensic medicine', 'boon with unearthly strength', 'spread the chill of the grave', 'siphon life force', 'feign death', 'carried by the horde', 'sense life force', 'fascinated by death'],
        weaknessTags: ['lengthy ritual', 'mangled bodies', 'cold and distant', 'cloud of rot'],
        identity: 'I must perform rites to honor the spirits whose bodies I use.',
      },
      {
        name: 'Evil Eye',
        powerTags: ['hex of vulnerability', 'folk curses', 'afflict with boils', 'hypnotic gaze', 'turn to stone', 'shield from harmful magic', 'curse of clumsiness', 'detect malevolent forces', 'need for vengeance'],
        weaknessTags: ['requires eye contact', "it's only hedge magic", 'holds a grudge', 'misfortune is infectious'],
        identity: 'I must never stifle my bitterness.',
      },
      {
        name: "Devil's Bargains",
        powerTags: ['remove obstacles for others', 'legal expertise', 'shower with riches', 'magically binding contracts', 'spring nasty loophole', 'silver tongued', 'drag them to hell', 'see their desires', 'natural negotiator'],
        weaknessTags: ['must have a signature', 'marks with strong convictions', 'pedantic', 'deal gone wrong'],
        identity: 'I must uphold my end of each bargain I make.',
      },
      {
        name: 'Fortune Telling',
        powerTags: ['glimpse impending events', 'symbology', 'foretell greater trends', 'heed my prophecy', 'reveal inescapable destiny', 'foresee danger', 'follow the signs', 'fate manipulation', 'storyteller'],
        weaknessTags: ['requires divinatory tools', 'too many threads of fate', 'fatalistic', 'assailed by visions'],
        identity: 'I must follow the signs, wherever they lead.',
      },
      {
        name: 'Potion Craft',
        powerTags: ['healing salves', 'herbology', 'poisons and toxins', 'love potions', 'explosive concoctions', 'stoneskin oil', 'colorful smoke bomb', 'discriminating taste buds', 'seeking immortality'],
        weaknessTags: ['rare ingredients', 'divergent biology', 'wafts unusual odors', 'acidic touch'],
        identity: 'I must experiment with any new ingredient presented to me.',
      },
      {
        name: 'Warding Signs',
        powerTags: ['circle of protection', 'geomancy', 'silent alarm spell', 'carve a talisman for someone', 'explosive glyph', 'counterspell', 'barrier ward', 'trace spell source', 'vigilant'],
        weaknessTags: ['running out of special chalk', 'no solid surfaces', 'isolationist', 'disrupts helpful magic'],
        identity: 'I must maintain the warding symbols around my home or community.',
      },
      {
        name: 'Spirit Summoning',
        powerTags: ['spirit binding', 'knowledge of the nether realms', 'banish spirit', 'induce possession', 'unleash a raging spirit', 'summoned defenders', 'enter the spirit world', 'see spirits', 'strong spirit'],
        weaknessTags: ['disrupted ritual', 'spirits demand respect', 'seems to talk to myself', 'poltergeist effects'],
        identity: 'I must bind any wayward spirit I come upon.',
      },
      {
        name: 'Weapon Witching',
        powerTags: ['legend-killing enchantment', 'weapon smithing', 'magic-guided missiles', 'blinding weapon', 'teleporting projectiles', 'disenchant weapons', 'strength-draining edge', 'intuit foe capabilities', 'elegant combatant'],
        weaknessTags: ['wears down the weapon', 'enchanting under fire', 'haughty', 'inter-enchantment reaction'],
        identity: 'I must never allow an enchanted weapon to go unused.',
      },
    ],
  },
  {
    type: 'Exposure',
    category: 'mythos',
    description:
      'A transformative encounter — an event, an entity, or a place — has permanently changed you and left you resonating with a Source.',
    kits: [
      {
        name: 'Angelic Wings',
        powerTags: ['angelic beauty', 'the higher the better', 'dive bomb', 'shine evil-searing light', 'shelter in wings', 'sense demons & angels', 'buffet with wings', 'cover great distance', 'true believer'],
        weaknessTags: ['problems with clothing', 'tight places', 'cannot force mankind', 'attracts evil'],
        identity: 'I must always take a leap of faith when it presents itself.',
      },
      {
        name: 'Aura of Authority',
        powerTags: ['supernaturally regal', 'trappings of authority', 'inspire loyalty', 'subjugating command', 'blinding aura', 'intuit power dynamics', 'command objects', 'flock of followers', 'supremely confident'],
        weaknessTags: ['useless sycophants', 'self-doubt', 'requires communication', 'must bow to superiors'],
        identity: 'I must worship at the shrine of the entity that grants me my authority.',
      },
      {
        name: 'Animate Shadows',
        powerTags: ['become a shadow', 'lighting that casts shadows', 'form shadow assassins', 'inexplicable terror', 'momentary incorporeality', 'detach my own shadow', 'drag into the shadows', 'see in the dark', 'inscrutable mien'],
        weaknessTags: ['my unruly shadow', 'bright ambient light', 'complete darkness', 'light deities'],
        identity: 'I must enter the shadow realm every night.',
      },
      {
        name: 'Elemental Body',
        powerTags: ['transform specific body parts', 'places rich in [element]', 'absorb [element]', 'surge of [element]', 'create an elemental wall', 'detect [element]', 'sculpt [element]', 'unharmed by [element]', 'gleefully destructive'],
        weaknessTags: ['accidental destruction', 'opposite elements', 'no ambient [element]', 'those who keep the balance'],
        identity: 'I must bathe in [element] daily.',
      },
      {
        name: 'Floral Overgrowth',
        powerTags: ['sprout vines', 'soil, water, and sunlight', 'mesmerizing petals', 'cloud of spores', 'bark-armored skin', 'venus flytrap reflexes', 'tear from the inside', 'emit pheromones', 'intense vitality'],
        weaknessTags: ['sedentary existence', 'uprooted', 'burn easily', 'slashing weapons'],
        identity: 'I must regularly commune with the vegetative life around me.',
      },
      {
        name: 'Speak with Machines',
        powerTags: ['command cybernetics', 'dumb devices', 'raise a machine horde', 'programming-overriding voice', 'they come to my defense', '"hear" transmissions', 'lull them to shutdown', 'rapport with AIs', 'robotic logic'],
        weaknessTags: ['overwhelmed by information', 'signal jamming', 'needs electric power', 'viral infection crossover'],
        identity: 'I must report routinely to [a powerful machine intelligence].',
      },
      {
        name: 'Midas Touch',
        powerTags: ['become gold', 'greedy victims', 'turn someone to gold', 'transmute at range', 'turn projectiles to soft gold', 'know net worth', 'generate lots of gold', 'welcomed by the rich and powerful', 'bracing for the consequences'],
        weaknessTags: ['accidental transformation', 'angering the gods', "wealth can't buy you happiness", 'gold diggers'],
        identity: 'I must live humbly, foregoing the trappings of success and wealth.',
      },
      {
        name: "Warrior's Instincts",
        powerTags: ['peak physical condition', 'dueling', 'weapon mastery', 'enforce honorable combat', 'battlefield heroics', 'visions of the coming battle', 'call upon honored warrior spirits', 'alert to danger', 'battle focus'],
        weaknessTags: ['haunted by past warriors', 'showing irreverence', 'need archaic regalia', 'traitors and backstabbers'],
        identity: 'I must temper my violent instincts with ritualized combat.',
      },
    ],
  },

  // ── NOISE ────────────────────────────────────────────────────────────────
  {
    type: 'Augmentation',
    category: 'noise',
    description:
      'Your body has been enhanced with cybernetic implants and biological modifications that push you beyond human limits.',
    kits: [
      {
        name: 'Animalistic Modifications',
        powerTags: ['superior anatomy', 'acute senses', 'natural weapons', 'climbing appendages', 'animal reflexes', 'spurn social norms', 'bioengineering', 'animal lover', 'seductive pheromones'],
        weaknessTags: ['weak immune system', 'fight or flight instincts', 'I get exhausted fast', 'ridiculed as a freak'],
        identity: 'Experience the world as an animal.',
      },
      {
        name: 'Boosted Mental Capacity',
        powerTags: ['recall useful information', 'photographic memory', 'tactical assistant software', 'analyze environment', 'calculate an alternative', 'cool and collected', 'neural lubricant', 'high-speed debate champion', 'names and faces database'],
        weaknessTags: ['magnetic head', 'flood of memories', 'speak too fast', "can't be trusted"],
        identity: 'Push the limits of my processing power and memory.',
      },
      {
        name: 'Armored Juggernaut',
        powerTags: ['brute force', 'pierce-proof plating', 'gigantic weapon', 'mighty leap', 'bust through walls', 'newfound confidence', 'welding gear', 'corporate military', 'imposing physique'],
        weaknessTags: ['bulky', 'servo-motor jerks', 'rusts when wet', 'treated like a brainless brute'],
        identity: 'Smash through it.',
      },
      {
        name: 'Chipped Weapon Mastery',
        powerTags: ['integrated targeting systems', 'telescopic eyes', 'weapon link', 'trick shots', 'nearspace targeting through walls', 'shoot first', 'weapon maintenance', 'negotiate fees', 'impress with my skills'],
        weaknessTags: ['recoil arthritis', 'arm controlled by app', 'worse in low visibility', 'not a true master'],
        identity: 'Master every weapon.',
      },
      {
        name: 'Enhanced Senses',
        powerTags: ['pierce through concealment', 'chemical analysis', 'see it coming', 'receive wireless communication', 'hear heartbeats', 'appreciation for details', 'meditative repair mode', 'private detective', 'lie detector'],
        weaknessTags: ['insomnia', 'sensory overload', 'momentary blackouts', 'accusations of spying'],
        identity: 'See everything, hear everything.',
      },
      {
        name: 'Impossibly Good Looks',
        powerTags: ['dazzle and impress', 'alternate face', 'distracting appearance', 'precise body control', 'powers of seduction', 'self-suggestion techniques', 'on-call plastic surgeon', 'fashion model', 'center of attention'],
        weaknessTags: ['easily damaged', 'modification pains', 'needs constant updating', 'intense jealousy'],
        identity: 'Be seen by more eyes, appreciated for the work of art that I am.',
      },
      {
        name: 'Hidden Gadgets',
        powerTags: ['scanners and diagnostic tools', 'secret compartment', 'knife launcher', 'painkiller injector', 'finger lockpick', 'resourceful', 'obtain new attachments', 'hide my secret life', 'holographic face mask'],
        weaknessTags: ['unusual weight distribution', 'many devices to monitor', 'compartment door jam', "can't surprise them twice"],
        identity: 'Surprise them with a new trick.',
      },
      {
        name: 'Reflex Booster Implants',
        powerTags: ['increased reaction speed', 'adrenaline rush', 'burst of strength', 'slow metabolism', 'filter out toxins', 'mental clarity hormones', 'biochemistry set', 'extreme sports', 'inject someone else'],
        weaknessTags: ["body can't self regulate", 'withdrawal symptoms', 'bloodstream already flooded', 'stigmatized as a junkie'],
        identity: 'Push my body to the limit.',
      },
    ],
  },
  {
    type: 'Cutting Edge',
    category: 'noise',
    description:
      "You wield prototype and bleeding-edge technology that most people haven't even heard of yet.",
    kits: [
      {
        name: 'Advanced Railgun',
        powerTags: ['rain hell on them', 'deterrence', 'pierces any physical barrier', 'plough through hordes', 'use it to tunnel', 'battle HUD', 'gunnery', 'arms dealer circuits', 'stabilizing harness'],
        weaknessTags: ['out of ammo', "enemy's priority target", 'blind rampage', 'magnetic fields'],
        identity: 'Reduce everything to atoms.',
      },
      {
        name: 'Cloud of Nanites',
        powerTags: ['alter matter', 'take over electronics', 'disintegrate objects', 'cushion impact', 'craft a tool', 'compositional data', 'material scientist', 'robotics lab job', 'cleanroom suit'],
        weaknessTags: ['wind gusts', 'rogue nanite contamination', 'wreaks havoc on my DNA', 'strong magnetic fields'],
        identity: 'Leave nothing as it was.',
      },
      {
        name: 'Cloaking Jumpsuit',
        powerTags: ['completely invisible', 'seizure-inducing strobe', 'close range kills', 'adapt to any spectrum', 'whisper in their ears', 'see them without masks', 'stealth', 'black ops operative', 'sound muffling tech'],
        weaknessTags: ['see even the slightest tear', "drivers can't see me", 'fraying identity', 'mass detectors'],
        identity: 'Remain unknown.',
      },
      {
        name: 'Cryptographic Skeleton Key',
        powerTags: ['decrypt any cypher', 'unbreakable encryption', 'walk through cybersecurity', 'identical false credentials', 'take over broadcast', 'intercepted correspondence', 'mathematical genius', 'crypto bazaar contacts', 'jacket with built-in harness'],
        weaknessTags: ['requires massive computation power', 'leak damaging data', 'VR vertigo', 'outdated security systems'],
        identity: 'Unlock all doors, learn all secrets.',
      },
      {
        name: 'Exoskeleton Suit',
        powerTags: ['large and in charge', 'protective armor', 'hydraulic haymaker', 'run very fast', 'extra lift power', 'structural scanner', 'construction worker', 'corporate investors', "mechanic's tool chest"],
        weaknessTags: ['hackable', 'squishy allies', 'muscle atrophy', 'too big even for me'],
        identity: 'Fight big enemies, do big things.',
      },
      {
        name: 'Force Fields',
        powerTags: ['disrupt energy or motion', 'entrapping sphere', 'use it to clobber', 'keyed to stop projectiles', 'slow falling mass', 'energy readings', 'applied physics', 'inventor parent', 'radiation shielding suit'],
        weaknessTags: ['huge power requirements', 'slow-moving weapons', 'severe burns', "can't stop gasses"],
        identity: 'Keep things separate and apart, everything in its place.',
      },
      {
        name: 'Experimental Vehicle',
        powerTags: ['100g maneuvers', 'immovable mode', 'incinerating side swipe', 'too fast to hit', 'catch someone mid-air', 'high-speed motion sensors', 'nerves of steel', 'combat pilot', 'personal force field'],
        weaknessTags: ['radioactive fuel', 'collisions are fatal', 'internal bruising', 'force fields'],
        identity: "Break the rules and don't get caught.",
      },
      {
        name: 'Self-Healing',
        powerTags: ['wounds close instantly', 'break down foreign substances', 'toxic blood nanites', 'self-resuscitating', 'sacrifice a limb', 'medical monitor', 'medical training', 'genetic laboratory', 'accelerated regen gel'],
        weaknessTags: ['requires nutrients', 'sought-after blood', "can't feel anything", 'extreme cold'],
        identity: 'Ignore the danger, I can survive it.',
      },
    ],
  },
  {
    type: 'Cyberspace',
    category: 'noise',
    description:
      'You navigate the digital realm through a neural interface, wielding code as a weapon and the net as your domain.',
    kits: [
      {
        name: 'Builder of Worlds',
        powerTags: ['avatar construction', 'virtual object design', 'portable harnessing console', 'alter VR physics', 'design virtual guardians', 'turn data to object', 'effects and fanfare', 'run with no avatar', 'artisanal reputation'],
        weaknessTags: ["forget I'm in meatspace", 'overloaded graphics processors', 'recognizable work', 'VR heist heat'],
        identity: 'Create as if you were a god.',
      },
      {
        name: 'Cyberspace Ruins Explorer',
        powerTags: ['experienced spirals navigator', 'analyze digital phenomena', 'long haul life support bed', 'data-cutting buzzsaw', 'high-integrity avatar', 'endure data storms', 'traverse disused datalinks', 'old blackmail files', 'eccentric collector'],
        weaknessTags: ['old server shutdowns', 'too old to interface', 'outdated firewall', 'roaming feral programs'],
        identity: 'Dig deeper to touch the core.',
      },
      {
        name: 'Cybernetic Hijacker',
        powerTags: ['neural link takeover', 'augmentation engineer', 'circumvent safeguards', 'overheat organs', 'shut down weapons', 'harvest personal files', 'make hearts stop', 'set trigger event', "augur's worst nightmare"],
        weaknessTags: ['no wireless connection', 'feedback from cyberware', 'counter-hacking', 'hunted by manufacturers'],
        identity: 'Pull on their strings like a puppet master.',
      },
      {
        name: 'Influencer',
        powerTags: ['mob of fans', 'live streaming camera drone', 'trash a reputation', 'backup uplink', 'control the narrative', 'make it about me', 'start a rumor', 'star power'],
        weaknessTags: ['easily recognized', 'overcrowded channels', 'easily tracked digitally', 'obsessive fans'],
        identity: 'Be a part of every conversation.',
      },
      {
        name: 'Information Broker',
        powerTags: ['exclusive information sources', 'extract important info', 'comms interception equipment', 'leverage information', 'hi-end encryption suite', 'revise the data', 'connect the dots', 'track online activities', 'you came to me'],
        weaknessTags: ['unrecorded info', 'corrupted data', 'searching takes time', 'desperate customers'],
        identity: 'Trade old info for new.',
      },
      {
        name: 'Post-Human Intelligence',
        powerTags: ['entirely digital', 'self-programming', 'secret home server', 'possess a machine', 'self-replicating process', 'copious data', 'be everywhere', 'free enslaved programs', 'outthink humans'],
        weaknessTags: ['no body', 'violent code evolutions', 'another instance of me', 'AI police'],
        identity: 'Let go of human habits.',
      },
      {
        name: 'Intrusion Specialist',
        powerTags: ['find backdoors', 'bypassing defensive programs', 'custom neural harness', 'crash systems', 'silent stalking', 'locate hidden files', 'fake my crash', 'silently crash ICS', 'masquerade as real user'],
        weaknessTags: ['requires concentration', 'weaker against alerted systems', 'easy to crash', 'trace programs'],
        identity: 'Always control, never be controlled.',
      },
      {
        name: 'Zeroed Identity',
        powerTags: ['impossible to identify', 'evade surveillance', 'identity blurring gadgets', "steal someone's identity", 'a network of proxies', 'erase data', 'appear out of thin air', 'make others zeroed', 'anonymous saboteur'],
        weaknessTags: ['no identity documents', 'cameras catch glimpses', 'DNA traces', 'the authorities'],
        identity: 'Never reveal your true name.',
      },
    ],
  },
  {
    type: 'Drones',
    category: 'noise',
    description:
      'You command a fleet of remote-operated machines — aerial, ground, or aquatic — that extend your reach across the city.',
    kits: [
      {
        name: 'Android Servants',
        powerTags: ['provide luxury amenities', 'staff management', 'secretly bodyguards', 'rules of etiquette', "can't be provoked", 'carry me away from harm', 'neither seen nor heard', 'simulated humanity', 'boss people around'],
        weaknessTags: ["can't stand little mistakes", 'droid liberating viruses', 'complacency', 'missed personality updates'],
        identity: 'Have the androids do it for me.',
      },
      {
        name: 'Med Wagon',
        powerTags: ['stabilize patients', 'emergency medicine', 'built-in drug injector', 'diagnostic equipment', 'combat medic plating', 'flying vehicle', 'easily reskinned', 'turn into a barricade', 'thrives when needed'],
        weaknessTags: ['playing god', 'ethics safeguards', 'focused on patient', 'out of supplies'],
        identity: 'Patch up as many as you can.',
      },
      {
        name: 'Giant Construction Robot',
        powerTags: ['lift heavy things', 'construction engineering', 'titanic strength', 'find structural weakness', 'durable metal frame', 'VTOL transport', 'appear to power down', 'wrecking ball', 'desire to rebuild'],
        weaknessTags: ['showoff', 'similar demolition targets', 'more durable than it seems', 'hydraulics leaks'],
        identity: 'Reshape the Megacity.',
      },
      {
        name: 'Mobile Weapons Platform',
        powerTags: ['seek & destroy', 'tactical leader', 'variable munitions', 'target acquisition', 'point-defense turrets', 'gunner cupola', 'military camouflage', 'split into smaller units', 'glory seeker'],
        weaknessTags: ['always keeping score', 'needs a visible target', 'down scope tunnel-vision', 'targeting needs recalibration'],
        identity: 'Destroy all opposition.',
      },
      {
        name: 'RC Racing Star',
        powerTags: ['high speed flying', 'famous in sports circles', 'overtake the competition', 'collision prevention protocols', 'superior maneuverability', 'hold onto it', 'tiny & silent', 'plug into a vehicle', 'burning desire to win'],
        weaknessTags: ['sore loser', 'latency', 'complete VR immersion', 'cracks in the chassis'],
        identity: 'Be the first to get there.',
      },
      {
        name: 'Synthetic Guard Dog',
        powerTags: ['vigilant', 'security professional', 'hydraulic bite', 'movement sensors', 'self-repairing fluids', 'drag to safety', 'silent sentinel', 'folded minigun', 'machine empathy'],
        weaknessTags: ['too attached', 'protects me first', 'anxious with it', 'needs its battery treats'],
        identity: 'Take my dog everywhere and do everything together.',
      },
      {
        name: 'Spy Satellites',
        powerTags: ['aerial view', 'government satellite hacking', 'orbital laser platform', 'wide-spectrum sensors', 'approaching danger alert', 'real time minimap', 'target is oblivious', 'project hard light holograms', 'one step ahead'],
        weaknessTags: ["secrets I shouldn't know", 'government retasking', 'outdoor imagery only', 'out of focus'],
        identity: 'Watch from afar.',
      },
      {
        name: 'Swarm of Probes',
        powerTags: ['search dangerous places', 'surveyor', 'many flying projectiles', 'follow the target', 'harry foes', 'coordinated lifting', 'scatter from view', 'merge into one', 'safety in numbers'],
        weaknessTags: ['anxious shepherd', 'too far apart', 'scattered attention', 'low battery'],
        identity: 'Explore every nook and cranny.',
      },
    ],
  },
]

export const THEME_BOOK_BY_TYPE = Object.fromEntries(
  THEME_BOOK.map(e => [e.type, e])
) as Record<ThemeType, ThemeBookEntry>
