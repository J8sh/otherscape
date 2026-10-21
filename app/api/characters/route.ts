import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { canEditCharacter, loadCampaignFor, pick } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { Character, SHEET_FIELDS } from '@/lib/models/Character'
import { Campaign } from '@/lib/models/Campaign'

/**
 * Characters of one campaign, each flagged with whether the caller may edit
 * it — or, with `?mine=1`, a short list of the caller's own characters in
 * campaigns they still belong to (for quick links).
 */
export const GET = route(async (req: Request) => {
  const user = await requireUser()
  const params = new URL(req.url).searchParams
  if (params.get('mine') === '1') {
    await connectDB()
    const campaigns = await Campaign.find({ 'members.userId': user._id }, { name: 1 }).lean<{ _id: unknown; name: string }[]>()
    const names = new Map(campaigns.map(c => [String(c._id), c.name]))
    const mine = await Character.find({ ownerId: user._id, campaignId: { $in: [...names.keys()] } }, { name: 1, campaignId: 1, themes: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 }).limit(50).lean<{ _id: unknown; name: string; campaignId: unknown; themes?: { themeType?: string; category?: string }[]; updatedAt: Date }[]>()
    return NextResponse.json(mine.map(c => ({
      _id: String(c._id),
      name: c.name,
      campaignId: String(c.campaignId),
      campaignName: names.get(String(c.campaignId)) ?? '',
      categories: (c.themes ?? []).filter(t => t.themeType).map(t => t.category),
      updatedAt: c.updatedAt,
    })))
  }
  const campaignId = params.get('campaignId')
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
