'use client'
import { useState } from 'react'
import { Clapperboard, PackageX } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { api } from '@/lib/api'

/** MC buttons for the book's end-of-session and end-of-job bookkeeping. */
export function TableTools({ campaignId, onDone }: { campaignId: string; onDone: () => void }) {
  const [msg, setMsg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function run(action: 'credit-roll' | 'load-off', question: string) {
    if (!confirm(question)) return
    setBusy(true)
    setMsg(null)
    try {
      const r = await api<{ crewTagsRecovered?: number; relationshipsRestored?: number; characters?: number }>(
        `/api/campaigns/${campaignId}/session`, { method: 'POST', json: { action } })
      setMsg(action === 'credit-roll'
        ? `Credit Roll done: ${r.crewTagsRecovered} crew tag${r.crewTagsRecovered === 1 ? '' : 's'} recovered, ${r.relationshipsRestored} relationship tag${r.relationshipsRestored === 1 ? '' : 's'} restored. Talk through the session, and let players rewrite relationships that changed.`
        : `Loaded off: every loadout tag on ${r.characters} sheet${r.characters === 1 ? '' : 's'} is burnt again.`)
      onDone()
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel p-4" aria-labelledby="tools-heading">
      <h2 id="tools-heading" className="font-display text-xl tracking-widest mb-3" style={{ color: 'var(--accent-lime)' }}>TABLE TOOLS</h2>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-ghost btn-sm flex-1" disabled={busy}
            onClick={() => run('credit-roll', 'Run the Credit Roll? This restores every burned crew relationship tag and recovers one burned crew power tag per character.')}>
            <Clapperboard size={15} aria-hidden /> CREDIT ROLL
          </button>
          <InfoTip label="Credit Roll">End of session: restore all burned crew relationship tags, and recover one crew power tag for each crew member.</InfoTip>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-ghost btn-sm flex-1" disabled={busy}
            onClick={() => run('load-off', 'Load Off every character? All loadout tags become burnt (unpacked) and wildcards are cleared.')}>
            <PackageX size={15} aria-hidden /> LOAD OFF (END OF JOB)
          </button>
          <InfoTip label="Load Off">When the job ends, every loadout tag is burnt again. Players Load Up fresh before the next job.</InfoTip>
        </div>
      </div>
      {msg && <p role="status" className="text-sm mt-3" style={{ color: 'var(--text-soft)' }}>{msg}</p>}
    </section>
  )
}
