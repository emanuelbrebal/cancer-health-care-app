import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { FieldError } from './FieldError'
import { cn } from './cn'

// Figma: dropdown (341:8276). <select> nativo para manter teclado e leitor de tela.
export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
  error?: string
}

export function SelectField({ label, options, placeholder, error, className, ...rest }: SelectFieldProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-support font-medium text-ink">
        {label}
        {rest.required && <span aria-hidden> *</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'min-h-11 w-full appearance-none rounded-field border bg-surface py-2 pr-10 pl-3 text-body-sm text-ink shadow-field',
            'focus:border-primary',
            error ? 'border-danger' : 'border-line-soft',
          )}
          {...rest}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={20}
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted"
        />
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}
