import { UPGRADE_BOXES } from './rules.ts'
import type { ICharacter } from '../types/index.ts'

/** A tag on a character sheet that can be invoked in a roll. */
export type TagRef =
  | { kind: 'theme'; theme: number; tag: number }
  | { kind: 'story'; index: number }
  | { kind: 'loadout'; index: number }
  | { kind: 'relationship'; index: number }

export const refKey = (r: TagRef) =>
  r.kind === 'theme' ? `theme:${r.theme}:${r.tag}` : `${r.kind}:${r.index}`

export interface RollSelection {
  /** Helpful tags invoked from the sheet. */
  positive: TagRef[]
  /** The sheet's own weakness tags invoked (theme or loadout flaws). */
  weaknesses: TagRef[]
  /** One positive tag burned for +3 instead of +1. */
  burnedForPower?: TagRef | null
}

export interface ApplyResult {
  character: ICharacter
  /** Human-readable list of what changed, for the confirmation message. */
  changes: string[]
}

/**
 * What a roll does to the sheet afterwards:
 *  - the tag burned for Power is burned (a story tag is removed instead);
 *  - crew relationship tags burn whenever they're invoked;
 *  - each invoked theme weakness marks an upgrade box on its theme, and each
 *    loadout flaw on the loadout theme (capped at the track's 3 boxes — the
 *    sheet then prompts for the upgrade).
 */
export function applyRoll(c: ICharacter, sel: RollSelection): ApplyResult {
  const changes: string[] = []
  const themes = c.themes.map(t => ({ ...t, tags: t.tags.map(tag => ({ ...tag })) }))
  const loadout = { ...c.loadoutTheme, tags: (c.loadoutTheme.tags ?? []).map(t => ({ ...t })) }
  let storyTags = (c.storyTags ?? []).map(t => ({ ...t }))
  const relationships = c.crewRelationships.map(r => ({ ...r }))

  const burn = sel.burnedForPower
  if (burn) {
    if (burn.kind === 'theme') {
      const tag = themes[burn.theme]?.tags[burn.tag]
      if (tag) { tag.isBurned = true; changes.push(`Burned “${tag.text}”`) }
    } else if (burn.kind === 'loadout') {
      const tag = loadout.tags[burn.index]
      if (tag) { tag.isBurned = true; changes.push(`Burned “${tag.text}”`) }
    } else if (burn.kind === 'story') {
      const tag = storyTags[burn.index]
      if (tag) { changes.push(`Used up story tag “${tag.text}”`); storyTags = storyTags.filter((_, i) => i !== burn.index) }
    }
  }

  for (const r of sel.positive) {
    if (r.kind === 'relationship' && relationships[r.index] && !relationships[r.index].isBurned) {
      relationships[r.index].isBurned = true
      changes.push(`Burned relationship “${relationships[r.index].relationshipTag}”`)
    }
  }

  for (const r of sel.weaknesses) {
    if (r.kind === 'theme' && themes[r.theme]) {
      const t = themes[r.theme]
      if (t.upgrade < UPGRADE_BOXES) {
        t.upgrade += 1
        changes.push(`Marked upgrade on ${t.name || t.themeType} (${t.upgrade}/${UPGRADE_BOXES})`)
      }
    } else if (r.kind === 'loadout' && loadout.upgrade < UPGRADE_BOXES) {
      loadout.upgrade += 1
      changes.push(`Marked loadout upgrade (${loadout.upgrade}/${UPGRADE_BOXES})`)
    }
  }

  return {
    character: { ...c, themes, loadoutTheme: loadout, storyTags, crewRelationships: relationships },
    changes,
  }
}

/** A fair d6 using the browser/Node crypto RNG. */
export function rollD6(): number {
  const buf = new Uint32Array(1)
  // Rejection sampling avoids modulo bias.
  const limit = Math.floor(0xffffffff / 6) * 6
  do { globalThis.crypto.getRandomValues(buf) } while (buf[0] >= limit)
  return (buf[0] % 6) + 1
}
