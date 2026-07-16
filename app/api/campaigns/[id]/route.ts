import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { route } from '@/lib/apiHandler'
import { Campaign } from '@/lib/models/Campaign'

export const GET = route(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  const campaign = await Campaign.findById(id).lean()
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(campaign)
})

export const PATCH = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const campaign = await Campaign.findByIdAndUpdate(id, body, { new: true }).lean()
  return NextResponse.json(campaign)
})

export const DELETE = route(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  await Campaign.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
})
