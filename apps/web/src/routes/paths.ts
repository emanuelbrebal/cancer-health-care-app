// Substitui src/helpers/router.ts do template (flash data em cookie → `location.state`).
export const paths = {
  login: '/',
  forgotPassword: '/esqueci-senha',
  resetPassword: '/redefinir-senha',
  home: '/admin',
  account: '/admin/conta',
  users: '/admin/usuarios',
  user: (id: string) => `/admin/usuarios/${id}`,
  content: '/admin/conteudo',
  contentTab: (tab: ContentTab) => `/admin/conteudo/${tab}`,
  contentNew: (tab: ContentTab) => `/admin/conteudo/${tab}/novo`,
  contentEdit: (tab: ContentTab, id: string) => `/admin/conteudo/${tab}/${id}/editar`,
} as const

export const contentTabs = ['livros', 'filmes', 'series', 'lazer'] as const
export type ContentTab = (typeof contentTabs)[number]

/** Só aceita caminho interno do painel: evita open redirect via `?next=`. */
export function safeNext(next: string | null): string {
  if (!next || !next.startsWith('/admin') || next.startsWith('//')) return paths.home
  return next
}
