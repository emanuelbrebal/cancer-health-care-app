// Figma: Conteúdo (37:720) — lista com cabeçalho escuro e ações; Excluir conteúdo (385:1404) —
// modal de confirmação (D4: inativar não pede senha). PRD 02 (mídia) e PRD 03 (lazer).
// Lista via `/admin/*`: ativos e inativos, filtros, busca e paginação no servidor; todo o estado
// fica na URL para o formulário voltar à mesma página e filtros.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, NavLink, useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { ChevronLeft, ChevronRight, FilePlus2, Pencil, RotateCcw, Search, ShieldAlert, Tags, Trash2 } from 'lucide-react'
import {
  Button,
  DataTable,
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
import {
  frequencyLabels,
  kindToGenreType,
  leisureTypeLabels,
  statusLabels,
  tabLabels,
  tabSingular,
  tabToKind,
  toOptions,
} from '@/features/content/labels'
import {
  pageCount,
  parseListParams,
  toApiQuery,
  toListParams,
  updateFilters,
  type ListFilters,
} from '@/features/content/listQuery'
import type { AdminLeisureItem, AdminMediaItem, ContentStatus, MediaKind } from '@/features/content/types'
import { useLoad } from '@/features/content/useLoad'
import { formatDate } from '@/features/users/labels'
import { PageHeader } from '@/layouts/PageHeader'
import { contentTabs, paths, type ContentTab } from '@/routes/paths'
import { genreService, leisureService, mediaService } from '@/services/content'
import { apiErrorMessage } from '@/services/errors'

type Row = { id: string; label: string; status: ContentStatus; updatedAt: string; item: AdminMediaItem | AdminLeisureItem }
type Action = 'inactivate' | 'reactivate'

const SEARCH_DELAY = 300

const freeOptions = [
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' },
]

const isTab = (value: string | undefined): value is ContentTab =>
  !!value && (contentTabs as readonly string[]).includes(value)

export default function ContentListPage() {
  const { tab } = useParams()
  if (!isTab(tab)) return <Navigate to={paths.contentTab('livros')} replace />
  // `key` zera busca, mensagens e modal ao trocar de aba.
  return <ContentList key={tab} tab={tab} />
}

function ContentList({ tab }: { tab: ContentTab }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const isLeisure = tab === 'lazer'
  const kind: MediaKind | null = isLeisure ? null : tabToKind[tab]

  const filters = useMemo(() => parseListParams(params, isLeisure), [params, isLeisure])
  const apiQuery = toApiQuery(filters, isLeisure)

  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(() => {
    const flash = (location.state as { flash?: string } | null)?.flash
    return flash ? { tone: 'success', text: flash } : null
  })
  const [target, setTarget] = useState<{ row: Row; action: Action } | null>(null)
  const [busy, setBusy] = useState(false)

  // Busca: o campo responde na hora; a URL (e a API) só depois de uma pausa na digitação.
  const [searchInput, setSearchInput] = useState(filters.search)
  const [syncedSearch, setSyncedSearch] = useState(filters.search)
  if (syncedSearch !== filters.search) {
    // Voltar/avançar no histórico muda a busca da URL: o campo acompanha.
    setSyncedSearch(filters.search)
    setSearchInput(filters.search)
  }
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  function apply(patch: Partial<ListFilters>, replace = true) {
    setParams((prev) => toListParams(updateFilters(parseListParams(prev, isLeisure), patch)), { replace })
  }

  function onSearch(value: string) {
    setSearchInput(value)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => apply({ search: value }), SEARCH_DELAY)
  }

  // Mensagem de sucesso vinda do formulário vale uma vez: limpa o state do histórico (mantém filtros).
  useEffect(() => {
    if (location.state) navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: null })
  }, [location.state, location.pathname, location.search, navigate])

  const queryKey = new URLSearchParams(apiQuery as Record<string, string>).toString()
  const { data, loading, error, reload } = useLoad(`${tab}?${queryKey}`, async () => {
    if (isLeisure) {
      const page = await leisureService.adminList(apiQuery)
      const rows: Row[] = page.items.map((item) => ({
        id: item.id,
        label: item.name,
        status: item.status as ContentStatus,
        updatedAt: item.updatedAt,
        item,
      }))
      return { rows, total: page.total }
    }
    const page = await mediaService.adminList(kind as MediaKind, apiQuery)
    const rows: Row[] = page.items.map((item) => ({
      id: item.id,
      label: item.title,
      status: item.status as ContentStatus,
      updatedAt: item.updatedAt,
      item,
    }))
    return { rows, total: page.total }
  })

  // Gêneros do tipo (ativos e inativos) para o filtro; falha aqui só esvazia o filtro.
  const genres = useLoad(`genres/${tab}`, () =>
    kind ? genreService.adminList(kindToGenreType[kind]).catch(() => []) : Promise.resolve([]),
  )
  const genreOptions = (genres.data ?? []).map((g) => ({
    value: g.id,
    label: g.status === 'ACTIVE' ? g.name : `${g.name} (inativo)`,
  }))

  const pages = pageCount(data?.total ?? 0)
  // Página além do fim (ex.: link antigo ou filtro que encolheu a lista): vai para a última.
  useEffect(() => {
    if (data && filters.page > pages) apply({ page: pages })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filters.page, pages])

  // Ao inativar/reativar, a lista recarrega e a linha que abriu o modal pode sumir: o foco cairia
  // no <body>. Devolve ao <main>; a região viva anuncia o resultado.
  useEffect(() => {
    if (!loading && document.activeElement === document.body) document.getElementById('conteudo')?.focus()
  }, [loading])

  const from = `${location.pathname}${location.search}`
  const openForm = (to: string) => navigate(to, { state: { from } })

  const actions: Column<Row> = {
    key: 'actions',
    header: 'Ações',
    className: 'w-[140px] text-right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <IconAction label={`Editar ${row.label}`} onClick={() => openForm(paths.contentEdit(tab, row.id))}>
          <Pencil size={22} aria-hidden />
        </IconAction>
        {row.status === 'ACTIVE' ? (
          <IconAction label={`Inativar ${row.label}`} tone="danger" onClick={() => setTarget({ row, action: 'inactivate' })}>
            <Trash2 size={22} aria-hidden />
          </IconAction>
        ) : (
          <IconAction label={`Reativar ${row.label}`} onClick={() => setTarget({ row, action: 'reactivate' })}>
            <RotateCcw size={22} aria-hidden />
          </IconAction>
        )}
      </div>
    ),
  }

  const statusColumn: Column<Row> = {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <span
        className={cn(
          'inline-flex rounded-full px-3 py-1 text-note font-semibold',
          r.status === 'ACTIVE' ? 'bg-success-bg text-success' : 'bg-surface text-ink-muted',
        )}
      >
        {statusLabels[r.status] ?? r.status}
      </span>
    ),
  }
  const updatedColumn: Column<Row> = { key: 'updatedAt', header: 'Atualização', render: (r) => formatDate(r.updatedAt) }

  const columns: Column<Row>[] = isLeisure
    ? [
        { key: 'name', header: 'Nome', render: (r) => r.label },
        { key: 'type', header: 'Tipo', render: (r) => leisureTypeLabels[(r.item as AdminLeisureItem).type] },
        { key: 'frequency', header: 'Frequência', render: (r) => frequencyLabels[(r.item as AdminLeisureItem).frequency] },
        statusColumn,
        updatedColumn,
        actions,
      ]
    : [
        { key: 'title', header: 'Título', render: (r) => r.label },
        { key: 'genre', header: 'Gênero', render: (r) => (r.item as AdminMediaItem).genre },
        { key: 'year', header: 'Ano', render: (r) => (r.item as AdminMediaItem).releaseYear ?? '—' },
        { key: 'free', header: 'Gratuito', render: (r) => ((r.item as AdminMediaItem).isFree ? 'Sim' : 'Não') },
        statusColumn,
        updatedColumn,
        actions,
      ]

  async function confirmAction() {
    if (!target) return
    const { row, action } = target
    setBusy(true)
    try {
      if (action === 'inactivate') {
        if (kind) await mediaService.inactivate(kind, row.id)
        else await leisureService.inactivate(row.id)
        setMessage({ tone: 'success', text: `“${row.label}” foi inativado e não aparece mais no app.` })
      } else {
        if (kind) await mediaService.reactivate(kind, row.id)
        else await leisureService.reactivate(row.id)
        setMessage({ tone: 'success', text: `“${row.label}” foi reativado e volta a aparecer no app.` })
      }
      reload()
    } catch (e) {
      setMessage({
        tone: 'error',
        text: apiErrorMessage(e, action === 'inactivate' ? 'Não foi possível inativar.' : 'Não foi possível reativar.'),
      })
    } finally {
      setBusy(false)
      setTarget(null)
    }
  }

  const filtered =
    !!filters.search.trim() || !!filters.status || !!filters.genreId || !!filters.isFree || !!filters.type || !!filters.frequency
  const total = data?.total ?? 0
  const unit = total === 1 ? 'item' : 'itens'
  const reactivating = target?.action === 'reactivate'

  return (
    <>
      <PageHeader
        title="Gerenciador de conteúdo"
        description="Recomendações exibidas nas áreas de Lazer e Oncologia do app."
        actions={
          <form role="search" onSubmit={(e) => e.preventDefault()} className="w-[min(392px,80vw)]">
            <TextField
              label={isLeisure ? 'Pesquisar por nome' : 'Pesquisar por título'}
              hideLabel
              type="search"
              maxLength={150}
              placeholder={isLeisure ? 'Pesquisar atividade' : 'Pesquisar título'}
              icon={Search}
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
            />
          </form>
        }
      />

      <Panel
        title={`Lista de ${tabLabels[tab].toLocaleLowerCase('pt-BR')}`}
        actions={
          isLeisure ? (
            <Button variant="outline" icon={FilePlus2} onClick={() => openForm(paths.contentNew('lazer'))}>
              Cadastrar conteúdo
            </Button>
          ) : (
            <>
              <Link
                to={paths.genres(kindToGenreType[kind as MediaKind])}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-surface-card px-4 py-2.5 text-body-sm font-semibold text-primary hover:bg-surface"
              >
                <Tags size={22} aria-hidden />
                Gêneros
              </Link>
              <Button variant="outline" icon={FilePlus2} onClick={() => openForm(paths.contentNew(tab))}>
                Cadastrar conteúdo
              </Button>
            </>
          )
        }
      >
        <nav aria-label="Tipo de conteúdo">
          <ul className="flex flex-wrap gap-2">
            {contentTabs.map((t) => (
              <li key={t}>
                <NavLink
                  to={paths.contentTab(t)}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-11 items-center rounded-full border px-5 text-body-sm',
                      isActive
                        ? 'border-primary bg-primary text-ink-inverse'
                        : 'border-line bg-surface-card text-ink hover:bg-surface',
                    )
                  }
                >
                  {tabLabels[t]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField
            label="Status"
            placeholder="Todos"
            options={toOptions(statusLabels)}
            value={filters.status}
            onChange={(e) => apply({ status: e.target.value as ListFilters['status'] })}
          />
          {isLeisure ? (
            <>
              <SelectField
                label="Tipo"
                placeholder="Todos"
                options={toOptions(leisureTypeLabels)}
                value={filters.type}
                onChange={(e) => apply({ type: e.target.value as ListFilters['type'] })}
              />
              <SelectField
                label="Frequência"
                placeholder="Todas"
                options={toOptions(frequencyLabels)}
                value={filters.frequency}
                onChange={(e) => apply({ frequency: e.target.value as ListFilters['frequency'] })}
              />
            </>
          ) : (
            <>
              <SelectField
                label="Gênero"
                placeholder="Todos"
                options={genreOptions}
                value={filters.genreId}
                onChange={(e) => apply({ genreId: e.target.value })}
              />
              <SelectField
                label="Gratuito"
                placeholder="Todos"
                options={freeOptions}
                value={filters.isFree}
                onChange={(e) => apply({ isFree: e.target.value as ListFilters['isFree'] })}
              />
            </>
          )}
        </div>

        <p className="text-note text-ink-muted">Itens inativos aparecem aqui, mas não aparecem no app.</p>

        <LiveRegion tone={message?.tone === 'success' ? 'success' : 'error'} message={message?.text} />

        {loading ? (
          <PageLoader />
        ) : error ? (
          <LiveRegion message={apiErrorMessage(error, 'Não foi possível carregar a lista.')} />
        ) : (
          <>
            <DataTable
              caption={`${tabLabels[tab]} cadastrados — página ${filters.page} de ${pages}`}
              columns={columns}
              rows={data?.rows ?? []}
              rowKey={(r) => r.id}
              empty={filtered ? 'Nenhum item encontrado com esses filtros.' : 'Nenhum item cadastrado.'}
            />

            <nav aria-label="Paginação" className="flex flex-wrap items-center justify-end gap-4">
              <p aria-live="polite" className="text-support text-ink-muted">
                Página {Math.min(filters.page, pages)} de {pages} · {total} {unit}
              </p>
              <Button
                variant="outline"
                icon={ChevronLeft}
                disabled={filters.page <= 1}
                onClick={() => apply({ page: filters.page - 1 }, false)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                icon={ChevronRight}
                disabled={filters.page >= pages}
                onClick={() => apply({ page: filters.page + 1 }, false)}
              >
                Próxima
              </Button>
            </nav>
          </>
        )}
      </Panel>

      <Modal
        open={!!target}
        title={`${reactivating ? 'Reativar' : 'Inativar'} ${tabSingular[tab]}`}
        icon={ShieldAlert}
        tone={reactivating ? 'primary' : 'danger'}
        onClose={() => !busy && setTarget(null)}
      >
        <p className="text-support text-ink">
          {reactivating
            ? `“${target?.row.label}” volta a aparecer no app.`
            : `“${target?.row.label}” deixará de aparecer no app. Os dados continuam guardados.`}
        </p>
        <div className="flex flex-wrap justify-between gap-4">
          <Button variant="ghost" onClick={() => setTarget(null)} disabled={busy} className="min-w-[160px]">
            Cancelar
          </Button>
          <Button
            variant={reactivating ? 'primary' : 'danger'}
            onClick={confirmAction}
            loading={busy}
            className="min-w-[160px]"
          >
            {reactivating ? 'Reativar' : 'Inativar'}
          </Button>
        </div>
      </Modal>
    </>
  )
}

