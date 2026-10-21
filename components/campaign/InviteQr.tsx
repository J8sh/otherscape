'use client'
import { useEffect, useState } from 'react'

/** The invite link as a QR code, for players joining at the table. */
export function InviteQr({ url }: { url: string }) {
  const [svg, setSvg] = useState<string | null>(null)
  useEffect(() => {
    let live = true
    import('qrcode')
      .then(QR => QR.toString(url, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#080c18', light: '#ffffff' } }))
      .then(s => { if (live) setSvg(s) })
      .catch(() => { if (live) setSvg(null) })
    return () => { live = false }
  }, [url])
  if (!svg) return null
  return (
    <figure className="mt-3 flex flex-col items-center gap-1">
      <div className="rounded-lg overflow-hidden" style={{ width: 200, height: 200, background: '#fff' }}
        role="img" aria-label="QR code for the invite link" dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        Players can scan this to join.
        {/\/\/(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url) && (
          <span className="block mt-1" style={{ color: '#ffd9a0' }}>This link says “localhost”, which only works on this computer — open the site by its network address or domain so phones can reach it.</span>
        )}
      </figcaption>
    </figure>
  )
}
