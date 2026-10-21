/**
 * Small fetch wrapper for the client: JSON in/out, and the server's
 * `{ error }` message surfaced as the thrown Error's message. A 401 means
 * the session ended, so send the user to sign in again.
 */
export async function api<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  const res = await fetch(path, {
    ...rest,
    headers: json !== undefined ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })
  if (res.status === 401 && typeof window !== 'undefined' && !path.startsWith('/api/auth/')) {
    const next = window.location.pathname + window.location.search
    window.location.href = `/login?next=${encodeURIComponent(next)}`
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`)
  return body as T
}
