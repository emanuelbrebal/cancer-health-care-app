import { NavLink } from 'react-router'
import { HeartPulse, LogOut, type LucideIcon } from 'lucide-react'
import { cn } from '@/components/ui'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

// Figma: "menu-lateral" (28:131): 200 px, logo circular, itens 16/400 com pill azul à esquerda
// no ativo (raio 24 só à esquerda), "Sair" em vermelho no rodapé.
export function Sidebar({ items, onLogout }: { items: ReadonlyArray<NavItem>; onLogout: () => void }) {
  return (
    <aside className="sticky top-0 flex h-screen w-sidebar shrink-0 flex-col border-r border-line bg-surface-card">
      <div className="flex h-[200px] flex-col items-center justify-center gap-4 border-b border-line">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-ink-inverse">
          <HeartPulse size={30} aria-hidden />
        </span>
        <p className="text-center text-support text-ink-strong">
          OncoMente
          <br />
          Gerenciador WEB
        </p>
      </div>

      <nav aria-label="Menu principal" className="mt-[71px] flex-1 pl-5">
        <ul className="flex flex-col gap-4">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex h-8 items-center gap-2 rounded-l-panel pl-4 text-body-sm',
                    isActive ? 'bg-primary text-ink-inverse' : 'text-ink hover:bg-surface',
                  )
                }
              >
                <Icon size={22} aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mx-auto mb-20 flex h-8 items-center gap-2 rounded-full px-4 text-body-sm text-danger hover:bg-danger-bg"
      >
        <LogOut size={22} aria-hidden />
        Sair
      </button>
    </aside>
  )
}
