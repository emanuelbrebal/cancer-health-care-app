import { useSession, type EndReason } from '@/store/session'
import type { AdminUser } from '@/types/user'
import { http, refreshSession, sessionHttp } from './http'

interface SessionPayload {
  access_token: string
  user: AdminUser
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await sessionHttp.post<SessionPayload>('/login', { email, password })
    useSession.getState().setSession(data.access_token, data.user)
    return data.user
  },

  /** Restaura a sessão no boot pelo cookie; sem cookie válido, fica 'anonymous'. */
  async restore() {
    try {
      await refreshSession()
    } catch {
      useSession.getState().clear()
    }
  },

  /** Encerra no servidor (revoga o refresh e apaga o cookie) e limpa a memória. */
  async logout(reason: EndReason = 'logout') {
    try {
      await sessionHttp.post('/logout')
    } catch {
      // Sem rede, a memória é limpa mesmo assim; o cookie expira sozinho.
    } finally {
      useSession.getState().clear(reason)
    }
  },

  async forgotPassword(email: string) {
    const { data } = await http.post<{ message: string }>('/auth/forgot-password', { email })
    return data.message
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await http.post<{ message: string }>('/auth/reset-password', { token, newPassword })
    return data.message
  },

  /** O backend revoga todas as sessões ao trocar a senha (W01-8): é preciso entrar de novo. */
  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await http.patch<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    })
    useSession.getState().clear('password-changed')
    return data.message
  },
}
