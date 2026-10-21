import { NextResponse } from 'next/server'
import { HttpError, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor, newInviteCode } from '@/lib/auth/access'

type Ctx = { params: Promise<{ id: string }> }

/** Issue a fresh invite code; the old link stops working. */
export const POST = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.canManage) throw new HttpError(403, 'Only the MC can manage invites.')
  campaign.inviteCode = newInviteCode()
  await campaign.save()
  return NextResponse.json({ inviteCode: campaign.inviteCode })
})
