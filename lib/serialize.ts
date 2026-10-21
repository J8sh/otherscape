import { User } from '@/lib/models/User'
import type { CampaignAccess } from '@/lib/auth/access'
import type { ICampaign, ICampaignMember } from '@/types'

interface RawMember { userId: unknown; role: ICampaignMember['role']; joinedAt?: Date }

/** Campaign JSON for one viewer: member names resolved, permissions attached, invite code only for managers. */
export async function serializeCampaign(doc: { toObject?: () => unknown } | Record<string, unknown>, access: CampaignAccess): Promise<ICampaign> {
  const raw = (typeof doc.toObject === 'function' ? doc.toObject() : doc) as Record<string, unknown> & { members?: RawMember[] }
  const members = raw.members ?? []
  const users = await User.find({ _id: { $in: members.map(m => m.userId) } })
    .select('username displayName')
    .lean<{ _id: unknown; username: string; displayName: string }[]>()
  const byId = new Map(users.map(u => [String(u._id), u]))

  const out = JSON.parse(JSON.stringify(raw)) as ICampaign
  out.members = members
    .filter(m => byId.has(String(m.userId)))
    .map(m => {
      const u = byId.get(String(m.userId))!
      return { userId: String(m.userId), username: u.username, displayName: u.displayName, role: m.role, joinedAt: m.joinedAt?.toISOString() }
    })
  out.me = {
    role: access.role,
    isOwner: access.isOwner,
    canManage: access.canManage,
    canEditCrew: access.canEditCrew,
    canCreateCharacter: access.canCreateCharacter,
  }
  if (!access.canManage) {
    delete out.inviteCode
    // Players see only what the MC has revealed — and never her notes, Threats or Specials.
    out.challenges = (out.challenges ?? [])
      .filter(c => c.revealed)
      .map(c => ({
        ...c,
        notes: undefined,
        threats: [],
        specials: [],
        limits: c.limitsRevealed ? c.limits : [],
      }))
  }
  return out
}
