import { test } from 'node:test'
import assert from 'node:assert/strict'
import { THEME_QUESTIONS } from './themeQuestions.ts'
import { THEME_BOOK } from './themeBook.ts'

test('every themebook has 10 power and 4 weakness questions', () => {
  assert.equal(Object.keys(THEME_QUESTIONS).length, THEME_BOOK.length)
  for (const b of THEME_BOOK) {
    const q = THEME_QUESTIONS[b.type]
    assert.ok(q, `${b.type} has questions`)
    assert.equal(q.power.length, 10, `${b.type} power`)
    assert.equal(q.weakness.length, 4, `${b.type} weakness`)
  }
})
