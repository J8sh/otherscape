import type { ICharacter, ICrewThemeCard, ITag } from '@/types'

/**
 * Sheets created before the card redesign were pre-filled with blank rows
 * (8 crew tags, 12 loadout tags, 6 specials…). Drop the blanks and make sure
 * the crew starts like a theme: at least 3 power tags and 1 weakness tag.
 * Pure: returns new objects and never touches tags that have text.
 */
export function normalizeCrew(crew: ICrewThemeCard): ICrewThemeCard {
  const kept = (crew.tags ?? []).filter(t => t.text.trim() || t.isPower || t.isWeakness)
  const powers = kept.filter(t => !t.isWeakness).length
  const blankPower = (): ITag => ({ text: '', isPower: true, isWeakness: false, isBurned: false })
  const tags = [
    ...kept.filter(t => !t.isWeakness),
    ...Array.from({ length: Math.max(0, 3 - powers) }, blankPower),
    ...kept.filter(t => t.isWeakness),
  ]
  if (!tags.some(t => t.isWeakness)) tags.push({ text: '', isPower: false, isWeakness: true, isBurned: false })
  return { ...crew, tags, specials: (crew.specials ?? []).filter(s => s.trim()) }
}

export function normalizeCharacter<T extends ICharacter>(c: T): T {
  const loadout = c.loadoutTheme ?? { name: '', tags: [], upgrade: 0, specials: [] }
  return {
    ...c,
    specials: (c.specials ?? []).filter(s => s.trim()),
    loadoutTheme: {
      ...loadout,
      tags: (loadout.tags ?? []).filter(t => t.text.trim()),
      specials: (loadout.specials ?? []).filter(s => s.trim()),
    },
    storyTags: c.storyTags ?? [],
    crewRelationships: c.crewRelationships ?? [],
  }
}
