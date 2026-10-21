import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireAdmin } from '@/lib/auth/session'
import { hashPassword } from '@/lib/auth/password'
import { parsePassword } from '@/lib/auth/validate'
import { User } from '@/lib/models/User'
import { Session } from '@/lib/models/Session'

type Ctx = { params: Promise<{ id: string }> }

/**
 * Admin changes to an account: site role, disabling sign-in, or setting a
 * new password for someone who forgot theirs. Disabling or resetting signs
 * the user out everywhere.
 */
export const PATCH = route(async (req: Request, { params }: Ctx) => {
  const admin = await requireAdmin()
  const { id } = await params
  const body = await readJson(req)
  await connectDB()
  const user = await User.findById(id)
  if (!user) throw new HttpError(404, 'User not found.')
  const isSelf = id === admin._id

  if ('role' in body) {
    if (body.role !== 'admin' && body.role !== 'user') throw new HttpError(400, 'Role must be admin or user.')
    if (isSelf && body.role !== 'admin') throw new HttpError(400, 'You can’t remove your own admin role.')
    user.role = body.role
  }
  let signOut = false
  if ('disabled' in body) {
    if (isSelf) throw new HttpError(400, 'You can’t disable your own account.')
    user.disabled = Boolean(body.disabled)
    signOut ||= user.disabled
  }
  if ('newPassword' in body) {
    user.passwordHash = await hashPassword(parsePassword(body.newPassword))
    signOut = true
  }
  await user.save()
  if (signOut) await Session.deleteMany({ userId: user._id })
  return NextResponse.json({ success: true })
})
