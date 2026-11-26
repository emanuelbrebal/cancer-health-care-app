import type {
  LeisureItem,
  LeisurePayload,
  MediaItem,
  MediaKind,
  MediaPayload,
} from '@/features/content/types'
import { http } from './http'

// O backend responde em dois formatos: POST (e PATCH de séries) devolve `{ message, data }`;
// os demais PATCH devolvem o item direto. Este helper aceita os dois.
function unwrap<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body && 'message' in body) {
    return (body as { data: T }).data
  }
  return body as T
}

export const mediaService = {
  async list(kind: MediaKind) {
    const { data } = await http.get<MediaItem[]>(`/${kind}`)
    return data
  },
  async get(kind: MediaKind, id: string) {
    const { data } = await http.get<MediaItem>(`/${kind}/${id}`)
    return data
  },
  async update(kind: MediaKind, id: string, changes: MediaPayload) {
    const { data } = await http.patch(`/${kind}/${id}`, changes)
    return unwrap<MediaItem>(data)
  },
  /** Marca INACTIVE (some do app). */
  async inactivate(kind: MediaKind, id: string) {
    await http.delete(`/${kind}/${id}`)
  },
}

export const leisureService = {
  async list() {
    const { data } = await http.get<LeisureItem[]>('/leisures')
    return data
  },
  async get(id: string) {
    const { data } = await http.get<LeisureItem>(`/leisures/${id}`)
    return data
  },
  async create(payload: LeisurePayload) {
    const { data } = await http.post('/leisures', payload)
    return unwrap<LeisureItem>(data)
  },
  async update(id: string, changes: Partial<LeisurePayload>) {
    const { data } = await http.patch(`/leisures/${id}`, changes)
    return unwrap<LeisureItem>(data)
  },
  async inactivate(id: string) {
    await http.delete(`/leisures/${id}`)
  },
}
