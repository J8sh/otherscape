import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyHistory, record, redo, undo } from './history.ts'

test('rapid edits coalesce into one undo step', () => {
  let h = emptyHistory<string>()
  h = record(h, 'a', 1000)
  h = record(h, 'ab', 1300)
  h = record(h, 'abc', 1600)
  assert.deepEqual(h.past, ['a'])
  h = record(h, 'abcd', 5000)
  assert.deepEqual(h.past, ['a', 'abcd'])
})

test('undo then redo round-trips, and a new edit clears redo', () => {
  let h = record(record(emptyHistory<number>(), 1, 0), 2, 5000)
  const u = undo(h, 3)!
  assert.equal(u.value, 2)
  const u2 = undo(u.history, 2)!
  assert.equal(u2.value, 1)
  assert.equal(undo(u2.history, 1), null)
  const r = redo(u2.history, 1)!
  assert.equal(r.value, 2)
  h = record(r.history, 2, 9000)
  assert.equal(h.future.length, 0)
  assert.equal(redo(h, 9), null)
})

test('an edit right after undo is its own step, and history is capped', () => {
  const u = undo(record(emptyHistory<number>(), 1, 0), 2)!
  const h = record(u.history, 1, 10)
  assert.deepEqual(h.past, [1])
  let big = emptyHistory<number>()
  for (let i = 0; i < 50; i++) big = record(big, i, i * 2000, 1000, 30)
  assert.equal(big.past.length, 30)
  assert.equal(big.past[0], 20)
})
