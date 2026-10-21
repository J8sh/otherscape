import { Schema, model, models, type InferSchemaType } from 'mongoose'

/**
 * A person who signs in. `role` is the site-wide role: admins manage every
 * user and campaign; everyone else is a regular user whose powers come from
 * their per-campaign membership (MC / player / spectator).
 */
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    disabled: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: unknown }

export const User = models.User || model('User', UserSchema)
