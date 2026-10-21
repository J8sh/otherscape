import { NextResponse } from 'next/server'

/** Throw from a route handler to answer with a specific status and message. */
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'HttpError'
  }
}

/**
 * Wraps a route handler so thrown errors are logged and returned as JSON
 * instead of an empty 500 body. HttpErrors keep their status; MongoDB
 * connection/selection failures map to 503 (service unavailable) so clients
 * can distinguish "DB is down" from a genuine server bug.
 */
export function route<A extends unknown[]>(
  handler: (...args: A) => Promise<Response>
) {
  return async (...args: A): Promise<Response> => {
    try {
      const res = await handler(...args)
      // Per-user data: keep it out of browser and shared caches.
      res.headers.set('Cache-Control', 'private, no-store')
      return res
    } catch (err) {
      if (err instanceof HttpError) {
        return NextResponse.json({ error: err.message }, { status: err.status })
      }

      const name = err instanceof Error ? err.name : ''
      const isDbDown =
        name === 'MongooseServerSelectionError' ||
        name === 'MongoNetworkError' ||
        name === 'MongoServerSelectionError'

      console.error('[api] request failed:', err)

      if (isDbDown) {
        return NextResponse.json(
          { error: 'Database unavailable. Please try again shortly.' },
          { status: 503 }
        )
      }
      if (name === 'CastError') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      if (name === 'ValidationError') {
        return NextResponse.json({ error: err instanceof Error ? err.message : 'Invalid data' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

/** A whole character sheet is a few KB; this leaves plenty of room. */
const MAX_BODY_BYTES = 256 * 1024

/** Parse a JSON body, answering 400/413 instead of throwing a 500 on bad or oversized input. */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > MAX_BODY_BYTES) throw new HttpError(413, 'That’s too much data in one save.')
  const text = await req.text()
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, 'That’s too much data in one save.')
  let body: unknown = null
  try { body = JSON.parse(text) } catch { /* handled below */ }
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Expected a JSON object.')
  return body as Record<string, unknown>
}
