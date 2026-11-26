import { useId, type InputHTMLAttributes } from 'react'
import { cn } from './cn'

// Figma: Chekbox (Componentes › Controles de Seleção, 341:7856): 24 px, raio 4, borda cinza.
export interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string
  hint?: string
}

export function CheckboxField({ label, hint, className, ...rest }: CheckboxFieldProps) {
  const id = useId()
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        id={id}
        type="checkbox"
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-check border border-checkbox accent-primary"
        {...rest}
      />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="cursor-pointer text-body-sm text-ink">
          {label}
        </label>
        {hint && (
          <p id={`${id}-hint`} className="text-note text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    </div>
  )
}
