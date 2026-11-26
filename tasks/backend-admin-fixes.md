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

1. [ ] Ler repositórios de mídia/lazer e o schema (unicidade); confirmar premissas.
2. [ ] Regra W04-7 no `UsersService.remove` (self + último ADMIN). → `🐛 fix(user): block self and last admin removal` + e2e `🧪 test(user): …`
3. [ ] Helper de unicidade + 409 em lazer e mídia. → `🐛 fix(leisures): return 409 on duplicate name`, `🐛 fix(media): return 409 on duplicate title` + e2e
4. [ ] P5 mensagem de filmes. → `🐛 fix(media): fix movie created message`
5. [ ] P9 PATCH de séries (checar mobile com grep antes). → `🐛 fix(media): return mapped series on update`
6. [ ] Web: tratar `409` como duplicado; simplificar contornos. → `♻️ refactor(web): rely on api duplicate errors`
7. [ ] Postman + histórico neste plano + pendências fechadas em `gerenciador-web.md`. → `📚 docs(tasks): log admin backend fixes`

---

## FASE 5 — Verificação

- [ ] Perguntas bloqueadoras respondidas
- [x] Backend e web em commits separados
- [x] Contrato do mobile preservado (crit. 4–5)

**Gate = Rascunho**
