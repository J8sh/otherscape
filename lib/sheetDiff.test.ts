import { test } from 'node:test'
import assert from 'node:assert/strict'
import { describeSheetChanges } from './sheetDiff.ts'
import type { ICharacter } from '../types/index.ts'

const base = (): ICharacter => ({
  _id: 'c', campaignId: 'k', name: 'Rook', player: '',
  themes: [{ name: 'T', category: 'self', themeType: 'Expertise', motivation: '', decay: 0, upgrade: 0, specials: [],
    tags: [{ text: 'knife', isPower: true, isWeakness: false, isBurned: false }, { text: 'gun', isPower: true, isWeakness: false, isBurned: true }] }],
  loadoutTheme: { name: '', upgrade: 0, specials: [], tags: [] },
  evolution: {} as ICharacter['evolution'], specials: [], crewRelationships: [],
  statuses: [{ name: 'wounded', tier: 2, type: 'harmful' }, { name: 'scared', tier: 1, type: 'harmful' }],
  storyTags: [{ text: 'stim patch' }],
  createdAt: '', updatedAt: '',
})

test('reports statuses, burned/recovered tags and story tags', () => {
  const prev = base()
  const next = base()
  next.statuses = [{ name: 'wounded', tier: 3, type: 'harmful' }, { name: 'stunned', tier: 1, type: 'hindering' }]
  next.themes[0].tags = [{ ...prev.themes[0].tags[0], isBurned: true }, { ...prev.themes[0].tags[1], isBurned: false }]
  next.storyTags = [{ text: 'keycard' }]
  assert.deepEqual(describeSheetChanges(prev, next), [
    'wounded rose to 3', 'New status: stunned-1', 'scared cleared',
    'Burned: knife', 'Recovered: gun',
    'New story tag: keycard', 'Story tag gone: stim patch',
  ])
})

test('falls back to a generic message', () => {
  const next = base()
  next.notes = 'hello'
  assert.deepEqual(describeSheetChanges(base(), next), ['Other details changed.'])
})
