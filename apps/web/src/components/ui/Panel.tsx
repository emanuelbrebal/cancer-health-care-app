import type { ReactNode } from 'react'
import { cn } from './cn'

// Figma: "painel-principal" (28:160): branco, raio 24 só no topo, título de seção 24/500.
export function Panel({
  title,
  actions,
  children,
  className,
}: {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      aria-label={title}
      className={cn('flex flex-1 flex-col gap-6 rounded-t-panel bg-surface-card px-8 pt-10 pb-8', className)}
    >
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          {title && <h2 className="text-page-title font-medium text-ink-strong">{title}</h2>}
          {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

// Figma: cards do Dashboard (1:7207): surface, raio 16, sombra curta.
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-card bg-surface p-5 shadow-card', className)}>{children}</div>
}
