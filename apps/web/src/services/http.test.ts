import { AxiosError, AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useSession } from '@/store/session'
import type { AdminUser } from '@/types/user'
import { __resetRefreshForTests, http, sessionHttp } from './http'

const admin: AdminUser = {
  id: 'a1',
  name: 'Admin',
  email: 'admin@oncomente.com',
  role: 'ADMIN',
  pronoun: 'NOT_INFORMED',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function respond<T>(config: InternalAxiosRequestConfig, status: number, data: T): AxiosResponse<T> {
  return { data, status, statusText: String(status), headers: {}, config }
}

function unauthorized(config: InternalAxiosRequestConfig): never {
  const response = respond(config, 401, { message: 'Unauthorized' })
  throw new AxiosError('401', AxiosError.ERR_BAD_REQUEST, config, null, response)
}

const originalHttp = http.defaults.adapter
const originalSession = sessionHttp.defaults.adapter

describe('interceptor de 401 (PRD 01 W01-5)', () => {
  let refreshCalls: number
  let refreshOk: boolean

  beforeEach(() => {
    refreshCalls = 0
    refreshOk = true
    __resetRefreshForTests()
    useSession.setState({ status: 'authenticated', accessToken: 'expired', user: admin, endReason: null })

    sessionHttp.defaults.adapter = async (config) => {
      refreshCalls += 1
      await new Promise((r) => setTimeout(r, 20))
      if (!refreshOk) unauthorized(config)
      return respond(config, 200, { access_token: 'fresh', user: admin })
    }
    // A API aceita só o token novo.
    http.defaults.adapter = async (config) => {
      const auth = AxiosHeaders.from(config.headers).get('Authorization')
      if (auth !== 'Bearer fresh') unauthorized(config)
      return respond(config, 200, { ok: config.url })
    }
  })

  afterEach(() => {
    http.defaults.adapter = originalHttp
    sessionHttp.defaults.adapter = originalSession
  })

  it('requisições simultâneas com token vencido geram UMA renovação e todas concluem', async () => {
    const results = await Promise.all([http.get('/a'), http.get('/b'), http.get('/c')])

    expect(refreshCalls).toBe(1)
    expect(results.map((r) => r.status)).toEqual([200, 200, 200])
    expect(useSession.getState().accessToken).toBe('fresh')
  })

  it('renovação que falha limpa a sessão (vai ao login) e não tenta de novo', async () => {
    refreshOk = false

    await expect(Promise.all([http.get('/a'), http.get('/b')])).rejects.toBeInstanceOf(AxiosError)

    expect(refreshCalls).toBe(1)
    expect(useSession.getState()).toMatchObject({ status: 'anonymous', accessToken: null, endReason: 'expired' })
  })

  it('token válido não chama refresh', async () => {
    useSession.setState({ accessToken: 'fresh' })
    await http.get('/a')
    expect(refreshCalls).toBe(0)
  })
})
