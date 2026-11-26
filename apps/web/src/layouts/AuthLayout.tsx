import type { ReactNode } from 'react'
import { HeartHandshake } from 'lucide-react'

// Figma: Login (1:2): metade esquerda com ilustração em fundo cinza, formulário à direita.
// A ilustração do Figma não foi baixada (limite do MCP, ver D13 no plano): o painel usa a marca.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-surface-card lg:grid-cols-[minmax(0,840fr)_minmax(0,600fr)]">
      <aside
        aria-hidden
        className="hidden flex-col items-center justify-center gap-6 bg-line-soft px-12 text-primary lg:flex"
      >
        <HeartHandshake size={160} strokeWidth={1.25} />
        <p className="max-w-sm text-center text-title-3 text-ink-muted">
          Gerenciador de conteúdo do OncoMente
        </p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[336px]">{children}</div>
      </main>
    </div>
  )
}
