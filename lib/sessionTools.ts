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
