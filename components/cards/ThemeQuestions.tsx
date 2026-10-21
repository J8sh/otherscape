'use client'
import { Plus } from 'lucide-react'
import { THEME_QUESTIONS } from '@/lib/themeQuestions'
import type { ThemeType } from '@/types'

/**
 * “Write your own tags” helper on a theme card: the themebook's power and
 * weakness questions (custom creation, p. 190). Each answer becomes a tag;
 * the + button adds an empty slot of that kind to write it in.
 */
export function ThemeQuestions({ themeType, onAddPower, onAddWeakness }: {
  themeType: ThemeType
  onAddPower: () => void
  onAddWeakness: () => void
}) {
  const q = THEME_QUESTIONS[themeType]
  if (!q) return null
  const row = (text: string, i: number, kind: 'power' | 'weakness') => (
    <li key={`${kind}${i}`} className="flex items-start gap-2 py-1" style={{ borderBottom: '1px solid #00000012' }}>
      <span className="flex-1 text-[15px] leading-snug" style={{ fontWeight: kind === 'power' && i === 0 ? 700 : 500 }}>{text}</span>
      <button
        type="button"
        onClick={kind === 'power' ? onAddPower : onAddWeakness}
        className="flex items-center justify-center rounded-md shrink-0 hover:bg-black/10"
        style={{ width: 36, height: 36, color: kind === 'power' ? '#3d5200' : '#7a3a48' }}
        aria-label={`Add a ${kind} tag answering: ${text}`}
      >
        <Plus size={16} aria-hidden />
      </button>
    </li>
  )
  return (
    <details className="mx-3 mt-2 rounded-lg px-3 py-1 edit-only" style={{ background: 'var(--card-slot)' }}>
      <summary className="cursor-pointer font-display tracking-widest text-sm flex items-center" style={{ minHeight: 40, color: 'var(--card-ink-soft)' }}>
        WRITE YOUR OWN TAGS — {themeType.toUpperCase()} QUESTIONS
      </summary>
      <p className="text-sm mb-1" style={{ color: 'var(--card-ink-soft)' }}>
        Answer the first (bold) question plus two more for power tags, and one weakness question. Keep each answer short — a few words.
      </p>
      <div className="font-display tracking-widest text-xs mt-2" style={{ color: '#3d5200' }}>POWER</div>
      <ul>{q.power.map((t, i) => row(t, i, 'power'))}</ul>
      <div className="font-display tracking-widest text-xs mt-2" style={{ color: '#7a3a48' }}>WEAKNESS</div>
      <ul className="mb-2">{q.weakness.map((t, i) => row(t, i, 'weakness'))}</ul>
    </details>
  )
}
