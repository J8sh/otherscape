'use client'
import { useState } from 'react'
import { BookMarked } from 'lucide-react'
import { InfoTip } from '@/components/ui/Tooltip'
import { SaveIndicator } from '@/components/ui/SaveIndicator'
import { api } from '@/lib/api'
import { useAutosave } from '@/lib/useAutosave'

/** The series concept and Megacity, written by the MC for the whole table. */
export function SeriesNotes({ campaignId, notes, canManage }: { campaignId: string; notes: string; canManage: boolean }) {
  const [text, setText] = useState(notes)
  const save = useAutosave((seriesNotes: string) => api(`/api/campaigns/${campaignId}`, { method: 'PATCH', json: { seriesNotes } }), 1000)
  if (!canManage && !notes.trim()) return null

  return (
    <section className="panel p-4" aria-labelledby="series-heading">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h2 id="series-heading" className="font-display text-xl tracking-widest flex items-center gap-2" style={{ color: 'var(--accent-lime)' }}>
          <BookMarked size={17} aria-hidden /> THE SERIES
          <InfoTip label="series notes">The series concept, the Megacity, key players and what the crew is about (core book pp. 145–173). The MC writes it; everyone reads it.</InfoTip>
        </h2>
        {canManage && <SaveIndicator state={save.state} error={save.error} />}
      </div>
      {canManage ? (
        <textarea
          className="input"
          rows={6}
          style={{ resize: 'vertical' }}
          value={text}
          maxLength={8000}
          onChange={e => { setText(e.target.value); save.schedule(e.target.value) }}
          placeholder={'Series concept: …\nMegacity: districts, the Noise, who runs what…\nKey players: corps, gangs, Mythoi…\nWhat the crew wants: …'}
          aria-label="Series notes"
        />
      ) : (
        <p className="whitespace-pre-wrap" style={{ color: 'var(--text-soft)', fontFamily: 'Inter, sans-serif', fontSize: 15, lineHeight: 1.6 }}>{notes}</p>
      )}
    </section>
  )
}
