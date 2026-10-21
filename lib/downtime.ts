import { UPGRADE_BOXES, reduceStatus, statusTier } from './rules.ts'
import type { ICharacter, ICrewThemeCard } from '../types/index.ts'

/** Downtime benefit (core book p.124): mark an upgrade, or spend 3 Power. */
export const DOWNTIME_POWER = 3

export interface DowntimeSpend {
  /** Burned theme power tags to recover — 1 Power each during downtime. */
  recover: { theme: number; tag: number }[]
  /** Status index → tiers to remove (1 Power per tier). */
  heal: Record<number, number>
  /** Burned crew power tags (by text) to recover — also 1 Power each. */
  crew?: string[]
}

export function downtimeCost(spend: DowntimeSpend) {
  return spend.recover.length + (spend.crew?.length ?? 0) + Object.values(spend.heal).reduce((a, b) => a + b, 0)
}

/** Apply the 3-Power benefit. Throws if it costs more than the budget. */
export function applyDowntimePower(c: ICharacter, spend: DowntimeSpend, budget = DOWNTIME_POWER): ICharacter {
  if (downtimeCost(spend) > budget) throw new Error(`That costs more than ${budget} Power.`)
  const themes = c.themes.map((t, ti) => ({
    ...t,
    tags: t.tags.map((tag, i) => spend.recover.some(r => r.theme === ti && r.tag === i) ? { ...tag, isBurned: false } : tag),
  }))
  const statuses = c.statuses.flatMap((s, i) => {
    const n = spend.heal[i] ?? 0
    if (!n) return [s]
    const marks = reduceStatus(s.marks?.length ? s.marks : [s.tier], n)
    return marks.length ? [{ ...s, marks, tier: statusTier(marks) }] : []
  })
  return { ...c, themes, statuses }
}

/** Recover burned crew tags (matched by text, so it applies to a freshly read card). */
export function recoverCrewTags(crew: ICrewThemeCard, texts: string[]): ICrewThemeCard {
  const want = new Set(texts)
  return { ...crew, tags: crew.tags.map(t => (t.isBurned && want.has(t.text) ? { ...t, isBurned: false } : t)) }
}

/** The other benefit: one upgrade box on a theme (capped at the track). */
export function applyDowntimeUpgrade(c: ICharacter, themeIndex: number): ICharacter {
  return { ...c, themes: c.themes.map((t, i) => i === themeIndex ? { ...t, upgrade: Math.min(UPGRADE_BOXES, t.upgrade + 1) } : t) }
}
