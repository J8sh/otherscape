import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCharacterFor, pick } from '@/lib/auth/access'
import { SHEET_FIELDS } from '@/lib/models/Character'

type Ctx = { params: Promise<{ id: string }> }


export const GET = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { character, campaign, access, canEdit } = await loadCharacterFor(id, user)
  return NextResponse.json({
    ...character.toObject(),
    canEdit,
    campaignName: campaign.name,
    myRole: access.role,
    rules: campaign.optionalRules,
  })
})

export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { character, canEdit } = await loadCharacterFor(id, user)
  if (!canEdit) throw new HttpError(403, 'You can only edit your own characters.')
  const body = await readJson(req)
  character.set(pick(body, SHEET_FIELDS))
  await character.save()
  return NextResponse.json({ ...character.toObject(), canEdit })
})

export const DELETE = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { character, canEdit } = await loadCharacterFor(id, user)
  if (!canEdit) throw new HttpError(403, 'You can only delete your own characters.')
  // Soft delete: restorable from the campaign page until the TTL index purges it.
  character.set({ deletedAt: new Date() })
  await character.save()
  return NextResponse.json({ success: true })
})
