import { Schema, model, models } from 'mongoose'

/**
 * A signed-in browser. The cookie holds a random token; only its SHA-256
 * hash is stored here, so a leaked database can't be replayed as sessions.
 * The TTL index lets MongoDB delete expired sessions on its own.
 */
const SessionSchema = new Schema(
  {
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
)

export const Session = models.Session || model('Session', SessionSchema)
