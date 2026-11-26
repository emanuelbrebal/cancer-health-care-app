import { LoaderCircle } from 'lucide-react'
import { cn } from './cn'

export function Spinner({ size = 32, className }: { size?: number; className?: string }) {
  return <LoaderCircle size={size} aria-hidden className={cn('animate-spin', className)} />
}

export function PageLoader({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-ink-muted">
      <Spinner className="text-primary" />
      <span>{label}</span>
    </div>
  )
}
