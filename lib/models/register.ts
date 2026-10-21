import mongoose, { type Schema } from 'mongoose'

/**
 * Register a model, replacing any previous registration. In dev, hot reload
 * re-runs model files while Mongoose keeps the old compiled model — the
 * usual `models.X || model(...)` would then keep validating against the
 * stale schema (e.g. old max values) until a full restart.
 */
// Typed loosely (as the old `models.X || model(...)` pattern was) — routes
// read documents through their own narrow types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerModel(name: string, schema: Schema): mongoose.Model<any> {
  if (mongoose.models[name]) mongoose.deleteModel(name)
  return mongoose.model(name, schema)
}
