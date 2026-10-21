import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCharacterFor } from '@/lib/auth/access'

type Ctx = { params: Promise<{ id: string }> }

/** MC only: hand a character to another player (or the MC) in the same campaign. */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { character, campaign, access } = await loadCharacterFor(id, user)
  if (!access.canManage) throw new HttpError(403, 'Only the MC can reassign characters.')
  const { ownerId } = await readJson(req)
  const member = campaign.members.find((m: { userId: unknown; role: string }) => String(m.userId) === ownerId)
  if (typeof ownerId !== 'string' || !member) throw new HttpError(400, 'That person isn’t in this campaign.')
  if (member.role === 'spectator') throw new HttpError(400, 'Spectators can’t play characters — make them a player first.')
  character.set('ownerId', ownerId)
  await character.save()
  return NextResponse.json({ success: true })
})
