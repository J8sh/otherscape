/**
 * Pure rule helpers for :Otherscape bookkeeping. Kept free of React and
 * Mongo so they can be tested on their own (see lib/rules.test.ts).
 */

export type Category = 'self' | 'mythos' | 'noise'

// ── Tracks ────────────────────────────────────────────────────────────────
/** Every theme (and the crew and loadout themes) has 3 upgrade boxes and 3 decay boxes. */
export const UPGRADE_BOXES = 3
export const DECAY_BOXES = 3
/** Five Evolution points earn a Moment of Evolution. */
export const EVOLUTION_TRACK = 5
/** Default status Limit for player characters: tier 5 overcomes, tier 6 is permanent. */
export const PC_STATUS_LIMIT = 5

// ── Essence ───────────────────────────────────────────────────────────────
export type EssenceKey =
  | 'NEXUS' | 'SPIRITUALIST' | 'CYBORG' | 'TRANSHUMAN'
  | 'REAL' | 'AVATAR' | 'CONDUIT' | 'SINGULARITY'

/**
 * Essence comes from which theme categories a character has (not how many):
 * all three → Nexus; two → Spiritualist (Self+Mythos), Cyborg (Self+Noise),
 * Transhuman (Mythos+Noise); one → Real (Self), Singularity (Noise), or for
 * Mythos-only, Avatar (one shared Source) vs Conduit (different Sources).
 */
export function essenceOf(categories: Category[], mythosSameSource = false): EssenceKey | null {
  const has = new Set(categories)
  const self = has.has('self'), mythos = has.has('mythos'), noise = has.has('noise')
  if (self && mythos && noise) return 'NEXUS'
  if (self && mythos) return 'SPIRITUALIST'
  if (self && noise) return 'CYBORG'
  if (mythos && noise) return 'TRANSHUMAN'
  if (self) return 'REAL'
  if (noise) return 'SINGULARITY'
  if (mythos) return mythosSameSource ? 'AVATAR' : 'CONDUIT'
  return null
}

// ── Statuses ──────────────────────────────────────────────────────────────
export const TIER_NAMES = ['', 'Mild', 'Minor', 'Major', 'Dramatic', 'Incapacitating', 'Lethal / permanent'] as const

/** A status's tier is its highest marked box (0 = gone). */
export function statusTier(marks: number[]) {
  return marks.length ? Math.max(...marks) : 0
}

/**
 * Stack an incoming tier onto a status: mark that box, or if it's already
 * marked, the next unmarked box above it. Tiers above 6 cap at 6.
 */
export function stackStatus(marks: number[], incoming: number): number[] {
  if (incoming <= 0) return [...marks].sort((a, b) => a - b)
  const set = new Set(marks)
  let t = Math.min(incoming, 6)
  while (set.has(t) && t < 6) t++
  set.add(t)
  return [...set].sort((a, b) => a - b)
}

/** Remove tiers: every mark shifts down by `amount`; marks pushed below 1 are erased. */
export function reduceStatus(marks: number[], amount: number): number[] {
  return [...new Set(marks.map(m => m - amount).filter(m => m >= 1))].sort((a, b) => a - b)
}

// ── Action rolls ──────────────────────────────────────────────────────────
export type Outcome = 'miss' | 'mixed' | 'strong'

/**
 * Power = positive tags − negative tags + best helpful status − worst
 * hindering status. A burned-for-Power tag counts as 3 instead of 1.
 */
export function actionPower(opts: { positive: number; negative: number; burned?: boolean; bestStatus?: number; worstStatus?: number }) {
  const burnBonus = opts.burned ? 2 : 0
  return opts.positive + burnBonus - opts.negative + (opts.bestStatus ?? 0) - (opts.worstStatus ?? 0)
}

/** 2d6 + Power: 6− miss, 7–9 mixed, 10+ strong. Snake eyes always miss; boxcars always hit strong. */
export function rollOutcome(d1: number, d2: number, power: number): { total: number; outcome: Outcome } {
  const total = d1 + d2 + power
  if (d1 === 1 && d2 === 1) return { total, outcome: 'miss' }
  if (d1 === 6 && d2 === 6) return { total, outcome: 'strong' }
  return { total, outcome: total >= 10 ? 'strong' : total >= 7 ? 'mixed' : 'miss' }
}

/** Power available to spend on Effects after a hit (Rule of Minimum One, +1 for taking Consequences on a strong hit). */
export function spendablePower(power: number, outcome: Outcome, pushedStrongHit = false) {
  if (outcome === 'miss') return 0
  return Math.max(power, 1) + (outcome === 'strong' && pushedStrongHit ? 1 : 0)
}

// ── Evolution ─────────────────────────────────────────────────────────────
/** Evolution points earned by replacing a theme (p.138). */
export function evolutionForReplacedTheme(t: { powerTags: number; weaknessTags: number; specials: number }) {
  return 1 + Math.max(0, t.powerTags - 3) + Math.max(0, t.weaknessTags - 1) + t.specials
}

/** Add Evolution points; every 5 earns a Moment of Evolution and the track resets. */
export function addEvolution(points: number, gained: number) {
  const total = points + gained
  return { points: total % EVOLUTION_TRACK, momentsEarned: Math.floor(total / EVOLUTION_TRACK) }
}

// ── Challenges ────────────────────────────────────────────────────────────
export type LimitState = 'immune' | 'open' | 'maxed' | 'exceeded'

/**
 * How close a Challenge is to a Limit: the highest tier among statuses
 * counting toward it. Reaching the Limit overcomes the Challenge (or, for a
 * progress Limit, triggers what it was building to); going past it makes
 * the outcome permanent.
 */
export function limitProgress(max: number | null, statuses: { tier: number; limit?: string }[], limitName: string) {
  const current = statuses.filter(s => s.limit === limitName).reduce((m, s) => Math.max(m, s.tier), 0)
  const state: LimitState = max == null ? 'immune' : current > max ? 'exceeded' : current === max ? 'maxed' : 'open'
  return { current, state }
}
