import { NextResponse } from 'next/server'
import { HttpError, readJson, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import { creditRoll, loadOff } from '@/lib/sessionTools'
import { Character } from '@/lib/models/Character'
import type { ICharacter, ICrewThemeCard } from '@/types'

type Ctx = { params: Promise<{ id: string }> }

/**
 * MC table tools that touch every character at once:
 *  - { action: 'credit-roll' } — end of session
 *  - { action: 'load-off' } — end of a job
 */
export const POST = route(async (req: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.canManage) throw new HttpError(403, 'Only the MC can do that.')
  const { action } = await readJson(req)
  const docs = await Character.find({ campaignId: campaign._id })

  if (action === 'credit-roll') {
    const plain = docs.map(d => d.toObject() as ICharacter)
    const result = creditRoll(campaign.crewTheme.toObject() as ICrewThemeCard, plain)
    campaign.set('crewTheme.tags', result.crew.tags)
    await campaign.save()
    await Promise.all(docs.map((d, i) => { d.set('crewRelationships', result.characters[i].crewRelationships); return d.save() }))
    return NextResponse.json(result.summary)
  }

  if (action === 'load-off') {
    await Promise.all(docs.map(d => { d.set('loadoutTheme', loadOff(d.toObject() as ICharacter).loadoutTheme); return d.save() }))
    return NextResponse.json({ characters: docs.length })
  }

  throw new HttpError(400, 'Unknown action.')
})
