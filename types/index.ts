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

export interface ICampaign {
  _id: string
  name: string
  description: string
  megacity: string
  crewTheme: ICrewThemeCard
  createdAt: string
  updatedAt: string
}
