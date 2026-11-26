import { useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useInactivityLogout } from '@/hooks/useInactivityLogout'
import { paths } from '@/routes/paths'
import { authService } from '@/services/auth'
import { useSession } from '@/store/session'
import { navItems } from './nav'
import { Sidebar } from './Sidebar'

// Substitui src/app/admin/layout.tsx + themes/components/{menu,main}.tsx do template.
export function AdminLayout() {
  const navigate = useNavigate()
  const authenticated = useSession((s) => s.status === 'authenticated')

  const logout = useCallback(async () => {
    await authService.logout('logout')
    navigate(paths.login, { replace: true })
  }, [navigate])

  const expire = useCallback(() => {
    void authService.logout('inactive')
  }, [])

  useInactivityLogout(authenticated, expire)

  return (
    <div className="flex min-h-screen bg-surface-page">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded bg-primary px-4 py-2 text-ink-inverse focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Pular para o conteúdo
      </a>
      <Sidebar items={navItems} onLogout={logout} />
      <div className="flex min-w-0 flex-1 flex-col gap-6 px-[31px]">
        <main id="conteudo" tabIndex={-1} className="flex flex-col gap-6 outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

// Figma: Footer (82:630): faixa surface com raio 20 no topo (D12: sem a marca CITEC).
function Footer() {
  return (
    <footer className="mt-auto rounded-t-footer bg-surface-card py-4 text-center text-support text-ink-strong">
      © {new Date().getFullYear()} OncoMente. Todos os direitos reservados.
    </footer>
  )
}
