import { test } from 'node:test'
import assert from 'node:assert/strict'
import { creditRoll, loadOff } from './sessionTools.ts'
import type { ICharacter, ICrewThemeCard } from '../types/index.ts'

const crew: ICrewThemeCard = {
  name: 'Rats', motivation: '', decay: 0, upgrade: 0, specials: [],
  tags: [
    { text: 'Rats', isPower: true, isWeakness: false, isBurned: true },
    { text: 'safehouse', isPower: true, isWeakness: false, isBurned: true },
    { text: 'van', isPower: true, isWeakness: false, isBurned: true },
    { text: 'wanted', isPower: false, isWeakness: true, isBurned: false },
  ],
}
const pc = (name: string): ICharacter => ({
  _id: name, campaignId: 'k', name, player: '', themes: [], specials: [], statuses: [], createdAt: '', updatedAt: '',
  evolution: {} as ICharacter['evolution'],
  loadoutTheme: { name: '', upgrade: 0, specials: [], wildcards: 2, tags: [{ text: 'rifle', isFlaw: false, isBurned: false }] },
  crewRelationships: [{ crewMember: 'x', relationshipTag: 'trusts me', isBurned: true }],
})

test('credit roll recovers one crew power tag per member and restores relationships', () => {
  const r = creditRoll(crew, [pc('a'), pc('b')])
  assert.equal(r.crew.tags.filter(t => t.isBurned).length, 1)
  assert.equal(r.summary.crewTagsRecovered, 2)
  assert.equal(r.summary.relationshipsRestored, 2)
  assert.ok(r.characters.every(c => c.crewRelationships.every(x => !x.isBurned)))
})

test('load off burns all loadout tags and clears wildcards', () => {
  const c = loadOff(pc('a'))
  assert.equal(c.loadoutTheme.tags[0].isBurned, true)
  assert.equal(c.loadoutTheme.wildcards, 0)
})
