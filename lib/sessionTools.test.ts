import { test } from 'node:test'
import assert from 'node:assert/strict'
import { creditRoll, loadOff, sessionWrap } from './sessionTools.ts'
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

test('session wrap summarizes the credit roll and the rolls', () => {
  const wrap = sessionWrap({ crewTagsRecovered: 1, relationshipsRestored: 2 }, [
    { characterName: 'Rook', outcome: 'strong' }, { characterName: 'Vee', outcome: 'miss' }, { characterName: 'Rook', outcome: 'mixed' },
  ], new Date('2026-10-21T20:00:00Z'))
  assert.equal(wrap.title, 'Session wrap — 2026-10-21')
  assert.match(wrap.body, /1 crew tag recovered, 2 relationship tags restored/)
  assert.match(wrap.body, /Shared rolls: 3 — 1 strong hit, 1 mixed hit, 1 miss\./)
  assert.match(wrap.body, /By character: Rook 2, Vee 1\./)
  assert.match(sessionWrap({ crewTagsRecovered: 0, relationshipsRestored: 0 }, [], new Date()).body, /No shared rolls/)
})
