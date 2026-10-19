# 03 — Gerenciador Web (Painel Administrativo)

> Estado atual: `apps/web` é o template padrão do Vite (React 19 + TS 5.9 + Vite 7, sem dependências de app). Commits na pasta: só setup.

## FASE 1 — Escopo

**Objetivo:** painel autenticado (somente ADMIN) que mantém todo o conteúdo dinâmico do app e permite moderação/auditoria, cobrindo RF-001 regra 4, RF-003, RF-008..011, RF-014 (consulta de logs), RF-023 (meses de conscientização), RF-025.

**Telas (escopo)**

| Módulo | Operações | RF | Endpoint (plano 04) |
|---|---|---|---|
| Login admin | login, logout, sessão expirada | RF-004 | `POST /auth/login` (rejeitar role ≠ ADMIN no client e no server) |
| Dashboard de KPIs (8 páginas) + Saúde da API | ver catálogo no plano 09 | RNF16 | `/admin/kpis/*`, `/admin/api-health` *(a criar — plano 09)* |
| Livros | listar/buscar (título, autor, gênero, ano), criar, editar, inativar/reativar | RF-008 | `/books` |
| Filmes | idem (diretor) | RF-010 | `/movies` |
| Séries | idem (showrunner, temporadas) | RF-009 | `/series` |
| Atividades | idem (tipo, frequência) | RF-011 | `/leisures` |
| Gêneros | CRUD por tipo | RF-008..010 | `/genres` *(a criar)* |
| Meses de conscientização | CRUD | RF-023 | `/awareness-months` *(a criar)* |
| Mensagens diárias/motivacionais | CRUD, segmentação por role | RF-007 1.a/1.b | `/daily-messages` *(a criar)* |
| Mascote | ver config ativa, editar prompt/personalidade, histórico de versões, ativar/desativar | RF-025 | `/mascot-config` *(a criar)* |
| Usuários | buscar por nome/e-mail/role/status, ver detalhe (sem dados de diário), alterar status, criar ADMIN | RF-001, RF-003 | `/users` + `/users/admin` *(a criar)* |
| Logs de emergência | lista filtrável por data/número | RF-014 | `/emergency-dial-logs` *(a criar)* |
| Auditoria | lista filtrável (ator, entidade, período) | RNF16 | `/audit-logs` *(a criar)* |

**Não-escopo:** leitura de diários de pacientes (RNF15 proíbe), edição de tratamentos de terceiros, i18n além de pt-BR.

**Critérios de aceite**
1. Usuário não-ADMIN não acessa nenhuma rota do painel (redirect para login + mensagem).
2. Cada CRUD: lista paginada com busca, formulário com validação client (Zod) espelhando os limites do doc (título 150, autor 120, etc.), confirmação antes de inativar, toasts de sucesso/erro com as mensagens do RNF02.
3. Conteúdo criado no painel aparece no app sem novo build (incluindo capa via URL).
4. `npm run build` e `npm run lint` sem erros; `tsc -b` sem erros.
5. Layout utilizável de 1280px a 768px (tablet); contraste AA.
6. Build estático configurável por `VITE_API_URL`.

## FASE 2 — Evidências

| Arquivo | Fato |
|---|---|
| `apps/web/package.json` | Só react/react-dom; nenhum router, client HTTP ou UI kit |
| `apps/web/src/App.tsx` | Template "Vite + React" |
| `packages/shared/store/useAuthStore.ts` | `createAuthStore(storageEngine)` aceita storage injetável → reutilizável com `localStorage` no web |
| `packages/shared/types/user.ts` | `UserRole`, `PronounEnum` compartilhados |
| `apps/backend/src/main.ts` | Sem CORS → bloqueio no browser até plano 04 item 7 |
| `apps/mobile/src/constants/mediaImageMap.ts` | Capas resolvidas por mapa local → precisa suportar URL remota (decisão D5) |

## FASE 3 — Decisões

**Bloco 1 — Base do painel**
| Opção | Corretude | Blast radius | Manutenção | Alinhamento | Esforço |
|---|---|---|---|---|---|
| A. Framework admin (react-admin / Refine) | 4 | 4 | 3 (convenções próprias, data provider custom para formatos `{message,data}` do Nest) | 3 | baixo |
| B. React Router + TanStack Query + React Hook Form + Zod + UI kit (Mantine ou shadcn/ui) | 5 | 5 | 4 | 5 (mesmo React do monorepo, reuso de `packages/shared`) | médio |
| C. Gerar painel a partir do Swagger (openapi codegen + scaffolding) | 3 | 4 | 3 | 3 | baixo inicial, alto para customizar |

**Escolha: B.** Respostas do backend são heterogêneas (`{ message, data }` no create, array cru no list), o que encarece data providers genéricos (A). B dá controle total, reaproveita o store compartilhado e é mais defensável na banca. Ganho incremental: tipagem do client gerada do Swagger (`openapi-typescript`) para não duplicar DTOs — só os tipos, não as telas (o melhor de C).

**Bloco 2 — Imagens de capa (D5)**
Escolha: campo de URL com preview + (fase 2) upload para object storage (Cloudinary ou Supabase Storage, free tier) retornando URL. Mobile passa a usar `{ uri }` quando `image_path` começa com `http`, mantendo o mapa local para o seed legado. Descartado: upload no disco do backend (disco efêmero em PaaS).

**Bloco 3 — Componente CRUD genérico**
Escolha: `ResourceTable` + `ResourceForm` configurados por schema Zod por recurso, com 1 página por recurso. Evita 8× a mesma tela sem esconder regras específicas (ex.: campos de detalhe de livro/filme/série).

## FASE 4 — Checklist de execução

Branch `feat/web-admin-foundation` → depois `feat/web-admin-<recurso>` por recurso.

1. [ ] Dependências: react-router, @tanstack/react-query, axios, react-hook-form, zod, @hookform/resolvers, UI kit escolhido; fixar versões exatas — `🔧 chore(web): add admin dependencies` · *verif.: `npm ls` sem peer warnings de React*
2. [ ] Estrutura `src/{api,auth,components,pages,routes,schemas}`, `api/client.ts` com `VITE_API_URL` + interceptors (JWT, 401 → logout), store via `createAuthStore(localStorage)`; remover template — `✨ feat(web): scaffold admin shell`
3. [ ] Login + `ProtectedRoute` (exige `role === 'ADMIN'`) + layout (sidebar, header, logout) — `✨ feat(web): add admin login and layout` · *verif.: PATIENT recebe "Acesso restrito"*
4. [ ] `ResourceTable` (paginação, busca, filtro de status, ação inativar/reativar com confirmação) e `ResourceForm` (RHF + Zod, mensagens do RNF02, modal "Todas as alterações serão perdidas…") — `✨ feat(components): add generic crud components`
5. [ ] Gêneros → Livros → Filmes → Séries → Atividades (1 commit por recurso) — `✨ feat(web): add books management` …
6. [ ] Meses de conscientização + Mensagens diárias — `✨ feat(web): add awareness months management` …
7. [ ] Mascote: editor de prompt (textarea grande com contagem), histórico de versões com diff simples, toggle ativo — `✨ feat(web): add mascot config page`
8. [ ] Usuários (busca, status, criar ADMIN), Logs de emergência — 1 commit por página
9. [ ] Dashboard de KPIs, Auditoria e Saúde da API → **executar pelo plano 09, bloco C** (itens 11–14)
10. [ ] Qualidade: testes de componentes críticos (Vitest + Testing Library: ProtectedRoute, ResourceForm), `Dockerfile` (nginx servindo `dist/`) ou config de static hosting, favicon/título "OncoMente Admin" — `🧪 test(web): cover auth guard and forms` · `🔧 chore(web): add production build config`

## FASE 5 — Verificação

- [x] Autorização real no backend; o guard do web é só UX
- [x] Web desacoplado (apenas REST + tipos gerados)
- [x] Critérios testáveis
- [x] Checklist = 10 itens
- [x] 3 opções avaliadas, 1 escolhida
- [x] Evidências ≤ 7
- [x] Dependência explícita: plano 04 B2 (CORS) e B3 (endpoints) antes dos itens 5–9

**Gate = Livre para execução** (itens 1–4 podem começar já, usando endpoints existentes de books/login).
