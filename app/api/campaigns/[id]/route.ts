import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor, pick } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { serializeCampaign } from '@/lib/serialize'
import { Character } from '@/lib/models/Character'
import { JournalEntry } from '@/lib/models/JournalEntry'
import { Roll } from '@/lib/models/Roll'

type Ctx = { params: Promise<{ id: string }> }

export const GET = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  return NextResponse.json(await serializeCampaign(campaign, access))
})

/**
 * MCs edit everything about the campaign; players may only update the shared
 * crew theme card (burning crew tags, marking decay/upgrade during play).
 */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  const body = await readJson(req)

  const wantsDetails = ['name', 'description', 'megacity', 'seriesNotes'].some(k => k in body)
  if (wantsDetails && !access.canManage) throw new HttpError(403, 'Only the MC can edit campaign details.')
  if ('crewTheme' in body && !access.canEditCrew) throw new HttpError(403, 'Spectators can’t edit the crew.')
  if ('challenges' in body && !access.canManage) throw new HttpError(403, 'Only the MC can edit Challenges.')
  if ('optionalRules' in body && !access.canManage) throw new HttpError(403, 'Only the MC can change the rules.')

  const update = pick(body, ['name', 'description', 'megacity', 'crewTheme', 'challenges', 'optionalRules', 'seriesNotes'] as const)
  if ('name' in update) campaign.name = parseText(update.name, 'Campaign name', { required: true, max: 80 })
  if ('description' in update) campaign.description = parseText(update.description, 'Description', { max: 500 })
  if ('megacity' in update) campaign.megacity = parseText(update.megacity, 'Megacity', { max: 80 })
  if ('seriesNotes' in update) campaign.seriesNotes = parseText(update.seriesNotes, 'Series notes', { max: 8000 })
  if ('crewTheme' in update) campaign.set('crewTheme', update.crewTheme)
  if ('optionalRules' in update) campaign.set('optionalRules', update.optionalRules)
  if ('challenges' in update) {
    if (!Array.isArray(update.challenges) || update.challenges.length > 100) throw new HttpError(400, 'Challenges must be a list (max 100).')
    campaign.set('challenges', update.challenges)
  }
  await campaign.save()
  return NextResponse.json(await serializeCampaign(campaign, access))
})

/** Only the owner (or an admin) can delete a campaign; its characters go with it. */
export const DELETE = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.isOwner && !access.isAdmin) throw new HttpError(403, 'Only the campaign owner can delete it.')
  await Character.deleteMany({ campaignId: campaign._id })
  await JournalEntry.deleteMany({ campaignId: campaign._id })
  await Roll.deleteMany({ campaignId: campaign._id })
  await campaign.deleteOne()
  return NextResponse.json({ success: true })
})
