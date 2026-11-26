import { describe, expect, it } from 'vitest'
import {
  PAGE_SIZE,
  emptyFilters,
  pageCount,
  parseListParams,
  returnTo,
  toApiQuery,
  toListParams,
  updateFilters,
} from './listQuery'

const params = (query: string) => new URLSearchParams(query)

describe('parseListParams', () => {
  it('URL vazia → todos os filtros vazios, página 1', () => {
    expect(parseListParams(params(''), false)).toEqual(emptyFilters)
  })

  it('lê os filtros de mídia e ignora os de lazer', () => {
    const f = parseListParams(params('status=INACTIVE&search=dom&genreId=g1&isFree=false&type=SOCIAL&page=3'), false)
    expect(f).toMatchObject({ status: 'INACTIVE', search: 'dom', genreId: 'g1', isFree: 'false', type: '', page: 3 })
  })

  it('lê os filtros de lazer e ignora os de mídia', () => {
    const f = parseListParams(params('type=SOCIAL&frequency=FORTWEEKLY&genreId=g1&isFree=true'), true)
    expect(f).toMatchObject({ type: 'SOCIAL', frequency: 'FORTWEEKLY', genreId: '', isFree: '' })
  })

  it('valores desconhecidos viram "todos" e página inválida vira 1', () => {
    const f = parseListParams(params('status=DELETED&isFree=talvez&type=X&page=-2'), true)
    expect(f).toMatchObject({ status: '', isFree: '', type: '', page: 1 })
    expect(parseListParams(params('page=abc'), false).page).toBe(1)
    expect(parseListParams(params('page=2.5'), false).page).toBe(1)
  })

  it('mantém o espaço da busca (o campo reflete a URL)', () => {
    expect(parseListParams(params('search=harry%20'), false).search).toBe('harry ')
  })
})

describe('toListParams', () => {
  it('omite vazios e page=1', () => {
    expect(toListParams(emptyFilters).toString()).toBe('')
    expect(toListParams({ ...emptyFilters, search: '   ' }).toString()).toBe('')
  })

  it('ida e volta preserva os filtros', () => {
    const filters = { ...emptyFilters, status: 'ACTIVE' as const, genreId: 'g1', isFree: 'true' as const, page: 4 }
    const url = toListParams(filters)
    expect(url.toString()).toBe('status=ACTIVE&genreId=g1&isFree=true&page=4')
    expect(parseListParams(url, false)).toEqual(filters)
  })
})

describe('updateFilters', () => {
  const current = { ...emptyFilters, status: 'ACTIVE' as const, page: 5 }

  it('mudar filtro volta para a página 1', () => {
    expect(updateFilters(current, { search: 'x' })).toMatchObject({ search: 'x', status: 'ACTIVE', page: 1 })
  })

  it('mudar só a página mantém os filtros', () => {
    expect(updateFilters(current, { page: 6 })).toMatchObject({ status: 'ACTIVE', page: 6 })
  })
})

describe('toApiQuery', () => {
  it('sempre envia page e limit; busca sem espaços nas pontas', () => {
    expect(toApiQuery({ ...emptyFilters, search: ' dom ' }, false)).toEqual({ page: 1, limit: PAGE_SIZE, search: 'dom' })
  })

  it('só os filtros do tipo de lista', () => {
    const filters = { ...emptyFilters, genreId: 'g1', isFree: 'false' as const, type: 'REST' as const, frequency: 'DAILY' as const }
    expect(toApiQuery(filters, false)).toEqual({ page: 1, limit: PAGE_SIZE, genreId: 'g1', isFree: 'false' })
    expect(toApiQuery(filters, true)).toEqual({ page: 1, limit: PAGE_SIZE, type: 'REST', frequency: 'DAILY' })
  })
})

describe('pageCount', () => {
  it('arredonda para cima, mínimo 1', () => {
    expect(pageCount(0)).toBe(1)
    expect(pageCount(1)).toBe(1)
    expect(pageCount(20)).toBe(1)
    expect(pageCount(21)).toBe(2)
    expect(pageCount(500)).toBe(25)
    expect(pageCount(45, 10)).toBe(5)
  })

  it('valores inválidos → 1', () => {
    expect(pageCount(Number.NaN)).toBe(1)
    expect(pageCount(-3)).toBe(1)
    expect(pageCount(10, 0)).toBe(1)
  })
})

describe('returnTo', () => {
  const list = '/admin/conteudo/livros'

  it('volta à URL de origem com filtros e página', () => {
    expect(returnTo({ from: `${list}?status=INACTIVE&page=3` }, list)).toBe(`${list}?status=INACTIVE&page=3`)
    expect(returnTo({ from: list }, list)).toBe(list)
  })

  it('sem origem, ou origem de outra lista, volta para a aba sem filtros', () => {
    expect(returnTo(null, list)).toBe(list)
    expect(returnTo({ from: '/admin/conteudo/filmes?page=2' }, list)).toBe(list)
    expect(returnTo({ from: '/admin/conteudo/livros-x' }, list)).toBe(list)
    expect(returnTo({ from: 42 }, list)).toBe(list)
  })
})
