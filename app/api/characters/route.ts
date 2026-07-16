import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { route } from '@/lib/apiHandler'
import { Character } from '@/lib/models/Character'

export const GET = route(async (req: Request) => {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const campaignId = searchParams.get('campaignId')
  const query = campaignId ? { campaignId } : {}
  const characters = await Character.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json(characters)
})

export const POST = route(async (req: Request) => {
  await connectDB()
  const body = await req.json()
  const character = await Character.create(body)
  return NextResponse.json(character, { status: 201 })
})
