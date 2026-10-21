import { test } from 'node:test'
import assert from 'node:assert/strict'
import { TROPES } from './tropes.ts'
import { THEME_BOOK } from './themeBook.ts'

test('every trope kit exists in the Theme Book under its themebook', () => {
  for (const t of TROPES) {
    assert.equal(t.kits.length, 3, t.name)
    assert.equal(t.choose.length, 3, t.name)
    for (const k of [...t.kits, ...t.choose]) {
      const book = THEME_BOOK.find(b => b.type === k.type)
      assert.ok(book, `${t.name}: unknown themebook ${k.type}`)
      assert.ok(book!.kits.some(x => x.name.toLowerCase() === k.kit.toLowerCase()), `${t.name}: no kit “${k.kit}” in ${k.type}`)
    }
  }
})
