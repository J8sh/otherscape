import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { getSessionUser, requireUser } from '@/lib/auth/session'
import { hashPassword, verifyPassword } from '@/lib/auth/password'
import { parseDisplayName, parsePassword } from '@/lib/auth/validate'
import { User } from '@/lib/models/User'

/** The signed-in user, or `null` (200) when signed out — the client decides what to show. */
export const GET = route(async () => {
  return NextResponse.json(await getSessionUser())
})

/** Update your own display name and/or password (the current password is required to change it). */
export const PATCH = route(async (req: Request) => {
  const me = await requireUser()
  const body = await readJson(req)
  await connectDB()
  const user = await User.findById(me._id).select('+passwordHash')
  if (!user) throw new HttpError(404, 'User not found.')

  if (body.displayName !== undefined) user.displayName = parseDisplayName(body.displayName, user.username)
  if (body.newPassword !== undefined) {
    const current = typeof body.currentPassword === 'string' ? body.currentPassword : ''
    if (!(await verifyPassword(current, user.passwordHash))) throw new HttpError(400, 'Current password is wrong.')
    user.passwordHash = await hashPassword(parsePassword(body.newPassword))
  }
  await user.save()
  return NextResponse.json({ _id: me._id, username: user.username, displayName: user.displayName, role: user.role })
})
