import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { JOURNAL_KINDS as KINDS, JournalEntry } from '@/lib/models/JournalEntry'

type Ctx = { params: Promise<{ id: string; entryId: string }> }

async function loadEntry(id: string, entryId: string) {
  const user = await requireUser()
  const { access } = await loadCampaignFor(id, user)
  const entry = await JournalEntry.findOne({ _id: entryId, campaignId: id })
  if (!entry) throw new HttpError(404, 'Entry not found.')
  const canEdit = access.canManage || String(entry.authorId) === user._id
  return { entry, canEdit, canPin: access.canManage }
}

/** Authors edit their own entries; MCs can edit, pin or delete any. */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const { id, entryId } = await params
  const { entry, canEdit, canPin } = await loadEntry(id, entryId)
  if (!canEdit) throw new HttpError(403, 'You can only edit your own entries.')
  const body = await readJson(req)
  if ('title' in body) entry.title = parseText(body.title, 'Title', { max: 120 })
  if ('body' in body) entry.body = parseText(body.body, 'Entry', { max: 20000, required: true })
  if ('kind' in body && KINDS.includes(body.kind as (typeof KINDS)[number])) entry.kind = body.kind
  if ('pinned' in body) {
    if (!canPin) throw new HttpError(403, 'Only the MC can pin entries.')
    entry.pinned = Boolean(body.pinned)
  }
  await entry.save()
  return NextResponse.json({ success: true })
})

export const DELETE = route(async (_: Request, { params }: Ctx) => {
  const { id, entryId } = await params
  const { entry, canEdit } = await loadEntry(id, entryId)
  if (!canEdit) throw new HttpError(403, 'You can only delete your own entries.')
  await entry.deleteOne()
  return NextResponse.json({ success: true })
})
