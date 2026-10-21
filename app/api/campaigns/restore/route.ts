import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { campaignAccess, newInviteCode, pick } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { serializeCampaign } from '@/lib/serialize'
import { Campaign } from '@/lib/models/Campaign'
import { Character, SHEET_FIELDS } from '@/lib/models/Character'
import { JOURNAL_KINDS, JournalEntry } from '@/lib/models/JournalEntry'

const MAX_BACKUP_BYTES = 4 * 1024 * 1024

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {})
const list = (v: unknown, max: number, what: string): unknown[] => {
  if (v == null) return []
  if (!Array.isArray(v)) throw new HttpError(400, `${what} must be a list.`)
  if (v.length > max) throw new HttpError(400, `Too many ${what.toLowerCase()} (max ${max}).`)
  return v
}

/**
 * Start a new campaign from a backup file (see ../[id]/backup). The caller
 * becomes its MC and owns every restored character — reassign them to players
 * once they join. Nothing is merged into an existing campaign.
 */
export const POST = route(async (req: Request) => {
  const user = await requireUser()
  const body = await readJson(req, MAX_BACKUP_BYTES)
  if (body.format !== 'otherscape-campaign-backup' || body.version !== 1) throw new HttpError(400, 'That isn’t a campaign backup file.')
  const src = obj(body.campaign)
  const characters = list(body.characters, 50, 'Characters')
  const journal = list(body.journal, 1000, 'Journal entries')
  const challenges = list(src.challenges, 100, 'Challenges')
  await connectDB()

  const campaign = await Campaign.create({
    name: `${parseText(src.name, 'Campaign name', { max: 68 }) || 'Campaign'} (restored)`,
    megacity: parseText(src.megacity, 'Megacity', { max: 80 }),
    description: parseText(src.description, 'Description', { max: 500 }),
    seriesNotes: parseText(src.seriesNotes, 'Series notes', { max: 8000 }),
    ownerId: user._id,
    members: [{ userId: user._id, role: 'mc' }],
    inviteCode: newInviteCode(),
    ...(src.crewTheme ? { crewTheme: obj(src.crewTheme) } : {}),
    ...(src.optionalRules ? { optionalRules: obj(src.optionalRules) } : {}),
    challenges,
  })
  try {
    for (const item of characters) {
      const sheet = pick(obj(obj(item).sheet), SHEET_FIELDS)
      await Character.create({
        ...sheet,
        campaignId: campaign._id,
        ownerId: user._id,
        name: parseText((sheet as { name?: unknown }).name, 'Name', { max: 60 }) || 'New Character',
        player: parseText((sheet as { player?: unknown }).player, 'Player', { max: 60 }),
      })
    }
    for (const item of journal) {
      const e = obj(item)
      await JournalEntry.create({
        campaignId: campaign._id,
        authorId: user._id,
        title: parseText(e.title, 'Title', { max: 120 }),
        body: parseText(e.body, 'Entry', { max: 20000 }),
        kind: JOURNAL_KINDS.includes(e.kind as never) ? e.kind : 'note',
        pinned: e.pinned === true,
      })
    }
  } catch (err) {
    // Don’t leave a half-restored campaign behind.
    await Promise.all([
      Character.deleteMany({ campaignId: campaign._id }),
      JournalEntry.deleteMany({ campaignId: campaign._id }),
      campaign.deleteOne(),
    ])
    if (err instanceof HttpError) throw err
    throw new HttpError(400, 'Part of that backup couldn’t be read, so nothing was restored.')
  }
  return NextResponse.json(await serializeCampaign(campaign, campaignAccess(campaign, user)!), { status: 201 })
})
