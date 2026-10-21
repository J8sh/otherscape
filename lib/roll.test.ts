import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyRoll, rollD6 } from './roll.ts'
import type { ICharacter } from '../types/index.ts'

function sheet(): ICharacter {
  return {
    _id: 'c1', campaignId: 'k1', name: 'Rook', player: 'P',
    themes: [{
      name: 'Street Samurai', category: 'self', themeType: 'Expertise', motivation: '', decay: 0, upgrade: 2, specials: [],
      tags: [
        { text: 'Street Samurai', isPower: true, isWeakness: false, isBurned: false, isTitle: true },
        { text: 'mono-edge knife', isPower: true, isWeakness: false, isBurned: false },
        { text: 'hot-headed', isPower: false, isWeakness: true, isBurned: false },
      ],
    }],
    loadoutTheme: { name: '', upgrade: 0, specials: [], tags: [{ text: 'smart pistol', isFlaw: false, isBurned: false }, { text: 'jams', isFlaw: true, isBurned: false }] },
    evolution: {} as ICharacter['evolution'],
    specials: [],
    crewRelationships: [{ crewMember: 'Vee', relationshipTag: 'owes me', isBurned: false }],
    statuses: [],
    storyTags: [{ text: 'stim patch' }],
    createdAt: '', updatedAt: '',
  }
}

test('burning a theme tag for power burns it', () => {
  const { character, changes } = applyRoll(sheet(), { positive: [], weaknesses: [], burnedForPower: { kind: 'theme', theme: 0, tag: 1 } })
  assert.equal(character.themes[0].tags[1].isBurned, true)
  assert.match(changes[0], /mono-edge knife/)
})

test('burning a story tag removes it', () => {
  const { character } = applyRoll(sheet(), { positive: [], weaknesses: [], burnedForPower: { kind: 'story', index: 0 } })
  assert.equal(character.storyTags?.length, 0)
})

test('invoked relationship tags burn; weaknesses mark upgrades (capped at 3)', () => {
  const base = sheet()
  const { character } = applyRoll(base, {
    positive: [{ kind: 'relationship', index: 0 }],
    weaknesses: [{ kind: 'theme', theme: 0, tag: 2 }, { kind: 'loadout', index: 1 }],
  })
  assert.equal(character.crewRelationships[0].isBurned, true)
  assert.equal(character.themes[0].upgrade, 3)
  assert.equal(character.loadoutTheme.upgrade, 1)
  assert.equal(base.themes[0].upgrade, 2, 'input sheet is not mutated')
  const again = applyRoll(character, { positive: [], weaknesses: [{ kind: 'theme', theme: 0, tag: 2 }] })
  assert.equal(again.character.themes[0].upgrade, 3)
})

test('d6 stays in range', () => {
  for (let i = 0; i < 500; i++) {
    const d = rollD6()
    assert.ok(d >= 1 && d <= 6 && Number.isInteger(d))
  }
})
