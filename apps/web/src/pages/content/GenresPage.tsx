// Gêneros por tipo de mídia (PRD 02 W02-8): listar, criar, renomear, inativar e reativar.
// Contrato: tasks/admin-catalogo.md → "Contrato da API". Mesmo visual da lista de conteúdo.
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, Pencil, Plus, RotateCcw, ShieldAlert, Tags, Trash2 } from 'lucide-react'
import { Formik, type FormikHelpers } from 'formik'
import {
  Button,
  DataTable,
  FocusFirstError,
  IconAction,
  LiveRegion,
  Modal,
  PageLoader,
  Panel,
  SelectField,
  TextField,
  cn,
  type Column,
} from '@/components/ui'
import { genreTypeLabels, statusLabels, toOptions } from '@/features/content/labels'
import { genreSchema } from '@/features/content/schemas'
import type { AdminGenre, ContentStatus, GenreType } from '@/features/content/types'
import { useLoad } from '@/features/content/useLoad'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'
import { genreService } from '@/services/content'
import { apiCode, apiErrorMessage, apiStatus } from '@/services/errors'

const genreTypes = Object.keys(genreTypeLabels) as GenreType[]

const asGenreType = (v: string | null): GenreType => (genreTypes.includes(v as GenreType) ? (v as GenreType) : 'BOOK')
const asStatus = (v: string | null): ContentStatus | '' => (v === 'ACTIVE' || v === 'INACTIVE' ? v : '')

type Dialog =
  | { kind: 'create' }
  | { kind: 'rename' | 'inactivate' | 'reactivate'; genre: AdminGenre }

type Message = { tone: 'success' | 'error'; text: string }

export default function GenresPage() {
  const [params, setParams] = useSearchParams()
  const type = asGenreType(params.get('type'))
  const status = asStatus(params.get('status'))
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [message, setMessage] = useState<Message | null>(null)
  const [busy, setBusy] = useState(false)

  const { data, loading, error, reload } = useLoad(`${type}/${status}`, () =>
    genreService.adminList(type, status || undefined),
  )

  // Após recarregar, a linha que abriu o modal pode sumir (filtro de status): devolve o foco ao <main>.
  useEffect(() => {
    if (!loading && document.activeElement === document.body) document.getElementById('conteudo')?.focus()
  }, [loading])

  function setFilter(next: { type?: GenreType; status?: ContentStatus | '' }) {
    const t = next.type ?? type
    const s = next.status ?? status
    setParams(s ? { type: t, status: s } : { type: t }, { replace: true })
  }

  async function confirmStatusChange() {
    if (!dialog || dialog.kind === 'create' || dialog.kind === 'rename') return
    const { genre } = dialog
    setBusy(true)
    try {
      if (dialog.kind === 'inactivate') {
        await genreService.inactivate(genre.id)
        setMessage({ tone: 'success', text: `Gênero “${genre.name}” inativado.` })
      } else {
        await genreService.reactivate(genre.id)
        setMessage({ tone: 'success', text: `Gênero “${genre.name}” reativado.` })
      }
      reload()
    } catch (e) {
      // 409 GENRE_IN_USE: o servidor informa quantos itens ativos usam o gênero.
      const fallback =
        apiCode(e) === 'GENRE_IN_USE'
          ? 'Este gênero tem itens ativos. Mude o gênero desses itens ou inative-os antes.'
          : 'Não foi possível concluir a ação.'
      setMessage({ tone: 'error', text: apiErrorMessage(e, fallback) })
    } finally {
      setBusy(false)
      setDialog(null)
    }
  }

  function saved(text: string, savedType: GenreType) {
    setDialog(null)
    setMessage({ tone: 'success', text })
    if (savedType !== type) setFilter({ type: savedType })
    else reload()
  }

  const columns: Column<AdminGenre>[] = [
    { key: 'name', header: 'Nome', render: (g) => g.name },
    { key: 'status', header: 'Status', render: (g) => statusLabels[g.status] },
    { key: 'activeItems', header: 'Itens ativos', render: (g) => g.activeItems },
    {
      key: 'actions',
      header: 'Ações',
      className: 'w-[140px] text-right',
      render: (g) => (
        <div className="flex justify-end gap-1">
          <IconAction label={`Renomear ${g.name}`} onClick={() => setDialog({ kind: 'rename', genre: g })}>
            <Pencil size={22} aria-hidden />
          </IconAction>
          {g.status === 'ACTIVE' ? (
            <IconAction label={`Inativar ${g.name}`} tone="danger" onClick={() => setDialog({ kind: 'inactivate', genre: g })}>
              <Trash2 size={22} aria-hidden />
            </IconAction>
          ) : (
            <IconAction label={`Reativar ${g.name}`} onClick={() => setDialog({ kind: 'reactivate', genre: g })}>
              <RotateCcw size={22} aria-hidden />
            </IconAction>
          )}
        </div>
      ),
    },
  ]

  const typeLabel = genreTypeLabels[type].toLocaleLowerCase('pt-BR')
  const statusDialog = dialog && (dialog.kind === 'inactivate' || dialog.kind === 'reactivate') ? dialog : null

  return (
    <>
      <PageHeader
        title="Gerenciador de conteúdo"
        description="Gêneros usados para classificar livros, filmes e séries."
        actions={
          <Link
            to={paths.contentTab('livros')}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-support font-semibold text-primary hover:bg-surface"
          >
            <ArrowLeft size={20} aria-hidden />
            Voltar ao conteúdo
          </Link>
        }
      />

      <Panel
        title="Gêneros"
        actions={
          <Button variant="outline" icon={Plus} onClick={() => setDialog({ kind: 'create' })}>
            Novo gênero
          </Button>
        }
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <nav aria-label="Tipo de mídia">
            <ul className="flex flex-wrap gap-2">
              {genreTypes.map((t) => (
                <li key={t}>
                  <Link
                    to={paths.genres(t)}
                    replace
                    aria-current={t === type ? 'page' : undefined}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded-full border px-5 text-body-sm',
                      t === type
                        ? 'border-primary bg-primary text-ink-inverse'
                        : 'border-line bg-surface-card text-ink hover:bg-surface',
                    )}
                  >
                    {genreTypeLabels[t]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <SelectField
            label="Status"
            placeholder="Todos"
            options={toOptions(statusLabels)}
            value={status}
            onChange={(e) => setFilter({ status: asStatus(e.target.value) })}
            className="w-[200px]"
          />
        </div>

        <p className="text-note text-ink-muted">
          Gênero inativo não aparece no cadastro de mídia. Só é possível inativar um gênero sem itens ativos.
        </p>

        <LiveRegion tone={message?.tone === 'success' ? 'success' : 'error'} message={message?.text} />

        {loading ? (
          <PageLoader />
        ) : error ? (
          <LiveRegion message={apiErrorMessage(error, 'Não foi possível carregar os gêneros.')} />
        ) : (
          <>
            <p aria-live="polite" className="text-support text-ink-muted">
              {data?.length ?? 0} {data?.length === 1 ? 'gênero' : 'gêneros'} de {typeLabel}
            </p>
            <DataTable
              caption={`Gêneros de ${typeLabel}`}
              columns={columns}
              rows={data ?? []}
              rowKey={(g) => g.id}
              empty={status ? 'Nenhum gênero com este status.' : `Nenhum gênero de ${typeLabel} cadastrado.`}
            />
          </>
        )}
      </Panel>

      <Modal
        open={dialog?.kind === 'create' || dialog?.kind === 'rename'}
        title={dialog?.kind === 'rename' ? 'Renomear gênero' : 'Novo gênero'}
        icon={Tags}
        tone="primary"
        onClose={() => setDialog(null)}
      >
        {dialog?.kind === 'create' && (
          <GenreForm
            initial={{ name: '', type }}
            onCancel={() => setDialog(null)}
            onSubmit={async (v) => {
              const created = await genreService.create(v.name, v.type)
              saved(`Gênero “${created?.name ?? v.name}” criado.`, v.type)
            }}
          />
        )}
        {dialog?.kind === 'rename' && (
          <GenreForm
            initial={{ name: dialog.genre.name, type: dialog.genre.type }}
            renaming
            onCancel={() => setDialog(null)}
            onSubmit={async (v) => {
              if (v.name === dialog.genre.name) {
                setDialog(null)
                return
              }
              await genreService.rename(dialog.genre.id, v.name)
              saved(`Gênero renomeado para “${v.name}”.`, dialog.genre.type)
            }}
          />
        )}
      </Modal>

      <Modal
        open={!!statusDialog}
        title={statusDialog?.kind === 'reactivate' ? 'Reativar gênero' : 'Inativar gênero'}
        icon={ShieldAlert}
        tone={statusDialog?.kind === 'reactivate' ? 'primary' : 'danger'}
        onClose={() => !busy && setDialog(null)}
      >
        <p className="text-support text-ink">
          {statusDialog?.kind === 'reactivate'
            ? `“${statusDialog.genre.name}” volta a aparecer no cadastro de mídia.`
            : `“${statusDialog?.genre.name}” deixa de aparecer no cadastro de mídia. Os dados continuam guardados.`}
        </p>
        <div className="flex flex-wrap justify-between gap-4">
          <Button variant="ghost" onClick={() => setDialog(null)} disabled={busy} className="min-w-[160px]">
            Cancelar
          </Button>
          <Button
            variant={statusDialog?.kind === 'reactivate' ? 'primary' : 'danger'}
            onClick={confirmStatusChange}
            loading={busy}
            className="min-w-[160px]"
          >
            {statusDialog?.kind === 'reactivate' ? 'Reativar' : 'Inativar'}
          </Button>
        </div>
      </Modal>
    </>
  )
}

interface GenreValues {
  name: string
  type: GenreType
}

function GenreForm({
  initial,
  renaming = false,
  onSubmit,
  onCancel,
}: {
  initial: GenreValues
  renaming?: boolean
  onSubmit: (values: GenreValues) => Promise<void>
  onCancel: () => void
}) {
  const [error, setError] = useState<string | null>(null)

  async function submit(values: GenreValues, helpers: FormikHelpers<GenreValues>) {
    setError(null)
    try {
      await onSubmit({ name: values.name.trim(), type: values.type })
    } catch (e) {
      // 409 DUPLICATE: mensagem do servidor ao lado do campo; o texto digitado fica no formulário.
      if (apiStatus(e) === 409) {
        const text = apiErrorMessage(e, 'Já existe um gênero com este nome para este tipo.')
        helpers.setFieldError('name', text)
        setError(text)
      } else {
        setError(apiErrorMessage(e, 'Não foi possível salvar o gênero.'))
      }
    }
  }

  return (
    <Formik initialValues={initial} validationSchema={genreSchema} onSubmit={submit}>
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FocusFirstError />
          <TextField
            label="Nome"
            name="name"
            maxLength={60}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
            required
            autoFocus
          />
          {renaming ? (
            <p className="text-support text-ink-muted">Tipo: {genreTypeLabels[values.type]}</p>
          ) : (
            <SelectField
              label="Tipo"
              name="type"
              options={toOptions(genreTypeLabels)}
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.type ? errors.type : undefined}
              required
            />
          )}
          <LiveRegion message={error} />
          <div className="flex flex-wrap justify-between gap-4">
            <Button variant="ghost" onClick={onCancel} disabled={isSubmitting} className="min-w-[160px]">
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting} className="min-w-[160px]">
              Salvar
            </Button>
          </div>
        </form>
      )}
    </Formik>
  )
}
