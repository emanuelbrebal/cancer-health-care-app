import { useEffect } from 'react'

export const INACTIVITY_LIMIT_MS = 30 * 60 * 1000

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'] as const

/**
 * Encerra a sessão após 30 min sem interação (PRD 01, "Regras de sessão").
 * Conta pelo relógio, não por um timer: aba em segundo plano também expira.
 */
export function useInactivityLogout(active: boolean, onTimeout: () => void, limitMs = INACTIVITY_LIMIT_MS) {
  useEffect(() => {
    if (!active) return
    let last = Date.now()
    const touch = () => {
      last = Date.now()
    }
    const check = () => {
      if (Date.now() - last >= limitMs) onTimeout()
    }

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, touch, { passive: true }))
    document.addEventListener('visibilitychange', check)
    const timer = window.setInterval(check, Math.min(60_000, limitMs))

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, touch))
      document.removeEventListener('visibilitychange', check)
      window.clearInterval(timer)
    }
  }, [active, onTimeout, limitMs])
}
