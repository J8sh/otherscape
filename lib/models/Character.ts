import { Schema } from 'mongoose'
import { registerModel } from '@/lib/models/register'

const TagSchema = new Schema({
  text: { type: String, default: '' },
  isPower: { type: Boolean, default: false },
  isWeakness: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
  isTitle: { type: Boolean, default: false },
  note: { type: String, default: '', maxlength: 200 },
})

const LoadoutTagSchema = new Schema({
  text: { type: String, default: '' },
  isFlaw: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
  note: { type: String, default: '', maxlength: 200 },
})

const ThemeCardSchema = new Schema({
  name: { type: String, default: '' },
  category: { type: String, enum: ['self', 'mythos', 'noise'], default: 'self' },
  themeType: { type: String, default: '' },
  motivation: { type: String, default: '' },
  tags: { type: [TagSchema], default: () => [] }, // grows as tags are picked/added; power vs weakness via flags
  decay: { type: Number, default: 0, min: 0, max: 3 },
  upgrade: { type: Number, default: 0, min: 0, max: 3 },
  specials: { type: [String], default: () => [] }, // chosen Theme Special names, picked via ThemeSpecialsPicker
  nascent: { type: Boolean, default: false },
})

const LoadoutThemeSchema = new Schema({
  name: { type: String, default: '' },
  // Loadout tags start burnt: Loading Up before a job un-burns the ones you pack.
  tags: { type: [LoadoutTagSchema], default: () => [] },
  upgrade: { type: Number, default: 0, min: 0, max: 3 },
  specials: { type: [String], default: () => [] },
  loadingUpBonus: { type: Number, default: 0, min: 0 },
  wildcards: { type: Number, default: 0, min: 0 },
})

const EvolutionSchema = new Schema({
  points: { type: Number, default: 0, min: 0, max: 4 },
  veteranSpecials: { type: [String], default: () => [] },
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
  marks: { type: [Number], default: undefined },
  type: { type: String, enum: ['helpful', 'harmful', 'hindering', 'compelling', 'progress'], default: 'harmful' },
})

const StoryTagSchema = new Schema({
  text: { type: String, default: '' },
  isBurned: { type: Boolean, default: false },
  isNegative: { type: Boolean, default: false },
})

const CrewRelationshipSchema = new Schema({
  crewMember: { type: String, default: '' },
  relationshipTag: { type: String, default: '' },
  isBurned: { type: Boolean, default: false },
})

const CharacterSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, // the player who controls this character
    name: { type: String, required: true },
    player: { type: String, default: '' },
    themes: { type: [ThemeCardSchema], default: () => Array(4).fill(null).map(() => ({})) },
    loadoutTheme: { type: LoadoutThemeSchema, default: () => ({}) },
    evolution: { type: EvolutionSchema, default: () => ({}) },
    specials: { type: [String], default: () => [] },
    crewRelationships: { type: [CrewRelationshipSchema], default: () => [] }, // one per crewmate; the setup checklist adds rows
    statuses: { type: [StatusSchema], default: () => [] },
    storyTags: { type: [StoryTagSchema], default: () => [] },
    themeHistory: {
      type: [new Schema({
        name: { type: String, default: '' },
        themeType: { type: String, default: '' },
        category: { type: String, default: '' },
        evolution: { type: Number, default: 0 },
        replacedAt: { type: Date, default: () => new Date() },
      }, { _id: false })],
      default: () => [],
    },
    essence: { mythosSameSource: { type: Boolean, default: false } },
    notes: { type: String, default: '', maxlength: 5000 },
    /** Set when deleted: the character can be restored for 30 days, then MongoDB purges it. */
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

/** Deleted characters are purged 30 days after deletion (TTL index; null never expires). */
export const RESTORE_DAYS = 30
CharacterSchema.index({ deletedAt: 1 }, { expireAfterSeconds: RESTORE_DAYS * 24 * 3600 })

// Reads skip deleted characters unless a query opts in with { withDeleted: true }.
CharacterSchema.pre(['find', 'findOne', 'countDocuments'], function () {
  if (!this.getOptions().withDeleted && this.getFilter().deletedAt === undefined) this.where({ deletedAt: null })
})

export const Character = registerModel('Character', CharacterSchema)

/** Sheet fields a player may write (and that export/import carry). campaignId and ownerId never come from a request body. */
export const SHEET_FIELDS = [
  'name', 'player', 'themes', 'loadoutTheme', 'evolution', 'specials',
  'crewRelationships', 'statuses', 'storyTags', 'essence', 'notes', 'themeHistory',
] as const
