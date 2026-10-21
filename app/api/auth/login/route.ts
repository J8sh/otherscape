import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import { allowAttempt, clearFailures, recordFailure } from '@/lib/auth/rateLimit'
import { User } from '@/lib/models/User'

export const POST = route(async (req: Request) => {
  const body = await readJson(req)
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  const key = `${username}|${ip}`

  if (!allowAttempt(key)) throw new HttpError(429, 'Too many attempts. Try again in a few minutes.')

  await connectDB()
  const user = await User.findOne({ username }).select('+passwordHash')
  const ok = user && !user.disabled && (await verifyPassword(password, user.passwordHash))
  if (!ok) {
    recordFailure(key)
    // Same message whether the username exists or not.
    throw new HttpError(401, 'Wrong username or password.')
  }

  clearFailures(key)
  await createSession(String(user._id))
  return NextResponse.json({
    _id: String(user._id), username: user.username, displayName: user.displayName, role: user.role,
  })
})
