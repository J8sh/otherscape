import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Character } from '@/lib/models/Character'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const character = await Character.findById(id).lean()
  if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(character)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const character = await Character.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
  return NextResponse.json(character)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await Character.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
