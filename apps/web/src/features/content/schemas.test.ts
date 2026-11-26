import { describe, expect, it } from 'vitest'
import { ValidationError } from 'yup'
import { genreSchema, leisureSchema, mediaSchema } from './schemas'
import type { MediaKind } from './types'

// Erros de validação por campo (PRD 02 crit. 4: o erro aparece ao lado do campo).
function fieldErrors(run: () => unknown): Record<string, string> {
  try {
    run()
    return {}
  } catch (e) {
    if (!(e instanceof ValidationError)) throw e
    return Object.fromEntries(e.inner.map((err) => [err.path ?? '', err.message]))
  }
}

const validate = (kind: MediaKind, values: object) =>
  fieldErrors(() => mediaSchema(kind).validateSync(values, { abortEarly: false }))

const base = { title: 'Além da Cura', genreId: 'g1', isFree: false, releaseYear: '', image_path: '', synopsis: '', whereToFind: [] }

describe('mediaSchema — criação', () => {
  it('formulário vazio: título e gênero obrigatórios em todos os tipos', () => {
    for (const kind of ['books', 'movies', 'series'] as const) {
      const errors = validate(kind, { ...base, title: '', genreId: '' })
      expect(errors.title).toBe('Informe o título.')
      expect(errors.genreId).toBe('Escolha o gênero.')
    }
  })

  it('livro exige autor', () => {
    expect(validate('books', base)).toEqual({ author: 'Informe o autor.' })
    expect(validate('books', { ...base, author: 'Milena' })).toEqual({})
  })

  it('filme exige direção e duração', () => {
    const errors = validate('movies', base)
    expect(Object.keys(errors).sort()).toEqual(['director', 'duration'])
    expect(validate('movies', { ...base, director: 'Fulana', duration: '1h 45min' })).toEqual({})
  })

  it('série não tem campo obrigatório além dos comuns', () => {
    expect(validate('series', base)).toEqual({})
  })

  it('limites: título 150, autor 100, sinopse 2000', () => {
    const errors = validate('books', {
      ...base,
      title: 'a'.repeat(151),
      author: 'b'.repeat(101),
      synopsis: 'c'.repeat(2001),
    })
    expect(errors).toEqual({
      title: 'Use até 150 caracteres.',
      author: 'Use até 100 caracteres.',
      synopsis: 'Use até 2000 caracteres.',
    })
    expect(validate('books', { ...base, author: 'x', synopsis: 'c'.repeat(2000) })).toEqual({})
  })

  it('URLs opcionais precisam ser válidas', () => {
    expect(validate('books', { ...base, author: 'x', eduCapesLink: 'educapes' }).eduCapesLink).toMatch(/endereço válido/)
    expect(validate('books', { ...base, author: 'x', eduCapesLink: 'https://educapes.capes.gov.br/1' })).toEqual({})
    expect(validate('series', { ...base, externalLink: 'ftp://x' }).externalLink).toMatch(/endereço válido/)
  })

  it('ano e números inteiros', () => {
    const errors = validate('series', { ...base, releaseYear: '99', seasons: '2a' })
    expect(Object.keys(errors).sort()).toEqual(['releaseYear', 'seasons'])
  })
})

describe('leisureSchema', () => {
  it('nome, tipo e frequência obrigatórios; sinopse opcional', () => {
    const errors = fieldErrors(() =>
      leisureSchema.validateSync({ name: '', type: '', frequency: '', image_path: '', synopsis: '' }, { abortEarly: false }),
    )
    expect(Object.keys(errors).sort()).toEqual(['frequency', 'name', 'type'])
  })
})

describe('genreSchema', () => {
  it('nome de 1 a 60 caracteres e tipo válido', () => {
    const run = (values: object) => fieldErrors(() => genreSchema.validateSync(values, { abortEarly: false }))
    expect(run({ name: '  ', type: 'BOOK' })).toEqual({ name: 'Informe o nome do gênero.' })
    expect(run({ name: 'a'.repeat(61), type: 'BOOK' })).toEqual({ name: 'Use até 60 caracteres.' })
    expect(run({ name: 'Drama', type: 'PODCAST' })).toEqual({ type: 'Escolha o tipo.' })
    expect(run({ name: 'Drama', type: 'SERIES' })).toEqual({})
  })
})
