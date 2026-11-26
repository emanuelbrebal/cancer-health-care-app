# Gerenciador Web — bootstrap a partir do admin-template

- Branch: `feat/GerenciadorWeb` (de `main` @ `3ee596d`)
- Stash pendente: `stash@{0}` "pre-GerenciadorWeb: expo patch bump + casos de uso mobile" (origem `feat/HeuristicasNielsen`, recuperar lá com `git stash pop`)
- Fonte de verdade de comportamento: `docs/prd-web-admin/` (PRDs 01–05). Este plano cobre o **visual/estrutura** (template + Figma) e o recorte executável agora.
- Plano irmão: `tasks/manual-de-uso.md`

---

## FASE 1 — Escopo

**Objetivo:** portar o `CarlosWGama/admin-template` (Next.js 15) para o `apps/web` (React 19 + Vite 7) e entregar o painel ADMIN com sessão segura (PRD 01) e as telas dos PRDs 02–04 **na medida em que o backend atual permite**, com visual alinhado ao Figma.

**Decisões do usuário (2026-11-25)**
- Stack: portar para Vite (não adotar Next)
- Funcionário = ADMIN (sem role nova)
- Refresh token em **cookie HttpOnly** (opção recomendada no PRD 01)
- Escopo: **só o painel web agora**; as lacunas do backend (G4–G10) ficam para outro plano
  - Exceção: a emissão do cookie é obrigatoriamente do servidor. Entra aqui um ajuste mínimo em `backend/auth`, em commits próprios, sem mudar o contrato usado pelo mobile.

**Escopo**
- Bootstrap: tooling, kit de UI do template, layout com menu, roteamento e guard
- PRD 01 completo: login ADMIN, refresh silencioso single-flight, logout, esqueci/redefinir senha, troca de senha, 429, `ACCOUNT_SUSPENDED`, retorno à URL pedida, encerramento por 30 min de inatividade
- Backend (mínimo): rotas web de sessão com cookie
- PRD 02 parcial: listas de livros/filmes/séries (ativos), editar (só campos alterados), inativar com confirmação. **Criar mídia bloqueado** (sem endpoint de gêneros, G4)
- PRD 03 parcial: lazer com listar, criar, editar e inativar; aviso fixo W03-6; rótulos pt-BR dos enums
- PRD 04 parcial: lista (e-mail mascarado, sem telefone/nascimento/foto), detalhe, excluir com confirmação em duas etapas (digitar o e-mail), bloqueio de autoexclusão no front
- Página inicial com atalhos (o template tem "dashboard"; KPIs estão fora do escopo do PRD)
- Fidelidade ao Figma (bloqueada até o MCP carregar)

**Não-escopo:** gêneros, listagem de inativos/paginação no servidor, reativar, `synopsis`, suspensão pelo admin, PRD 05 (consentimentos), criar usuário/admin pelo painel, editar dados de terceiros, upload de imagem, deploy (CESMAC).

**Critérios de aceite**
1. `npm run start:web` sobe; `npm run build -w web` e `npm run lint -w web` passam. ✅
2. PRD 01, critérios 1–6 atendidos; em especial **nenhum token em `localStorage`, na URL ou no console**, e o access token só em memória. ✅
3. Refresh pelo cookie `HttpOnly; Secure; SameSite=Strict`, restrito ao path das rotas web; reuso do refresh após "Sair" → `401`. ✅
4. Mobile intocado: `POST /auth/login|refresh|logout` com corpo JSON seguem idênticos (testes e2e de auth existentes passam). ✅
5. Lazer: criar/editar/inativar refletem no app; nome duplicado mostra "Já existe uma atividade com este nome" sem perder o que foi digitado. ⚠️ parcial: duplicado verificado no navegador; criar/editar/inativar gravando no banco **não** foi exercitado (evitei sujar o banco de dev), fica para o smoke manual
6. Mídia: editar envia só os campos alterados (formulário sem mudança não chama a API) e trata `{ message, data }` (POST) e o item direto (PATCH). ✅
7. Usuários: lista sem telefone/nascimento/foto, e-mail mascarado `m***@dominio.com`; exclusão pede o e-mail digitado; o próprio admin não vê a ação de excluir a si mesmo. ✅
8. Telas com ação bloqueada (criar mídia, suspender, reativar) mostram "Em breve" desabilitado com motivo, sem botão quebrado. ✅
9. WCAG 2.2 AA nos formulários e tabelas: rótulos, foco visível, operação por teclado, erro anunciado (`aria-live`). ⚠️ parcial: rótulos, `aria-live`, foco visível e `<dialog>` implementados; sem auditoria axe/leitor de tela nesta rodada
10. Nenhum `next/*` ou `js-cookie` no `apps/web`; visual conferido contra o Figma. ✅

**Bloqueadoras:** nenhuma. Figma liberado em 2026-11-25 pela cópia do usuário.

**Premissas**
- Admin inicial vem do seed (`prisma/seed.ts:39`, `admin@oncomente.com`).
- Template sem LICENSE: uso autorizado como base do projeto; a origem vai registrada no README.
- PRDs escritos em 16/11 marcam G1–G3 como lacuna, mas o backend atual **já** tem guards de ADMIN, `GET /users` só para ADMIN e refresh/logout (evidências 3–5).

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Comportamento, campos e mensagens do painel | `docs/prd-web-admin/01..05-*.md` |
| 2 | Login devolve `{ access_token, refresh_token, user }`; refresh/logout recebem `refresh_token` no **corpo**; sem `cookie-parser` no backend | `apps/backend/src/auth/auth.controller.ts:35-57`, `apps/backend/package.json` |
| 3 | CORS por `CORS_ORIGINS`, liberado em dev, **sem `credentials`**; `whitelist: true` | `apps/backend/src/bootstrap/configure-app.ts:12-19` |
| 4 | Users: `GET /users` só ADMIN; `GET/PATCH /users/:id` dono ou ADMIN; `DELETE /users/:id` só ADMIN; sem `POST /users` nem suspensão de terceiros | `apps/backend/src/user/user.controller.ts:31-87` |
| 5 | Media/leisures: escrita com `JwtAuthGuard + RolesGuard + @Roles(ADMIN)`; `genreId` obrigatório; `Genre` sem controller | `media/books/books.controller.ts:25-69`, `media/common/dto/CreateMediaDto.ts:21`, `prisma/schema/schema.prisma:134` |
| 6 | `createAuthStore` persiste `token` e `user`; não modela refresh | `packages/shared/store/useAuthStore.ts` |
| 7 | Estrutura do template (Next 15, Tailwind 4, Formik/Yup, js-cookie, ionicons) | `gh api repos/CarlosWGama/admin-template/git/trees/main` |

**Incertezas**
- ~~Conteúdo de `middleware.ts`, `helpers/router.ts`, `services/user.ts`~~ → lido no item 1: cookie `user` legível, flash data em cookie e mock; nenhum portado literalmente.
- ~~Validação de `type`/`frequency`~~ → `@IsEnum` nos dois (item 7).
- ~~Regra "última conta ADMIN"~~ → **não existe** no backend (`user.service.ts:73-90`, `user.controller.ts:80-86`); o painel não oferece excluir a si mesmo nem conta ADMIN (P6).
- Versões de libs: fixar com `npm view` na execução.

---

## FASE 3 — Arquitetura

**Decisão 1 — Como trazer o template:** copiar o `src/` para um diretório isolado e adaptar arquivo a arquivo dentro do `apps/web`. Subtree/submódulo foi descartado (acopla o histórico Next ao monorepo); reescrever do zero foi descartado (ignora "trabalhe em cima dele").

**Decisão 2 — Sessão com cookie (backend mínimo)**

| Abordagem | Corretude | Blast radius | Manutenção | Alinhamento |
|---|---|---|---|---|
| A. Rotas novas `POST /auth/web/{login,refresh,logout}` que reusam `AuthService`/`SessionService`, gravam o refresh em cookie e devolvem só `{ access_token, user }` | 5 | baixo: mobile usa as rotas atuais sem mudança | 4 | 5 |
| B. Rotas atuais detectam o cliente (header) e alternam corpo/cookie | 3 | médio: toca o fluxo do mobile | 2 | 3 |
| C. BFF/proxy na frente da API | 4 | baixo | 2 (serviço novo para deploy) | 2 |

**Vencedora: A.** Isola o painel, não altera o contrato do mobile e é reversível removendo as 3 rotas.
- Cookie `oncomente_admin_rt`: `HttpOnly; Secure` (em dev `Secure` só fora de localhost); `SameSite=Strict`; `Path=/auth/web`; `Max-Age` = `REFRESH_TTL_DAYS`.
- CSRF: `SameSite=Strict` + header obrigatório `X-Requested-With: oncomente-admin` nas rotas web + `enableCors({ credentials: true })` só com origens explícitas (em produção, `CORS_ORIGINS`).
- `/auth/web/login` recusa role ≠ ADMIN no servidor e revoga a sessão recém-emitida (W01-2 garantido no backend, não só na UI).
- Dependência: `cookie-parser`.

**Decisão 3 — Front: estado e HTTP**
- Access token e usuário em **memória** (Zustand sem `persist`, store local do `apps/web`). `createAuthStore` do shared foi descartado porque persiste o token, o que o PRD proíbe.
- No boot, o app chama `/auth/web/refresh` para restaurar a sessão (F5 continua logado enquanto o cookie vale).
- Axios com `withCredentials` nas rotas `/auth/web/*`, Bearer nas demais, refresh **single-flight** em 401 (promise compartilhada), um retry e logout se falhar.
- Inatividade de 30 min → logout.

**Decisão 4 — Roteamento:** `react-router` com `createBrowserRouter`, layout `/admin` aninhado e `<RequireAdmin>` guardando `?next=` para voltar à URL pedida. TanStack Router foi descartado: curva extra sem ganho para cerca de 15 rotas.

**Validações:** autorização segue no backend (guards + checagem de role no login web); o guard do front é só UX. Backend alterado só em `auth`, sem tocar `user`/`media`. Tudo reversível por commit. Contratos atuais preservados.

**Mapeamento template (Next) → `apps/web` (Vite)**

| Template | Destino | Adaptação |
|---|---|---|
| `src/app/layout.tsx`, `globals.css` | `src/main.tsx`, `src/index.css` | `@import "tailwindcss"`, tokens em `@theme`, Montserrat |
| `src/app/(login)/page.tsx`, `_form.tsx` | `src/pages/auth/{LoginPage,LoginForm}.tsx` | Formik/Yup; mensagens W01-3/9/10 |
| (novo) | `src/pages/auth/{ForgotPassword,ResetPassword}Page.tsx`, `src/pages/account/ChangePasswordPage.tsx` | W01-7/8 |
| `src/app/admin/layout.tsx` | `src/layouts/AdminLayout.tsx` | `<Outlet/>`, menu, "Sair" |
| `src/app/admin/dashboard/page.tsx` | `src/pages/home/HomePage.tsx` | atalhos, sem KPI |
| `src/app/admin/usuarios/{page,_list}.tsx` | `src/pages/users/UsersListPage.tsx` | máscara de e-mail; colunas do PRD 04 |
| `src/app/admin/usuarios/editar/[userID]/*` | `src/pages/users/UserDetailPage.tsx` | **somente leitura** (PRD 04 proíbe editar terceiros); `useParams()` |
| `src/app/admin/usuarios/novo/*` | — removido | criar usuário fora do escopo |
| (novo) | `src/pages/{books,movies,series,leisures}/*` + `src/features/content/` | lista + formulário genérico por tipo |
| `src/middleware.ts` | `src/routes/RequireAdmin.tsx` | `<Navigate to="/?next=…" />` |
| `src/helpers/router.ts` | `src/routes/paths.ts` | constantes (confirmar conteúdo) |
| `next/navigation`, `next/link` | `useNavigate`, `<Navigate>`, `Link`/`NavLink` | — |
| `src/services/user.ts` | `src/services/{http,auth,users,content}.ts` | axios + interceptor |
| `js-cookie` | — removido | cookie HttpOnly não é legível pelo JS |
| `src/themes/components/*` | `src/components/ui/*` | tirar `"use client"`; `next/image` → `<img>` |
| `src/app/styles/ionicons.*` | `src/assets/ionicons/` | manter fontes locais |
| `next.config.ts`, `postcss.config.mjs`, `tailwind.config.js` | `vite.config.ts` | `@tailwindcss/vite`; alias `@/`; proxy `/api` → `:3000` em dev |
| `NEXT_PUBLIC_*` | `import.meta.env.VITE_API_URL` | `.env.example` |

---

## Tokens do Figma

Arquivo: cópia do usuário `VMXbv1C2tgGO6TtCAaIxny` ("Modelo base p/ gerenciador web (Copy)"). O original `55tQNBTdXpKpO5HEyj1dWs` recusa leitura por MCP (sem acesso de editor). Extraído em 2026-11-25 via `get_variable_defs`, `get_screenshot` e `get_design_context` (sidebar `28:131`, header `28:147`, tabela `28:160`); o limite do plano Starter do MCP cortou a leitura do login e dos modais, então raio e sombra deles saíram **aproximados do screenshot**.

**Páginas:** `340:451` guia (texto: módulos recomendados + "Inter/Nunito Sans/Roboto" e "ícones Lucide React") · `0:1` Prototipo (telas) · `28:265` Componentes (botões `341:7383`, campos `341:7767`, seleção `341:7844`, tipografia `341:9435`, identidade `341:9679`).

**Paleta**

| Token (`@theme`) | Figma | Hex |
|---|---|---|
| `--color-primary` | primaria / Colors/Ação/Azul | `#0069ad` |
| `--color-secondary` | Colors/Principais/Secundária | `#a6d6d6` |
| `--color-ink` | Texto escuro | `#1e1e1e` |
| `--color-ink-strong` | Colors/Neutros/Texto | `#000000` |
| `--color-ink-inverse` | Texto claro | `#fbfbfb` |
| `--color-ink-muted` | Cinza escuro (#313231) | `#313231` |
| `--color-placeholder` | cinza escuro (#8b8b8b) | `#8b8b8b` |
| `--color-surface` | surface | `#f5f5f5` |
| `--color-surface-dark` | fundo-escuro (cabeçalho da tabela, card de perfil) | `#111828` |
| `--color-surface-dark-alt` | Surface escuro | `#202938` |
| `--color-line` | cinza-médio | `#c7c7c7` |
| `--color-line-soft` | cinza claro | `#d3d3d3` |
| `--color-checkbox` | Colors/Neutros/cinza | `#8e8e93` |
| `--color-danger` | Erro | `#e00808` |
| `--color-danger-soft` | Score/4 (botão "Bloquear") | `#e23232` |
| `--color-info` | Info (link "Esqueci minha senha") | `#4703d0` |
| `--color-success` | "Ativo" no perfil (verde do screenshot, escurecido para contraste AA) | `#2e7d32` |
| `--color-surface-page` | fundo da área de conteúdo (template `--background-secondary`) | `#f2f3f0` |
| `--color-primary-hover` | derivado (hover do primário) | `#005a94` |

**Tipografia** (desktop = Inter; Montserrat só no "MobileFirst" do Figma, que é o app)

| Estilo Figma | Tamanho/peso | Uso |
|---|---|---|
| Titulo 1 | 28 / 600 | — |
| título de página (header) | 24 / 600 | "Gerenciador de usuários" |
| título de seção | 24 / 500 | "Lista de contas cadastradas" |
| Titulo 2 | 22 / 600 | título de modal |
| Titulo 3 | 20 / 400 | — |
| Corpo / Cabeçalho | 17 / 400–600 | campos, cabeçalho da tabela, botões |
| Corpo Pequeno | 16 / 400 | itens do menu, botões |
| Subtítulo | 15 / 400 | — |
| Texto de apoio | 14 / 400 | descrição do header, linhas da tabela (14/500) |
| Nota Pequena | 13 / 400–600 | links auxiliares |
| Legenda 1/2 | 12 · 11 / 600 | — |

**Espaçamento, raios, sombras**
- Grid: sidebar 200 px fixa; conteúdo com margem 31 px; gaps 8/16/20/32 px; linhas da tabela 58 px; botões de ação 50 px (alvo de toque).
- Raios: campo 12 px; botão/pill 100 px (`rounded-full`); painéis 24 px (header: só embaixo; principal: só em cima); item ativo do menu 24 px só à esquerda; card do dashboard/modal 16–24 px (aprox.); checkbox 4 px; rodapé 20 px em cima.
- Sombras: campos preenchidos (`surface`) e cards do dashboard com sombra curta para baixo (aprox. `0 2px 4px rgb(0 0 0 / .25)`); modal sobre overlay escuro com blur.
- Ícones: **Lucide React** (recomendação do guia `340:4071`).

**Telas (node-id)**

| Tela Figma | node-id | Destino no plano |
|---|---|---|
| Login | `1:2` (form `1:7168`) | `LoginPage` |
| esqueci minha senha (modal sobre login) | `23:70` (modal `23:259`) | `ForgotPasswordPage` |
| Solicitar acesso / enviada | `12:23`, `23:482` | — (sem rota) |
| Dashboard | `1:7207` | `HomePage` (cards de atalho, sem KPI) |
| Gerenciar contas | `28:130` | `UsersListPage` |
| Gerenciar contas - Ver perfil | `376:1254` | `UserDetailPage` |
| Gerenciar contas - editar perfil | `376:1758` | — (PRD 04 proíbe) |
| Gerenciar contas - Excluir usuario | `29:1094`, `378:740` | modal de exclusão (`UserDetailPage`) |
| Conteúdo | `37:720` | listas de livros/filmes/séries/lazer |
| adc conteudo | `40:1063` | formulário de criação (lazer) |
| editar | `385:1726` | formulário de edição (lazer/mídia) |
| Excluir conteúdo | `385:1404` | modal de inativação |
| Minha Conta | `45:1657` (frame vazio) | `ChangePasswordPage` |

**Divergências Figma × plano/PRD** (regra: PRD manda no comportamento, Figma no visual)

| # | Divergência | Decisão |
|---|---|---|
| D1 | "Solicitar acesso" (`12:23`/`23:482`) sem rota no plano; PRD 01 põe cadastro de admin fora do escopo | não implementar; o link "Entre em contato com o desenvolvedor" vira texto informativo |
| D2 | "Esqueci a senha" é modal no Figma; plano tem página | rota `/esqueci-senha` renderiza o modal sobre o layout do login (visual do Figma, URL do plano) |
| D3 | Redefinir senha (link do e-mail) sem frame | reusa o layout do login |
| D4 | Modais de exclusão pedem **senha**; PRD 04 W04-6 pede **digitar o e-mail** | e-mail (PRD); visual do modal mantido. Inativar conteúdo: confirmação simples, sem senha (o backend não pede) |
| D5 | Lista de contas: botão "Cadastrar usuário", ícone "editar" e coluna Nível | sem cadastrar (fora do escopo); "editar" vira "ver" (olho); colunas do PRD 04 (nome, e-mail mascarado, perfil, data de cadastro) |
| D6 | Ver perfil: Editar, Bloquear, Resetar senha, CPF, endereço, foto | somente leitura com os campos do PRD 04 (W04-3); "Bloquear" = "Em breve" (W04-4); sem resetar senha (W04-8) nem foto/CPF/endereço |
| D7 | Menu com Relatórios, Cadastros, Notificações, Configurações, Logs e Suporte | sem rota no plano; ficam fora do menu (não há tela) |
| D8 | Header com ícones de tema e notificações | omitidos (sem função); ícone de usuário → "Minha conta" |
| D9 | Form de conteúdo com upload de arquivo e "Visibilidade" | upload fora do escopo (`image_path` em texto, R3); "Visibilidade" ↔ status Ativo/Inativo |
| D10 | Plano previa **ionicons** e **Montserrat** (template) | Figma manda no visual: **lucide-react** + **Inter**; ionicons não é portado |
| D11 | Plano previa rotas de mídia e lazer separadas; Figma tem um "Conteúdo" | uma entrada "Conteúdo" no menu com abas Livros/Filmes/Séries/Lazer |
| D12 | Marca "CITEC"/"Nome do aplicativo" e logo placeholder | nome "OncoMente — Gerenciador" e rodapé "© 2026 OncoMente"; logo CITEC não usado (não é a marca do app) |
| D13 | Ilustração do login (`1:2`) | não baixada (limite do MCP no plano Starter); painel esquerdo usa ícone Lucide + texto. Trocar pelo asset quando houver cota |
| D14 | Plano previa proxy `/api` → `:3000` no Vite | **sem proxy**: o cookie tem `Path=/auth/web` e precisa ver o caminho real; `localhost:5173` e `localhost:3000` são o mesmo site, então `SameSite=Strict` funciona com `VITE_API_URL=http://localhost:3000` |
| D15 | Redefinir senha "por link" (PRD 01 W01-7) | o e-mail do backend manda o **código em texto** (`mailer.service.ts:30`); a tela tem campo "Código" (pré-preenchido se vier `?token=`) |

---

## FASE 4 — Checklist de execução

1. [x] **Ler o template** num diretório isolado (scratchpad) e fechar o mapeamento fino. Sem commit.
2. [x] **Backend: sessão web por cookie:** `cookie-parser`; `POST /auth/web/{login,refresh,logout}` com checagem de ADMIN; CORS `credentials` com origens explícitas; e2e cobrindo cookie, rotação, reuso após logout, PATIENT recusado e rotas antigas inalteradas. → `✨ feat(auth): add admin cookie session` + `🧪 test(auth): cover admin cookie session`
3. [x] **Tooling web:** `react-router`, `tailwindcss` + `@tailwindcss/vite`, `formik`, `yup`, `axios`, `zustand`; alias; proxy; `.env.example`; remover o boilerplate. → `🔧 chore(web): setup vite tooling`
4. [x] **Kit de UI** do template portado + ionicons + tokens provisórios. → `✨ feat(web): port template ui kit`
5. [x] **Sessão + HTTP:** store em memória, restauração no boot, interceptor single-flight, inatividade de 30 min. → `✨ feat(web): add admin session client`
6. [x] **Rotas + PRD 01:** login, guard com `?next=`, layout/menu, sair, esqueci/redefinir, trocar senha, mensagens 401/403/429. → `✨ feat(web): add admin auth flow`
7. [x] **Lazer + mídia:** ler os DTOs → schemas Yup; lazer com criar/editar/inativar; mídia com listar/editar (diff de campos)/inativar; "Em breve" em criar mídia. → `✨ feat(web): add content management`
8. [x] **Usuários:** lista mascarada, detalhe somente leitura, exclusão em duas etapas; conferir a regra da última conta ADMIN. → `✨ feat(web): add users management`
9. [x] **Figma (desbloqueado):** tokens extraídos da cópia `VMXbv1C2tgGO6TtCAaIxny` e aplicados já no item 4; ajuste fino feito tela a tela nos itens 6–8 (cada tela com node-id). Sem commit `style` próprio: não sobrou ajuste depois das telas.
10. [x] **Testes + docs:** Vitest/Testing Library (guard, interceptor single-flight, máscara de e-mail, diff de PATCH); smoke manual dos critérios; `apps/web/README.md`, CLAUDE.md (`apps/web` e rotas `/auth/web/*`), Postman e histórico neste arquivo. → `🧪 test(web): …` + `📚 docs(web): document admin setup`

Ordem executada: tokens do Figma → 1 → 2 → 3 → 4 (com tokens do Figma) → 5 → 6 → 7 ∥ 8 (subagentes em paralelo) → 9 (absorvido) → 10.

---

## FASE 5 — Verificação

- [x] Regra de negócio na camada certa (ADMIN checado no servidor, inclusive no login web)
- [x] Sem acoplamento desnecessário (mobile e rotas atuais intocados; shared não alterado)
- [x] Critérios de aceite objetivos e testáveis (10)
- [x] Checklist ≤ 10 itens
- [x] Máx. 3 abordagens avaliadas, 1 escolhida (Decisão 2: A)
- [x] Evidências ≤ 7
- [x] Bloqueadoras respondidas ou explicitadas (Figma → item 9)

**Gate = Livre para execução** (todos os itens; executado em 2026-11-25)

---

## Riscos e pendências

| # | Item | Encaminhamento |
|---|---|---|
| R1 | `SameSite=Strict` exige painel e API no **mesmo site** em produção (ex.: `admin.x.br` e `api.x.br`) | registrar no `docs/release/06-deploy-checklist.md` (handoff CESMAC) |
| R2 | Ajuste de backend dentro de um escopo "só web" | limitado a `auth`, commits próprios, e2e garantindo o mobile |
| R3 | Imagens só por texto (`image_path`); app usa mapa local (G8) | conteúdo novo pode aparecer sem capa; documentar no manual |
| R4 | `GET /users` sem paginação (máx. 500); filtro e paginação no cliente | suficiente para o TCC |
| P1 | G4 gêneros → libera "criar mídia" | próximo plano de backend |
| P2 | G5/G6 inativos e reativar; G7 `synopsis` | idem |
| P3 | Suspender/reativar pelo admin (W04-4/5) e trilha de auditoria (W04 crit. 6) | idem |
| P4 | PRD 05 inteiro (`/admin/consents/*`, `/admin/deletions`) | idem |
| P5 | Mensagem do POST de filmes diz "Livro criado com sucesso!" (confirmado no item 7) | `apps/backend/src/media/movies/movies.controller.ts:37`, `fix/` separado |
| P6 | `DELETE /users/:id` não bloqueia autoexclusão nem a última conta ADMIN (W04-7) | front esconde a ação para si e para ADMIN; regra no backend num `fix/` |
| P7 | Nome/título duplicado não é tratado (P2002 vira 500) em lazer e mídia | painel valida contra a lista antes de enviar e trata 500/409 como provável duplicado; backend deveria devolver 409 |
| P8 | `UserMapper.toDto` não devolve `status`/`suspendedAt`; mídia/lazer não devolvem `updatedAt` nem `genreId` | lista sem colunas de status (W04-1) e de atualização (W02-1/W03-1); DTO admin no próximo plano |
| P9 | Respostas usam `imagePath`/`pageCount`, escrita usa `image_path`/`page_count`; PATCH de séries devolve `{ message, data }` cru | tratado no `services/content.ts`; padronizar no backend |
| P10 | `GET /:id` de mídia/lazer só acha ativos | editar item inativado dá 404 ("não encontrado ou inativado"); depende de G5/G6 |
| P11 | Exclusão de usuário sem motivo (W04-6): endpoint não recebe `reason` | modal em 2 etapas sem campo de motivo; incluir no próximo plano |

---

## Histórico de execução

### 2026-11-25 — `/exec` (persona: arquiteto front-end sênior)

**Figma.** O arquivo original recusou o MCP (sem acesso de editor); o usuário duplicou para `VMXbv1C2tgGO6TtCAaIxny`. Extraídos variáveis, 9 screenshots de tela e o código de referência de sidebar/header/tabela; o limite do plano Starter cortou o resto (D13, sombras aproximadas).

**Delegação.** Itens 7 e 8 rodaram em paralelo em dois subagentes (só arquivos novos, sem commit); integração no router/menu, revisão, smoke e commits ficaram no agente principal.

### Stage de Execução — Entregáveis

| # | Entregável | Caminho | Commit | Status |
|---|---|---|---|---|
| 0 | Tokens do Figma + divergências D1–D15 | `tasks/gerenciador-web.md` | (docs) | ✅ |
| 1 | Leitura do template (scratchpad) | — | — | ✅ |
| 2 | Rotas `POST /auth/web/{login,refresh,logout}`, guard anti-CSRF, `cookie-parser`, CORS `credentials` | `apps/backend/src/auth/{auth-web.controller,auth.service,auth.module}.ts`, `auth/guards/admin-web-client.guard.ts`, `bootstrap/configure-app.ts` | `a7df985` | ✅ |
| 2 | e2e da sessão web (7 casos) | `apps/backend/test/admin-web-session.e2e-spec.ts` | `ed91916` | ✅ |
| 3 | Tooling (Tailwind 4, router, formik, yup, axios, zustand, lucide, Inter), alias, `.env.example` | `apps/web/{package.json,vite.config.ts,tsconfig.app.json,index.html,.env.example}` | `a7c4a08` | ✅ |
| 4 | Kit de UI + `@theme` com tokens do Figma | `apps/web/src/components/ui/*`, `src/index.css` | `0677e78` | ✅ |
| 5 | Store em memória, axios single-flight, inatividade 30 min | `src/store/session.ts`, `src/services/{http,auth,errors}.ts`, `src/hooks/useInactivityLogout.ts` | `6e42edb` | ✅ |
| 6 | Login (`1:2`), esqueci (`23:70`), redefinir, trocar senha (`45:1657`), layout (`28:131`, `28:147`, footer `82:630`), início (`1:7207`), guard | `src/pages/{auth,account,home}/*`, `src/layouts/*`, `src/routes/*` | `25727be` | ✅ |
| 7 | Conteúdo: listas (`37:720`), inativar (`385:1404`), lazer criar/editar (`40:1063`, `385:1726`), mídia editar (`385:1726`) | `src/pages/content/*`, `src/features/content/*`, `src/services/content.ts`, `components/ui/CheckboxField.tsx` | `0a3a3b3` | ✅ |
| 8 | Usuários: lista (`28:130`), detalhe (`376:1254`), exclusão (`29:1094`/`378:740`) | `src/pages/users/*`, `src/features/users/*`, `src/services/users.ts` | `59837bb`, `172ae8b` | ✅ |
| 9 | Ajuste fino Figma | absorvido em 4, 6, 7, 8 | — | ✅ |
| 10 | Vitest (30 testes) | `src/**/*.test.ts(x)` | `6fd5de1` | ✅ |
| 10 | README, CLAUDE.md, Postman (3 rotas web), checklist de deploy (R1), este plano | `apps/web/README.md`, `CLAUDE.md`, `apps/postman/…collection.json`, `docs/release/06-deploy-checklist.md` | (docs) | ✅ |

**Desvios do plano**
- Sem proxy no Vite (D14): o `Path=/auth/web` do cookie exige o caminho real da API.
- Ionicons e Montserrat trocados por Lucide e Inter (D10, Figma manda no visual).
- `zustand` do web fixado em `^5.0.13` para não mexer no hoisting do mobile; o Tailwind 4 trouxe bumps transitivos de build (`@jridgewell/sourcemap-codec` 1.6.0, `enhanced-resolve` 5.27.0, `tinyexec`), todos semver-compatíveis.
- `jsdom` fixado em `^26` (o 31 exige Node ≥ 22.22; local é 22.19).
- Item 9 sem commit `style` próprio (tokens entraram no item 4).
- Commit extra `🐛 fix(web)`: foco no campo da 2ª etapa do modal de exclusão, achado no smoke.

### Stage de Execução — Validação

| Critério | Resultado | Evidência |
|---|---|---|
| 1. start/build/lint | ✅ | `npm run build -w web` e `npm run lint -w web` limpos; `vite` subiu em :5173 no smoke |
| 2. PRD 01 (1–6) | ✅ | navegador: PATIENT → "Acesso restrito a administradores"; `/admin/usuarios` sem sessão → login `?next=` → volta após entrar; `localStorage` vazio, `document.cookie` sem o refresh, console sem token; Vitest: 3 × 401 → 1 refresh |
| 3. Cookie e reuso após sair | ✅ | e2e: `HttpOnly; Secure; SameSite=Strict; Path=/auth/web; Max-Age=604800`; rotação; reuso pós-logout 401; navegador: logout 200 → refresh 401 |
| 4. Mobile intocado | ✅ | `git diff 3ee596d..HEAD -- apps/mobile packages/shared auth.controller.ts` vazio; e2e `/auth/login|refresh|logout` com corpo JSON idênticos; suíte e2e 5/5 (26 testes) |
| 5. Lazer | ⚠️ | duplicado "Já existe uma atividade com este nome" sem perder o digitado e sem chamar a API (navegador); gravação real não exercitada |
| 6. Mídia (diff) | ✅ | navegador: salvar sem mudança → "Nenhuma alteração para salvar" e nenhuma requisição; Vitest `diffChanged`; `unwrap` trata `{message,data}` e item direto |
| 7. Usuários | ✅ | navegador: e-mail `a***@oncomente.com`, sem telefone/nascimento/foto; própria conta sem "Excluir"; modal pede o e-mail e mantém "Excluir" desabilitado até bater |
| 8. "Em breve" | ✅ | "Cadastrar" (mídia, G4) e "Suspender conta" (W04-4) desabilitados com motivo visível |
| 9. WCAG 2.2 AA | ⚠️ | rótulos, `aria-invalid/describedby`, `aria-live`, foco visível global, skip link, `<dialog>` com Esc; sem auditoria axe nesta rodada |
| 10. Sem `next/*`/`js-cookie`; Figma | ✅ | grep vazio; telas comparadas aos screenshots dos node-ids |
| Prompt: tokens em `@theme`, sem hex solto | ✅ | `grep -rE "#[0-9a-f]{3,8}" apps/web/src --include=*.ts*` vazio |
| Prompt: commits por `.claude/rules/commits.md` | ✅ | 10 commits atômicos; backend (`feat`/`test(auth)`) separado do web |
| Prompt: stash@{0} | ✅ | não aplicado |

**Pendências humanas**
- Smoke de gravação: criar/editar/inativar lazer e editar mídia no banco de dev e conferir no app (critério 5).
- Auditoria axe / leitor de tela nas telas novas (critério 9).
- Trocar a ilustração do login pelo asset do Figma quando houver cota no MCP (D13).
- Backend: P6 (última conta ADMIN), P7 (409 em duplicado), P8 (status/updatedAt no DTO admin), P11 (motivo da exclusão).
