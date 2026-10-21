import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import { parseText } from '@/lib/auth/validate'
import { reduceStatus, stackStatus, statusTier } from '@/lib/rules'

type Ctx = { params: Promise<{ id: string; challengeId: string }> }

interface ChallengeStatusDoc { name: string; tier: number; marks?: number[]; type: string; limit?: string }

/**
 * Apply an Effect's status to a Challenge from a roll: { name, tier, op:
 * 'add' | 'reduce', limit? }. Players may only touch revealed Challenges, and
 * only link to Limits the MC has revealed. Stacking follows the book.
 */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id, challengeId } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.canCreateCharacter) throw new HttpError(403, 'Spectators can’t change Challenges.')
  const challenge = campaign.challenges.id(challengeId)
  if (!challenge || (!access.canManage && !challenge.revealed)) throw new HttpError(404, 'Challenge not found.')

  const body = await readJson(req)
  const name = parseText(body.name, 'Status', { required: true, max: 60 })
  const tier = Math.trunc(Number(body.tier))
  if (!(tier >= 1 && tier <= 6)) throw new HttpError(400, 'Tier must be 1–6.')
  const op = body.op === 'reduce' ? 'reduce' : 'add'
  let limit = typeof body.limit === 'string' ? body.limit : ''
  const limitNames: string[] = challenge.limits.map((l: { name: string }) => l.name)
  if (limit && (!limitNames.includes(limit) || (!access.canManage && !challenge.limitsRevealed))) limit = ''

  const statuses = challenge.statuses as ChallengeStatusDoc[]
  const i = statuses.findIndex(s => s.name.trim().toLowerCase() === name.toLowerCase())
  if (op === 'add') {
    if (i >= 0) {
      const marks = stackStatus(statuses[i].marks?.length ? statuses[i].marks! : [statuses[i].tier], tier)
      statuses[i].marks = marks
      statuses[i].tier = statusTier(marks)
      if (limit) statuses[i].limit = limit
    } else {
      statuses.push({ name, tier, marks: [tier], type: 'harmful', limit })
    }
  } else {
    if (i < 0) throw new HttpError(404, `It doesn’t have “${name}”.`)
    const marks = reduceStatus(statuses[i].marks?.length ? statuses[i].marks! : [statuses[i].tier], tier)
    if (marks.length) { statuses[i].marks = marks; statuses[i].tier = statusTier(marks) }
    else statuses.splice(i, 1)
  }
  await campaign.save()
  const s = statuses.find(x => x.name.trim().toLowerCase() === name.toLowerCase())
  return NextResponse.json({ challenge: challenge.name, status: s ? `${s.name}-${s.tier}` : `${name} removed` })
})
