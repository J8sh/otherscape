import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { JOURNAL_KINDS as KINDS, JournalEntry } from '@/lib/models/JournalEntry'
import { User } from '@/lib/models/User'

type Ctx = { params: Promise<{ id: string }> }

/** Every entry, pinned first then newest, with author names and edit rights. */
export const GET = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { access } = await loadCampaignFor(id, user)
  const entries = await JournalEntry.find({ campaignId: id }).sort({ pinned: -1, createdAt: -1 }).lean<{ authorId: unknown }[]>()
  const authors = await User.find({ _id: { $in: entries.map(e => e.authorId) } }).select('displayName').lean<{ _id: unknown; displayName: string }[]>()
  const names = new Map(authors.map(a => [String(a._id), a.displayName]))
  return NextResponse.json(entries.map(e => ({
    ...e,
    authorName: names.get(String(e.authorId)) ?? 'Someone',
    canEdit: access.canManage || String(e.authorId) === user._id,
  })))
})

/** MCs and players can write; spectators read. */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { access } = await loadCampaignFor(id, user)
  if (!access.canCreateCharacter) throw new HttpError(403, 'Spectators can’t write in the journal.')
  const body = await readJson(req)
  const kind = KINDS.includes(body.kind as (typeof KINDS)[number]) ? body.kind : 'recap'
  const entry = await JournalEntry.create({
    campaignId: id,
    authorId: user._id,
    title: parseText(body.title, 'Title', { max: 120 }),
    body: parseText(body.body, 'Entry', { max: 20000, required: true }),
    kind,
  })
  return NextResponse.json({ ...entry.toObject(), authorName: user.displayName, canEdit: true }, { status: 201 })
})
