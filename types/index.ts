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
  decay: number   // 0–3
  upgrade: number // 0–2
  specials: string[]
}

export interface ILoadoutThemeCard {
  _id?: string
  name: string
  tags: ILoadoutTag[]
  upgrade: number // 0–2
  specials: string[]
}

export interface ICrewRelationship {
  _id?: string
  crewMember: string
  relationshipTag: string
}

export interface IEvolution {
  newEssenceType: boolean
  broadPowerTag: boolean
  veteranSpecial1: boolean
  veteranSpecial2: boolean
  veteranSpecial3: boolean
  retirement: boolean
  sunderCosmology: boolean
  totalReconstitution: boolean
}

export interface IStatus {
  _id?: string
  name: string
  tier: number // 1–6
  type: 'helpful' | 'harmful' | 'hindering' | 'compelling'
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
  createdAt: string
  updatedAt: string
}

export interface ICrewThemeCard {
  _id?: string
  name: string
  motivation: string
  tags: ITag[]
  decay: number
  upgrade: number
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

export interface ICampaign {
  _id: string
  name: string
  description: string
  megacity: string
  crewTheme: ICrewThemeCard
  ownerId?: string
  inviteCode?: string // only sent to members who can manage the campaign
  members?: ICampaignMember[]
  me?: ICampaignPermissions
  createdAt: string
  updatedAt: string
}
