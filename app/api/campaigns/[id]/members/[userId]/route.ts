import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import type { CampaignRole } from '@/types'

type Ctx = { params: Promise<{ id: string; userId: string }> }
const ROLES: CampaignRole[] = ['mc', 'player', 'spectator']

/** MC changes a member's role. The owner always stays MC. */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id, userId } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.canManage) throw new HttpError(403, 'Only the MC can change roles.')
  const { role } = await readJson(req)
  if (!ROLES.includes(role as CampaignRole)) throw new HttpError(400, 'Role must be mc, player or spectator.')
  if (String(campaign.ownerId) === userId && role !== 'mc') throw new HttpError(400, 'The campaign owner is always an MC.')

  const member = campaign.members.find((m: { userId: unknown }) => String(m.userId) === userId)
  if (!member) throw new HttpError(404, 'Not a member of this campaign.')
  member.role = role
  await campaign.save()
  return NextResponse.json({ success: true })
})

/** MC removes a member, or a member leaves on their own. Their characters stay with the campaign. */
export const DELETE = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id, userId } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  const leavingSelf = userId === user._id
  if (!leavingSelf && !access.canManage) throw new HttpError(403, 'Only the MC can remove members.')
  if (String(campaign.ownerId) === userId) throw new HttpError(400, 'The owner can’t leave; delete the campaign instead.')

  campaign.members = campaign.members.filter((m: { userId: unknown }) => String(m.userId) !== userId)
  await campaign.save()
  return NextResponse.json({ success: true })
})
