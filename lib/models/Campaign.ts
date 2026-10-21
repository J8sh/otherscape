import { Schema } from 'mongoose'
import { registerModel } from '@/lib/models/register'

const TagSchema = new Schema({
  text: { type: String, default: '' },
  isPower: { type: Boolean, default: false },
  isWeakness: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
  note: { type: String, default: '', maxlength: 200 },
})

const CrewThemeSchema = new Schema({
  name: { type: String, default: '' },
  motivation: { type: String, default: '' },
  // Starts with 3 power tags + 1 weakness tag, like a character theme.
  tags: {
    type: [TagSchema],
    default: () => [
      ...Array(3).fill(null).map(() => ({ text: '', isPower: true, isWeakness: false, isBurned: false })),
      { text: '', isPower: false, isWeakness: true, isBurned: false },
    ],
  },
  decay: { type: Number, default: 0, min: 0, max: 3 },
  upgrade: { type: Number, default: 0, min: 0, max: 3 },
  specials: { type: [String], default: () => [] },
})

/** A user's seat in a campaign: the MC runs it, players own characters, spectators watch. */
const MemberSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['mc', 'player', 'spectator'], default: 'player' },
    joinedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
)

const ChallengeStatusSchema = new Schema({
  name: { type: String, default: '' },
  tier: { type: Number, min: 1, max: 6, default: 1 },
  marks: { type: [Number], default: undefined },
  type: { type: String, enum: ['helpful', 'harmful', 'hindering', 'compelling', 'progress'], default: 'harmful' },
  limit: { type: String, default: '' },
})

/** An MC's Challenge profile (core book pp. 294–300): Limits, base tags, Specials, Threats → Consequences. */
const ChallengeSchema = new Schema({
  name: { type: String, default: '', maxlength: 120 },
  role: { type: String, enum: ['attacker', 'barrier', 'countdown', 'mystery', 'pursuer', 'target', 'watcher', 'temptation', 'asset', 'other'], default: 'attacker' },
  description: { type: String, default: '', maxlength: 2000 },
  limits: {
    type: [new Schema({
      name: { type: String, default: '' },
      max: { type: Number, min: 1, max: 6, default: 3 },
      progress: { type: Boolean, default: false },
      onMax: { type: String, default: '' },
    })],
    default: () => [],
  },
  statuses: { type: [ChallengeStatusSchema], default: () => [] },
  tags: { type: [new Schema({ text: { type: String, default: '' }, isBurned: { type: Boolean, default: false } })], default: () => [] },
  specials: { type: [new Schema({ name: { type: String, default: '' }, text: { type: String, default: '' } })], default: () => [] },
  threats: { type: [new Schema({ threat: { type: String, default: '' }, consequence: { type: String, default: '' } })], default: () => [] },
  revealed: { type: Boolean, default: false },
  limitsRevealed: { type: Boolean, default: false },
  notes: { type: String, default: '', maxlength: 2000 },
})

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    megacity: { type: String, default: '' },
    crewTheme: { type: CrewThemeSchema, default: () => ({}) },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    members: { type: [MemberSchema], default: () => [] },
    inviteCode: { type: String, index: { unique: true, sparse: true } },
    challenges: { type: [ChallengeSchema], default: () => [] },
    seriesNotes: { type: String, default: '', maxlength: 8000 },
    optionalRules: {
      pcLimit: { type: Number, enum: [3, 4, 5], default: 5 },
      enhanceCost: { type: Number, enum: [1, 2], default: 1 },
      powerTagCap: { type: Number, min: 1, max: 10, default: null },
      noDeathSpiral: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
)

CampaignSchema.index({ 'members.userId': 1 })

export const Campaign = registerModel('Campaign', CampaignSchema)
