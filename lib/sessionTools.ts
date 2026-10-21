import type { ICharacter, ICrewThemeCard } from '../types/index.ts'

/**
 * End-of-session Credit Roll (core book p.125): every crew relationship tag
 * is restored, and the crew recovers one burned crew power tag per crew
 * member (player character).
 */
export function creditRoll(crew: ICrewThemeCard, characters: ICharacter[]) {
  let toRecover = characters.length
  const tags = crew.tags.map(t => {
    if (toRecover > 0 && t.isBurned && !t.isWeakness) { toRecover--; return { ...t, isBurned: false } }
    return t
  })
  const recovered = characters.length - toRecover
  const restored = characters.reduce((n, c) => n + c.crewRelationships.filter(r => r.isBurned).length, 0)
  return {
    crew: { ...crew, tags },
    characters: characters.map(c => ({ ...c, crewRelationships: c.crewRelationships.map(r => ({ ...r, isBurned: false })) })),
    summary: { crewTagsRecovered: recovered, relationshipsRestored: restored },
  }
}

/** End of a job (p.116): every loadout tag is burnt again and unused wildcards are lost. */
export function loadOff(character: ICharacter): ICharacter {
  return {
    ...character,
    loadoutTheme: {
      ...character.loadoutTheme,
      tags: (character.loadoutTheme.tags ?? []).map(t => ({ ...t, isBurned: true })),
      wildcards: 0,
    },
  }
}

export interface WrapRoll { characterName: string; outcome: 'strong' | 'mixed' | 'miss' }

/**
 * The journal entry the Credit Roll leaves behind: what it restored, and a
 * tally of the session's shared rolls — a starting point for the recap.
 */
export function sessionWrap(
  summary: { crewTagsRecovered: number; relationshipsRestored: number },
  rolls: WrapRoll[],
  date: Date,
): { title: string; body: string } {
  const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
  const lines = [
    `Credit Roll: ${plural(summary.crewTagsRecovered, 'crew tag')} recovered, ${plural(summary.relationshipsRestored, 'relationship tag')} restored.`,
  ]
  if (rolls.length) {
    const count = (o: WrapRoll['outcome']) => rolls.filter(r => r.outcome === o).length
    lines.push(`Shared rolls: ${rolls.length} — ${plural(count('strong'), 'strong hit')}, ${plural(count('mixed'), 'mixed hit')}, ${plural(count('miss'), 'miss', 'misses')}.`)
    const per = new Map<string, number>()
    for (const r of rolls) per.set(r.characterName || 'Unnamed', (per.get(r.characterName || 'Unnamed') ?? 0) + 1)
    lines.push(`By character: ${[...per].map(([name, n]) => `${name} ${n}`).join(', ')}.`)
  } else {
    lines.push('No shared rolls this session.')
  }
  lines.push('', 'What happened? Write the recap here.')
  return { title: `Session wrap — ${date.toISOString().slice(0, 10)}`, body: lines.join('\n') }
}
