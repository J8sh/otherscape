import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { hashPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'
import { parseDisplayName, parsePassword, parseUsername } from '@/lib/auth/validate'
import { User } from '@/lib/models/User'
import { Campaign } from '@/lib/models/Campaign'
import { Character } from '@/lib/models/Character'

export const POST = route(async (req: Request) => {
  const body = await readJson(req)
  const username = parseUsername(body.username)
  const password = parsePassword(body.password)
  const displayName = parseDisplayName(body.displayName, username)

  await connectDB()
  if (await User.exists({ username })) throw new HttpError(409, 'That username is taken.')

  // The very first account runs the site.
  const isFirst = (await User.estimatedDocumentCount()) === 0
  const user = await User.create({
    username,
    displayName,
    passwordHash: await hashPassword(password),
    role: isFirst ? 'admin' : 'user',
  })

  if (isFirst) {
    // Data created before accounts existed has no owner — the first admin adopts it.
    await Campaign.updateMany(
      { ownerId: { $exists: false } },
      { $set: { ownerId: user._id, members: [{ userId: user._id, role: 'mc', joinedAt: new Date() }] } }
    )
    await Character.updateMany({ ownerId: { $exists: false } }, { $set: { ownerId: user._id } })
  }

  await createSession(String(user._id))
  return NextResponse.json(
    { _id: String(user._id), username, displayName, role: user.role },
    { status: 201 }
  )
})
