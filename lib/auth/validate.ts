import { HttpError } from '@/lib/apiHandler'

export const USERNAME_RULES = '3–24 characters: letters, numbers, dot, dash or underscore.'
export const PASSWORD_RULES = 'At least 8 characters.'

export function parseUsername(value: unknown) {
  const username = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!/^[a-z0-9._-]{3,24}$/.test(username)) throw new HttpError(400, `Username must be ${USERNAME_RULES}`)
  return username
}

export function parsePassword(value: unknown) {
  const password = typeof value === 'string' ? value : ''
  if (password.length < 8 || password.length > 200) throw new HttpError(400, `Password must be ${PASSWORD_RULES.toLowerCase()}`)
  return password
}

export function parseDisplayName(value: unknown, fallback: string) {
  const name = typeof value === 'string' ? value.trim() : ''
  if (name.length > 40) throw new HttpError(400, 'Display name must be 40 characters or fewer.')
  return name || fallback
}

/** A short required text field (names etc.), trimmed and length-capped. */
export function parseText(value: unknown, label: string, { max = 120, required = false } = {}) {
  const text = typeof value === 'string' ? value.trim() : ''
  if (required && !text) throw new HttpError(400, `${label} is required.`)
  if (text.length > max) throw new HttpError(400, `${label} must be ${max} characters or fewer.`)
  return text
}
