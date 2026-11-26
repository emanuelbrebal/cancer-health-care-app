# Privacidade e consentimentos no painel (PRD 05)

- Branch sugerida: `feat/AdminPrivacidade` (de `main`, depois de `feat/AdminContas`)
- PRD: `docs/prd-web-admin/05-privacidade-e-consentimentos.md`
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 5)

---

## FASE 1 — Escopo

**Objetivo:** dar ao responsável uma visão de conformidade (agregados de consentimento e registro de exclusões) sem identificar pessoas nem expor dados de saúde.

**Escopo — backend**
- `GET /admin/consents/summary`: por finalidade (`HEALTH_DATA`, `AI_MASCOT`, `NOTIFICATIONS`) total, concedido, negado/nunca respondido, %; por versão do termo; versão vigente e data (W05-1, W05-2, W05-6).
- `GET /admin/users/:id/consents`: estado atual + histórico da conta (W05-3), somente leitura.
- `GET /admin/deletions?page=&limit=`: data, perfil, motivo, id pseudonimizado (W05-5).
- Supressão de grupos pequenos: contagens < 5 viram "< 5".

**Escopo — web**
- Página "Privacidade" no menu: cards de agregados por finalidade e por versão (cards do Dashboard `1:7207` do Figma).
- Seção "Consentimentos" no detalhe da conta (abaixo do card escuro).
- Lista de exclusões paginada.

**Não-escopo:** editar termos, fila de solicitações do titular, RIPD, exportação.

**Critérios de aceite**
1. PRD 05 crit. 1–5.
2. Nenhuma ação no painel altera consentimento de terceiro (W05-4); não existe rota admin de escrita.
3. Nenhuma resposta `/admin/*` desta área traz e-mail, nome, telefone ou `userId` em claro nas exclusões.
4. e2e com contagens conhecidas batendo com o banco, incluindo o caso "< 5".

**Perguntas bloqueadoras**
1. A supressão "< 5" vale também na tela de uma conta específica (histórico individual)? Proposta: não (já é uma conta identificada pelo admin); só nos agregados.
2. A data de vigência do termo vem de onde? Hoje há `CONSENT_TERM_VERSION` no `.env`; precisa de uma data configurável também?

**Premissas:** módulo `consent/` com histórico por finalidade e versão já existe (CLAUDE.md, `ConsentGuard`); `UserDeletionLog` guarda o registro pseudonimizado (`schema.prisma:107`).

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Módulo de consentimento | `apps/backend/src/consent/` |
| 2 | Registro de exclusões | `apps/backend/prisma/schema/schema.prisma:107` (`UserDeletionLog`) |
| 3 | Versão do termo | `CONSENT_TERM_VERSION` (`apps/backend/test/e2e.env`, checklist de deploy) |

**Incertezas:** Confiança: LOW sobre os campos de `UserDeletionLog` (perfil e motivo presentes?); ler no item 1.

---

## FASE 3 — Arquitetura

- Agregação no banco (`groupBy` sobre o registro mais recente por usuário e finalidade), não em memória.
- Controller `admin-consents` separado do `consent` do titular (sem reaproveitar `PUT /consents/:purpose`).

---

## FASE 4 — Checklist de execução

1. [ ] Responder bloqueadoras; ler `consent/` e `UserDeletionLog`.
2. [ ] Backend summary + supressão < 5. → `✨ feat(consent): add admin consent summary` + e2e
3. [ ] Backend histórico por conta + exclusões. → `✨ feat(consent): add admin consent history` + e2e
4. [ ] Web: página Privacidade. → `✨ feat(web): add privacy overview`
5. [ ] Web: consentimentos no detalhe da conta + lista de exclusões. → `✨ feat(web): show account consents`
6. [ ] Testes + Postman + histórico. → `🧪 test(web): …`, `📚 docs(tasks): …`

---

## FASE 5 — Verificação

- [ ] Perguntas bloqueadoras respondidas
- [x] Sem escrita de consentimento de terceiro
- [x] Checklist ≤ 10 itens

**Gate = Rascunho**
