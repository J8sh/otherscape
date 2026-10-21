import { test } from 'node:test'
import assert from 'node:assert/strict'
import { exportCharacter } from './characterFile.ts'
import type { ICharacter } from '../types/index.ts'

test('export keeps dates as ISO strings and drops ids', () => {
  const when = new Date('2026-10-21T12:00:00Z')
  const file = exportCharacter({
    _id: 'x', name: 'Rook', themes: [{ _id: 't1', name: 'A', tags: [] }],
    themeHistory: [{ name: 'Old', replacedAt: when }],
  } as unknown as ICharacter)
  const sheet = file.sheet as Record<string, any>
  assert.equal(sheet.themeHistory[0].replacedAt, '2026-10-21T12:00:00.000Z')
  assert.equal('_id' in sheet.themes[0], false)
})
