// PRD 02 W02-4: na edição só vão os campos alterados; sem alteração, nada é enviado
// (o backend recusa corpo vazio com 400). Função pura: compara dois payloads já normalizados.

function same(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => same(v, b[i]))
  }
  // null e undefined contam como "vazio" igual.
  if (a == null && b == null) return true
  return Object.is(a, b)
}

export function diffChanged<T extends object>(initial: T, current: T): Partial<T> {
  const changed: Partial<T> = {}
  for (const key of Object.keys(current) as Array<keyof T>) {
    if (!same(initial[key], current[key])) changed[key] = current[key]
  }
  return changed
}

export const hasChanges = (diff: object) => Object.keys(diff).length > 0

/** Campo numérico de formulário (texto) → número inteiro ou null quando vazio. */
export function toIntOrNull(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  if (text === '') return null
  const n = Number(text)
  return Number.isFinite(n) ? Math.trunc(n) : null
}

/** Texto opcional → string sem espaços nas pontas ou null quando vazio. */
export function toTextOrNull(value: string | null | undefined): string | null {
  const text = (value ?? '').trim()
  return text === '' ? null : text
}

/** Lista "onde encontrar": remove vazios e espaços, mantém a ordem. */
export function cleanList(values: ReadonlyArray<string>): string[] {
  return values.map((v) => v.trim()).filter(Boolean)
}
