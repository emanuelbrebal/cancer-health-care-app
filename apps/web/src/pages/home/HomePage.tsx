import { Link } from 'react-router'
import { ArrowRight, BookOpen, KeyRound, Users, type LucideIcon } from 'lucide-react'
import { Card, Panel } from '@/components/ui'
import { navItems } from '@/layouts/nav'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'

interface Shortcut {
  to: string
  title: string
  text: string
  icon: LucideIcon
}

const shortcuts: Shortcut[] = [
  {
    to: paths.content,
    title: 'Conteúdo',
    text: 'Livros, filmes, séries e atividades de lazer exibidos no app.',
    icon: BookOpen,
  },
  {
    to: paths.users,
    title: 'Usuários',
    text: 'Localizar contas e excluir a pedido do titular.',
    icon: Users,
  },
  {
    to: paths.account,
    title: 'Minha conta',
    text: 'Trocar a sua senha de acesso ao painel.',
    icon: KeyRound,
  },
]

// Figma: Dashboard (1:7207): grade de cards. Sem KPIs (fora do escopo do PRD): cards de atalho.
export default function HomePage() {
  const available = new Set(navItems.map((i) => i.to).concat(paths.account))

  return (
    <>
      <PageHeader title="Início" description="Atalhos para as áreas do painel administrativo." />
      <Panel>
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts
            .filter((s) => available.has(s.to))
            .map(({ to, title, text, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="group block h-full rounded-card">
                  <Card className="flex h-full flex-col gap-4 transition-shadow group-hover:shadow-modal">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-body-sm font-medium text-ink-strong">{title}</h2>
                      <span className="flex size-10 items-center justify-center rounded-full bg-line-soft text-primary">
                        <Icon size={20} aria-hidden />
                      </span>
                    </div>
                    <p className="text-note text-ink">{text}</p>
                    <span className="mt-auto inline-flex items-center gap-1 text-note font-semibold text-primary">
                      Abrir <ArrowRight size={16} aria-hidden />
                    </span>
                  </Card>
                </Link>
              </li>
            ))}
        </ul>
      </Panel>
    </>
  )
}
