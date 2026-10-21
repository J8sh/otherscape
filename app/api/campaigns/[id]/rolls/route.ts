import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { canEditCharacter, loadCampaignFor } from '@/lib/auth/access'
import { rollOutcome } from '@/lib/rules'
import { Character } from '@/lib/models/Character'
import { Roll } from '@/lib/models/Roll'

type Ctx = { params: Promise<{ id: string }> }

/** The 30 most recent shared rolls. */
export const GET = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  await loadCampaignFor(id, user)
  const rolls = await Roll.find({ campaignId: id }).sort({ createdAt: -1 }).limit(30).lean()
  return NextResponse.json(rolls)
})

/**
 * Share a roll made for a character you can edit. The outcome is
 * recomputed here from the dice and Power, so the log can't be told a 6
 * was a strong hit.
 */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { access } = await loadCampaignFor(id, user)
  const body = await readJson(req)
  const character = await Character.findOne({ _id: body.characterId, campaignId: id })
  if (!character || !canEditCharacter(access, character, user)) throw new HttpError(403, 'You can only share rolls for your own characters.')

  const dice = Array.isArray(body.dice) ? body.dice.map(Number) : []
  const power = Math.trunc(Number(body.power))
  if (dice.length !== 2 || dice.some((d: number) => !(d >= 1 && d <= 6)) || !Number.isFinite(power)) throw new HttpError(400, 'Invalid roll.')
  const { total, outcome } = rollOutcome(dice[0], dice[1], power)
  const tags = Array.isArray(body.tags) ? body.tags.filter((t: unknown): t is string => typeof t === 'string').slice(0, 20).map((t: string) => t.slice(0, 80)) : []

  const roll = await Roll.create({
    campaignId: id, characterId: character._id, characterName: character.name, userId: user._id,
    dice, power, total, outcome, tags, note: typeof body.note === 'string' ? body.note.slice(0, 200) : '',
  })
  // Keep the log small: drop anything beyond the newest 200.
  const stale = await Roll.find({ campaignId: id }).sort({ createdAt: -1 }).skip(200).select('_id').lean<{ _id: unknown }[]>()
  if (stale.length) await Roll.deleteMany({ _id: { $in: stale.map(r => r._id) } })
  return NextResponse.json(roll, { status: 201 })
})
