// Estado da lista de conteúdo na URL (`useSearchParams`): filtros, busca e página. Os nomes dos
// parâmetros são os mesmos da API `/admin/*`, então voltar do formulário reabre a mesma consulta.
import type { ContentStatus, Frequency, LeisureType } from './types'
import { frequencyLabels, leisureTypeLabels } from './labels'

export const PAGE_SIZE = 20

export interface ListFilters {
  status: ContentStatus | ''
  search: string
  /** Mídia */
  genreId: string
  isFree: 'true' | 'false' | ''
  /** Lazer */
  type: LeisureType | ''
  frequency: Frequency | ''
  page: number
}

export const emptyFilters: ListFilters = {
  status: '',
  search: '',
  genreId: '',
  isFree: '',
  type: '',
  frequency: '',
  page: 1,
}

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | '' =>
  value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : ''

const leisureTypes = Object.keys(leisureTypeLabels) as LeisureType[]
const frequencies = Object.keys(frequencyLabels) as Frequency[]

/** URL → filtros. Valores desconhecidos viram "todos"; página inválida vira 1. */
export function parseListParams(params: URLSearchParams, isLeisure: boolean): ListFilters {
  const page = Number(params.get('page'))
  return {
    status: oneOf(params.get('status'), ['ACTIVE', 'INACTIVE'] as const),
    // Sem trim: o campo de busca reflete a URL e não pode perder o espaço digitado.
    search: params.get('search') ?? '',
    genreId: isLeisure ? '' : (params.get('genreId') ?? '').trim(),
    isFree: isLeisure ? '' : oneOf(params.get('isFree'), ['true', 'false'] as const),
    type: isLeisure ? oneOf(params.get('type'), leisureTypes) : '',
    frequency: isLeisure ? oneOf(params.get('frequency'), frequencies) : '',
    page: Number.isInteger(page) && page > 1 ? page : 1,
  }
}

/** Filtros → URL, sem os vazios e sem `page=1` (URL curta e estável). */
export function toListParams(filters: ListFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const key of ['status', 'search', 'genreId', 'isFree', 'type', 'frequency'] as const) {
    const value = filters[key]
    if (value.trim()) params.set(key, value)
  }
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

/** Muda filtros; qualquer mudança que não seja de página volta para a página 1. */
export function updateFilters(current: ListFilters, patch: Partial<ListFilters>): ListFilters {
  const next = { ...current, ...patch }
  if (patch.page === undefined) next.page = 1
  return next
}

/** Query da API: só os filtros do tipo de lista, mais `page` e `limit`. */
export function toApiQuery(filters: ListFilters, isLeisure: boolean): Record<string, string | number> {
  const query: Record<string, string | number> = { page: filters.page, limit: PAGE_SIZE }
  const keys = isLeisure ? (['status', 'search', 'type', 'frequency'] as const) : (['status', 'search', 'genreId', 'isFree'] as const)
  for (const key of keys) {
    const value = filters[key].trim()
    if (value) query[key] = value
  }
  return query
}

/** Total de páginas (mínimo 1, mesmo com lista vazia). */
export function pageCount(total: number, limit = PAGE_SIZE): number {
  if (!Number.isFinite(total) || total <= 0 || limit <= 0) return 1
  return Math.ceil(total / limit)
}

/**
 * Para onde o formulário volta: a URL da lista que o abriu (com filtros e página), desde que seja
 * a lista da mesma aba; senão, a aba sem filtros.
 */
export function returnTo(state: unknown, listPath: string): string {
  const from = (state as { from?: unknown } | null)?.from
  if (typeof from === 'string' && (from === listPath || from.startsWith(`${listPath}?`))) return from
  return listPath
}
