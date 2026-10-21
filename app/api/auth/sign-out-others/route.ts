import { NextResponse } from 'next/server'
import { route } from '@/lib/apiHandler'
import { requireUser, rotateSessions } from '@/lib/auth/session'

/** End every other session for this account; this browser gets a fresh one. */
export const POST = route(async () => {
  const user = await requireUser()
  await rotateSessions(user._id)
  return NextResponse.json({ success: true })
})
