'use client'
import { Plus, ThumbsDown } from 'lucide-react'
import { Tooltip, InfoTip } from '@/components/ui/Tooltip'
import { CardStrip, PaperCard, TagSlot } from '@/components/sheet/primitives'
import type { IStoryTag } from '@/types'

/**
 * Temporary tags from play — a borrowed gyrocycle, a summoned spirit, a
 * contact's favor. They expire when the story says so. Burning one (for +3
 * Power, or because it's used up) removes it.
 */
export function StoryTagsCard({ tags, onChange }: { tags: IStoryTag[]; onChange: (tags: IStoryTag[]) => void }) {
  const update = (i: number, patch: Partial<IStoryTag>) => onChange(tags.map((t, idx) => idx === i ? { ...t, ...patch } : t))

  return (
    <PaperCard accent="#7fe8ff" label="Story tags">
      <div className="paper-band" style={{ background: 'linear-gradient(90deg, #5fe0ff, #a8f0ff)' }}>
        <span className="font-display tracking-[0.2em] text-lg">STORY TAGS</span>
        <InfoTip label="story tags">
          Situational tags from the scene: items you grabbed, allies you called, abilities you were granted. Each relevant one is ±1 Power. They expire when the MC says so — keep one for later by moving it to your loadout. Burning a story tag (e.g. a consumable, for +3 Power) removes it.
        </InfoTip>
      </div>
      <CardStrip>ACTIVE</CardStrip>
      {tags.length === 0 && <p className="px-4 pb-1 text-[15px]" style={{ color: 'var(--card-ink-soft)' }}>None right now.</p>}
      {tags.map((tag, i) => (
        <TagSlot
          key={tag._id ?? i}
          kind={tag.isNegative ? 'weakness' : 'story'}
          text={tag.text}
          placeholder="story tag…"
          onText={text => update(i, { text })}
          onRemove={() => onChange(tags.filter((_, idx) => idx !== i))}
          extra={
            <Tooltip content={tag.isNegative ? 'Works against you. Tap to make it helpful.' : 'Mark as working against you (−1 Power when relevant).'}>
              <button type="button" className={`slot-btn edit-only ${tag.isNegative ? 'is-on' : ''}`} style={tag.isNegative ? { color: '#a01838' } : undefined} onClick={() => update(i, { isNegative: !tag.isNegative })} aria-pressed={!!tag.isNegative} aria-label="Works against me">
                <ThumbsDown size={14} />
              </button>
            </Tooltip>
          }
        />
      ))}
      <div className="px-3 edit-only">
        <button type="button" className="w-full flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
          onClick={() => onChange([...tags, { text: '', isBurned: false, isNegative: false }])}>
          <Plus size={14} aria-hidden /> STORY TAG
        </button>
      </div>
    </PaperCard>
  )
}
