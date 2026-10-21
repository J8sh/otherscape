import type { ICharacter } from '@/types'

/** Portable character file: just the sheet, no ids, owner or campaign. */
export const FILE_FORMAT = 'otherscape-character'

const FIELDS = ['name', 'player', 'themes', 'loadoutTheme', 'evolution', 'specials', 'crewRelationships', 'statuses', 'storyTags', 'essence', 'notes', 'themeHistory'] as const

/** Drop database ids so an imported sheet gets fresh ones. */
function stripIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([k]) => k !== '_id' && k !== '__v').map(([k, v]) => [k, stripIds(v)]))
  }
  return value
}

export function exportCharacter(c: ICharacter) {
  const sheet = Object.fromEntries(FIELDS.map(f => [f, stripIds((c as unknown as Record<string, unknown>)[f])]))
  return { format: FILE_FORMAT, version: 1, exportedAt: new Date().toISOString(), sheet }
}

export function downloadCharacter(c: ICharacter) {
  const blob = new Blob([JSON.stringify(exportCharacter(c), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(c.name || 'character').replace(/[^\w-]+/g, '-').toLowerCase()}.otherscape.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Read a file picked by the user; throws a friendly error if it isn't a character file. */
export async function readCharacterFile(file: File): Promise<Record<string, unknown>> {
  if (file.size > 200_000) throw new Error('That file is too big to be a character.')
  let data: unknown
  try { data = JSON.parse(await file.text()) } catch { throw new Error('That file isn’t valid JSON.') }
  const d = data as { format?: string; sheet?: unknown }
  if (d?.format !== FILE_FORMAT || !d.sheet || typeof d.sheet !== 'object') throw new Error('That isn’t an exported :Otherscape character.')
  return d.sheet as Record<string, unknown>
}
