import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { route } from '@/lib/apiHandler'
import { Campaign } from '@/lib/models/Campaign'

export const GET = route(async () => {
  await connectDB()
  const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(campaigns)
})

export const POST = route(async (req: Request) => {
  await connectDB()
  const body = await req.json()
  const campaign = await Campaign.create(body)
  return NextResponse.json(campaign, { status: 201 })
})
