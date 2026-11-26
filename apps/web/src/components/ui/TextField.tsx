import { useId, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { FieldError } from './FieldError'
import { cn } from './cn'

// Figma: Campo de Texto (341:7767). Campo preenchido em `surface`, raio 12, sombra curta.
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  /** Esconde o rótulo visualmente (fica para leitor de tela), como no login do Figma. */
  hideLabel?: boolean
  icon?: LucideIcon
  error?: string
  hint?: string
  revealable?: boolean
}

export function TextField({
  label,
  hideLabel = false,
  icon: Icon,
  error,
  hint,
  revealable = false,
  type = 'text',
  className,
  ...rest
}: TextFieldProps) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className={cn('text-support font-medium text-ink', hideLabel && 'sr-only')}>
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <div
        className={cn(
          'flex min-h-11 items-center gap-2 rounded-field border bg-surface px-3 shadow-field',
          'focus-within:border-primary',
          error ? 'border-danger' : 'border-line-soft',
          rest.disabled && 'opacity-60',
        )}
      >
        {Icon && <Icon size={20} aria-hidden className="shrink-0 text-ink-muted" />}
        <input
          id={id}
          type={revealable && revealed ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className="min-w-0 flex-1 bg-transparent py-2 text-body-sm text-ink outline-none placeholder:text-placeholder"
          {...rest}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={revealed}
            className="rounded p-1 text-ink-muted hover:text-ink"
          >
            {revealed ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
          </button>
        )}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-note text-ink-muted">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
