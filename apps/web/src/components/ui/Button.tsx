import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Spinner } from './Spinner'
import { cn } from './cn'

// Figma: Button/Default e Button/Round (Componentes › Botões, 341:7383). Pill de 44 px.
type Variant = 'primary' | 'outline' | 'danger' | 'danger-outline' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-ink-inverse border-primary hover:bg-primary-hover',
  outline: 'bg-surface-card text-primary border-primary hover:bg-surface',
  danger: 'bg-danger text-ink-inverse border-danger hover:opacity-90',
  'danger-outline': 'bg-surface-card text-danger border-danger hover:bg-danger-bg',
  ghost: 'bg-transparent text-danger border-transparent hover:bg-danger-bg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: LucideIcon
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  icon: Icon,
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2.5',
        'text-body-sm font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Spinner size={18} /> : Icon && <Icon size={22} aria-hidden />}
      <span>{children}</span>
    </button>
  )
}
