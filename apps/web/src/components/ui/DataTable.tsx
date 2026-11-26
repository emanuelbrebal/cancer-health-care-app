import type { ReactNode } from 'react'
import { cn } from './cn'

// Figma: tabela de "Gerenciar contas" (28:160): cabeçalho escuro (surface-dark) 78 px,
// texto 17 claro; linhas 14/500 com divisória cinza-médio.
export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
}

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
}: {
  caption: string
  columns: ReadonlyArray<Column<T>>
  rows: ReadonlyArray<T>
  rowKey: (row: T) => string
  empty: ReactNode
}) {
  return (
    <div className="-mx-8 overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-surface-dark text-ink-inverse">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('h-[78px] px-8 text-body font-normal', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-8 py-12 text-center text-ink-muted">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line">
                {columns.map((c) => (
                  <td key={c.key} className={cn('h-[58px] px-8 text-support font-medium text-ink-strong', c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// Botão de ícone das ações da linha (50 px de alvo, como no Figma).
export function IconAction({
  label,
  onClick,
  children,
  tone = 'default',
}: {
  label: string
  onClick: () => void
  children: ReactNode
  tone?: 'default' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-[50px] items-center justify-center rounded-full hover:bg-surface',
        tone === 'danger' ? 'text-danger-soft' : 'text-ink',
      )}
    >
      {children}
    </button>
  )
}
