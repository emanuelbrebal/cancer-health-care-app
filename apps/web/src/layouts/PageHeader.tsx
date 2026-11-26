import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { UserRound } from 'lucide-react'
import { paths } from '@/routes/paths'
import { useSession } from '@/store/session'

// Figma: "painel-superior" (28:147): branco, raio 24 só embaixo; faixa com o nome do app e
// atalho de conta (D8: sem tema/notificações); título 24/600 + descrição 14 + ações à direita.
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  const name = useSession((s) => s.user?.name || s.user?.email)

  return (
    <header className="rounded-b-panel bg-surface-card">
      <div className="flex h-[78px] items-center justify-between border-b border-line px-8">
        <p className="text-[18px] text-ink-strong">OncoMente</p>
        <Link
          to={paths.account}
          className="flex items-center gap-2 rounded-full px-2 py-1 text-support text-ink hover:bg-surface"
        >
          <UserRound size={22} aria-hidden />
          <span className="max-w-[220px] truncate">{name}</span>
          <span className="sr-only">— Minha conta</span>
        </Link>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-8 pt-5 pb-6">
        <div className="max-w-[480px]">
          <h1 className="text-page-title font-semibold text-ink-strong">{title}</h1>
          {description && <p className="mt-2 text-support leading-[22px] text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-5">{actions}</div>}
      </div>
    </header>
  )
}
