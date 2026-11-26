import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { Alert } from '@/components/ui'
import { AuthLayout } from '@/layouts/AuthLayout'
import { safeNext } from '@/routes/paths'
import { useSession, type EndReason } from '@/store/session'
import { LoginForm } from './LoginForm'

const endMessages: Partial<Record<EndReason, string>> = {
  expired: 'Sua sessão expirou. Entre novamente.',
  inactive: 'Sessão encerrada após 30 minutos sem atividade.',
  'password-changed': 'Senha alterada. Entre com a nova senha.',
}

export default function LoginPage() {
  const status = useSession((s) => s.status)
  const endReason = useSession((s) => s.endReason)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(params.get('next'))

  if (status === 'authenticated') return <Navigate to={next} replace />

  const notice = endReason ? endMessages[endReason] : undefined

  return (
    <AuthLayout>
      {notice && (
        <Alert tone="info" className="mb-6">
          {notice}
        </Alert>
      )}
      <LoginForm onSuccess={() => navigate(next, { replace: true })} />
    </AuthLayout>
  )
}
