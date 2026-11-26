import { describe, expect, it } from 'vitest'
import { maskEmail } from './maskEmail'

describe('maskEmail (PRD 04 W04-1)', () => {
  it.each([
    ['maria@dominio.com', 'm***@dominio.com'],
    ['a@b.com', 'a***@b.com'],
    ['  joao.silva@oncomente.com.br ', 'j***@oncomente.com.br'],
    ['semarroba', 's***'],
    ['', ''],
  ])('%s → %s', (input, expected) => {
    expect(maskEmail(input)).toBe(expected)
  })

  it('não expõe nenhum caractere do usuário além do primeiro', () => {
    expect(maskEmail('segredo@x.com')).not.toContain('egredo')
  })
})
