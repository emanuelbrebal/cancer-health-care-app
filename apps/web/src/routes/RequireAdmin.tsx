import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { PageLoader } from '@/components/ui'
import { useSession } from '@/store/session'
import { paths } from './paths'

// Substitui o middleware.ts do template. Guard de UX: a autorização real é do backend
// (só ADMIN recebe sessão em /auth/web/*; rotas de escrita têm RolesGuard).
export function RequireAdmin({ children }: { children: ReactNode }) {
  const status = useSession((s) => s.status)
  const role = useSession((s) => s.user?.role)
  const endReason = useSession((s) => s.endReason)
  const location = useLocation()

  if (status === 'unknown') return <PageLoader label="Verificando sessão…" />

  if (status !== 'authenticated' || role !== 'ADMIN') {
    // "Sair" volta ao login limpo; sessão expirada ou acesso direto guarda a URL pedida (W01-4).
    const next = endReason === 'logout' ? '' : `?next=${encodeURIComponent(location.pathname + location.search)}`
    return <Navigate to={`${paths.login}${next}`} replace />
  }

  return <>{children}</>
}
