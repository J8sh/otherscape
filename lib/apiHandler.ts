import { NextResponse } from 'next/server'

/**
 * Wraps a route handler so thrown errors are logged and returned as JSON
 * instead of an empty 500 body. MongoDB connection/selection failures map to
 * 503 (service unavailable) so clients can distinguish "DB is down" from a
 * genuine server bug.
 */
export function route<A extends unknown[]>(
  handler: (...args: A) => Promise<Response>
) {
  return async (...args: A): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (err) {
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
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
