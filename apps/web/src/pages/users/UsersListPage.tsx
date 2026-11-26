// Figma: "Gerenciar contas" (28:130): header com busca, tabela escura, ações por linha.
// PRD 04 W04-1/W04-2: e-mail mascarado; sem telefone, nascimento ou foto (D5: sem "Cadastrar").
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChevronLeft, ChevronRight, Eye, Search } from 'lucide-react'
import {
  Button,
  DataTable,
  IconAction,
  LiveRegion,
  PageLoader,
  Panel,
  SelectField,
  TextField,
  type Column,
} from '@/components/ui'
import { formatDate, roleLabels, roleOptions } from '@/features/users/labels'
import { maskEmail } from '@/features/users/maskEmail'
import { PageHeader } from '@/layouts/PageHeader'
import { paths } from '@/routes/paths'
import { apiErrorMessage } from '@/services/errors'
import { usersService } from '@/services/users'
import type { ApiUser } from '@/types/user'

const PAGE_SIZE = 20

export default function UsersListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const flash = (location.state as { flash?: string } | null)?.flash ?? null

  const [users, setUsers] = useState<ApiUser[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    let alive = true
    usersService
      .list()
      .then((data) => alive && setUsers(data))
      .catch((e: unknown) => alive && setError(apiErrorMessage(e, 'Não foi possível carregar as contas.')))
    return () => {
      alive = false
    }
  }, [])

  // Busca no cliente (R4): nome contém o termo ou e-mail exato (não revela e-mail por prefixo).
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return (users ?? []).filter((u) => {
      if (role && u.role !== role) return false
      if (!term) return true
      return u.email.toLowerCase() === term || (u.name ?? '').toLowerCase().includes(term)
    })
  }, [users, query, role])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const columns: Column<ApiUser>[] = [
    { key: 'name', header: 'Nome', render: (u) => u.name || '—' },
    { key: 'email', header: 'E-mail', render: (u) => maskEmail(u.email) },
    { key: 'role', header: 'Perfil', render: (u) => roleLabels[u.role] },
    { key: 'createdAt', header: 'Cadastro', render: (u) => formatDate(u.createdAt) },
    {
      key: 'actions',
      header: 'Ações',
      className: 'w-[120px] text-center',
      render: (u) => (
        <IconAction label={`Ver conta de ${u.name || maskEmail(u.email)}`} onClick={() => navigate(paths.user(u.id))}>
          <Eye size={22} aria-hidden />
        </IconAction>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Gerenciador de usuários"
        description="Localize contas para dar suporte. Dados de saúde não ficam acessíveis no painel."
        actions={
          <form role="search" onSubmit={(e) => e.preventDefault()} className="w-[min(392px,100%)]">
            <TextField
              label="Pesquisar usuário"
              hideLabel
              type="search"
              placeholder="Pesquisar por nome ou e-mail exato"
              icon={Search}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
            />
          </form>
        }
      />

      <Panel
        title="Lista de contas cadastradas"
        actions={
          <SelectField
            label="Perfil"
            placeholder="Todos"
            options={roleOptions}
            value={role}
            onChange={(e) => {
              setRole(e.target.value)
              setPage(1)
            }}
            className="w-[220px]"
          />
        }
      >
        <LiveRegion tone="success" message={flash} />
        <LiveRegion message={error} />

        {users === null && !error ? (
          <PageLoader label="Carregando contas…" />
        ) : (
          users && (
            <>
              <DataTable
                caption="Contas cadastradas"
                columns={columns}
                rows={rows}
                rowKey={(u) => u.id}
                empty={query || role ? 'Nenhuma conta encontrada com esses filtros.' : 'Nenhuma conta cadastrada.'}
              />

              <nav aria-label="Paginação" className="flex flex-wrap items-center justify-end gap-4">
                <p aria-live="polite" className="text-support text-ink-muted">
                  Página {current} de {pages} · {filtered.length} {filtered.length === 1 ? 'conta' : 'contas'}
                </p>
                <Button
                  variant="outline"
                  icon={ChevronLeft}
                  disabled={current <= 1}
                  onClick={() => setPage(current - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  icon={ChevronRight}
                  disabled={current >= pages}
                  onClick={() => setPage(current + 1)}
                >
                  Próxima
                </Button>
              </nav>
            </>
          )
        )}
      </Panel>
    </>
  )
}
