import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { route } from '@/lib/apiHandler'
import { requireAdmin } from '@/lib/auth/session'
import { User } from '@/lib/models/User'
import { Campaign } from '@/lib/models/Campaign'

/** Every account, with how many campaigns each belongs to. */
export const GET = route(async () => {
  await requireAdmin()
  await connectDB()
  const users = await User.find().sort({ createdAt: 1 }).lean<{ _id: unknown }[]>()
  const counts = await Campaign.aggregate<{ _id: unknown; n: number }>([
    { $unwind: '$members' },
    { $group: { _id: '$members.userId', n: { $sum: 1 } } },
  ])
  const byId = new Map(counts.map(c => [String(c._id), c.n]))
  return NextResponse.json(users.map(u => ({ ...u, campaignCount: byId.get(String(u._id)) ?? 0 })))
})
