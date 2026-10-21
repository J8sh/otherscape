'use client'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { X } from 'lucide-react'

type Kind = 'info' | 'success' | 'warning'
interface Toast { id: number; title?: string; message: string; kind: Kind }

const ToastContext = createContext<(t: Omit<Toast, 'id' | 'kind'> & { kind?: Kind }) => void>(() => {})

/** Show a short, non-blocking message (announced to screen readers). */
export const useToast = () => useContext(ToastContext)

const COLORS: Record<Kind, string> = { info: 'var(--accent-cyan)', success: 'var(--accent-lime)', warning: '#ffb347' }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => setToasts(ts => ts.filter(t => t.id !== id)), [])
  const show = useCallback((t: Omit<Toast, 'id' | 'kind'> & { kind?: Kind }) => {
    const id = nextId.current++
    setToasts(ts => [...ts.slice(-2), { id, kind: 'info', ...t }])
    setTimeout(() => dismiss(id), 8000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div role="status" aria-live="polite" className="no-print fixed z-[60] left-4 right-4 sm:left-auto sm:right-6 flex flex-col gap-2 pointer-events-none"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 84px)', maxWidth: 420 }}>
        {toasts.map(t => (
          <div key={t.id} className="panel pointer-events-auto px-4 py-3 flex items-start gap-3" style={{ borderColor: COLORS[t.kind], boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}>
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-display tracking-widest" style={{ color: COLORS[t.kind] }}>{t.title}</div>}
              <p className="text-[15px] leading-snug">{t.message}</p>
            </div>
            <button type="button" className="slot-btn shrink-0" style={{ color: 'var(--text-muted)' }} onClick={() => dismiss(t.id)} aria-label="Dismiss"><X size={16} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
