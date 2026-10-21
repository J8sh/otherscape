import { randomBytes } from 'node:crypto'
import { connectDB } from '@/lib/mongodb'
import { HttpError } from '@/lib/apiHandler'
import { Campaign } from '@/lib/models/Campaign'
import { Character } from '@/lib/models/Character'
import type { SessionUser } from '@/lib/auth/session'
import type { CampaignRole } from '@/types'

/**
 * Who may do what. Site admins can do everything. Inside a campaign:
 *  - MC: edits the campaign, the crew, and every character; manages members.
 *  - Player: edits the crew card and their own characters; reads the rest.
 *  - Spectator: reads everything, edits nothing.
 */
export interface CampaignAccess {
  /** The caller's seat; admins who aren't members act as MC. */
  role: CampaignRole
  isAdmin: boolean
  isOwner: boolean
  canManage: boolean     // campaign details, members, invites
  canEditCrew: boolean   // the shared crew theme card
  canCreateCharacter: boolean
}

interface CampaignLike {
  _id: unknown
  ownerId?: unknown
  members?: { userId: unknown; role: CampaignRole }[]
}

export function campaignAccess(campaign: CampaignLike, user: SessionUser): CampaignAccess | null {
  const isAdmin = user.role === 'admin'
  const isOwner = campaign.ownerId != null && String(campaign.ownerId) === user._id
  const member = campaign.members?.find(m => String(m.userId) === user._id)
  const role: CampaignRole | null = member?.role ?? (isOwner || isAdmin ? 'mc' : null)
  if (!role) return null
  const isMc = role === 'mc' || isAdmin
  return {
    role,
    isAdmin,
    isOwner,
    canManage: isMc,
    canEditCrew: isMc || role === 'player',
    canCreateCharacter: isMc || role === 'player',
  }
}

/** Load a campaign the user can see, or throw 404 (not 403, so ids don't leak). */
export async function loadCampaignFor(id: string, user: SessionUser) {
  await connectDB()
  const campaign = await Campaign.findById(id)
  const access = campaign ? campaignAccess(campaign, user) : null
  if (!campaign || !access) throw new HttpError(404, 'Campaign not found.')
  return { campaign, access }
}

export function canEditCharacter(access: CampaignAccess, character: { ownerId?: unknown }, user: SessionUser) {
  if (access.canManage) return true
  return access.role === 'player' && character.ownerId != null && String(character.ownerId) === user._id
}

/** Load a character plus the caller's access to its campaign, or throw 404. */
export async function loadCharacterFor(id: string, user: SessionUser) {
  await connectDB()
  const character = await Character.findById(id)
  if (!character) throw new HttpError(404, 'Character not found.')
  const { campaign, access } = await loadCampaignFor(String(character.campaignId), user)
  return { character, campaign, access, canEdit: canEditCharacter(access, character, user) }
}

/** Campaign ids the user belongs to (admins: every campaign). */
export async function visibleCampaignFilter(user: SessionUser) {
  if (user.role === 'admin') return {}
  return { $or: [{ ownerId: user._id }, { 'members.userId': user._id }] }
}

export function newInviteCode() {
  // 10 chars of an unambiguous alphabet (no 0/O, 1/I/L) — easy to read aloud at the table.
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = randomBytes(10)
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('')
}

/** Copy only the listed keys from an untrusted body (blocks mass-assignment of owner/members/etc.). */
export function pick<T extends string>(body: Record<string, unknown>, keys: readonly T[]) {
  const out: Partial<Record<T, unknown>> = {}
  for (const k of keys) if (k in body) out[k] = body[k]
  return out
}
