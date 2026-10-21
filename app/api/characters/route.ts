import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { canEditCharacter, loadCampaignFor, pick } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { Character, SHEET_FIELDS } from '@/lib/models/Character'

/** Characters of one campaign, each flagged with whether the caller may edit it. */
export const GET = route(async (req: Request) => {
  const user = await requireUser()
  const campaignId = new URL(req.url).searchParams.get('campaignId')
  if (!campaignId) throw new HttpError(400, 'campaignId is required.')
  const { access } = await loadCampaignFor(campaignId, user)
  await connectDB()
  const characters = await Character.find({ campaignId }).sort({ createdAt: 1 }).lean<{ ownerId?: unknown }[]>()
  return NextResponse.json(
    characters.map(c => ({ ...c, canEdit: canEditCharacter(access, c, user) }))
  )
})

/**
 * Players create characters they own. An MC may create one for another
 * member by passing `ownerId` (e.g. to set up a pregen for a new player).
 */
export const POST = route(async (req: Request) => {
  const user = await requireUser()
  const body = await readJson(req)
  const campaignId = typeof body.campaignId === 'string' ? body.campaignId : ''
  const { campaign, access } = await loadCampaignFor(campaignId, user)
  if (!access.canCreateCharacter) throw new HttpError(403, 'Spectators can’t create characters.')

  let ownerId = user._id
  if (typeof body.ownerId === 'string' && body.ownerId !== user._id) {
    if (!access.canManage) throw new HttpError(403, 'Only the MC can create characters for other players.')
    const isMember = campaign.members.some((m: { userId: unknown }) => String(m.userId) === body.ownerId)
    if (!isMember) throw new HttpError(400, 'That user isn’t in this campaign.')
    ownerId = body.ownerId
  }

  // `sheet` imports an exported character (only sheet fields; ids, owner and campaign are never taken from it).
  const sheet = body.sheet && typeof body.sheet === 'object' && !Array.isArray(body.sheet)
    ? pick(body.sheet as Record<string, unknown>, SHEET_FIELDS)
    : {}
  const character = await Character.create({
    ...sheet,
    campaignId,
    ownerId,
    name: parseText(body.name ?? (sheet as { name?: unknown }).name, 'Name', { max: 60 }) || 'New Character',
    player: parseText(body.player ?? (sheet as { player?: unknown }).player, 'Player', { max: 60 }),
  })
  return NextResponse.json({ ...character.toObject(), canEdit: true }, { status: 201 })
})
