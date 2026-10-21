import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { campaignAccess, newInviteCode, visibleCampaignFilter } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { serializeCampaign } from '@/lib/serialize'
import { Campaign } from '@/lib/models/Campaign'

export const GET = route(async () => {
  const user = await requireUser()
  await connectDB()
  const campaigns = await Campaign.find(await visibleCampaignFilter(user)).sort({ createdAt: -1 })
  const out = await Promise.all(campaigns.map(c => serializeCampaign(c, campaignAccess(c, user)!)))
  return NextResponse.json(out)
})

/** Anyone signed in can start a campaign; they become its owner and MC. */
export const POST = route(async (req: Request) => {
  const user = await requireUser()
  const body = await readJson(req)
  await connectDB()
  const campaign = await Campaign.create({
    name: parseText(body.name, 'Campaign name', { required: true, max: 80 }),
    megacity: parseText(body.megacity, 'Megacity', { max: 80 }),
    description: parseText(body.description, 'Description', { max: 500 }),
    ownerId: user._id,
    members: [{ userId: user._id, role: 'mc' }],
    inviteCode: newInviteCode(),
  })
  return NextResponse.json(await serializeCampaign(campaign, campaignAccess(campaign, user)!), { status: 201 })
})
