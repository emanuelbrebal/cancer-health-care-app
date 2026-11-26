import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from './cn'

// Ação ainda sem backend (critério 8): visível, desabilitada, com o motivo legível.
export function ComingSoonButton({
  label,
  reason,
  icon: Icon,
  className,
}: {
  label: string
  reason: string
  icon?: LucideIcon
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex flex-col items-end gap-1', className)}>
      <button
        type="button"
        disabled
        aria-describedby={id}
        className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-full border border-line px-4 py-2.5 text-body-sm font-semibold text-placeholder"
      >
        {Icon && <Icon size={22} aria-hidden />}
        {label}
        <span className="rounded-full bg-surface px-2 py-0.5 text-caption font-semibold text-ink-muted">Em breve</span>
      </button>
      <p id={id} className="max-w-xs text-right text-note text-ink-muted">
        {reason}
      </p>
    </div>
  )
}
