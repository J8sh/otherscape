// Run with: npm test   (node's built-in test runner, TypeScript via type stripping)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  addEvolution, actionPower, essenceOf, evolutionForReplacedTheme, limitProgress,
  reduceStatus, rollOutcome, spendablePower, stackStatus, statusTier,
} from './rules.ts'

test('essence follows which categories are present', () => {
  assert.equal(essenceOf(['self', 'mythos', 'noise', 'self']), 'NEXUS')
  assert.equal(essenceOf(['self', 'self', 'mythos', 'mythos']), 'SPIRITUALIST')
  assert.equal(essenceOf(['self', 'noise', 'noise', 'noise']), 'CYBORG')
  assert.equal(essenceOf(['mythos', 'noise']), 'TRANSHUMAN')
  assert.equal(essenceOf(['self', 'self', 'self', 'self']), 'REAL')
  assert.equal(essenceOf(['noise', 'noise']), 'SINGULARITY')
  assert.equal(essenceOf(['mythos', 'mythos'], true), 'AVATAR')
  assert.equal(essenceOf(['mythos', 'mythos'], false), 'CONDUIT')
  assert.equal(essenceOf([]), null)
})

test('stacking marks the incoming tier, or the next free box above it', () => {
  assert.deepEqual(stackStatus([3], 2), [2, 3])         // banished-3 + banished-2 stays tier 3
  assert.equal(statusTier(stackStatus([3], 2)), 3)
  assert.deepEqual(stackStatus([4], 4), [4, 5])         // wounded-4 + wounded-4 → wounded-5
  assert.deepEqual(stackStatus([4, 5], 4), [4, 5, 6])   // and again → wounded-6
  assert.deepEqual(stackStatus([], 9), [6])             // caps at 6
})

test('reducing shifts every mark down and erases those below 1', () => {
  assert.deepEqual(reduceStatus([2, 4], 1), [1, 3])     // confident-4 −1 → confident-3
  assert.deepEqual(reduceStatus([2, 4], 3), [1])        // −3 → confident-1
  assert.deepEqual(reduceStatus([1], 1), [])
})

test('rolls: thresholds, snake eyes and boxcars', () => {
  assert.equal(rollOutcome(3, 3, 0).outcome, 'miss')
  assert.equal(rollOutcome(3, 4, 0).outcome, 'mixed')
  assert.equal(rollOutcome(5, 4, 1).outcome, 'strong')
  assert.equal(rollOutcome(1, 1, 10).outcome, 'miss')
  assert.equal(rollOutcome(6, 6, -10).outcome, 'strong')
})

test('power counts tags, burn bonus and the best/worst status', () => {
  assert.equal(actionPower({ positive: 3, negative: 1, bestStatus: 2, worstStatus: 4 }), 0)
  assert.equal(actionPower({ positive: 3, negative: 0, burned: true }), 5)
  assert.equal(actionPower({ positive: 2, negative: 0, scaleGap: -1 }), 1) // lone enforcer vs a small gang
  assert.equal(spendablePower(-2, 'mixed'), 1)
  assert.equal(spendablePower(3, 'strong', true), 4)
  assert.equal(spendablePower(3, 'miss'), 0)
})

test('evolution points', () => {
  assert.equal(evolutionForReplacedTheme({ powerTags: 4, weaknessTags: 2, specials: 0 }), 3) // Unagi's example
  assert.deepEqual(addEvolution(3, 3), { points: 1, momentsEarned: 1 })
})

test('challenge limit progress', () => {
  const st = [{ tier: 2, limit: 'hurt' }, { tier: 3, limit: 'hurt' }, { tier: 4, limit: 'convince' }]
  assert.deepEqual(limitProgress(3, st, 'hurt'), { current: 3, state: 'maxed' })
  assert.deepEqual(limitProgress(3, st, 'convince'), { current: 4, state: 'exceeded' })
  assert.deepEqual(limitProgress(4, st, 'banish'), { current: 0, state: 'open' })
  assert.equal(limitProgress(null, st, 'hurt').state, 'immune')
})

test('going out in a blaze', async () => {
  const { blazeResult } = await import('./rules.ts')
  assert.deepEqual(blazeResult('noReturn', 'strong'), { succeeds: true, price: 'Burn all tags in the theme at stake' })
  assert.equal(blazeResult('noReturn', 'mixed').price, 'Replace the theme at stake')
  assert.equal(blazeResult('noReturn', 'miss').succeeds, false)
  assert.equal(blazeResult('significant', 'strong').price, 'Burn only two tags in the theme at stake')
  assert.equal(blazeResult('inescapable', 'strong').price, 'Take a tier-6 status, whatever you roll')
})

test('polar statuses cancel tier for tier', async () => {
  const { polarOpposite, resolvePolar } = await import('./rules.ts')
  assert.equal(polarOpposite('Hostile'), 'friendly')
  assert.equal(polarOpposite('wounded'), null)
  assert.deepEqual(resolvePolar({ name: 'hostile', tier: 3 }, { name: 'friendly', tier: 2 }), { name: 'hostile', tier: 1 })
  assert.deepEqual(resolvePolar({ name: 'hostile', tier: 3 }, { name: 'friendly', tier: 4 }), { name: 'friendly', tier: 1 })
  assert.equal(resolvePolar({ name: 'hidden', tier: 2 }, { name: 'exposed', tier: 2 }), null)
})
