'use client'
import { Tooltip } from '@/components/ui/Tooltip'
import { Flame } from 'lucide-react'
import type { ICrewThemeCard } from '@/types'

interface Props {
  crew: ICrewThemeCard
  onChange: (crew: ICrewThemeCard) => void
}

export function CrewThemeCard({ crew, onChange }: Props) {
  function updateTag(i: number, field: string, value: string | boolean) {
    const tags = crew.tags.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
    onChange({ ...crew, tags })
  }

  function updateSpecial(i: number, value: string) {
    const specials = crew.specials.map((s, idx) => idx === i ? value : s)
    onChange({ ...crew, specials })
  }

  return (
    <div className="rounded-xl overflow-hidden card-chamfer" style={{ background: '#141929', border: '1px solid #2a3352' }}>
      {/* Cyan accent bar — crew color */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, #00d4ff, #0080cc)' }} />

      <div className="px-4 pt-3 pb-2 flex items-start justify-between" style={{ borderBottom: '1px solid #1e2840' }}>
        <div className="flex-1">
          <Tooltip content="The Crew Theme Card represents your whole crew's shared identity, resources, and bonds. All crew members can invoke its tags.">
            <span className="font-display text-xs tracking-widest cursor-help px-2 py-0.5 rounded" style={{ background: '#001a2a', color: '#00d4ff', border: '1px solid #004466' }}>
              CREW THEME
            </span>
          </Tooltip>
          <input
            className="editable-field font-display mt-1"
            style={{ fontSize: 20, letterSpacing: '0.05em' }}
            value={crew.name}
            onChange={e => onChange({ ...crew, name: e.target.value })}
            placeholder="CREW THEME NAME"
          />
        </div>
        {/* Decay / Upgrade */}
        <div className="flex gap-3 pt-1 shrink-0">
          {[
            { label: 'DECAY', max: 3, value: crew.decay, color: '#ff2d7a', tooltip: 'Crew Decay (0–3): Increases when the crew acts against their collective motivation. At 3, the crew theme transforms.' },
            { label: 'UPGRADE', max: 2, value: crew.upgrade, color: '#c8ff00', tooltip: 'Crew Upgrade (0–2): Earned by fully embracing the crew\'s motivation.' },
          ].map(track => (
            <Tooltip key={track.label} content={track.tooltip}>
              <div className="flex flex-col items-center gap-1 cursor-help">
                <span style={{ color: '#7a8099', fontSize: 10, fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em' }}>{track.label}</span>
                <div className="flex gap-1">
                  {Array.from({ length: track.max }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const val = track.label === 'DECAY' ? crew.decay : crew.upgrade
                        const newVal = val === i + 1 ? i : i + 1
                        onChange({ ...crew, [track.label === 'DECAY' ? 'decay' : 'upgrade']: newVal })
                      }}
                      style={{
                        width: 16, height: 16, borderRadius: 3,
                        border: `1.5px solid ${i < track.value ? track.color : '#2a3352'}`,
                        background: i < track.value ? track.color : 'transparent',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Motivation */}
      <div className="px-4 py-2 flex items-center gap-2" style={{ borderBottom: '1px solid #1e2840', background: '#0f1520' }}>
        <Tooltip content="The crew's shared Identity/Ritual/Itch — what drives the crew as a whole. Acting against it marks crew Decay.">
          <span className="font-display text-xs tracking-widest shrink-0 cursor-help" style={{ color: '#00d4ff' }}>
            IDENTITY / RITUAL / ITCH
          </span>
        </Tooltip>
        <input
          className="editable-field"
          style={{ fontSize: 13, color: '#c8d8e8' }}
          value={crew.motivation}
          onChange={e => onChange({ ...crew, motivation: e.target.value })}
          placeholder="Crew motivation..."
        />
      </div>

      {/* Tags */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <Tooltip content="Crew tags — shared descriptors any crew member can invoke. Power tags add +1 Power; Weakness tags subtract −1. BURN for a one-time major effect.">
            <span className="font-display text-xs tracking-widest cursor-help" style={{ color: '#7a8099' }}>TAGS</span>
          </Tooltip>
          <div className="flex gap-4 text-xs" style={{ color: '#7a8099', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', fontSize: 10 }}>
            <span>PWR</span><span>WKN</span><span>BURN</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {crew.tags.map((tag, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="flex-1 rounded px-2 py-1"
                style={{
                  background: tag.isBurned ? '#3d2800' : tag.isPower ? '#1a3a1a' : tag.isWeakness ? '#3a1a1a' : '#0f1520',
                  border: `1px solid ${tag.isBurned ? '#6b3d00' : tag.isPower ? '#3a6a3a' : tag.isWeakness ? '#6a3a3a' : '#1e2840'}`,
                  opacity: tag.isBurned ? 0.7 : 1,
                }}
              >
                <input
                  className="w-full bg-transparent outline-none text-sm"
                  style={{
                    color: tag.isBurned ? '#cc7700' : tag.isPower ? '#90ee90' : tag.isWeakness ? '#ee9090' : '#e8eaf0',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 500,
                    fontStyle: tag.isPower || tag.isWeakness ? 'italic' : 'normal',
                  }}
                  value={tag.text}
                  onChange={e => updateTag(i, 'text', e.target.value)}
                  placeholder={`crew tag ${i + 1}...`}
                />
              </div>
              <Tooltip content="Power tag — adds +1 Power"><button onClick={() => updateTag(i, 'isPower', !tag.isPower)} className="w-5 h-5 rounded border transition-all" style={{ background: tag.isPower ? '#3a6a3a' : 'transparent', borderColor: tag.isPower ? '#90ee90' : '#2a3352' }} /></Tooltip>
              <Tooltip content="Weakness tag — subtracts −1 Power"><button onClick={() => updateTag(i, 'isWeakness', !tag.isWeakness)} className="w-5 h-5 rounded border transition-all" style={{ background: tag.isWeakness ? '#6a3a3a' : 'transparent', borderColor: tag.isWeakness ? '#ee9090' : '#2a3352' }} /></Tooltip>
              <Tooltip content="Burn this tag for a major one-time effect">
                <button onClick={() => updateTag(i, 'isBurned', !tag.isBurned)} className="w-5 h-5 flex items-center justify-center rounded border transition-all" style={{ background: tag.isBurned ? '#6b3d00' : 'transparent', borderColor: tag.isBurned ? '#cc7700' : '#2a3352', color: tag.isBurned ? '#cc7700' : '#3a4462' }}>
                  <Flame size={11} />
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>

      {/* Crew Specials */}
      <div className="px-4 pb-4" style={{ borderTop: '1px solid #1e2840' }}>
        <Tooltip content="Crew Theme Specials — unique abilities unlocked by the crew's shared theme.">
          <div className="font-display text-xs tracking-widest pt-3 pb-2 cursor-help" style={{ color: '#7a8099' }}>CREW THEME SPECIALS</div>
        </Tooltip>
        <div className="flex flex-col gap-1">
          {crew.specials.map((s, i) => (
            <input key={i} className="editable-field" style={{ fontSize: 13 }} value={s} onChange={e => updateSpecial(i, e.target.value)} placeholder={`special ${i + 1}...`} />
          ))}
        </div>
      </div>
    </div>
  )
}
