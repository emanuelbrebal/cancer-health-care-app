// Figma: Conteúdo (37:720) — lista com cabeçalho escuro e ações; Excluir conteúdo (385:1404) —
// modal de confirmação (D4: inativar não pede senha). PRD 02 (mídia) e PRD 03 (lazer).
import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, NavLink, useLocation, useNavigate, useParams } from 'react-router'
import { FilePlus2, Pencil, Search, ShieldAlert, Tags, Trash2 } from 'lucide-react'
import {
  Button,
  ComingSoonButton,
  DataTable,
  IconAction,
  LiveRegion,
  Modal,
  PageLoader,
  Panel,
  TextField,
  cn,
  type Column,
} from '@/components/ui'
import {
  frequencyLabels,
  kindToGenreType,
  leisureTypeLabels,
  tabLabels,
  tabSingular,
  tabToKind,
} from '@/features/content/labels'
import type { LeisureItem, MediaItem } from '@/features/content/types'
import { useLoad } from '@/features/content/useLoad'
import { PageHeader } from '@/layouts/PageHeader'
import { contentTabs, paths, type ContentTab } from '@/routes/paths'
import { leisureService, mediaService } from '@/services/content'
import { apiErrorMessage } from '@/services/errors'

type Row = { id: string; label: string; item: MediaItem | LeisureItem }

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
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(() => {
    const flash = (location.state as { flash?: string } | null)?.flash
    return flash ? { tone: 'success', text: flash } : null
  })
  const [target, setTarget] = useState<Row | null>(null)
  const [busy, setBusy] = useState(false)

  // Mensagem de sucesso vinda do formulário vale uma vez: limpa o state do histórico.
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])

  const isLeisure = tab === 'lazer'
  const { data, loading, error, reload } = useLoad<Row[]>(tab, async () => {
    if (isLeisure) {
      const items = await leisureService.list()
      return items.map((item) => ({ id: item.id, label: item.name, item }))
    }
    const items = await mediaService.list(tabToKind[tab])
    return items.map((item) => ({ id: item.id, label: item.title, item }))
  })

  const rows = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('pt-BR')
    if (!data || !term) return data ?? []
    return data.filter((r) => r.label.toLocaleLowerCase('pt-BR').includes(term))
  }, [data, query])

  const actions: Column<Row> = {
    key: 'actions',
    header: 'Ações',
    className: 'w-[140px] text-right',
    render: (row) => (
      <div className="flex justify-end gap-1">
        <IconAction label={`Editar ${row.label}`} onClick={() => navigate(paths.contentEdit(tab, row.id))}>
          <Pencil size={22} aria-hidden />
        </IconAction>
        <IconAction label={`Inativar ${row.label}`} tone="danger" onClick={() => setTarget(row)}>
          <Trash2 size={22} aria-hidden />
        </IconAction>
      </div>
    ),
  }

  const columns: Column<Row>[] = isLeisure
    ? [
        { key: 'name', header: 'Nome', render: (r) => r.label },
        { key: 'type', header: 'Tipo', render: (r) => leisureTypeLabels[(r.item as LeisureItem).type] },
        { key: 'frequency', header: 'Frequência', render: (r) => frequencyLabels[(r.item as LeisureItem).frequency] },
        actions,
      ]
    : [
        { key: 'title', header: 'Título', render: (r) => r.label },
        { key: 'genre', header: 'Gênero', render: (r) => (r.item as MediaItem).genre },
        { key: 'year', header: 'Ano', render: (r) => (r.item as MediaItem).releaseYear ?? '—' },
        { key: 'free', header: 'Gratuito', render: (r) => ((r.item as MediaItem).isFree ? 'Sim' : 'Não') },
        actions,
      ]

  // Ao inativar, a lista recarrega e a linha que abriu o modal some: o foco cairia no <body>.
  // Devolve ao <main>; a região viva anuncia o resultado.
  useEffect(() => {
    if (!loading && document.activeElement === document.body) document.getElementById('conteudo')?.focus()
  }, [loading])

  async function confirmInactivate() {
    if (!target) return
    setBusy(true)
    try {
      if (isLeisure) await leisureService.inactivate(target.id)
      else await mediaService.inactivate(tabToKind[tab as Exclude<ContentTab, 'lazer'>], target.id)
      setMessage({ tone: 'success', text: `“${target.label}” foi inativado e não aparece mais no app.` })
      reload()
    } catch (e) {
      setMessage({ tone: 'error', text: apiErrorMessage(e, 'Não foi possível inativar.') })
    } finally {
      setBusy(false)
      setTarget(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Gerenciador de conteúdo"
        description="Recomendações exibidas nas áreas de Lazer e Oncologia do app."
        actions={
          <TextField
            label={isLeisure ? 'Pesquisar por nome' : 'Pesquisar por título'}
            hideLabel
            type="search"
            placeholder={isLeisure ? 'Pesquisar atividade' : 'Pesquisar título'}
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[min(392px,80vw)]"
          />
        }
      />

      <Panel
        title={`Lista de ${tabLabels[tab].toLocaleLowerCase('pt-BR')}`}
        actions={
          isLeisure ? (
            <Button variant="outline" icon={FilePlus2} onClick={() => navigate(paths.contentNew('lazer'))}>
              Cadastrar conteúdo
            </Button>
          ) : (
            <>
              <Link
                to={paths.genres(kindToGenreType[tabToKind[tab as Exclude<ContentTab, 'lazer'>]])}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-surface-card px-4 py-2.5 text-body-sm font-semibold text-primary hover:bg-surface"
              >
                <Tags size={22} aria-hidden />
                Gêneros
              </Link>
              <ComingSoonButton
                label="Cadastrar"
                icon={FilePlus2}
                reason="Depende do cadastro de gêneros no backend (G4)."
              />
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

        <p className="text-note text-ink-muted">
          Itens inativados não aparecem nesta lista nem no app (a listagem de inativos e a reativação chegam numa
          próxima versão).
        </p>

        <LiveRegion tone={message?.tone === 'success' ? 'success' : 'error'} message={message?.text} />

        {loading ? (
          <PageLoader />
        ) : error ? (
          <LiveRegion message={apiErrorMessage(error, 'Não foi possível carregar a lista.')} />
        ) : (
          <DataTable
            caption={`${tabLabels[tab]} cadastrados`}
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            empty={query ? 'Nenhum item encontrado para a pesquisa.' : 'Nenhum item ativo cadastrado.'}
          />
        )}
      </Panel>

      <Modal
        open={!!target}
        title={`Inativar ${tabSingular[tab]}`}
        icon={ShieldAlert}
        onClose={() => !busy && setTarget(null)}
      >
        <p className="text-support text-ink">
          “{target?.label}” deixará de aparecer no app. Os dados continuam guardados.
        </p>
        <div className="flex flex-wrap justify-between gap-4">
          <Button variant="ghost" onClick={() => setTarget(null)} disabled={busy} className="min-w-[160px]">
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmInactivate} loading={busy} className="min-w-[160px]">
            Inativar
          </Button>
        </div>
      </Modal>
    </>
  )
}
