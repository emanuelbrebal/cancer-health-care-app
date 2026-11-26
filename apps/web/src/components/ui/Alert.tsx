import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import { cn } from './cn'

const tones = {
  error: { box: 'bg-danger-bg text-danger border-danger', Icon: CircleAlert },
  success: { box: 'bg-success-bg text-success border-success', Icon: CircleCheck },
  info: { box: 'bg-surface text-ink border-line', Icon: Info },
} as const

// Mensagem de status anunciada por leitor de tela (WCAG 4.1.3): erro = assertive, resto = polite.
// `announce={false}` quando já está dentro de uma região viva (evita anúncio duplicado).
export function Alert({
  tone = 'info',
  announce = true,
  children,
  className,
}: {
  tone?: keyof typeof tones
  announce?: boolean
  children: ReactNode
  className?: string
}) {
  const { box, Icon } = tones[tone]
  return (
    <div
      role={announce ? (tone === 'error' ? 'alert' : 'status') : undefined}
      className={cn('flex items-start gap-2 rounded-field border px-4 py-3 text-support', box, className)}
    >
      <Icon size={20} aria-hidden className="mt-px shrink-0" />
      <div>{children}</div>
    </div>
  )
}

// Região viva sempre montada: o conteúdo muda e o leitor de tela anuncia.
export function LiveRegion({ message, tone = 'error' }: { message?: string | null; tone?: 'error' | 'success' }) {
  return (
    <div aria-live={tone === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
      {message && (
        <Alert tone={tone} announce={false}>
          {message}
        </Alert>
      )}
    </div>
  )
}
