# Contas no painel: suspender, reativar, status e motivo

- Branch sugerida: `feat/AdminContas` (de `main`, depois de `fix/AdminBackendFixes`)
- PRD: `docs/prd-web-admin/04-usuarios.md` (W04-1, W04-4, W04-5, W04-6, crit. 3, 5, 6)
- Lacunas: P8 (status no DTO), P11 (motivo da exclusão), auditoria de ações do admin
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 4)

---

## FASE 1 — Escopo

**Objetivo:** o admin suspende e reativa contas com motivo, vê o status na lista e no detalhe, e toda suspensão/exclusão fica registrada (quem, quando, motivo), sem dados de saúde.

**Escopo — backend**
- DTO administrativo de usuário: `id, name, email, role, pronoun, status, suspendedAt, createdAt` (sem telefone, nascimento, foto).
- `GET /users` com `status`, `role`, `search` (nome contém / e-mail exato), `page`, `limit`.
- `POST /admin/users/:id/suspend { reason }` e `POST /admin/users/:id/reactivate` (ADMIN); bloqueia self e última conta ADMIN (reusa a regra da sessão 2).
- `DELETE /users/:id` aceita `reason` obrigatório (W04-6).
- Registro das ações do admin (suspender, reativar, excluir): autor, alvo pseudonimizado, motivo, data.

**Escopo — web**
- Coluna e filtro de status na lista; status e data de suspensão no detalhe.
- "Suspender conta" (motivo obrigatório + confirmação) e "Reativar" substituem o "Em breve".
- Modal de exclusão ganha o campo motivo (etapa 1).

**Não-escopo:** editar dados de terceiros, alterar role, criar contas, exportar base.

**Critérios de aceite**
1. PRD 04 crit. 1–6 atendidos.
2. Conta suspensa pelo admin não entra no app (`403 ACCOUNT_SUSPENDED`), perde as sessões e, reativada, mantém diário e tratamentos.
3. Suspender/excluir a si mesmo ou a última conta ADMIN é recusado com explicação (front e back).
4. Registro de ações sem e-mail/nome do alvo em claro.
5. Reativação pelo próprio titular no login (`reactivate: true`) continua funcionando como hoje.

**Perguntas bloqueadoras**
1. Hoje a conta suspensa pelo **titular** (`POST /users/me/suspend`) pode se reativar no login com `reactivate: true`. Conta suspensa pelo **admin** deve poder se reativar sozinha? Proposta: **não** → precisa distinguir a origem (`suspendedBy`/`suspensionReason`, migration).
2. O registro de ações do admin reusa `UserDeletionLog`/auditoria existente ou ganha tabela própria (`AdminActionLog`)?

**Premissas:** `User.status` e `suspendedAt` já existem (`schema.prisma:56-57`); `UsersService.suspend` existe para o titular (`user.service.ts:46-50`); `remove(id, reason?)` já aceita motivo (`user.service.ts:73`).

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Suspensão pelo titular e `remove` com motivo opcional | `apps/backend/src/user/user.service.ts:46-90`, `user.controller.ts:41-86` |
| 2 | Mapper sem status | `apps/backend/src/user/user.mapper.ts:4-16` |
| 3 | Reativação no login | `apps/backend/src/auth/auth.service.ts` (`login`, `reactivate`) |
| 4 | Front: "Em breve" e lista sem status | `apps/web/src/pages/users/*` |

**Incertezas:** Confiança: LOW sobre a estrutura atual da auditoria pseudonimizada (`PSEUDONYM_KEY`); ler antes de decidir a pergunta 2.

---

## FASE 3 — Arquitetura

- Rotas de ação em `/admin/users/:id/*` (separa ação administrativa da conta própria).
- Migration aditiva (`suspendedBy`, `suspensionReason`), sem remover colunas.
- Front: o detalhe vira a "tela de ações"; lista só lê.

---

## FASE 4 — Checklist de execução

1. [ ] Responder bloqueadoras; ler auditoria existente.
2. [ ] Migration + DTO admin + filtros do `GET /users`. → `✨ feat(user): add admin user listing` + e2e
3. [ ] Suspender/reativar pelo admin (+ bloqueio no login conforme pergunta 1). → `✨ feat(user): add admin suspend and reactivate` + e2e
4. [ ] Motivo obrigatório na exclusão + registro de ações. → `✨ feat(user): require reason on admin removal` + e2e
5. [ ] Web: status, filtros e paginação no servidor. → `✨ feat(web): show account status`
6. [ ] Web: suspender/reativar e motivo na exclusão. → `✨ feat(web): add account suspension`
7. [ ] Testes web + Postman + histórico. → `🧪 test(web): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [ ] Perguntas bloqueadoras respondidas
- [x] Fluxo do titular preservado (crit. 5)
- [x] Checklist ≤ 10 itens

**Gate = Rascunho**
