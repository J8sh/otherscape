export type ThemeCategory = 'self' | 'mythos' | 'noise'

export type ThemeType =
  // Self
  | 'Affiliation' | 'Assets' | 'Expertise' | 'Horizon' | 'Personality' | 'Troubled Past'
  // Mythos
  | 'Artifact' | 'Companion' | 'Esoterica' | 'Exposure'
  // Noise
  | 'Augmentation' | 'Cutting Edge' | 'Cyberspace' | 'Drones'

export type EffectType =
  | 'Attack' | 'Disrupt' | 'Influence' | 'Weaken'
  | 'Bestow' | 'Create' | 'Enhance' | 'Restore'
  | 'Advance' | 'Set Back' | 'Discover' | 'Extra Feat'

export interface ITag {
  _id?: string
  text: string
  isPower: boolean
  isWeakness: boolean
  isBurned: boolean
  isTitle?: boolean // the theme's main power tag (title tag); implies isPower
}

export interface ILoadoutTag {
  _id?: string
  text: string
  isFlaw: boolean
  isBurned: boolean
}

export interface IThemeCard {
  _id?: string
  name: string
  category: ThemeCategory
  themeType: ThemeType | '' // '' = empty/unconfigured slot (shows the add-theme prompt)
  motivation: string // identity / ritual / itch text
  tags: ITag[]
  decay: number   // 0–3 (3 = replace the theme)
  upgrade: number // 0–3 (3 = the theme gains an upgrade, then resets)
  specials: string[]
  /** A replacement theme starts with only its title tag until it has 3 power tags. */
  nascent?: boolean
}

export interface ILoadoutThemeCard {
  _id?: string
  name: string
  tags: ILoadoutTag[] // isBurned = not loaded up for this job
  upgrade: number // 0–3
  specials: string[]
  /** Permanent +Power when Loading Up, bought with loadout upgrades. */
  loadingUpBonus?: number
  /** Wildcard slots bought this job (2 Power each), spent to reveal gear later. */
  wildcards?: number
}

export interface ICrewRelationship {
  _id?: string
  crewMember: string
  relationshipTag: string
  isBurned?: boolean
}

export interface IStoryTag {
  _id?: string
  text: string
  isBurned?: boolean
  /** Weakness-style story tag that works against you. */
  isNegative?: boolean
}

export interface IEssence {
  /** Mythos-only characters: one Source (Avatar) or several (Conduit). */
  mythosSameSource: boolean
}

export interface IEvolution {
  /** Evolution points on the 5-circle track (0–4; reaching 5 grants a Moment). */
  points?: number
  veteranSpecials?: string[]
  newEssenceType: boolean
  broadPowerTag: boolean
  veteranSpecial1: boolean
  veteranSpecial2: boolean
  veteranSpecial3: boolean
  retirement: boolean
  sunderCosmology: boolean
  totalReconstitution: boolean
}

export type StatusType = 'helpful' | 'harmful' | 'hindering' | 'compelling' | 'progress'

export interface IStatus {
  _id?: string
  name: string
  tier: number // 1–6, always the highest mark
  /** Every marked tier box (stacking marks the next free box). */
  marks?: number[]
  type: StatusType
}

export interface ICharacter {
  _id: string
  campaignId: string
  ownerId?: string
  name: string
  player: string
  themes: IThemeCard[]       // exactly 4
  loadoutTheme: ILoadoutThemeCard
  evolution: IEvolution
  specials: string[]
  crewRelationships: ICrewRelationship[]
  statuses: IStatus[]
  storyTags?: IStoryTag[]
  /** Themes lost to Decay — the character's "ghost memories". */
  themeHistory?: { name: string; themeType: string; category: string; evolution: number; replacedAt: string }[]
  essence?: IEssence
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ICrewThemeCard {
  _id?: string
  name: string
  motivation: string
  tags: ITag[]
  decay: number
  upgrade: number // 0–3
  specials: string[]
}

export type SiteRole = 'admin' | 'user'
export type CampaignRole = 'mc' | 'player' | 'spectator'

export interface IUser {
  _id: string
  username: string
  displayName: string
  role: SiteRole
  disabled?: boolean
  createdAt?: string
}

export interface ICampaignMember {
  userId: string
  username: string
  displayName: string
  role: CampaignRole
  joinedAt?: string
}

/** What the signed-in user may do in a campaign (computed server-side). */
export interface ICampaignPermissions {
  role: CampaignRole
  isOwner: boolean
  canManage: boolean
  canEditCrew: boolean
  canCreateCharacter: boolean
}

export type ChallengeRole =
  | 'attacker' | 'barrier' | 'countdown' | 'mystery' | 'pursuer' | 'target' | 'watcher' | 'temptation' | 'asset' | 'other'

export interface IChallengeLimit {
  _id?: string
  name: string
  /** Tier that overcomes the Challenge (2–6); null = immune ("–"). */
  max: number | null
  /** A progress Limit: something happens when it maxes out. */
  progress?: boolean
  onMax?: string
}

export interface IChallengeStatus extends IStatus {
  /** Which Limit this status counts toward (by limit name), if any. */
  limit?: string
}

export interface IChallenge {
  _id?: string
  name: string
  role: ChallengeRole
  description: string
  limits: IChallengeLimit[]
  statuses: IChallengeStatus[]
  tags: { _id?: string; text: string; isBurned?: boolean }[]
  specials: { _id?: string; name: string; text: string }[]
  threats: { _id?: string; threat: string; consequence: string }[]
  /** Players can see it (name, description, tags, statuses). */
  revealed: boolean
  /** Players can also see its Limits. */
  limitsRevealed?: boolean
  /** MC-only notes. */
  notes?: string
}

/** The book's optional rules, chosen per campaign by the MC. */
export interface IOptionalRules {
  /** Status Limit for PCs (book default 5; 4 or 3 for grittier games, p.107). */
  pcLimit: 3 | 4 | 5
  /** Power per tier for Enhance (book default 1; 2 makes buffs costlier, p.95). */
  enhanceCost: 1 | 2
  /** Max positive tags counted per roll; null = no cap (p.89). */
  powerTagCap: number | null
  /** Statuses counting toward a Limit don't affect rolls about that Limit (p.109). */
  noDeathSpiral: boolean
}

export const DEFAULT_RULES: IOptionalRules = { pcLimit: 5, enhanceCost: 1, powerTagCap: null, noDeathSpiral: false }

export interface ICampaign {
  _id: string
  name: string
  description: string
  megacity: string
  crewTheme: ICrewThemeCard
  ownerId?: string
  inviteCode?: string // only sent to members who can manage the campaign
  members?: ICampaignMember[]
  challenges?: IChallenge[]
  optionalRules?: IOptionalRules
  me?: ICampaignPermissions
  createdAt: string
  updatedAt: string
}
