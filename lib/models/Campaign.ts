import { Schema, model, models } from 'mongoose'

const TagSchema = new Schema({
  text: { type: String, default: '' },
  isPower: { type: Boolean, default: false },
  isWeakness: { type: Boolean, default: false },
  isBurned: { type: Boolean, default: false },
})

const CrewThemeSchema = new Schema({
  name: { type: String, default: '' },
  motivation: { type: String, default: '' },
  tags: { type: [TagSchema], default: () => Array(8).fill(null).map(() => ({ text: '', isPower: false, isWeakness: false, isBurned: false })) },
  decay: { type: Number, default: 0, min: 0, max: 3 },
  upgrade: { type: Number, default: 0, min: 0, max: 3 },
  specials: { type: [String], default: () => Array(6).fill('') },
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

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    megacity: { type: String, default: '' },
    crewTheme: { type: CrewThemeSchema, default: () => ({}) },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    members: { type: [MemberSchema], default: () => [] },
    inviteCode: { type: String, index: { unique: true, sparse: true } },
  },
  { timestamps: true }
)

CampaignSchema.index({ 'members.userId': 1 })

export const Campaign = models.Campaign || model('Campaign', CampaignSchema)
