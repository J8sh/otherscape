import type { ICharacter } from '../types/index.ts'

/**
 * A short, human-readable list of what changed between two versions of a
 * sheet — used to tell a player what the MC (or their other device) just did.
 * Covers what usually changes mid-scene; anything else is reported generically.
 */
export function describeSheetChanges(prev: ICharacter, next: ICharacter): string[] {
  const out: string[] = []

  const before = new Map(prev.statuses.map(s => [s.name.trim().toLowerCase(), s]))
  const after = new Map(next.statuses.map(s => [s.name.trim().toLowerCase(), s]))
  for (const [key, s] of after) {
    const old = before.get(key)
    if (!s.name.trim()) continue
    if (!old) out.push(`New status: ${s.name}-${s.tier}`)
    else if (old.tier !== s.tier) out.push(`${s.name} ${s.tier > old.tier ? 'rose' : 'dropped'} to ${s.tier}`)
  }
  for (const [key, s] of before) if (s.name.trim() && !after.has(key)) out.push(`${s.name} cleared`)

  const tagState = (c: ICharacter) => new Map(c.themes.flatMap(t => t.tags.filter(tag => tag.text.trim()).map(tag => [tag.text, tag.isBurned] as const)))
  const tagsBefore = tagState(prev)
  for (const [text, burned] of tagState(next)) {
    const was = tagsBefore.get(text)
    if (was === false && burned) out.push(`Burned: ${text}`)
    else if (was === true && !burned) out.push(`Recovered: ${text}`)
  }

  const story = (c: ICharacter) => new Set((c.storyTags ?? []).map(t => t.text).filter(t => t.trim()))
  const storyBefore = story(prev)
  const storyAfter = story(next)
  for (const t of storyAfter) if (!storyBefore.has(t)) out.push(`New story tag: ${t}`)
  for (const t of storyBefore) if (!storyAfter.has(t)) out.push(`Story tag gone: ${t}`)

  if (out.length === 0) out.push('Other details changed.')
  return out
}
