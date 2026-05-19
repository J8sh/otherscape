'use client'
import { Tooltip } from '@/components/ui/Tooltip'
import type { ICharacter, IEvolution } from '@/types'

// Essence web: 8 axes mapped to theme balance
// Self themes → REAL + SELF; Mythos → AVATAR + SPIRITUALIST; Noise → CYBORG + TRANSHUMAN
// NEXUS and CONDUIT are midpoints

const ESSENCE_NODES = [
  { key: 'REAL', angle: 270, tooltip: 'Real — predominantly Self-themed: grounded in humanity and personal identity' },
  { key: 'CYBORG', angle: 315, tooltip: 'Cyborg — high Noise, lower Mythos: tech-enhanced human' },
  { key: 'SINGULARITY', angle: 0, tooltip: 'Singularity — pure Noise: fully integrated with technology' },
  { key: 'TRANSHUMAN', angle: 45, tooltip: 'Transhuman — high Noise with some Mythos influence' },
  { key: 'AVATAR', angle: 90, tooltip: 'Avatar — pure Mythos: embodiment of a mythical Source' },
  { key: 'SPIRITUALIST', angle: 135, tooltip: 'Spiritualist — high Mythos with Self grounding' },
  { key: 'CONDUIT', angle: 180, tooltip: 'Conduit — balanced between Mythos and Noise' },
  { key: 'NEXUS', angle: 225, tooltip: 'Nexus — balanced across all three forces: Self, Mythos, Noise' },
]

const EVOLUTION_ITEMS: { key: keyof IEvolution; label: string; tooltip: string }[] = [
  { key: 'newEssenceType', label: 'Create a new type of Essence', tooltip: 'Gain access to a new Essence Special by shifting your theme balance' },
  { key: 'broadPowerTag', label: 'Create another broad power tag', tooltip: 'Add a new permanent broad power tag to one of your themes' },
  { key: 'veteranSpecial1', label: 'Gain a Veteran Special', tooltip: 'Unlock a Veteran Special ability (1st)' },
  { key: 'veteranSpecial2', label: 'Gain a Veteran Special', tooltip: 'Unlock a Veteran Special ability (2nd)' },
  { key: 'veteranSpecial3', label: 'Gain a Veteran Special', tooltip: 'Unlock a Veteran Special ability (3rd)' },
  { key: 'retirement', label: 'Ride off into the sunset (Retirement)', tooltip: 'Your character retires from active play — narrative conclusion' },
  { key: 'sunderCosmology', label: 'Sunder the cosmology (Narrative development)', tooltip: 'Permanently alter the world with a major narrative event' },
  { key: 'totalReconstitution', label: 'Total Reconstitution (Respec)', tooltip: 'Rebuild your character from scratch while retaining Essence evolution' },
]

function EssenceWeb({ themes }: { themes: ICharacter['themes'] }) {
  const selfCount = themes.filter(t => t.category === 'self').length
  const mythosCount = themes.filter(t => t.category === 'mythos').length
  const noiseCount = themes.filter(t => t.category === 'noise').length
  const total = Math.max(selfCount + mythosCount + noiseCount, 1)

  // Determine dominant essence node
  let dominant = 'NEXUS'
  if (selfCount >= 3) dominant = 'REAL'
  else if (noiseCount >= 3) dominant = 'SINGULARITY'
  else if (mythosCount >= 3) dominant = 'AVATAR'
  else if (noiseCount > mythosCount && noiseCount > selfCount) dominant = selfCount > mythosCount ? 'CYBORG' : 'TRANSHUMAN'
  else if (mythosCount > noiseCount && mythosCount > selfCount) dominant = selfCount > noiseCount ? 'SPIRITUALIST' : 'CONDUIT'
  else if (selfCount > 0) dominant = 'NEXUS'

  const cx = 80, cy = 80, r = 58

  return (
    <Tooltip content={`Essence web: Self ${selfCount} · Mythos ${mythosCount} · Noise ${noiseCount}. Your dominant nature is ${dominant}.`}>
      <div className="cursor-help" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Grid lines */}
          {ESSENCE_NODES.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180
            return (
              <line
                key={i}
                x1={cx} y1={cy}
                x2={cx + r * Math.cos(rad)}
                y2={cy + r * Math.sin(rad)}
                stroke="#2a3352" strokeWidth="1"
              />
            )
          })}
          {/* Rings */}
          {[0.33, 0.66, 1].map(f => (
            <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="#2a3352" strokeWidth="0.8" />
          ))}
          {/* Theme balance fill */}
          <polygon
            points={ESSENCE_NODES.map(n => {
              const rad = (n.angle * Math.PI) / 180
              let strength = 0
              if (['REAL', 'NEXUS'].includes(n.key)) strength = selfCount / total
              if (['AVATAR', 'SPIRITUALIST'].includes(n.key)) strength = mythosCount / total
              if (['SINGULARITY', 'CYBORG', 'TRANSHUMAN', 'CONDUIT'].includes(n.key)) strength = noiseCount / total
              const dist = 0.15 + strength * 0.85
              return `${cx + r * dist * Math.cos(rad)},${cy + r * dist * Math.sin(rad)}`
            }).join(' ')}
            fill="rgba(0,212,255,0.15)"
            stroke="#00d4ff"
            strokeWidth="1.5"
          />
          {/* Nodes */}
          {ESSENCE_NODES.map((n) => {
            const rad = (n.angle * Math.PI) / 180
            const isDominant = n.key === dominant
            return (
              <g key={n.key}>
                <circle
                  cx={cx + r * Math.cos(rad)}
                  cy={cy + r * Math.sin(rad)}
                  r={isDominant ? 5 : 3}
                  fill={isDominant ? '#c8ff00' : '#2a3352'}
                  stroke={isDominant ? '#c8ff00' : '#4a5a7a'}
                  strokeWidth="1.5"
                />
                <text
                  x={cx + (r + 12) * Math.cos(rad)}
                  y={cy + (r + 12) * Math.sin(rad)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontFamily="Bebas Neue, sans-serif"
                  letterSpacing="0.05em"
                  fill={isDominant ? '#c8ff00' : '#4a5a7a'}
                >
                  {n.key}
                </text>
              </g>
            )
          })}
          {/* Center label */}
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontFamily="Bebas Neue, sans-serif" fill="#c8ff00" letterSpacing="0.08em">
            {dominant}
          </text>
        </svg>
      </div>
    </Tooltip>
  )
}

interface Props {
  character: ICharacter
  onChange: (character: ICharacter) => void
}

export function CharacterCard({ character, onChange }: Props) {
  function update<K extends keyof ICharacter>(key: K, value: ICharacter[K]) {
    onChange({ ...character, [key]: value })
  }

  function updateEvolution(key: keyof IEvolution, value: boolean) {
    onChange({ ...character, evolution: { ...character.evolution, [key]: value } })
  }

  function updateRelationship(i: number, field: 'crewMember' | 'relationshipTag', value: string) {
    const crewRelationships = character.crewRelationships.map((r, idx) =>
      idx === i ? { ...r, [field]: value } : r
    )
    onChange({ ...character, crewRelationships })
  }

  function updateSpecial(i: number, value: string) {
    const specials = character.specials.map((s, idx) => idx === i ? value : s)
    onChange({ ...character, specials })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Card 1: Identity + Essence */}
      <div className="rounded-xl card-chamfer overflow-hidden" style={{ background: '#141929', border: '1px solid #2a3352' }}>
        <div style={{ height: 4, background: '#c8ff00' }} />
        <div className="px-4 pt-3 pb-4">
          <div className="font-display text-2xl tracking-widest mb-4" style={{ color: '#c8ff00' }}>CHARACTER CARD</div>

          {/* Name / Player */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Tooltip content="Your character's name in the :Otherscape world">
                <label className="font-display text-xs tracking-widest block mb-1 cursor-help" style={{ color: '#7a8099' }}>NAME</label>
              </Tooltip>
              <input
                className="editable-field font-display"
                style={{ fontSize: 16 }}
                value={character.name}
                onChange={e => update('name', e.target.value)}
                placeholder="Character name"
              />
            </div>
            <div>
              <Tooltip content="The player controlling this character">
                <label className="font-display text-xs tracking-widest block mb-1 cursor-help" style={{ color: '#7a8099' }}>PLAYER</label>
              </Tooltip>
              <input
                className="editable-field"
                value={character.player}
                onChange={e => update('player', e.target.value)}
                placeholder="Player name"
              />
            </div>
          </div>

          {/* Essence */}
          <div className="flex items-start gap-4 mb-4">
            <div>
              <Tooltip content="Essence — your cosmological nature determined by the balance of Self, Mythos, and Noise themes. It defines your Essence Special ability.">
                <label className="font-display text-xs tracking-widest block mb-2 cursor-help" style={{ color: '#7a8099' }}>ESSENCE</label>
              </Tooltip>
              <EssenceWeb themes={character.themes} />
            </div>
            <div className="flex-1">
              {/* Crew Relationships */}
              <Tooltip content="Crew relationships — tags describing your bond with each crew member. These can be invoked for Power in relevant situations.">
                <label className="font-display text-xs tracking-widest block mb-2 cursor-help" style={{ color: '#7a8099' }}>CREW RELATIONSHIPS</label>
              </Tooltip>
              <div className="flex flex-col gap-2">
                {character.crewRelationships.map((rel, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      className="editable-field"
                      style={{ fontSize: 12 }}
                      value={rel.crewMember}
                      onChange={e => updateRelationship(i, 'crewMember', e.target.value)}
                      placeholder="crew member"
                    />
                    <input
                      className="editable-field"
                      style={{ fontSize: 12 }}
                      value={rel.relationshipTag}
                      onChange={e => updateRelationship(i, 'relationshipTag', e.target.value)}
                      placeholder="relationship tag"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Evolution + Specials */}
      <div className="rounded-xl card-chamfer overflow-hidden" style={{ background: '#141929', border: '1px solid #2a3352' }}>
        <div style={{ height: 4, background: '#c8ff00' }} />
        <div className="px-4 pt-3 pb-4">
          <div className="font-display text-2xl tracking-widest mb-4" style={{ color: '#c8ff00' }}>CHARACTER CARD</div>

          <Tooltip content="Evolution — milestone checkboxes marking your character's major growth moments. Check each when achieved. Each character starts with none.">
            <label className="font-display text-xs tracking-widest block mb-3 cursor-help" style={{ color: '#7a8099' }}>EVOLUTION</label>
          </Tooltip>
          <div className="flex flex-col gap-2 mb-5">
            {EVOLUTION_ITEMS.map(item => (
              <Tooltip key={item.key} content={item.tooltip}>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => updateEvolution(item.key, !character.evolution[item.key])}
                    className="w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-all"
                    style={{
                      borderColor: character.evolution[item.key] ? '#c8ff00' : '#2a3352',
                      background: character.evolution[item.key] ? '#c8ff00' : 'transparent',
                    }}
                  >
                    {character.evolution[item.key] && (
                      <svg width="10" height="10" viewBox="0 0 10 10">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="#080c18" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm group-hover:text-white transition-colors" style={{ color: character.evolution[item.key] ? '#c8ff00' : '#c8d0e0' }}>
                    {item.label}
                  </span>
                </label>
              </Tooltip>
            ))}
          </div>

          {/* Specials */}
          <Tooltip content="Specials — unique abilities your character has earned, including the Essence Special derived from your theme balance.">
            <label className="font-display text-xs tracking-widest block mb-2 cursor-help" style={{ color: '#7a8099' }}>SPECIALS</label>
          </Tooltip>
          <div className="flex flex-col gap-1">
            {character.specials.map((s, i) => (
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
    </div>
  )
}
