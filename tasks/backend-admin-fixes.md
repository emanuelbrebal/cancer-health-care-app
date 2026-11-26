# Correções de backend achadas no painel web

- Branch sugerida: `fix/AdminBackendFixes` (de `main`)
- Origem: pendências P5, P6, P7, P9, P10 de `tasks/gerenciador-web.md`
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 2)

---

## FASE 1 — Escopo

**Objetivo:** corrigir no backend as falhas de regra e de contrato que o painel hoje só contorna no front, sem mudar o comportamento do app móvel.

**Escopo**
- **P6 / W04-7:** `DELETE /users/:id` recusa excluir a própria conta e a última conta `ADMIN` ativa, com `403`/`409` e mensagem clara.
- **P7 / W02-7 / W03-4:** nome/título duplicado em lazer e mídia (`P2002`) vira `409 Conflict` com "Já existe uma atividade com este nome" / "Já existe um item com este título".
- **P5:** mensagem do `POST /movies` ("Livro criado…" → "Filme criado…"); conferir séries.
- **P9:** padronizar o PATCH de séries para devolver o item mapeado (como livros/filmes), **sem** mudar os campos que o app lê.
- Web: remover os contornos que ficarem redundantes (validação de duplicado só antes do envio vira complemento; esconder "Excluir" de ADMIN continua, agora com respaldo do servidor).

**Não-escopo:** gêneros, inativos, reativar, synopsis (sessão 3); status/suspensão/motivo (sessão 4); renomear `imagePath`/`pageCount` nas respostas (quebra o app).

**Critérios de aceite**
1. e2e: ADMIN excluindo a si mesmo → recusado; excluindo a última conta ADMIN ativa → recusado; excluindo PATIENT → 200 (como hoje).
2. e2e: criar lazer/livro com nome/título existente → `409` com a mensagem do PRD; nenhum 500 nos logs.
3. `POST /movies` responde com mensagem de filme.
4. PATCH de séries devolve o mesmo formato de livros/filmes; o painel (`services/content.ts`) continua funcionando e o app não lê esse retorno (confirmar com grep no mobile).
5. Suíte e2e e unitária completas passam; mobile sem diff.

**Perguntas bloqueadoras**
1. Autoexclusão do ADMIN pelo painel: recusar sempre, ou permitir quando houver outro ADMIN ativo? (PRD 04 W04-7 diz "não pode excluir a própria conta" → proposta: recusar sempre.)
2. Código para duplicado: `409` (proposta) ou `400`?

**Respostas (usuário, 2026-11-26)**
1. Recusar sempre: `403` com `code: SELF_DELETE_FORBIDDEN` para a própria conta (é proibição de regra, não conflito de estado). Recusar também a última conta `ADMIN` ativa: `409` com `code: LAST_ADMIN` (depende do estado atual do banco). Mesmo estilo do `ADMIN_ONLY` em `auth.service.ts`.
2. `409 Conflict` com a mensagem do PRD, especializada por tipo ("Já existe uma atividade com este nome." / "Já existe um livro/filme com este título." / "Já existe uma série com este título."), `code: DUPLICATE`. Abordagem C, em criar e editar.
3. Unicidade de mídia será afrouxada (livro: título + autor; filme/série: título + ano) na **sessão 3** (`tasks/admin-catalogo.md`, decisão 4). Aqui não há migration; o helper não depende das colunas da constraint.

**Premissas:** a tabela de duplicidade é `title + type` em mídia e `name` único em lazer (PRD 02/03); confirmar no schema.

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | `remove()` sem checagem de self/último ADMIN | `apps/backend/src/user/user.service.ts:73-90`, `user.controller.ts:80-86` |
| 2 | Só `auth` e `user` tratam conflito; mídia/lazer não capturam `P2002` | `grep ConflictException src` (só `auth.service.ts:33`, `user.service.ts:39`) |
| 3 | Mensagem errada do POST de filmes | `apps/backend/src/media/movies/movies.controller.ts:37` |
| 4 | PATCH de séries devolve `{ message, data }` cru | relatório do item 7 em `tasks/gerenciador-web.md` |
| 5 | Contornos no front | `apps/web/src/pages/content/*`, `apps/web/src/pages/users/UserDetailPage.tsx` |

**Incertezas:** Confiança: LOW sobre onde tratar `P2002`: filtro global (`AllExceptionsFilter`) ou por repositório. Decidir na Fase 3 após ler os repositórios.

---

## FASE 3 — Arquitetura

**Decisão — onde mapear `P2002`**

| Abordagem | Prós | Contras |
|---|---|---|
| A. No repositório/serviço de cada módulo (mensagem específica) | mensagem do PRD por recurso | repetição em 4 módulos |
| B. No filtro global (`P2002` → 409 genérico) | um lugar só | mensagem genérica; mistura Prisma no filtro HTTP |
| C. Helper `rethrowUnique(e, message)` usado pelos serviços | mensagem específica, sem repetição | um helper novo em `common/` |

Proposta: **C**.

---

## FASE 4 — Checklist de execução

1. [x] Ler repositórios de mídia/lazer e o schema (unicidade); confirmar premissas.
2. [x] Regra W04-7 no `UsersService.remove` (self + último ADMIN). → `🐛 fix(user): block self and last admin removal` + e2e `🧪 test(user): …`
3. [x] Helper de unicidade + 409 em lazer e mídia. → `🐛 fix(leisures): return 409 on duplicate name`, `🐛 fix(media): return 409 on duplicate title` + e2e
4. [x] P5 mensagem de filmes. → `🐛 fix(media): fix movie created message`
5. [x] P9 PATCH de séries (checar mobile com grep antes). → `🐛 fix(media): return mapped series on update`
6. [x] Web: tratar `409` como duplicado; simplificar contornos. → `♻️ refactor(web): rely on api duplicate errors`
7. [x] Postman + histórico neste plano + pendências fechadas em `gerenciador-web.md`. → `📚 docs(tasks): log admin backend fixes`

---

## FASE 5 — Verificação

- [x] Perguntas bloqueadoras respondidas
- [x] Backend e web em commits separados
- [x] Contrato do mobile preservado (crit. 4–5)

**Gate = Livre**

---

## Histórico de execução

### 2026-11-26 — `/exec` (persona: dev backend sênior NestJS + Prisma)

- Premissas confirmadas no schema: `Media @@unique([title, type])` e `LeisureActivity @@unique([name])`. A unicidade vale também para itens inativados (soft delete), por isso o 409 aparece ao repetir o nome de um item inativo.
- Helper em `apps/backend/common/prisma/rethrow-unique.ts` (pasta `common/` já existente, mesma do `AllExceptionsFilter`, alias `common/*`); não há `src/common/`. Ele só olha o código `P2002`, não as colunas, então serve para a regra afrouxada da sessão 3.
- `removeByAdmin` novo no `UsersService`; `remove` e `removeOwn` (`DELETE /users/me`, app) não mudaram.
- P9: grep em `apps/mobile/src` — o app só faz `GET` de séries (`leisureService.getSeries`); nenhum `PATCH` de mídia. O `unwrap` do painel aceita os dois formatos.

### Stage de Execução — Entregáveis

| # | Descrição | Caminho | Commit | Status |
|---|---|---|---|---|
| 0 | Respostas às bloqueadoras, Gate Livre; decisão de unicidade na sessão 3 | `tasks/backend-admin-fixes.md`, `tasks/admin-catalogo.md` | `8e23320` | ✅ |
| 1 | Leitura de repositórios e schema | — | — | ✅ |
| 2 | W04-7: self → 403 `SELF_DELETE_FORBIDDEN`; última ADMIN ativa → 409 `LAST_ADMIN` | `apps/backend/src/user/user.{service,controller}.ts` | `355a228` | ✅ |
| 2 | e2e exclusão pelo admin (4 casos) | `apps/backend/test/admin-user-removal.e2e-spec.ts` | `a571f1b` | ✅ |
| 3 | Helper `rethrowUnique` + 409 em lazer | `apps/backend/common/prisma/rethrow-unique.ts`, `src/leisures/leisures.service.ts` | `cb279a9` | ✅ |
| 3 | 409 em livros, filmes, séries (criar e editar) | `apps/backend/src/media/{books,movies,series}/*.service.ts` | `66c9722` | ✅ |
| 4 | P5: "Filme criado com sucesso!" (séries já estava certo) | `apps/backend/src/media/movies/movies.controller.ts` | `4c0af6d` | ✅ |
| 5 | P9: PATCH de séries devolve o item mapeado | `apps/backend/src/media/series/series.controller.ts` | `6406959` | ✅ |
| 3–5 | e2e conteúdo (9 casos: 409 criar/editar, mesmo título em outro tipo, mensagem de filme, formato do PATCH de séries) | `apps/backend/test/admin-content.e2e-spec.ts` | `24c6ce0` | ✅ |
| 6 | Web: 409 mostra a mensagem do servidor; 500 deixa de ser tratado como duplicado; checagem local mantida | `apps/web/src/pages/content/{LeisureFormPage,MediaEditPage}.tsx`, `pages/users/UserDetailPage.tsx`, `services/content.ts` (comentários) | `63bea1e` | ✅ |
| 7 | Postman (403/409 e formatos), P5/P6/P7/P9 fechadas, este histórico | `apps/postman/OncoMente.postman_collection.json`, `tasks/gerenciador-web.md`, este arquivo | (docs) | ✅ |

### Stage de Execução — Validação

| Critério | Resultado | Observação |
|---|---|---|
| 1. Self / última ADMIN / PATIENT | ✅ | e2e: 403 `SELF_DELETE_FORBIDDEN`, 409 `LAST_ADMIN` (quem chama suspenso com token válido), PATIENT 200, outro ADMIN com ADMIN restante 200 |
| 2. Duplicado → 409 com mensagem do PRD | ✅ | e2e: lazer e livro (criar e editar), filme (criar), série (editar); nenhum 500 |
| 3. `POST /movies` com mensagem de filme | ✅ | e2e |
| 4. PATCH de séries no formato de livros/filmes | ✅ | e2e sem `message`/`data`/`image_path`; grep no mobile sem leitura desse retorno; Vitest do painel 30/30 |
| 5. Suítes completas; mobile sem diff | ✅ | backend lint 0 erros (9 warnings já existentes), unit 7 suítes/50 testes, e2e 7 suítes/39 testes; web lint limpo, `tsc -b` ok, Vitest 4 arquivos/30 testes; `git diff main --stat -- apps/mobile packages/shared` vazio |

**Pendências**
- Corrida entre dois ADMIN excluindo um ao outro ao mesmo tempo não é serializada (checagem por `count` fora de transação); aceitável no volume do TCC.
- `DELETE /users/me` (exclusão pelo titular) não checa "última ADMIN": fora do escopo (rota do app).
- Sessão 3: ao afrouxar a unicidade, ajustar a mensagem de livros para "título e autor".

