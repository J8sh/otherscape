import type { CampaignRole } from '@/types'

export const ROLE_LABEL: Record<CampaignRole, string> = {
  mc: 'MC',
  player: 'PLAYER',
  spectator: 'SPECTATOR',
}

export const ROLE_HELP: Record<CampaignRole, string> = {
  mc: 'Master of Ceremonies — runs the game. Edits the campaign, the crew card and every character, and manages members and invites.',
  player: 'Creates and edits their own characters, can update the shared crew card, and can view everyone else’s sheets.',
  spectator: 'Can view the crew and every character sheet, but can’t change anything.',
}
