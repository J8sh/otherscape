import { createHash, randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import { HttpError } from '@/lib/apiHandler'
import { Session } from '@/lib/models/Session'
import { User } from '@/lib/models/User'

export const SESSION_COOKIE = 'os_session'
const SESSION_DAYS = 30

export interface SessionUser {
  _id: string
  username: string
  displayName: string
  role: 'admin' | 'user'
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

// Secure cookies need HTTPS. Default to secure in production, but allow
// COOKIE_SECURE=false for a production build served over plain HTTP on a LAN.
function secureCookies() {
  if (process.env.COOKIE_SECURE) return process.env.COOKIE_SECURE !== 'false'
  return process.env.NODE_ENV === 'production'
}

export async function createSession(userId: string) {
  await connectDB()
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await Session.create({ tokenHash: hashToken(token), userId, expiresAt })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: secureCookies(),
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await connectDB()
    await Session.deleteOne({ tokenHash: hashToken(token) })
  }
  cookieStore.delete(SESSION_COOKIE)
}

/** The signed-in user, or null. Expired sessions and disabled users count as signed out. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  await connectDB()
  const session = await Session.findOne({ tokenHash: hashToken(token), expiresAt: { $gt: new Date() } }).lean<{ userId: unknown }>()
  if (!session) return null
  const user = await User.findById(session.userId).lean<{
    _id: unknown; username: string; displayName: string; role: 'admin' | 'user'; disabled?: boolean
  }>()
  if (!user || user.disabled) return null
  return { _id: String(user._id), username: user.username, displayName: user.displayName, role: user.role }
}

/** The signed-in user; throws 401 when signed out. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) throw new HttpError(401, 'Please sign in.')
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== 'admin') throw new HttpError(403, 'Admins only.')
  return user
}
