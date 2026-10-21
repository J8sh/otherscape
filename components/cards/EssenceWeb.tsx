'use client'
import type { EssenceKey } from '@/lib/rules'
import type { Category } from '@/lib/rules'

/**
 * The Essence hexagon from the character card. The hexagon splits into three
 * diamonds — Self, Mythos, Noise — whose outer corners are the pure
 * Essences (Real, Avatar/Conduit, Singularity); the corners between two
 * diamonds are the mixes (Cyborg, Spiritualist, Transhuman) and Nexus sits
 * in the middle. Categories the character has are filled in.
 */
const SIZE = 220
const C = SIZE / 2
const R = 74

function vertex(deg: number, r = R) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: C + r * Math.cos(rad), y: C + r * Math.sin(rad) }
}

// Pointy-top hexagon, clockwise from the top.
const V = [0, 60, 120, 180, 240, 300].map(d => vertex(d))
const pts = (...ps: { x: number; y: number }[]) => ps.map(p => `${p.x},${p.y}`).join(' ')
const center = { x: C, y: C }

const SECTORS: { cat: Category; color: string; points: string; label: { x: number; y: number } }[] = [
  { cat: 'noise', color: '#29c8f2', points: pts(center, V[5], V[0], V[1]), label: vertex(0, R * 0.5) },
  { cat: 'self', color: '#ff4f6e', points: pts(center, V[1], V[2], V[3]), label: vertex(120, R * 0.5) },
  { cat: 'mythos', color: '#a66bff', points: pts(center, V[3], V[4], V[5]), label: vertex(240, R * 0.5) },
]

const NODES: { key: EssenceKey[]; at: { x: number; y: number }; label: string; anchor: 'start' | 'middle' | 'end'; dy: number }[] = [
  { key: ['SINGULARITY'], at: V[0], label: 'SINGULARITY', anchor: 'middle', dy: -12 },
  { key: ['CYBORG'], at: V[1], label: 'CYBORG', anchor: 'start', dy: -8 },
  { key: ['REAL'], at: V[2], label: 'REAL', anchor: 'start', dy: 14 },
  { key: ['SPIRITUALIST'], at: V[3], label: 'SPIRITUALIST', anchor: 'middle', dy: 18 },
  { key: ['AVATAR', 'CONDUIT'], at: V[4], label: 'AVATAR · CONDUIT', anchor: 'end', dy: 14 },
  { key: ['TRANSHUMAN'], at: V[5], label: 'TRANSHUMAN', anchor: 'end', dy: -8 },
  { key: ['NEXUS'], at: center, label: 'NEXUS', anchor: 'middle', dy: 16 },
]

export function EssenceWeb({ categories, essence }: { categories: Category[]; essence: EssenceKey | null }) {
  const has = new Set(categories)
  return (
    <svg viewBox={`-56 0 ${SIZE + 112} ${SIZE}`} className="w-full max-w-[300px]" role="img" aria-label={`Essence: ${essence ?? 'none yet'}`}>
      <polygon points={pts(...V)} fill="rgba(255,255,255,0.55)" stroke="#9aa3b2" strokeWidth="1.5" />
      {SECTORS.map(s => (
        <g key={s.cat}>
          <polygon points={s.points} fill={s.color} fillOpacity={has.has(s.cat) ? 0.55 : 0.1} stroke={s.color} strokeOpacity={0.7} strokeWidth="1.2" />
          <text x={s.label.x} y={s.label.y} textAnchor="middle" dominantBaseline="middle" fontFamily="Bebas Neue, sans-serif" fontSize="12" letterSpacing="1" fill={has.has(s.cat) ? '#fff' : s.color}>
            {s.cat.toUpperCase()}
          </text>
        </g>
      ))}
      {NODES.map(n => {
        const active = !!essence && n.key.includes(essence)
        return (
          <g key={n.label}>
            <circle cx={n.at.x} cy={n.at.y} r={active ? 7 : 4.5} fill={active ? '#c8ff00' : '#fff'} stroke={active ? '#10140a' : '#7d8798'} strokeWidth={active ? 2 : 1.5} />
            <text
              x={n.at.x + (n.anchor === 'start' ? 8 : n.anchor === 'end' ? -8 : 0)}
              y={n.at.y + n.dy}
              textAnchor={n.anchor}
              fontFamily="Bebas Neue, sans-serif"
              fontSize={active ? 13 : 11}
              letterSpacing="0.5"
              fill={active ? '#10140a' : '#5b6578'}
              fontWeight={active ? 700 : 400}
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
