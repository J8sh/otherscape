import { Schema } from 'mongoose'
import { registerModel } from '@/lib/models/register'

/** A campaign journal entry: session recaps, leads, NPCs met, loot. */
const JournalEntrySchema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: '', maxlength: 120 },
    body: { type: String, default: '', maxlength: 20000 },
    kind: { type: String, enum: ['recap', 'lead', 'npc', 'loot', 'note'], default: 'recap' },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const JournalEntry = registerModel('JournalEntry', JournalEntrySchema)

export const JOURNAL_KINDS = ['recap', 'lead', 'npc', 'loot', 'note'] as const
export type JournalKind = (typeof JOURNAL_KINDS)[number]
