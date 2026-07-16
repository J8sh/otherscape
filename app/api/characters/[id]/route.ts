import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { route } from '@/lib/apiHandler'
import { Character } from '@/lib/models/Character'

export const GET = route(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  const character = await Character.findById(id).lean()
  if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(character)
})

export const PATCH = route(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const character = await Character.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
  return NextResponse.json(character)
})

export const DELETE = route(async (_: Request, { params }: { params: Promise<{ id: string }> }) => {
  await connectDB()
  const { id } = await params
  await Character.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
})
