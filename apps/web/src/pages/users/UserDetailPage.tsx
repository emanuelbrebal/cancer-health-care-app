// Figma: "Gerenciar contas - Ver perfil" (376:1254) e "Excluir usuario" (29:1094 / 378:740).
// PRD 04: somente leitura (D6), e-mail completo sob "mostrar" (W04-3), exclusão em duas etapas
// digitando o e-mail (W04-6, D4), sem excluir a si mesmo nem conta ADMIN (W04-7).
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Ban, ShieldAlert, Trash2 } from 'lucide-react'
import { Alert, Button, ComingSoonButton, LiveRegion, Modal, PageLoader, Panel, TextField } from '@/components/ui'
import { formatDate, pronounLabel, roleLabels } from '@/features/users/labels'
import { maskEmail } from '@/features/users/maskEmail'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'
import { apiErrorMessage, apiStatus } from '@/services/errors'
import { usersService } from '@/services/users'
import { useSession } from '@/store/session'
import type { ApiUser } from '@/types/user'

type LoadState = { kind: 'loading' } | { kind: 'ok'; user: ApiUser } | { kind: 'notFound' } | { kind: 'error'; message: string }

export default function UserDetailPage() {
  const { id = '' } = useParams()
  const selfId = useSession((s) => s.user?.id)
  const [state, setState] = useState<LoadState>({ kind: 'loading' })
  const [showEmail, setShowEmail] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let alive = true
    usersService
      .get(id)
      .then((user) => alive && setState({ kind: 'ok', user }))
      .catch((e: unknown) => {
        if (!alive) return
        setState(
          apiStatus(e) === 404 || apiStatus(e) === 400
            ? { kind: 'notFound' }
            : { kind: 'error', message: apiErrorMessage(e, 'Não foi possível carregar a conta.') },
        )
      })
    return () => {
      alive = false
    }
  }, [id])

  const backLink = (
    <Link to={paths.users} className="inline-flex items-center gap-1 text-support text-primary underline">
      <ArrowLeft size={18} aria-hidden /> Voltar para a lista
    </Link>
  )

  if (state.kind !== 'ok') {
    return (
      <>
        <PageHeader title="Gerenciador de usuários" />
        <Panel>
          {state.kind === 'loading' && <PageLoader label="Carregando conta…" />}
          {state.kind === 'notFound' && <Alert tone="error">Conta não encontrada.</Alert>}
          {state.kind === 'error' && <Alert tone="error">{state.message}</Alert>}
          {state.kind !== 'loading' && backLink}
        </Panel>
      </>
    )
  }

  const { user } = state
  const isSelf = user.id === selfId
  // O backend não protege autoexclusão nem a última conta ADMIN (DELETE /users/:id):
  // o painel não oferece excluir contas ADMIN. Ver relatório do item 8 no plano.
  const canDelete = !isSelf && user.role !== 'ADMIN'

  return (
    <>
      <PageHeader title="Gerenciador de usuários" description="Detalhe da conta (somente leitura)." />
      <Panel>
        {backLink}

        <section
          aria-label="Resumo da conta"
          className="grid gap-6 rounded-card bg-surface-dark px-6 py-6 text-ink-inverse md:grid-cols-2"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-title-2 font-semibold">{user.name || 'Sem nome informado'}</h2>
            <p className="text-note opacity-80">ID: {user.id}</p>
            <div className="flex flex-wrap items-center gap-2 text-support">
              <span className="font-semibold">E-mail:</span>
              <span>{showEmail ? user.email : maskEmail(user.email)}</span>
              <button
                type="button"
                onClick={() => setShowEmail((v) => !v)}
                aria-pressed={showEmail}
                className="rounded-full border border-ink-inverse px-3 py-1 text-note hover:bg-surface-dark-alt"
              >
                {showEmail ? 'Ocultar e-mail' : 'Mostrar e-mail'}
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-support">
            <dt className="font-semibold">Perfil:</dt>
            <dd>{roleLabels[user.role]}</dd>
            <dt className="font-semibold">Pronome de tratamento:</dt>
            <dd>{pronounLabel(user.pronoun)}</dd>
            <dt className="font-semibold">Data de cadastro:</dt>
            <dd>{formatDate(user.createdAt)}</dd>
          </dl>
        </section>

        <p className="text-support text-ink-muted">
          O administrador não altera dados nem senha de terceiros. Para trocar a senha, oriente o uso de “Esqueci minha
          senha” no app.
        </p>

        <div className="flex flex-wrap items-start justify-end gap-6">
          <ComingSoonButton
            label="Suspender conta"
            icon={Ban}
            reason="Depende da suspensão pelo admin no backend (W04-4)."
          />
          {canDelete ? (
            <Button variant="danger-outline" icon={Trash2} onClick={() => setDeleting(true)}>
              Excluir conta
            </Button>
          ) : (
            <p className="max-w-xs text-right text-note text-ink-muted">
              {isSelf
                ? 'Você não pode excluir a sua própria conta pelo painel.'
                : 'Contas de administrador não podem ser excluídas pelo painel.'}
            </p>
          )}
        </div>
      </Panel>

      {canDelete && <DeleteUserModal open={deleting} user={user} onClose={() => setDeleting(false)} />}
    </>
  )
}

function DeleteUserModal({ open, user, onClose }: { open: boolean; user: ApiUser; onClose: () => void }) {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2>(1)
  const [typed, setTyped] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const matches = typed.trim().toLowerCase() === user.email.trim().toLowerCase()

  const close = () => {
    setStep(1)
    setTyped('')
    setError(null)
    onClose()
  }

  const confirm = async () => {
    if (!matches) return
    setBusy(true)
    setError(null)
    try {
      await usersService.remove(user.id)
      navigate(paths.users, { replace: true, state: { flash: 'Conta excluída.' } })
    } catch (e) {
      setError(apiErrorMessage(e, 'Não foi possível excluir a conta.'))
      setBusy(false)
    }
  }

  return (
    <Modal open={open} title="Excluir conta" icon={ShieldAlert} tone="danger" onClose={close}>
      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <p className="text-support text-ink">
            Use só a pedido do titular. A exclusão apaga a conta e <strong>todos os dados pessoais e de saúde</strong>{' '}
            (diário, tratamentos, consentimentos e conversas com o mascote). Fica apenas um registro pseudonimizado da
            exclusão. <strong>Não é possível desfazer.</strong>
          </p>
          <div className="flex flex-wrap justify-between gap-4">
            <Button variant="ghost" onClick={close} className="min-w-[160px]">
              Cancelar
            </Button>
            <Button variant="danger" onClick={() => setStep(2)} className="min-w-[160px]">
              Continuar
            </Button>
          </div>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            void confirm()
          }}
          className="flex flex-col gap-6"
        >
          <TextField
            label={`Para confirmar, digite o e-mail da conta (${maskEmail(user.email)})`}
            name="confirmEmail"
            type="email"
            autoComplete="off"
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            hint="O botão “Excluir” só é liberado quando o e-mail digitado for exatamente o da conta."
            required
          />
          <LiveRegion message={error} />
          <div className="flex flex-wrap justify-between gap-4">
            <Button variant="ghost" onClick={close} className="min-w-[160px]">
              Cancelar
            </Button>
            <Button type="submit" variant="danger" disabled={!matches} loading={busy} className="min-w-[160px]">
              Excluir
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
