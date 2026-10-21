import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyDowntimePower, applyDowntimeUpgrade, downtimeCost } from './downtime.ts'
import type { ICharacter } from '../types/index.ts'

const c = {
  themes: [{ name: 'A', category: 'self', themeType: 'Expertise', motivation: '', decay: 0, upgrade: 2, specials: [], tags: [
    { text: 'knife', isPower: true, isWeakness: false, isBurned: true },
    { text: 'gun', isPower: true, isWeakness: false, isBurned: true },
  ] }],
  statuses: [{ name: 'wounded', tier: 3, marks: [1, 3], type: 'harmful' }, { name: 'tired', tier: 1, type: 'harmful' }],
} as unknown as ICharacter

test('3 Power recovers tags at 1 each and heals tiers', () => {
  const spend = { recover: [{ theme: 0, tag: 0 }], heal: { 0: 1, 1: 1 } }
  assert.equal(downtimeCost(spend), 3)
  const r = applyDowntimePower(c, spend)
  assert.equal(r.themes[0].tags[0].isBurned, false)
  assert.equal(r.themes[0].tags[1].isBurned, true)
  assert.equal(r.statuses.length, 1)               // tired-1 healed away
  assert.deepEqual(r.statuses[0].marks, [2])       // wounded 1,3 → 2
})

test('over budget throws; upgrade caps at 3', () => {
  assert.throws(() => applyDowntimePower(c, { recover: [{ theme: 0, tag: 0 }, { theme: 0, tag: 1 }], heal: { 0: 2 } }))
  assert.equal(applyDowntimeUpgrade(c, 0).themes[0].upgrade, 3)
  assert.equal(applyDowntimeUpgrade(applyDowntimeUpgrade(c, 0), 0).themes[0].upgrade, 3)
})
