import { act, cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { useSession } from '@/store/session'
import type { AdminUser } from '@/types/user'
import { safeNext } from './paths'
import { RequireAdmin } from './RequireAdmin'

const user = (role: AdminUser['role']): AdminUser => ({
  id: 'u1',
  name: 'Pessoa',
  email: 'p@x.com',
  role,
  pronoun: null,
  createdAt: '2026-01-01T00:00:00.000Z',
})

function renderAt(url: string) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <p>tela de login</p> },
      {
        path: '/admin/*',
        element: (
          <RequireAdmin>
            <p>área interna</p>
          </RequireAdmin>
        ),
      },
    ],
    { initialEntries: [url] },
  )
  render(<RouterProvider router={router} />)
  return router
}

afterEach(cleanup)

describe('RequireAdmin (PRD 01 W01-4)', () => {
  it('sem sessão leva ao login guardando a URL pedida em ?next=', () => {
    useSession.setState({ status: 'anonymous', accessToken: null, user: null, endReason: null })
    const router = renderAt('/admin/usuarios?x=1')

    expect(screen.getByText('tela de login')).toBeTruthy()
    expect(router.state.location.search).toBe(`?next=${encodeURIComponent('/admin/usuarios?x=1')}`)
  })

  it('depois de "Sair" volta ao login sem ?next=', () => {
    useSession.setState({ status: 'anonymous', accessToken: null, user: null, endReason: 'logout' })
    const router = renderAt('/admin/conteudo/livros')

    expect(screen.getByText('tela de login')).toBeTruthy()
    expect(router.state.location.search).toBe('')
  })

  it('PATIENT autenticado não vê tela interna (critério 1)', () => {
    useSession.setState({ status: 'authenticated', accessToken: 't', user: user('PATIENT'), endReason: null })
    renderAt('/admin')

    expect(screen.queryByText('área interna')).toBeNull()
    expect(screen.getByText('tela de login')).toBeTruthy()
  })

  it('ADMIN autenticado vê a área interna', () => {
    useSession.setState({ status: 'authenticated', accessToken: 't', user: user('ADMIN'), endReason: null })
    renderAt('/admin')

    expect(screen.getByText('área interna')).toBeTruthy()
  })

  it('enquanto a sessão é verificada, mostra carregando e não redireciona', () => {
    useSession.setState({ status: 'unknown', accessToken: null, user: null, endReason: null })
    const router = renderAt('/admin')

    expect(screen.getByRole('status').textContent).toContain('Verificando sessão')
    expect(router.state.location.pathname).toBe('/admin')

    act(() => useSession.setState({ status: 'authenticated', accessToken: 't', user: user('ADMIN') }))
    expect(screen.getByText('área interna')).toBeTruthy()
  })
})

describe('safeNext', () => {
  it.each([
    [null, '/admin'],
    ['/admin/usuarios', '/admin/usuarios'],
    ['https://evil.com', '/admin'],
    ['//evil.com/admin', '/admin'],
    ['/', '/admin'],
  ])('%s → %s', (input, expected) => {
    expect(safeNext(input)).toBe(expected)
  })
})
