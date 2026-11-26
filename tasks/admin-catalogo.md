# Catálogo completo no painel: gêneros, inativos, reativar e sinopse

- Branch sugerida: `feat/AdminCatalogo` (de `main`, depois de `fix/AdminBackendFixes`)
- PRDs: `docs/prd-web-admin/02-catalogo-de-midia.md`, `03-atividades-de-lazer.md`
- Lacunas: G4, G5, G6, G7, P8 (`updatedAt`/`genreId`), P10 (G8 capa → `tasks/admin-capas.md`, sessão 3b)
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 3)

---

## FASE 1 — Escopo

**Objetivo:** tirar o "Em breve" do catálogo: o admin cria mídia, gerencia gêneros, vê e reativa itens inativos, filtra e pagina no servidor, e preenche sinopse.

**Escopo — backend**
- G4: `GET /genres?type=` (público, só ativos), `POST/PATCH/DELETE /genres` (ADMIN); não inativar gênero com itens ativos (W02-8).
- G5: `GET /admin/{books,movies,series,leisures}?status=&search=&genreId=&type=&frequency=&page=&limit=` (ADMIN), incluindo inativos.
- G6: `PATCH /admin/{books,movies,series,leisures}/:id/reactivate` (ADMIN).
- G7: `synopsis` aceito nos DTOs de criação/edição de mídia e lazer.
- P8/P10: respostas admin com `updatedAt`, `genreId`, `status`; `GET /admin/…/:id` encontra inativos.
- Unicidade de mídia afrouxada (decisão 4): migration troca `@@unique([title, type])` em `Media` por unicidade por tipo — livro: título + autor; filme/série: título + ano. Ajustar o seed se ele depender da regra antiga. O `409` da sessão 2 (`rethrowUnique` em `apps/backend/common/prisma/rethrow-unique.ts`) continua valendo; só a mensagem dos livros passa a citar título e autor.

**Escopo — web**
- Tela de gêneros (lista por tipo, criar, renomear, inativar) dentro de "Conteúdo".
- Criar mídia (formulário por tipo, seleção de gênero; sem gênero → orienta criar, PRD 02 crit. 5).
- Listas usando as rotas `/admin/*`: filtros (status, gênero/tipo, gratuito, frequência), busca e paginação no servidor; colunas "status" e "atualização".
- Reativar com confirmação; editar item inativo.
- Campo sinopse nos formulários (só painel; o app não exibe nesta sessão).
- O campo "Imagem (caminho ou URL)" continua como está; o upload substitui esse campo na sessão 3b.

**Não-escopo:** upload/processamento de capa e mudança no mobile (sessão 3b, `tasks/admin-capas.md`), sinopse no app, cartão completo de pré-visualização, importação em massa.

**Critérios de aceite**
1. PRD 02 crit. 1–6 e PRD 03 crit. 1–4 atendidos.
2. Rotas públicas atuais (`GET /books`, `/leisures`…) mantêm o contrato do app (só ativos, mesmo formato).
3. Item criado no painel aparece no app; reativado volta a aparecer.
4. Lista com 500 itens paginada no servidor sem travar.
5. e2e cobrindo gêneros, listagem admin com inativos, reativar e 401/403.

**Decisões (2026-11-26)**
1. **G8 — capa: upload (B).** O painel envia o arquivo e o backend padroniza (formato único, dimensão fixa, compressão, limite de peso). Sai desta sessão e vira a sessão 3b (`tasks/admin-capas.md`), para manter o checklist ≤ 10 e porque muda o mobile.
2. **Sinopse:** só no painel por ora (dado guardado; o app não exibe).
3. **Pré-visualização (W02-10):** só da capa, já no formato final — entra na sessão 3b. Cartão completo fica fora.
4. **Unicidade de mídia — Decidido em 2026-11-26:** afrouxar `@@unique([title, type])`. Livro: único por título + autor; filme e série: únicos por título + ano. Duplicado continua `409` com `code: DUPLICATE` (helper da sessão 2). Fica nesta sessão (a sessão 2 não cria migration).

**Premissas:** coluna `synopsis` já existe em `Media` e `LeisureActivity` (PRD README, G7); `Genre { name @unique, type, status }` em `schema.prisma:134-140`.

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | `Genre` sem controller; `genreId` obrigatório | `apps/backend/prisma/schema/schema.prisma:134`, `media/common/dto/CreateMediaDto.ts:21` |
| 2 | `findAll()` só ativos, sem paginação | `media/common/base-media.repository.ts`, `leisures/leisures.repository.ts:17-19` |
| 4 | Front atual e "Em breve" de criar mídia | `apps/web/src/pages/content/ContentListPage.tsx` |

**Incertezas:** Confiança: LOW sobre `name @unique` global em `Genre` (impede o mesmo nome em tipos diferentes, ex.: "Drama" para filme e série). Verificar e decidir se vira `@@unique([name, type])` (migration).

---

## FASE 3 — Arquitetura

- Rotas `/admin/*` separadas das públicas (preserva o app; guard ADMIN no controller).
- Paginação offset (`page`, `limit ≤ 100`) com `{ items, total, page, limit }`.
- Web: hook de listagem com estado na URL (`?status=&page=`), para voltar à mesma página após editar.

**Decisões do item 1 (2026-11-26)**
- `Genre.name @unique` global → `@@unique([name, type])` (o mesmo "Drama" para filme e série).
- `Media @@unique([title, type])` sai do banco: o autor do livro está em `BookDetail` (outra tabela), e índice único entre tabelas não existe no Postgres. A regra vai para o serviço (`assertUniqueMedia`): livro = título + autor; filme/série = título + ano (ano nulo conta como igual); comparação sem diferenciar maiúsculas, com espaços aparados, incluindo inativos. Concorrência simultânea fica fora (aceitável para o TCC, como em W04-7).
- Lazer mantém `@@unique([name])` no banco + `rethrowUnique`.
- Gênero inativado pode ser **reativado** (`PATCH /admin/genres/:id/reactivate`): sem isso, a unicidade por nome + tipo impediria recriar o mesmo gênero. Desvio pequeno e justificado em relação a W02-8.

**Contrato da API** (fonte para backend e web)

| Rota | Acesso | Corpo / query | Resposta |
|---|---|---|---|
| `GET /genres?type=` | público | `type` = `BOOK`/`MOVIE`/`SERIES` | `[{ id, name, type }]` só ativos, por nome |
| `GET /admin/genres?type=&status=` | ADMIN | `status` = `ACTIVE`/`INACTIVE` (ausente = todos) | `[{ id, name, type, status, activeItems }]` |
| `POST /genres` | ADMIN | `{ name (1–60), type }` | 201 `{ id, name, type, status }`; 409 `DUPLICATE` |
| `PATCH /genres/:id` | ADMIN | `{ name }` | 200 gênero; 404; 409 `DUPLICATE` |
| `DELETE /genres/:id` | ADMIN | — | 200 `{ message }` (inativa); 409 `GENRE_IN_USE` com N itens ativos |
| `PATCH /admin/genres/:id/reactivate` | ADMIN | — | 200 gênero |
| `GET /admin/{books,movies,series}` | ADMIN | `status, search, genreId, isFree=true/false, page=1, limit=20 (≤100)` | `{ items, total, page, limit }`, por `updatedAt` desc |
| `GET /admin/{books,movies,series}/:id` | ADMIN | — | item admin (inclui inativo); 404 |
| `PATCH /admin/{books,movies,series}/:id/reactivate` | ADMIN | — | item admin (idempotente) |
| `GET /admin/leisures` | ADMIN | `status, search, type, frequency, page, limit` | `{ items, total, page, limit }` |
| `GET /admin/leisures/:id`, `PATCH /admin/leisures/:id/reactivate` | ADMIN | — | item admin |

- **Item admin de mídia** = mesmos campos do `GET /books` (etc.) + `genreId`, `createdAt`, `updatedAt` (ISO). **Item admin de lazer** = campos do `GET /leisures` + `createdAt`, `updatedAt`.
- Escrita continua nas rotas atuais (`POST/PATCH/DELETE /books` etc.). `PATCH` passa a funcionar em item inativo. `synopsis` (≤ 2000, opcional) aceito em mídia e lazer.
- `genreId` precisa ser gênero **ativo do mesmo tipo** → senão 400 `INVALID_GENRE`.
- Duplicados → 409 `DUPLICATE`: "Já existe um livro com este título e autor." / "Já existe um filme com este título e ano." / "Já existe uma série com este título e ano." / "Já existe um gênero com este nome para este tipo." / lazer como hoje.
- Rotas públicas (`GET /books`, `/movies`, `/series`, `/leisures`, `/:id`) **sem mudança** de contrato.

---

## FASE 4 — Checklist de execução

1. [x] Ler repositórios e schema; decidir unicidade de `Genre`.
2. [x] Backend gêneros (+ migration se necessário) e unicidade de mídia por tipo (decisão 4: migration, seed, e2e de 409). → `✨ feat(media): add genres crud`, `🐛 fix(media): relax media title uniqueness` + e2e
3. [x] Backend listagem admin + reativar + `GET` de inativos. → `✨ feat(media): add admin listing and reactivate`, idem `leisures` + e2e
4. [x] Backend `synopsis` nos DTOs. → `✨ feat(media): accept synopsis`
5. [x] Web: gêneros. → `✨ feat(web): add genres management`
6. [x] Web: listas admin (filtros, paginação, status, reativar). → `✨ feat(web): use admin content listing`
7. [x] Web: criar mídia + sinopse. → `✨ feat(web): add media creation`
8. [x] Testes web + Postman + histórico. → `🧪 test(web): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [x] Perguntas bloqueadoras respondidas (2026-11-26)
- [x] Contrato público preservado (crit. 2)
- [x] Checklist ≤ 10 itens

**Gate = Livre** (2026-11-26)

---

## Stage de Execução — Entregáveis

Execução em 2026-11-26. Backend feito na sessão principal; web (itens 5–7) delegado a um subagente numa worktree contra o contrato acima e trazido por cherry-pick (histórico linear).

| # | Entregável | Caminho | Commit | Status |
|---|---|---|---|---|
| 1 | Contrato da API + decisões do item 1 | este plano (FASE 3) | `8481200` | ✅ |
| 2 | Lazer sem imagem não dá mais 500 (`image_path` padrão `''`) | `src/leisures/leisures.repository.ts` | `365b236` | ✅ (achado no e2e) |
| 3 | Unicidade: `Genre @@unique([name, type])`; `Media @@unique([title, type])` → `MediaRulesService` (livro título+autor, filme/série título+ano; gênero ativo do mesmo tipo → 400 `INVALID_GENRE`); migration `20261126000000_catalog_uniqueness`; edição vale para inativo | `prisma/`, `src/media/common/media-rules.service.ts`, serviços e repositórios de mídia | `f8bdd36` | ✅ |
| 4 | CRUD de gêneros + `/admin/genres` (com `activeItems`) + reativar | `src/media/genres/` | `657fc49` | ✅ |
| 5 | Listagem admin de mídia (filtros, paginação, inclui inativos), detalhe e reativar | `common/pagination/`, `src/media/admin/` | `89de4c5` | ✅ |
| 6 | Idem para lazer | `src/leisures/admin-leisures.controller.ts`, repo/serviço/mapper | `55d24c2` | ✅ |
| 7 | Título limitado a 150 (tamanho da coluna) | `CreateMediaDto.ts` | `c3431e5` | ✅ |
| 8 | `synopsis` aceito em mídia e lazer | DTOs e repositórios | `bff9ab7` | ✅ |
| 9 | e2e do catálogo (16 casos) + ajuste do `admin-content` | `test/admin-catalog.e2e-spec.ts` | `56d2067`, `b96db65` | ✅ |
| 10 | Nomes de gênero comparados sem caixa | `genres.service.ts` | `d7a5a5b` | ✅ (achado no smoke) |
| 11 | Postman: pastas "Gêneros" e "Painel: catálogo" + descrições de 409/400 | `apps/postman/…` | `196df64` | ✅ |
| 12 | Web: tela de gêneros | `pages/content/GenresPage.tsx` | `4b4f4c2` | ✅ |
| 13 | Web: listas `/admin/*` com filtros, paginação e estado na URL; reativar | `ContentListPage.tsx`, `features/content/listQuery.ts` | `b09513c` | ✅ |
| 14 | Web: criar mídia (gênero obrigatório; sem gênero → orienta criar) | `MediaEditPage.tsx`, `services/content.ts` | `d0fb8d1` | ✅ |
| 15 | Web: sinopse (`TextAreaField`) | `components/ui/TextAreaField.tsx`, formulários | `751204d` | ✅ |
| 16 | Web: testes de URL/paginação e schemas | `listQuery.test.ts`, `schemas.test.ts` | `b92ce0d` | ✅ |
| 17 | Web: busca limitada a 150 (evita 400) | `ContentListPage.tsx` | `6278e52` | ✅ |
| 18 | axe nas telas novas | `scripts/axe-audit.mjs` | `fb72495` | ✅ |
| 19 | Docs: README do web, pendências fechadas, este histórico | `apps/web/README.md`, `tasks/gerenciador-web.md` | (este commit) | ✅ |

**Desvios**
- Unicidade de mídia saiu do banco para o serviço (autor está em outra tabela); concorrência simultânea não coberta, como em W04-7.
- Reativar gênero (`PATCH /admin/genres/:id/reactivate`) não estava em W02-8; sem ele, a unicidade por nome impediria recriar um gênero inativado.
- O formulário de mídia deixou de checar duplicado só pelo título antes do envio (daria falso positivo com título+autor/ano); vale o 409 do servidor, mostrado no campo Título.
- Banco de dev: `migrate deploy` aplicou também `add_user_deletion_logs` e `drop_social_area`, que estavam pendentes; ambas são no-op lá (conferido: tabelas sociais não existiam, `user_deletion_logs` já existia).

## Stage de Execução — Validação

| # | Critério de aceite | Resultado | Observação |
|---|---|---|---|
| 1 | PRD 02 crit. 1–6 e PRD 03 crit. 1–4 | ✅ | 401/403 (e2e); criado aparece no app; inativo some do app e aparece com filtro "Inativo"; formulário bloqueia obrigatórios (FocusFirstError); sem gênero → orienta criar; 500 itens paginados; rótulos pt-BR |
| 2 | Rotas públicas mantêm o contrato | ✅ | e2e: `GET /series` só ativos, sem `genreId`/`updatedAt`; `GET /series/:id` inativo → 404; app sem diff |
| 3 | Criado aparece no app; reativado volta | ✅ | smoke: "[teste] Livro smoke" no `GET /books` após criar e após reativar |
| 4 | 500 itens paginados sem travar | ✅ | e2e: página 25 de 500 com 20 itens em < 1 s |
| 5 | e2e: gêneros, listagem com inativos, reativar, 401/403 | ✅ | suíte completa 8/8, **55/55** |

**Smoke no navegador (banco de dev)**

| Fluxo | Resultado |
|---|---|
| Criar gênero (tipo vem da aba), anúncio e foco de volta ao botão | ✅ |
| Gênero repetido com outra caixa | ❌ → corrigido em `d7a5a5b` (aceitava "[teste] gênero smoke") |
| Criar livro com gênero e sinopse | ✅ público com gênero e sinopse |
| Livro título+autor repetido (outra caixa) | ✅ 409 no campo Título, foco no campo, digitado mantido, anúncio |
| Inativar gênero com item ativo | ✅ "Este gênero tem 1 item ativo…" |
| Inativar livro → filtro Inativo → Reativar (modal) | ✅ some/volta no público; foco no `<main>` |
| Limpeza | livro e os 2 gêneros `[teste]` inativados |

**Ferramentas:** backend `tsc` ok, lint 0 erros (9 warnings anteriores), unit 50/50, e2e 55/55; web `tsc -b`, lint, Vitest 55/55, build ok (aviso de chunk 502 kB); axe **0 violações em 23 telas/estados** (5 novas: livro novo, livro novo com erros, filmes inativos, gêneros, modal de gênero).
