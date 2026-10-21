'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Eye, EyeOff, Gauge, Minus, Plus, Swords, Trash2, X } from 'lucide-react'
import { InfoTip, Tooltip } from '@/components/ui/Tooltip'
import { ViewButton } from '@/components/sheet/primitives'
import { CHALLENGE_TEMPLATES } from '@/lib/challengeTemplates'
import { TIER_NAMES, limitProgress, reduceStatus, stackStatus, statusTier } from '@/lib/rules'
import type { ChallengeRole, IChallenge, IChallengeStatus } from '@/types'

const ROLES: { value: ChallengeRole; label: string; help: string }[] = [
  { value: 'attacker', label: 'Attacker', help: 'Wants to hurt the PCs — physically, socially, mentally.' },
  { value: 'barrier', label: 'Barrier / Hazard', help: 'Stands in the way. Usually passive: no Threats unless provoked.' },
  { value: 'countdown', label: 'Countdown', help: 'Something builds toward a crescendo — a bomb, a ritual, rising water.' },
  { value: 'mystery', label: 'Mystery', help: 'Something hidden the PCs want to understand.' },
  { value: 'pursuer', label: 'Pursuer', help: 'Chasing the PCs down.' },
  { value: 'target', label: 'Target', help: 'Something the PCs need that’s getting away.' },
  { value: 'watcher', label: 'Watcher', help: 'Patrolling, searching, or sizing the PCs up.' },
  { value: 'temptation', label: 'Temptation', help: 'Pulls the PCs toward acting a certain way.' },
  { value: 'asset', label: 'Asset', help: 'Someone or something the PCs must protect.' },
  { value: 'other', label: 'Other', help: '' },
]

const STATE_LABEL = {
  immune: { text: 'IMMUNE', color: '#7a8099' },
  open: { text: '', color: '' },
  maxed: { text: 'OVERCOME', color: '#c8ff00' },
  exceeded: { text: 'PERMANENT', color: '#ff4f8b' },
} as const

function blank<T>(list: T[] | undefined) { return list ?? [] }

function ChallengeCard({ challenge, canManage, onChange, onRemove, onDuplicate }: {
  challenge: IChallenge
  canManage: boolean
  onChange: (c: IChallenge) => void
  onRemove: () => void
  onDuplicate: () => void
}) {
  const [open, setOpen] = useState(true)
  const [newStatus, setNewStatus] = useState({ name: '', tier: 1, limit: '' })
  const c = challenge
  const limits = blank(c.limits)
  const statuses = blank(c.statuses)
  const update = (patch: Partial<IChallenge>) => onChange({ ...c, ...patch })

  const overcome = limits.some(l => !l.progress && ['maxed', 'exceeded'].includes(limitProgress(l.max, statuses, l.name).state))

  function setStatus(i: number, s: IChallengeStatus | null) {
    update({ statuses: s ? statuses.map((x, idx) => idx === i ? s : x) : statuses.filter((_, idx) => idx !== i) })
  }
  function withMarks(s: IChallengeStatus, marks: number[]): IChallengeStatus | null {
    const tier = statusTier(marks)
    return tier ? { ...s, marks, tier } : null
  }
  function addStatus(e: React.FormEvent) {
    e.preventDefault()
    const name = newStatus.name.trim()
    if (!name) return
    // Same status again stacks; different statuses that count toward one Limit stay separate.
    const i = statuses.findIndex(s => s.name.toLowerCase() === name.toLowerCase())
    if (i >= 0) setStatus(i, withMarks(statuses[i], stackStatus(statuses[i].marks ?? [statuses[i].tier], newStatus.tier)))
    else update({ statuses: [...statuses, { name, tier: newStatus.tier, marks: [newStatus.tier], type: 'harmful', limit: newStatus.limit }] })
    setNewStatus(s => ({ ...s, name: '' }))
  }

  const field = 'w-full bg-transparent outline-none'
  const role = ROLES.find(r => r.value === c.role) ?? ROLES[0]

  return (
    <article className="challenge-card" style={{ opacity: overcome ? 0.75 : 1 }} aria-label={`Challenge: ${c.name}`}>
      <header className="challenge-head flex-col" style={{ alignItems: 'stretch', gap: 2 }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {canManage ? (
              <select className="challenge-role" value={c.role} onChange={e => update({ role: e.target.value as ChallengeRole })} aria-label="Role">
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label.toUpperCase()}</option>)}
              </select>
            ) : (
              <Tooltip content={role.help}><span className="challenge-role cursor-help">{role.label.toUpperCase()}</span></Tooltip>
            )}
            {overcome && <span className="chip" style={{ color: 'var(--accent-lime)', borderColor: 'var(--accent-lime)' }}>OVERCOME</span>}
            {canManage && !c.revealed && <span className="chip">HIDDEN FROM PLAYERS</span>}
          </div>
        <div className="flex items-center gap-0.5">
          {canManage && (
            <>
              <Tooltip content={c.revealed ? 'Players can see this Challenge. Click to hide it.' : 'Hidden from players. Click to reveal its name, description, tags and statuses.'}>
                <button type="button" className="challenge-icon" onClick={() => update({ revealed: !c.revealed })} aria-pressed={c.revealed} aria-label={c.revealed ? 'Hide from players' : 'Reveal to players'}>
                  {c.revealed ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </Tooltip>
              <Tooltip content={c.limitsRevealed ? 'Players can see its Limits. Click to hide them.' : 'Limits are hidden — players find them by studying the Challenge or by trial and error. Click to reveal.'}>
                <button type="button" className="challenge-icon" onClick={() => update({ limitsRevealed: !c.limitsRevealed })} aria-pressed={!!c.limitsRevealed} aria-label={c.limitsRevealed ? 'Hide Limits from players' : 'Reveal Limits to players'}
                  style={{ color: c.limitsRevealed ? 'var(--accent-lime)' : undefined }}>
                  <Gauge size={17} />
                </button>
              </Tooltip>
              <button type="button" className="challenge-icon" onClick={onDuplicate} aria-label="Duplicate Challenge" title="Duplicate (e.g. a second guard)"><Copy size={16} /></button>
              <button type="button" className="challenge-icon hover:text-[#ff3b5c]" onClick={() => confirm(`Remove “${c.name}”?`) && onRemove()} aria-label="Remove Challenge"><Trash2 size={16} /></button>
            </>
          )}
          <ViewButton className="challenge-icon flex items-center justify-center" onClick={() => setOpen(o => !o)} expanded={open} label={open ? 'Collapse' : 'Expand'}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </ViewButton>
        </div>
        </div>
          {canManage ? (
          <input className={`${field} font-display tracking-wide text-2xl mt-0.5`} value={c.name} onChange={e => update({ name: e.target.value })} aria-label="Challenge name" placeholder="CHALLENGE NAME" />
        ) : <h3 className="font-display tracking-wide text-2xl mt-0.5">{c.name}</h3>}
      </header>

      {open && (
        <div className="challenge-body">
          {canManage ? (
            <textarea className="challenge-text" rows={2} value={c.description} onChange={e => update({ description: e.target.value })} placeholder="What it looks like and how it behaves…" aria-label="Description" />
          ) : c.description && <p className="text-[15px]" style={{ color: 'var(--text-soft)' }}>{c.description}</p>}

          {/* Limits */}
          {(canManage || limits.length > 0) && (
            <section>
              <h4 className="challenge-label">LIMITS <InfoTip label="Limits">A Limit is how much of a kind of status overcomes the Challenge (2 is easy, 6 is incredibly hard; “–” means immune). Statuses counting toward it fill the boxes; reaching it overcomes the Challenge, going past it is permanent. A progress Limit triggers something when it fills.</InfoTip></h4>
              <ul className="space-y-2">
                {limits.map((l, i) => {
                  const { current, state } = limitProgress(l.max, statuses, l.name)
                  const label = l.progress && state === 'maxed' ? { text: 'TRIGGERED', color: '#ffb347' } : STATE_LABEL[state]
                  return (
                    <li key={l._id ?? i} className="challenge-limit">
                      <div className="flex items-center gap-2 flex-wrap">
                        {canManage ? (
                          <>
                            <input className="challenge-input flex-1 min-w-[120px]" value={l.name} onChange={e => update({ limits: limits.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) })} aria-label="Limit name" placeholder="hurt-or-subdue" />
                            <select className="challenge-input" value={l.max ?? ''} onChange={e => update({ limits: limits.map((x, idx) => idx === i ? { ...x, max: e.target.value ? Number(e.target.value) : null } : x) })} aria-label="Limit tier">
                              <option value="">– immune</option>
                              {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <label className="flex items-center gap-1 text-sm"><input type="checkbox" checked={!!l.progress} onChange={e => update({ limits: limits.map((x, idx) => idx === i ? { ...x, progress: e.target.checked } : x) })} /> progress</label>
                            <button type="button" className="challenge-icon" onClick={() => update({ limits: limits.filter((_, idx) => idx !== i) })} aria-label={`Remove Limit ${l.name}`}><X size={14} /></button>
                          </>
                        ) : <span className="font-display tracking-widest">{l.name}{l.progress ? ' (progress)' : ''}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1" aria-label={`${l.name}: ${current} of ${l.max ?? 'immune'}`}>
                          {l.max == null ? <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Can’t be overcome this way.</span>
                            : Array.from({ length: l.max }, (_, n) => (
                              <span key={n} className="limit-box" style={{ background: n < current ? (l.progress ? '#ffb347' : '#ff4f6e') : undefined }} />
                            ))}
                        </div>
                        {l.max != null && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{current}/{l.max}</span>}
                        {label.text && <span className="font-display tracking-widest text-sm" style={{ color: label.color }}>{label.text}</span>}
                      </div>
                      {l.progress && (canManage ? (
                        <input className="challenge-input w-full mt-1" value={l.onMax ?? ''} onChange={e => update({ limits: limits.map((x, idx) => idx === i ? { ...x, onMax: e.target.value } : x) })} placeholder="When it fills…" aria-label="When this Limit fills" />
                      ) : l.onMax && <p className="text-sm mt-1" style={{ color: '#ffb347' }}>When it fills: {l.onMax}</p>)}
                    </li>
                  )
                })}
              </ul>
              {canManage && (
                <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => update({ limits: [...limits, { name: '', max: 3 }] })}><Plus size={14} aria-hidden /> LIMIT</button>
              )}
            </section>
          )}

          {/* Statuses */}
          <section>
            <h4 className="challenge-label">STATUSES <InfoTip label="Challenge statuses">Statuses the crew has inflicted (or the Challenge’s own, like firewalled-2). Link a status to a Limit to fill it. Taking the same status again stacks.</InfoTip></h4>
            {statuses.length === 0 && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>None yet.</p>}
            <ul className="space-y-1.5">
              {statuses.map((s, i) => {
                const marks = s.marks?.length ? s.marks : [s.tier]
                return (
                  <li key={s._id ?? i} className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{s.name}-{s.tier}</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{TIER_NAMES[s.tier]}</span>
                    <div className="flex gap-0.5" aria-hidden>
                      {[1, 2, 3, 4, 5, 6].map(t => <span key={t} className="limit-box small" style={{ background: marks.includes(t) ? '#c938c2' : undefined }} />)}
                    </div>
                    {canManage ? (
                      <span className="ml-auto flex items-center gap-1">
                        <select className="challenge-input text-sm" value={s.limit ?? ''} onChange={e => setStatus(i, { ...s, limit: e.target.value })} aria-label={`Limit for ${s.name}`}>
                          <option value="">(no Limit)</option>
                          {limits.map(l => <option key={l.name} value={l.name}>→ {l.name}</option>)}
                        </select>
                        <button type="button" className="challenge-icon" onClick={() => setStatus(i, withMarks(s, stackStatus(marks, 1)))} aria-label={`Add a tier to ${s.name}`} title="+1 tier (stack)"><Plus size={14} /></button>
                        <button type="button" className="challenge-icon" onClick={() => setStatus(i, withMarks(s, reduceStatus(marks, 1)))} aria-label={`Remove a tier from ${s.name}`} title="−1 tier"><Minus size={14} /></button>
                        <button type="button" className="challenge-icon" onClick={() => setStatus(i, null)} aria-label={`Remove ${s.name}`}><X size={14} /></button>
                      </span>
                    ) : s.limit && <span className="text-xs chip">→ {s.limit}</span>}
                  </li>
                )
              })}
            </ul>
            {canManage && (
              <form onSubmit={addStatus} className="flex flex-wrap gap-2 mt-2">
                <input className="challenge-input flex-1 min-w-[140px]" value={newStatus.name} onChange={e => setNewStatus(s => ({ ...s, name: e.target.value }))} placeholder="e.g. wounded" aria-label="New status name" />
                <select className="challenge-input" value={newStatus.tier} onChange={e => setNewStatus(s => ({ ...s, tier: Number(e.target.value) }))} aria-label="Tier">
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <select className="challenge-input" value={newStatus.limit} onChange={e => setNewStatus(s => ({ ...s, limit: e.target.value }))} aria-label="Counts toward Limit">
                  <option value="">(no Limit)</option>
                  {limits.map(l => <option key={l.name} value={l.name}>→ {l.name}</option>)}
                </select>
                <button type="submit" className="btn btn-primary btn-sm" disabled={!newStatus.name.trim()}><Plus size={14} aria-hidden /> STATUS</button>
              </form>
            )}
          </section>

          {/* Base tags */}
          {(canManage || blank(c.tags).length > 0) && (
            <section>
              <h4 className="challenge-label">TAGS <InfoTip label="Challenge tags">Base tags work against the crew’s rolls (heavy armor makes attacks harder). The crew can remove them with Weaken.</InfoTip></h4>
              <div className="flex flex-wrap gap-1.5">
                {blank(c.tags).map((t, i) => canManage ? (
                  <span key={t._id ?? i} className="inline-flex items-center rounded-lg" style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-card)' }}>
                    <input className="bg-transparent outline-none italic font-semibold px-2" style={{ width: `${Math.max(8, t.text.length + 2)}ch`, minHeight: 36, textDecoration: t.isBurned ? 'line-through' : undefined }}
                      value={t.text} onChange={e => update({ tags: blank(c.tags).map((x, idx) => idx === i ? { ...x, text: e.target.value } : x) })} aria-label="Tag" />
                    <button type="button" className="challenge-icon" onClick={() => update({ tags: blank(c.tags).filter((_, idx) => idx !== i) })} aria-label={`Remove tag ${t.text}`}><X size={13} /></button>
                  </span>
                ) : <span key={t._id ?? i} className="italic font-semibold px-2 py-1 rounded-lg" style={{ background: 'var(--bg-inset)' }}>{t.text}</span>)}
                {canManage && <button type="button" className="btn btn-ghost btn-sm" onClick={() => update({ tags: [...blank(c.tags), { text: '' }] })}><Plus size={14} aria-hidden /> TAG</button>}
              </div>
            </section>
          )}

          {canManage && (
            <>
              <section>
                <h4 className="challenge-label">THREATS → CONSEQUENCES <InfoTip label="Threats">A Threat telegraphs what the Challenge is about to do (on screen, specific). If the crew ignores it, deliver the paired Consequence. Only you see these.</InfoTip></h4>
                <ul className="space-y-2">
                  {blank(c.threats).map((t, i) => (
                    <li key={t._id ?? i} className="grid gap-1 sm:grid-cols-[1fr_1fr_auto] items-center">
                      <input className="challenge-input" value={t.threat} onChange={e => update({ threats: blank(c.threats).map((x, idx) => idx === i ? { ...x, threat: e.target.value } : x) })} placeholder="› Threat: draws a pistol…" aria-label="Threat" />
                      <input className="challenge-input" value={t.consequence} onChange={e => update({ threats: blank(c.threats).map((x, idx) => idx === i ? { ...x, consequence: e.target.value } : x) })} placeholder="» Consequence: fires (shot-3)" aria-label="Consequence" />
                      <button type="button" className="challenge-icon" onClick={() => update({ threats: blank(c.threats).filter((_, idx) => idx !== i) })} aria-label="Remove Threat"><X size={14} /></button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => update({ threats: [...blank(c.threats), { threat: '', consequence: '' }] })}><Plus size={14} aria-hidden /> THREAT</button>
              </section>
              <section>
                <h4 className="challenge-label">SPECIALS <InfoTip label="Challenge specials">Rules unique to this Challenge — “when X happens, do Y”. They interject whenever they trigger.</InfoTip></h4>
                <ul className="space-y-2">
                  {blank(c.specials).map((sp, i) => (
                    <li key={sp._id ?? i} className="grid gap-1 sm:grid-cols-[180px_1fr_auto] items-start">
                      <input className="challenge-input font-display tracking-wide" value={sp.name} onChange={e => update({ specials: blank(c.specials).map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) })} placeholder="Name" aria-label="Special name" />
                      <textarea className="challenge-input" rows={2} value={sp.text} onChange={e => update({ specials: blank(c.specials).map((x, idx) => idx === i ? { ...x, text: e.target.value } : x) })} placeholder="When…, then…" aria-label="Special rule" />
                      <button type="button" className="challenge-icon" onClick={() => update({ specials: blank(c.specials).filter((_, idx) => idx !== i) })} aria-label="Remove Special"><X size={14} /></button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="btn btn-ghost btn-sm mt-2" onClick={() => update({ specials: [...blank(c.specials), { name: '', text: '' }] })}><Plus size={14} aria-hidden /> SPECIAL</button>
              </section>
              <section>
                <h4 className="challenge-label">MC NOTES</h4>
                <textarea className="challenge-text" rows={2} value={c.notes ?? ''} onChange={e => update({ notes: e.target.value })} placeholder="Only you see this." aria-label="MC notes" />
              </section>
            </>
          )}
        </div>
      )}
    </article>
  )
}

interface Props {
  challenges: IChallenge[]
  canManage: boolean
  onChange: (challenges: IChallenge[]) => void
}

/** The scene's Challenges. MCs build and track them; players see only what's revealed. */
export function ChallengesPanel({ challenges, canManage, onChange }: Props) {
  const [template, setTemplate] = useState(0)
  if (!canManage && challenges.length === 0) return null

  function add() {
    const t = CHALLENGE_TEMPLATES[template].challenge
    onChange([...challenges, { ...structuredClone(t), revealed: false, limitsRevealed: false }])
  }

  return (
    <section aria-labelledby="challenges-heading" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 id="challenges-heading" className="font-display text-2xl tracking-widest flex items-center gap-2" style={{ color: '#ff4f6e' }}>
          <Swords size={20} aria-hidden /> CHALLENGES
          <InfoTip label="Challenges">
            Challenges are whatever stands in the crew’s way: enemies, hazards, locked doors, countdowns, mysteries. {canManage
              ? 'Build them here, track the statuses the crew inflicts, and reveal them when the players should see them.'
              : 'Your MC reveals the ones you know about, with the statuses your crew has dealt them.'}
          </InfoTip>
        </h2>
        {canManage && (
          <div className="flex gap-2">
            <select className="input text-sm" style={{ width: 'auto', minHeight: 36 }} value={template} onChange={e => setTemplate(Number(e.target.value))} aria-label="Start from">
              {CHALLENGE_TEMPLATES.map((t, i) => <option key={t.label} value={i}>{t.label}</option>)}
            </select>
            <button type="button" className="btn btn-primary btn-sm" onClick={add}><Plus size={16} aria-hidden /> ADD</button>
          </div>
        )}
      </div>
      {challenges.length === 0 ? (
        <p className="panel p-4" style={{ color: 'var(--text-muted)' }}>No Challenges in play. Add one to track an enemy, obstacle or countdown — it stays hidden from players until you reveal it.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {challenges.map((c, i) => (
            <ChallengeCard
              key={c._id ?? `new-${i}`}
              challenge={c}
              canManage={canManage}
              onChange={next => onChange(challenges.map((x, idx) => idx === i ? next : x))}
              onRemove={() => onChange(challenges.filter((_, idx) => idx !== i))}
              onDuplicate={() => {
                const copy = structuredClone(c)
                delete copy._id
                copy.name = `${c.name} 2`
                onChange([...challenges.slice(0, i + 1), copy, ...challenges.slice(i + 1)])
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}
