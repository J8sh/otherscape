import { Schema, model, models } from 'mongoose'

const TagSchema = new Schema({
  text: { type: String, default: '' },
  isPower: { type: Boolean, default: false },
  isWeakness: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
  isTitle: { type: Boolean, default: false },
})

const LoadoutTagSchema = new Schema({
  text: { type: String, default: '' },
  isFlaw: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
})

const ThemeCardSchema = new Schema({
  name: { type: String, default: '' },
  category: { type: String, enum: ['self', 'mythos', 'noise'], default: 'self' },
  themeType: { type: String, default: '' },
  motivation: { type: String, default: '' },
  tags: { type: [TagSchema], default: () => Array(8).fill(null).map(() => ({ text: '', isPower: false, isWeakness: false, isBurned: false })) },
  decay: { type: Number, default: 0, min: 0, max: 3 },
  upgrade: { type: Number, default: 0, min: 0, max: 2 },
  specials: { type: [String], default: () => [] }, // chosen Theme Special names, picked via ThemeSpecialsPicker
})

const LoadoutThemeSchema = new Schema({
  name: { type: String, default: '' },
  tags: { type: [LoadoutTagSchema], default: () => Array(12).fill(null).map(() => ({ text: '', isFlaw: false, isBurned: false })) },
  upgrade: { type: Number, default: 0, min: 0, max: 2 },
  specials: { type: [String], default: () => Array(6).fill('') },
})

const EvolutionSchema = new Schema({
  newEssenceType: { type: Boolean, default: false },
  broadPowerTag: { type: Boolean, default: false },
  veteranSpecial1: { type: Boolean, default: false },
  veteranSpecial2: { type: Boolean, default: false },
  veteranSpecial3: { type: Boolean, default: false },
  retirement: { type: Boolean, default: false },
  sunderCosmology: { type: Boolean, default: false },
  totalReconstitution: { type: Boolean, default: false },
})

const StatusSchema = new Schema({
  name: { type: String, required: true },
  tier: { type: Number, min: 1, max: 6, required: true },
  type: { type: String, enum: ['helpful', 'harmful', 'hindering', 'compelling'], default: 'harmful' },
})

const CrewRelationshipSchema = new Schema({
  crewMember: { type: String, default: '' },
  relationshipTag: { type: String, default: '' },
})

const CharacterSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    name: { type: String, required: true },
    player: { type: String, default: '' },
    themes: { type: [ThemeCardSchema], default: () => Array(4).fill(null).map(() => ({})) },
    loadoutTheme: { type: LoadoutThemeSchema, default: () => ({}) },
    evolution: { type: EvolutionSchema, default: () => ({}) },
    specials: { type: [String], default: () => Array(4).fill('') },
    crewRelationships: { type: [CrewRelationshipSchema], default: () => Array(3).fill(null).map(() => ({ crewMember: '', relationshipTag: '' })) },
    statuses: { type: [StatusSchema], default: () => [] },
  },
  { timestamps: true }
)

export const Character = models.Character || model('Character', CharacterSchema)
