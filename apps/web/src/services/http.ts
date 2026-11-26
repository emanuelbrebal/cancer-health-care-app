import axios, { AxiosHeaders, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useSession } from '@/store/session'
import type { AdminUser } from '@/types/user'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// Cliente das rotas de sessão por cookie (/auth/web/*): envia credenciais e o header anti-CSRF.
export const sessionHttp = axios.create({
  baseURL: `${API_URL}/auth/web`,
  withCredentials: true,
  headers: { 'X-Requested-With': 'oncomente-admin' },
})

// Cliente das demais rotas: Bearer em memória, sem cookies.
export const http = axios.create({ baseURL: API_URL })

interface SessionPayload {
  access_token: string
  user: AdminUser
}

let refreshing: Promise<string> | null = null

/**
 * Renovação single-flight (PRD 01 W01-5): chamadas simultâneas aguardam a mesma promise,
 * então N requisições com 401 geram uma única chamada a /auth/web/refresh.
 */
export function refreshSession(): Promise<string> {
  if (!refreshing) {
    refreshing = sessionHttp
      .post<SessionPayload>('/refresh')
      .then(({ data }) => {
        useSession.getState().setSession(data.access_token, data.user)
        return data.access_token
      })
      .catch((error: unknown) => {
        useSession.getState().clear()
        throw error
      })
      .finally(() => {
        refreshing = null
      })
  }
  return refreshing
}

http.interceptors.request.use((config) => {
  const token = useSession.getState().accessToken
  if (token) {
    config.headers = AxiosHeaders.from(config.headers)
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

http.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  if (error.response?.status !== 401 || !config || config._retried) throw error

  config._retried = true
  // Se a renovação falhar, a store vira 'anonymous' e o guard leva ao login.
  const token = await refreshSession()
  config.headers.set('Authorization', `Bearer ${token}`)
  return http(config)
})

/** Só para testes: zera a renovação em andamento. */
export function __resetRefreshForTests() {
  refreshing = null
}
