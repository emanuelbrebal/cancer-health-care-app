import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { cn } from './cn'

// Figma: modais de "Esqueci a senha" (23:259) e "Deletar" (29:1094): card branco centralizado,
// ícone de escudo, título 22/600, fechar no canto, fundo escurecido com blur.
// <dialog> nativo: foco preso, Esc fecha e o resto da página fica inerte.
export interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  icon?: LucideIcon
  tone?: 'primary' | 'danger'
  children: ReactNode
}

export function Modal({ open, title, onClose, icon: Icon, tone = 'danger', children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className={cn(
        'm-auto w-[min(600px,calc(100vw-2rem))] rounded-panel bg-surface-card p-0 text-ink shadow-modal',
        'backdrop:bg-overlay backdrop:backdrop-blur-sm',
      )}
    >
      {open && (
        <div className="flex flex-col gap-6 px-8 py-10 sm:px-16">
          <div className="flex items-center justify-between gap-4">
            <h2 id={titleId} className="text-title-2 font-semibold">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="rounded-full p-1 text-ink hover:bg-surface"
            >
              <X size={22} aria-hidden />
            </button>
          </div>
          {Icon && (
            <Icon
              size={56}
              strokeWidth={1.5}
              aria-hidden
              className={cn('self-center', tone === 'danger' ? 'text-danger' : 'text-primary')}
            />
          )}
          {children}
        </div>
      )}
    </dialog>
  )
}
