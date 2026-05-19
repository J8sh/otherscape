import mongoose, { Schema, model, models } from 'mongoose'

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
  upgrade: { type: Number, default: 0, min: 0, max: 2 },
  specials: { type: [String], default: () => Array(6).fill('') },
})

const CampaignSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    megacity: { type: String, default: '' },
    crewTheme: { type: CrewThemeSchema, default: () => ({}) },
  },
  { timestamps: true }
)

export const Campaign = models.Campaign || model('Campaign', CampaignSchema)
