import { create } from 'zustand'
import type { AdminUser } from '@/types/user'

// Sessão do painel SÓ em memória (PRD 01): sem persist, nada em localStorage/sessionStorage.
// O refresh token fica em cookie HttpOnly, fora do alcance do JS; F5 restaura via /auth/web/refresh.
type Status = 'unknown' | 'authenticated' | 'anonymous'

/** Por que a sessão acabou: decide a mensagem do login e se guarda `?next=`. */
export type EndReason = 'logout' | 'expired' | 'inactive' | 'password-changed'

interface SessionState {
  status: Status
  accessToken: string | null
  user: AdminUser | null
  endReason: EndReason | null
  setSession: (accessToken: string, user: AdminUser) => void
  clear: (reason?: EndReason) => void
}

export const useSession = create<SessionState>((set) => ({
  status: 'unknown',
  accessToken: null,
  user: null,
  endReason: null,
  setSession: (accessToken, user) => set({ status: 'authenticated', accessToken, user, endReason: null }),
  clear: (reason) =>
    set((s) => ({
      status: 'anonymous',
      accessToken: null,
      user: null,
      // Só marca motivo se havia sessão; boot sem cookie não é "sessão expirada".
      endReason: s.status === 'authenticated' ? (reason ?? 'expired') : (reason ?? null),
    })),
}))
