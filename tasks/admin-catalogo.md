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

1. [ ] Ler repositórios e schema; decidir unicidade de `Genre`.
2. [ ] Backend gêneros (+ migration se necessário) e unicidade de mídia por tipo (decisão 4: migration, seed, e2e de 409). → `✨ feat(media): add genres crud`, `🐛 fix(media): relax media title uniqueness` + e2e
3. [ ] Backend listagem admin + reativar + `GET` de inativos. → `✨ feat(media): add admin listing and reactivate`, idem `leisures` + e2e
4. [ ] Backend `synopsis` nos DTOs. → `✨ feat(media): accept synopsis`
5. [ ] Web: gêneros. → `✨ feat(web): add genres management`
6. [ ] Web: listas admin (filtros, paginação, status, reativar). → `✨ feat(web): use admin content listing`
7. [ ] Web: criar mídia + sinopse. → `✨ feat(web): add media creation`
8. [ ] Testes web + Postman + histórico. → `🧪 test(web): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [x] Perguntas bloqueadoras respondidas (2026-11-26)
- [x] Contrato público preservado (crit. 2)
- [x] Checklist ≤ 10 itens

**Gate = Livre** (2026-11-26)
