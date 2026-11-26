import { useId, type TextareaHTMLAttributes } from 'react'
import { FieldError } from './FieldError'
import { cn } from './cn'

// Mesmo visual do TextField (Figma: Campo de Texto, 341:7767), em várias linhas.
export interface TextAreaFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string
  hint?: string
  /** Mostra "n de max caracteres" (exige `maxLength`). */
  counter?: boolean
}

export function TextAreaField({ label, error, hint, counter = false, className, rows = 5, ...rest }: TextAreaFieldProps) {
  const id = useId()
  const length = String(rest.value ?? '').length
  const showCounter = counter && rest.maxLength !== undefined
  const describedBy = [error && `${id}-error`, hint && !error && `${id}-hint`, showCounter && `${id}-count`]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-support font-medium text-ink">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'min-h-11 w-full resize-y rounded-field border bg-surface px-3 py-2 text-body-sm text-ink shadow-field',
          'placeholder:text-placeholder focus:border-primary',
          error ? 'border-danger' : 'border-line-soft',
          rest.disabled && 'opacity-60',
        )}
        {...rest}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {hint && !error && (
            <p id={`${id}-hint`} className="text-note text-ink-muted">
              {hint}
            </p>
          )}
          <FieldError id={`${id}-error`} message={error} />
        </div>
        {showCounter && (
          <p id={`${id}-count`} className="shrink-0 text-note text-ink-muted">
            {length} de {rest.maxLength} caracteres
          </p>
        )}
      </div>
    </div>
  )
}
