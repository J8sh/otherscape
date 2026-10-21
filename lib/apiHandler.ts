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
      return await handler(...args)
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

/** Parse a JSON body, answering 400 instead of throwing a 500 on bad input. */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new HttpError(400, 'Expected a JSON object.')
  return body as Record<string, unknown>
}
