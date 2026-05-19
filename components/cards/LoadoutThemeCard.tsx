'use client'
import { useState } from 'react'
import { Tooltip } from '@/components/ui/Tooltip'
import { Flame, Search } from 'lucide-react'
import type { ILoadoutThemeCard } from '@/types'

// Street catalog — gear categories with items
const STREET_CATALOG: Record<string, string[]> = {
  'Access & Perks': ['VIP access', 'corporate clearance', 'black market contact', 'safe house', 'police scanner', 'encrypted comms'],
  'Ammo': ['hollow-point rounds', 'armor-piercing rounds', 'incendiary rounds', 'EMP rounds', 'rubber bullets', 'explosive slugs'],
  'Apps, Chips & Databases': ['hacking suite', 'facial recognition chip', 'language translator', 'combat AI', 'city grid access', 'dark web node'],
  'Armor': ['tactical vest', 'full body armor', 'nano-weave jacket', 'shield module', 'ablative plating', 'stealth suit'],
  'Body Attachments & Cybernetics': ['cyber-eyes', 'subdermal armor', 'reflex boosters', 'neural interface', 'retractable blade', 'mag-grip hands'],
  'Cyberspace': ['deck (basic)', 'military-grade deck', 'ICE breaker', 'ghost protocol', 'trace blocker', 'viral payload'],
  'Drones': ['recon drone', 'combat drone', 'swarm drones', 'stealth drone', 'med drone', 'cargo drone'],
  'Enhancers': ['stimulants', 'adrenaline shot', 'focus pills', 'nano-healers', 'strength booster', 'camouflage spray'],
  'Garments & Fashion': ['armored jacket', 'corp disguise', 'gang colors', 'thermal cloak', 'mirror shades', 'stealth bodysuit'],
  'Merc Gear': ['climbing kit', 'breaching charge', 'smoke grenades', 'zip-tie restraints', 'field medkit', 'surveillance package'],
  'Source-Touched Items': ['cursed amulet', 'ritual dagger', 'bound spirit object', 'ley-line compass', 'ghost trap', 'sorcerous ink'],
  'Vehicles': ['motorcycle', 'armored van', 'sports car', 'gyrocopter', 'speedboat', 'off-road buggy'],
  'Weapons': ['assault rifle', 'sawn-off shotgun', 'mono-edge knife', 'stun baton', 'sniper rifle', 'submachine gun', 'grenade launcher', 'plasma pistol'],
}

interface Props {
  loadout: ILoadoutThemeCard
  onChange: (loadout: ILoadoutThemeCard) => void
}

export function LoadoutThemeCard({ loadout, onChange }: Props) {
  const [search, setSearch] = useState('')
  const [showCatalog, setShowCatalog] = useState(false)

  function updateTag(i: number, field: string, value: string | boolean) {
    const tags = loadout.tags.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    onChange({ ...loadout, tags })
  }

  function updateSpecial(i: number, value: string) {
    const specials = loadout.specials.map((s, idx) => idx === i ? value : s)
    onChange({ ...loadout, specials })
  }

  function insertGear(item: string) {
    const emptyIdx = loadout.tags.findIndex(t => !t.text.trim())
    if (emptyIdx === -1) return
    const tags = loadout.tags.map((t, i) => i === emptyIdx ? { ...t, text: item } : t)
    onChange({ ...loadout, tags })
    setSearch('')
  }

  const filtered = search.trim()
    ? Object.entries(STREET_CATALOG).flatMap(([cat, items]) =>
        items.filter(i => i.toLowerCase().includes(search.toLowerCase())).map(i => ({ cat, item: i }))
      )
    : []

  return (
    <div className="rounded-xl overflow-hidden card-chamfer" style={{ background: '#141929', border: '1px solid #2a3352' }}>
      {/* Teal/steel accent bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #4a6a8a, #2a4a6a)' }} />

      <div className="px-4 pt-3 pb-2 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2840' }}>
        <div className="flex-1">
          <Tooltip content="The Loadout Theme Card records your gear and equipment — loadout tags must be selected before a job and provide Power when relevant.">
            <span className="font-display text-xs tracking-widest cursor-help px-2 py-0.5 rounded" style={{ background: '#1a2a3a', color: '#4a9aba', border: '1px solid #2a4a6a' }}>
              LOADOUT
            </span>
          </Tooltip>
          <input
            className="editable-field font-display mt-1"
            style={{ fontSize: 20, letterSpacing: '0.05em' }}
            value={loadout.name}
            onChange={e => onChange({ ...loadout, name: e.target.value })}
            placeholder="LOADOUT THEME NAME"
          />
        </div>
        <Tooltip content="Upgrade (0–2): Loadout upgrades expand your available gear capacity.">
          <div className="flex flex-col items-center gap-1 cursor-help shrink-0">
            <span style={{ color: '#7a8099', fontSize: 10, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em' }}>UPGRADE</span>
            <div className="flex gap-1">
              {[0, 1].map(i => (
                <button
                  key={i}
                  onClick={() => onChange({ ...loadout, upgrade: loadout.upgrade === i + 1 ? i : i + 1 })}
                  style={{
                    width: 16, height: 16, borderRadius: 3,
                    border: `1.5px solid ${i < loadout.upgrade ? '#c8ff00' : '#2a3352'}`,
                    background: i < loadout.upgrade ? '#c8ff00' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Search / catalog picker */}
      <div className="px-4 py-2" style={{ borderBottom: '1px solid #1e2840', background: '#0f1520' }}>
        <div className="flex items-center gap-2">
          <Search size={13} style={{ color: '#7a8099' }} />
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#e8eaf0', fontFamily: 'Rajdhani, sans-serif' }}
            placeholder="Search Street Catalog to add gear..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowCatalog(true) }}
            onFocus={() => setShowCatalog(true)}
          />
          <button
            onClick={() => setShowCatalog(!showCatalog)}
            className="text-xs px-2 py-0.5 rounded transition-colors"
            style={{ color: '#7a8099', border: '1px solid #2a3352', fontFamily: 'Bebas Neue, sans-serif' }}
          >
            {showCatalog ? 'CLOSE' : 'BROWSE'}
          </button>
        </div>
        {/* Search results */}
        {search.trim() && filtered.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {filtered.map(({ cat, item }) => (
              <button
                key={`${cat}-${item}`}
                onClick={() => insertGear(item)}
                className="text-xs px-2 py-0.5 rounded transition-colors hover:bg-opacity-80"
                style={{ background: '#1a2a3a', color: '#4a9aba', border: '1px solid #2a4a6a' }}
                title={cat}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        {/* Browse all */}
        {showCatalog && !search.trim() && (
          <div className="mt-2 max-h-48 overflow-y-auto">
            {Object.entries(STREET_CATALOG).map(([cat, items]) => (
              <div key={cat} className="mb-2">
                <div className="text-xs tracking-widest mb-1" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif' }}>{cat}</div>
                <div className="flex flex-wrap gap-1">
                  {items.map(item => (
                    <button
                      key={item}
                      onClick={() => insertGear(item)}
                      className="text-xs px-2 py-0.5 rounded transition-colors hover:opacity-80"
                      style={{ background: '#1a2a3a', color: '#4a9aba', border: '1px solid #2a4a6a' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Tooltip content="Loadout tags are power tags representing gear you've selected for this job. Must be loaded before the job begins.">
            <span className="font-display text-xs tracking-widest cursor-help" style={{ color: '#7a8099' }}>TAGS</span>
          </Tooltip>
          <div className="flex gap-4 text-xs" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', fontSize: 10 }}>
            <span>FLAW</span>
            <span>BURN</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {loadout.tags.map((tag, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex-1 rounded px-2 py-1"
                style={{
                  background: tag.isBurned ? '#3d2800' : tag.isFlaw ? '#3a1a1a' : '#0f1520',
                  border: `1px solid ${tag.isBurned ? '#6b3d00' : tag.isFlaw ? '#6a3a3a' : '#1e2840'}`,
                  opacity: tag.isBurned ? 0.7 : 1,
                }}
              >
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  style={{
                    color: tag.isBurned ? '#cc7700' : tag.isFlaw ? '#ee9090' : '#e8eaf0',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 500,
                  }}
                  value={tag.text}
                  onChange={e => updateTag(i, 'text', e.target.value)}
                  placeholder={`gear ${i + 1}...`}
                />
              </div>
              <Tooltip content="Flaw — a drawback or limitation of this gear item">
                <button
                  onClick={() => updateTag(i, 'isFlaw', !tag.isFlaw)}
                  className="w-5 h-5 rounded border transition-all"
                  style={{
                    background: tag.isFlaw ? '#6a3a3a' : 'transparent',
                    borderColor: tag.isFlaw ? '#ee9090' : '#2a3352',
                  }}
                />
              </Tooltip>
              <Tooltip content="Burn this gear tag — use it for a major one-time effect, then it's unavailable until recovered">
                <button
                  onClick={() => updateTag(i, 'isBurned', !tag.isBurned)}
                  className="w-5 h-5 flex items-center justify-center rounded border transition-all"
                  style={{
                    background: tag.isBurned ? '#6b3d00' : 'transparent',
                    borderColor: tag.isBurned ? '#cc7700' : '#2a3352',
                    color: tag.isBurned ? '#cc7700' : '#3a4462',
                  }}
                >
                  <Flame size={11} />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Loadout Specials */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid #1e2840' }}>
        <Tooltip content="Loadout Theme Specials are unique rules or abilities tied to your gear theme.">
          <div className="font-display text-xs tracking-widest pt-3 pb-2 cursor-help" style={{ color: '#7a8099' }}>
            LOADOUT SPECIALS
          </div>
        </Tooltip>
        <div className="flex flex-col gap-1">
          {loadout.specials.map((s, i) => (
            <input
              key={i}
              className="editable-field"
              style={{ fontSize: 13 }}
              value={s}
              onChange={e => updateSpecial(i, e.target.value)}
              placeholder={`special ${i + 1}...`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
