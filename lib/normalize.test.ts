import { test } from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCrew } from './normalize.ts'

const blank = { text: '', isPower: false, isWeakness: false, isBurned: false }

test('old blank crew rows become 3 power + 1 weakness', () => {
  const crew = normalizeCrew({ name: '', motivation: '', decay: 0, upgrade: 0, specials: ['', ''], tags: Array(8).fill(blank) })
  assert.equal(crew.tags.filter(t => t.isPower).length, 3)
  assert.equal(crew.tags.filter(t => t.isWeakness).length, 1)
  assert.deepEqual(crew.specials, [])
})

test('tags with text are kept as they are', () => {
  const crew = normalizeCrew({ name: '', motivation: '', decay: 0, upgrade: 0, specials: ['Tight Knit'], tags: [
    { text: 'smugglers', isPower: false, isWeakness: false, isBurned: true },
    { text: 'wanted', isPower: false, isWeakness: true, isBurned: false },
  ] })
  assert.equal(crew.tags[0].text, 'smugglers')
  assert.equal(crew.tags[0].isBurned, true)
  assert.equal(crew.tags.at(-1)?.text, 'wanted')
  assert.deepEqual(crew.specials, ['Tight Knit'])
})
