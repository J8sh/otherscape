import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { Campaign } from '@/lib/models/Campaign'

type Ctx = { params: Promise<{ code: string }> }

function normalize(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/** Preview an invite before accepting it. */
export const GET = route(async (_: Request, { params }: Ctx) => {
  await requireUser()
  const { code } = await params
  await connectDB()
  const campaign = await Campaign.findOne({ inviteCode: normalize(code) }).select('name megacity description').lean<{ _id: unknown; name: string; megacity: string; description: string }>()
  if (!campaign) throw new HttpError(404, 'That invite link is invalid or has been replaced.')
  return NextResponse.json({ _id: String(campaign._id), name: campaign.name, megacity: campaign.megacity, description: campaign.description })
})

/** Accept an invite: join as a player (no-op if already a member). */
export const POST = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { code } = await params
  await connectDB()
  const campaign = await Campaign.findOne({ inviteCode: normalize(code) })
  if (!campaign) throw new HttpError(404, 'That invite link is invalid or has been replaced.')
  const already = campaign.members.some((m: { userId: unknown }) => String(m.userId) === user._id)
  if (!already) {
    campaign.members.push({ userId: user._id, role: 'player', joinedAt: new Date() })
    await campaign.save()
  }
  return NextResponse.json({ campaignId: String(campaign._id) })
})
