/**
 * Máscara de e-mail da lista (PRD 04 W04-1): `maria@dominio.com` → `m***@dominio.com`.
 * Mantém só a 1ª letra do usuário e o domínio inteiro. Sem `@`, mascara o texto todo.
 */
export function maskEmail(email: string): string {
  const value = email.trim()
  const at = value.lastIndexOf('@')
  if (at <= 0) return value ? `${value[0]}***` : ''
  return `${value[0]}***${value.slice(at)}`
}
