import { describe, expect, it } from 'vitest'
import { cleanList, diffChanged, hasChanges, toIntOrNull, toTextOrNull } from './diff'

describe('diffChanged (PRD 02 W02-4)', () => {
  const initial = {
    title: 'Além da Cura',
    isFree: false,
    releaseYear: 2020 as number | null,
    whereToFind: ['Amazon', 'Kobo'],
    author: 'Milena',
  }

  it('formulário sem mudança → nada a enviar', () => {
    const diff = diffChanged(initial, { ...initial, whereToFind: ['Amazon', 'Kobo'] })
    expect(diff).toEqual({})
    expect(hasChanges(diff)).toBe(false)
  })

  it('envia só os campos alterados', () => {
    expect(diffChanged(initial, { ...initial, title: 'Novo', isFree: true })).toEqual({ title: 'Novo', isFree: true })
  })

  it('compara listas por conteúdo e ordem', () => {
    expect(diffChanged(initial, { ...initial, whereToFind: ['Kobo', 'Amazon'] })).toEqual({
      whereToFind: ['Kobo', 'Amazon'],
    })
    expect(diffChanged(initial, { ...initial, whereToFind: ['Amazon'] })).toEqual({ whereToFind: ['Amazon'] })
  })

  it('limpar um campo opcional envia null; null × undefined não é mudança', () => {
    expect(diffChanged(initial, { ...initial, releaseYear: null })).toEqual({ releaseYear: null })
    expect(diffChanged({ a: null as string | null | undefined }, { a: undefined })).toEqual({})
  })
})

describe('normalizadores do formulário', () => {
  it.each([
    ['', null],
    ['  ', null],
    ['2021', 2021],
    [' 12.7 ', 12],
    ['abc', null],
    [null, null],
  ] as const)('toIntOrNull(%j) → %j', (input, expected) => {
    expect(toIntOrNull(input)).toBe(expected)
  })

  it('toTextOrNull e cleanList tiram espaços e vazios', () => {
    expect(toTextOrNull('  x ')).toBe('x')
    expect(toTextOrNull('   ')).toBeNull()
    expect(cleanList([' Amazon ', '', '  ', 'Kobo'])).toEqual(['Amazon', 'Kobo'])
  })
})
