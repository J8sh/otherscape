import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { canEditCharacter, loadCampaignFor } from '@/lib/auth/access'
import { Character } from '@/lib/models/Character'

type Ctx = { params: Promise<{ id: string }> }

/** Bring back a deleted character (its player or the MC). */
export const POST = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  await connectDB()
  const character = await Character.findOne({ _id: id, deletedAt: { $ne: null } })
  if (!character) throw new HttpError(404, 'Nothing to restore — it may have been purged.')
  const { access } = await loadCampaignFor(String(character.campaignId), user)
  if (!canEditCharacter(access, character, user)) throw new HttpError(403, 'Only its player or the MC can restore this character.')
  character.set({ deletedAt: null })
  await character.save()
  return NextResponse.json({ success: true })
})
