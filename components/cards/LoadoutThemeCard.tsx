'use client'
import { Backpack, PackageX, Plus, Sparkles, TriangleAlert, X } from 'lucide-react'
import { Tooltip, InfoTip } from '@/components/ui/Tooltip'
import { BoxTrack, CardStrip, LegendChip, PaperCard, TagSlot } from '@/components/sheet/primitives'
import { UPGRADE_BOXES } from '@/lib/rules'
import { LOADOUT_SPECIALS } from '@/lib/streetCatalog'
import { CatalogPicker } from '@/components/cards/CatalogPicker'
import type { ILoadoutTag, ILoadoutThemeCard } from '@/types'

interface Props {
  loadout: ILoadoutThemeCard
  onChange: (loadout: ILoadoutThemeCard) => void
}

const BASE_LOADING_UP = 1
const WILDCARD_COST = 2

/**
 * The loadout theme: gear you can pack for a job. Loadout tags start burnt
 * (not packed). When the MC calls Loading Up, spend Loading Up Power — 1 per
 * tag you un-burn, or 2 for a wildcard slot to fill later. Loading Off at the
 * end of the job burns everything again.
 */
export function LoadoutThemeCard({ loadout, onChange }: Props) {
  const tags = loadout.tags ?? []
  const bonus = loadout.loadingUpBonus ?? 0
  const wildcards = loadout.wildcards ?? 0
  const loaded = tags.filter(t => t.text.trim() && !t.isBurned).length
  const power = BASE_LOADING_UP + bonus
  const spent = loaded + wildcards * WILDCARD_COST
  const upgradeReady = loadout.upgrade >= UPGRADE_BOXES

  const update = (patch: Partial<ILoadoutThemeCard>) => onChange({ ...loadout, ...patch })
  const updateTag = (i: number, patch: Partial<ILoadoutTag>) => update({ tags: tags.map((t, idx) => idx === i ? { ...t, ...patch } : t) })

  function loadOff() {
    if (!confirm('Load Off: burn every loadout tag and clear wildcards? Do this when the job ends.')) return
    update({ tags: tags.map(t => ({ ...t, isBurned: true })), wildcards: 0 })
  }

  return (
    <PaperCard label="Loadout theme">
      <div className="paper-band flex-wrap">
        <span className="font-display tracking-[0.2em] text-lg">LOADOUT THEME</span>
        <input
          className="flex-1 min-w-[140px] bg-transparent outline-none font-display tracking-wide"
          style={{ fontSize: 22, color: '#10140a' }}
          value={loadout.name}
          onChange={e => update({ name: e.target.value })}
          placeholder="name your kit…"
          aria-label="Loadout name"
        />
      </div>

      {/* Loading Up */}
      <div className="mx-3 mt-3 rounded-lg p-3" style={{ background: 'var(--card-slot)' }}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Backpack size={18} aria-hidden />
            <span className="font-display tracking-widest">LOADING UP</span>
            <InfoTip label="loading up">
              Before a job, you get {BASE_LOADING_UP} Loading Up Power{bonus ? ` (+${bonus} from upgrades)` : ''}, plus 1 per power tag that helps you pack (carrying capacity, toolbelt…). Un-burn a tag for 1 Power each, or buy a wildcard for 2 and fill it with any loadout tag mid-job.
            </InfoTip>
          </div>
          <span className="font-semibold" style={{ color: spent > power ? '#a01838' : 'var(--card-ink)' }}>
            {spent} of {power} Loading Up Power used
          </span>
          {spent > power && (
            <Tooltip content="That’s more than your base Loading Up Power. Fine if tags, downtime Power or the MC granted extra — otherwise un-pack something.">
              <span className="flex items-center gap-1 text-sm font-semibold cursor-help" style={{ color: '#a01838' }}><TriangleAlert size={14} aria-hidden /> over budget?</span>
            </Tooltip>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2 edit-only">
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ wildcards: wildcards + 1 })}>
            <Sparkles size={14} aria-hidden /> + WILDCARD ({WILDCARD_COST})
          </button>
          {wildcards > 0 && (
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ wildcards: wildcards - 1 })}>
              USE / DROP WILDCARD
            </button>
          )}
          <button type="button" className="btn btn-sm btn-danger" onClick={loadOff}><PackageX size={14} aria-hidden /> LOAD OFF</button>
        </div>
        {wildcards > 0 && (
          <p className="text-sm mt-2" style={{ color: 'var(--card-ink-soft)' }}>
            {wildcards} wildcard slot{wildcards > 1 ? 's' : ''} ready — when you need gear mid-job, un-burn a tag below and drop a wildcard.
          </p>
        )}
      </div>

      <CardStrip right={<><LegendChip>FLAW</LegendChip><LegendChip>PACKED</LegendChip></>}>
        TAGS{' '}
        <InfoTip label="loadout tags">
          Loadout tags are gear and access you don’t carry all the time. A burnt (flame) tag isn’t packed for this job. Once packed, use it like any power tag. Each item can have one flaw tag; invoking a flaw is −1 Power and marks an upgrade here.
        </InfoTip>
      </CardStrip>

      {tags.length === 0 && (
        <p className="px-4 pb-2 text-[15px]" style={{ color: 'var(--card-ink-soft)' }}>New characters start with three loadout tags — add your gear below.</p>
      )}
      {tags.map((tag, i) => (
        <TagSlot
          key={i}
          kind={tag.isFlaw ? 'flaw' : 'power'}
          text={tag.text}
          burned={tag.isBurned}
          placeholder={tag.isFlaw ? 'flaw…' : 'gear, contact, access…'}
          onText={text => updateTag(i, { text })}
          onBurn={() => updateTag(i, { isBurned: !tag.isBurned })}
          burnHelp={tag.isBurned ? 'Not packed. Un-burn to load it up (1 Loading Up Power, or use a wildcard mid-job).' : 'Packed for this job. Burn it if it’s used up, lost, or when you Load Off.'}
          onRemove={() => update({ tags: tags.filter((_, idx) => idx !== i) })}
          extra={
            <Tooltip content={tag.isFlaw ? 'This is a flaw (weakness) of your gear. Tap to make it a normal tag.' : 'Mark as a flaw — a weakness of a piece of gear.'}>
              <button type="button" className={`slot-btn edit-only ${tag.isFlaw ? 'is-on' : ''}`} style={tag.isFlaw ? { color: '#a01838' } : undefined} onClick={() => updateTag(i, { isFlaw: !tag.isFlaw })} aria-pressed={tag.isFlaw} aria-label="Flaw">
                <TriangleAlert size={14} />
              </button>
            </Tooltip>
          }
        />
      ))}
      <div className="px-3 edit-only flex gap-2 items-stretch">
        <button type="button" className="flex-1 flex items-center justify-center gap-1 font-display tracking-widest text-sm rounded-lg" style={{ minHeight: 40, border: '2px dashed #a7b0bd', color: 'var(--card-ink-soft)' }}
          onClick={() => update({ tags: [...tags, { text: '', isFlaw: false, isBurned: true }] })}>
          <Plus size={14} aria-hidden /> LOADOUT TAG
        </button>
        <CatalogPicker onAdd={added => update({ tags: [...tags, ...added] })} />
      </div>

      {upgradeReady && (
        <div className="mx-3 mt-3 rounded-lg p-3 edit-only" style={{ background: '#f3ffd0', border: '1px solid #b8d860' }}>
          <div className="font-display tracking-widest" style={{ color: '#3d5200' }}>LOADOUT UPGRADE — CHOOSE ONE</div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => update({ upgrade: 0, loadingUpBonus: bonus + 1 })}>+1 LOADING UP POWER</button>
            <select className="btn btn-sm btn-ghost" value="" aria-label="Choose a loadout special"
              onChange={e => { if (e.target.value) update({ upgrade: 0, specials: [...loadout.specials, e.target.value] }) }}>
              <option value="">LOADOUT SPECIAL…</option>
              {LOADOUT_SPECIALS.filter(sp => !loadout.specials.includes(sp.name)).map(sp => <option key={sp.name} value={sp.name}>{sp.name}</option>)}
            </select>
          </div>
        </div>
      )}

      <CardStrip>
        LOADOUT THEME SPECIALS{' '}
        <InfoTip label="loadout specials">Chosen with loadout upgrades (see the Street Catalog in the core book, p.253).</InfoTip>
      </CardStrip>
      <div className="px-3 space-y-1.5">
        {loadout.specials.map((name, i) => {
          const book = LOADOUT_SPECIALS.find(sp => sp.name === name)
          return book ? (
            <div key={i} className="rounded-lg px-3 py-2 flex items-start justify-between gap-2" style={{ background: 'var(--card-slot)', borderLeft: '5px solid var(--accent-lime)' }}>
              <div>
                <div className="font-display tracking-wide text-lg leading-tight">{book.name}</div>
                <p className="text-[15px] leading-snug" style={{ color: 'var(--card-ink-soft)' }}>{book.summary}</p>
              </div>
              <button type="button" className="slot-btn remove edit-only shrink-0" onClick={() => update({ specials: loadout.specials.filter((_, idx) => idx !== i) })} aria-label={`Remove ${name}`}><X size={14} /></button>
            </div>
          ) : (
            <div key={i} className="-mx-3">
              <TagSlot kind="power" text={name} placeholder="custom loadout special…"
                onText={text => update({ specials: loadout.specials.map((x, idx) => idx === i ? text : x) })}
                onRemove={() => update({ specials: loadout.specials.filter((_, idx) => idx !== i) })} />
            </div>
          )
        })}
        <select
          className="edit-only w-full rounded-lg px-2 font-semibold"
          style={{ minHeight: 40, border: '2px dashed #a7b0bd', background: 'transparent', color: 'var(--card-ink-soft)' }}
          value=""
          onChange={e => { if (e.target.value) update({ specials: [...loadout.specials, e.target.value === '__custom' ? '' : e.target.value] }) }}
          aria-label="Add a loadout special"
        >
          <option value="">+ Add a loadout special (with an upgrade)…</option>
          {LOADOUT_SPECIALS.filter(sp => !loadout.specials.includes(sp.name)).map(sp => <option key={sp.name} value={sp.name}>{sp.name}</option>)}
          <option value="__custom">Custom…</option>
        </select>
      </div>

      <div className="px-3 mt-3 flex justify-end">
        <div className="track-panel">
          <BoxTrack
            label="UPGRADE" value={Math.min(loadout.upgrade, UPGRADE_BOXES)} max={UPGRADE_BOXES} onChange={upgrade => update({ upgrade })}
            help="Mark when one of your gear flaws is invoked. Three marks = a loadout upgrade (+1 Loading Up Power or a Loadout Special). The loadout theme never decays."
          />
        </div>
      </div>
    </PaperCard>
  )
}
