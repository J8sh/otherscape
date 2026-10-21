import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { HttpError, route } from '@/lib/apiHandler'
import { requireUser } from '@/lib/auth/session'
import { loadCampaignFor } from '@/lib/auth/access'
import { Character } from '@/lib/models/Character'
import { JournalEntry } from '@/lib/models/JournalEntry'
import { exportCharacter } from '@/lib/characterFile'
import type { ICharacter } from '@/types'

type Ctx = { params: Promise<{ id: string }> }

/**
 * MC-only backup of a whole campaign as one JSON file: details, crew card,
 * Challenges, optional rules, series notes, every character sheet and the
 * journal. Leaves out accounts, member ids and the invite code.
 */
export const GET = route(async (_: Request, { params }: Ctx) => {
  const user = await requireUser()
  const { id } = await params
  const { campaign, access } = await loadCampaignFor(id, user)
  if (!access.canManage) throw new HttpError(403, 'Only the MC can back up the campaign.')
  await connectDB()
  const [characters, journal] = await Promise.all([
    Character.find({ campaignId: campaign._id }).sort({ createdAt: 1 }),
    JournalEntry.find({ campaignId: campaign._id }).sort({ createdAt: 1 }).lean<{ title: string; body: string; kind: string; pinned: boolean; createdAt: Date }[]>(),
  ])
  // Plain JSON first, so dates and ObjectIds become strings.
  const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
  const c = plain(campaign.toObject())
  const backup = {
    format: 'otherscape-campaign-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    campaign: {
      name: c.name, megacity: c.megacity, description: c.description, seriesNotes: c.seriesNotes,
      crewTheme: c.crewTheme, challenges: c.challenges, optionalRules: c.optionalRules,
    },
    characters: characters.map(d => exportCharacter(plain(d.toObject()) as ICharacter)),
    journal: journal.map(e => ({ title: e.title, body: e.body, kind: e.kind, pinned: e.pinned, createdAt: e.createdAt })),
  }
  const slug = (c.name || 'campaign').replace(/[^\w-]+/g, '-').toLowerCase()
  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${slug}-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
})
