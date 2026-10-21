import { Schema } from 'mongoose'
import { registerModel } from '@/lib/models/register'

/** A shared roll: what a player rolled from their sheet, for the table to see. */
const RollSchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    characterId: { type: Schema.Types.ObjectId, ref: 'Character' },
    characterName: { type: String, default: '', maxlength: 80 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dice: { type: [Number], validate: (d: number[]) => d.length === 2 && d.every(n => n >= 1 && n <= 6) },
    power: { type: Number, min: -30, max: 30 },
    total: { type: Number },
    outcome: { type: String, enum: ['miss', 'mixed', 'strong'] },
    tags: { type: [String], default: () => [] },
    note: { type: String, default: '', maxlength: 200 },
  },
  { timestamps: true }
)
RollSchema.index({ campaignId: 1, createdAt: -1 })

export const Roll = registerModel('Roll', RollSchema)
