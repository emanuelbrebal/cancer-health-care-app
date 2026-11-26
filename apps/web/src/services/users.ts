import type { ApiUser } from '@/types/user'
import { http } from './http'

// GET /users só ADMIN; sem paginação no servidor (máx. 500, ordenado por cadastro desc).
export const USERS_LIMIT = 500

export const usersService = {
  async list(limit = USERS_LIMIT) {
    const { data } = await http.get<ApiUser[]>('/users', { params: { limit } })
    return data
  },

  async get(id: string) {
    const { data } = await http.get<ApiUser>(`/users/${encodeURIComponent(id)}`)
    return data
  },

  async remove(id: string) {
    const { data } = await http.delete<{ message: string }>(`/users/${encodeURIComponent(id)}`)
    return data.message
  },
}
