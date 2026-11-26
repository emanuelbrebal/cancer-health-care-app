import { create } from 'zustand'
import type { AdminUser } from '@/types/user'

// Sessão do painel SÓ em memória (PRD 01): sem persist, nada em localStorage/sessionStorage.
// O refresh token fica em cookie HttpOnly, fora do alcance do JS; F5 restaura via /auth/web/refresh.
type Status = 'unknown' | 'authenticated' | 'anonymous'

interface SessionState {
  status: Status
  accessToken: string | null
  user: AdminUser | null
  setSession: (accessToken: string, user: AdminUser) => void
  setAccessToken: (accessToken: string) => void
  clear: () => void
}

export const useSession = create<SessionState>((set) => ({
  status: 'unknown',
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ status: 'authenticated', accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ status: 'anonymous', accessToken: null, user: null }),
}))
