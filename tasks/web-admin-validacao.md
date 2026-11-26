# Validação do painel web entregue (pós PR #55)

- Branch sugerida: `fix/WebAdminValidacao` (de `main`)
- Origem: critérios 5 e 9 parciais e D13 em `tasks/gerenciador-web.md` → "Histórico de execução"
- Roadmap: `tasks/roadmap-gerenciador-web.md` (sessão 1)

---

## FASE 1 — Escopo

**Objetivo:** fechar a validação do painel que já está na `main`: exercitar as gravações reais (lazer e mídia) refletindo no app e auditar acessibilidade (WCAG 2.2 AA), corrigindo o que aparecer.

**Escopo**
- Smoke de gravação: criar, editar e inativar atividade de lazer; editar livro/filme/série; conferir no app (Expo Web ou dispositivo) que o item aparece/muda/some.
- Auditoria axe (Playwright + `@axe-core/playwright`, já usado na UX AV3) em: login, esqueci senha, início, conteúdo (lista + formulários), usuários (lista + detalhe + modal), minha conta.
- Teste manual por teclado e com leitor de tela (NVDA) nos fluxos de login, formulário de lazer e exclusão de conta.
- Corrigir violações e falhas encontradas, uma por commit.
- D13: substituir o ícone do login pela ilustração do Figma (`1:2`) **se** houver cota no MCP; senão, registrar e seguir.

**Não-escopo:** funcionalidades novas, backend, mudança de layout além da correção de violações.

**Critérios de aceite**
1. Lazer criado no painel aparece no app; editado mostra o novo valor; inativado some (PRD 03 crit. 2).
2. Edição de mídia reflete no app; o PATCH carrega só os campos alterados (conferido na aba Network).
3. axe: 0 violações `serious`/`critical` nas telas listadas; as `moderate` restantes justificadas no plano.
4. Todos os fluxos acima concluídos só por teclado, com foco visível e ordem lógica; erros anunciados pelo NVDA.
5. Massa de teste: itens criados nesta sessão ficam inativados ao final (ou o banco de teste é descartável).
6. Build, lint, `npm run test -w web` e e2e do backend passam.

**Perguntas bloqueadoras**
1. O smoke de gravação pode usar o **banco de dev** (deixando itens inativados de teste) ou devemos subir um banco descartável com seed (`docker-compose.test.yml` + `prisma db seed` apontando para ele)?
2. Leitor de tela: NVDA está instalado? Se não, o critério 4 fica só com teclado + árvore de acessibilidade.

**Premissas:** script de axe da UX AV3 reaproveitável (`docs/` ou `apps/mobile/scripts`; confirmar caminho no item 1).

---

## FASE 2 — Evidências

| # | Evidência | Âncora |
|---|---|---|
| 1 | Critérios parciais e motivos | `tasks/gerenciador-web.md` → Stage de Execução — Validação |
| 2 | Telas e rotas | `apps/web/src/routes/router.tsx` |
| 3 | axe já usado no projeto | `package-lock.json` (`@axe-core/playwright`), memória UX AV3 |

**Incertezas:** Confiança: LOW sobre o caminho do script de captura/axe da UX AV3; localizar no item 1.

---

## FASE 3 — Arquitetura

Sem decisão arquitetural. Testes de acessibilidade como script de verificação (não entram no CI nesta sessão).

---

## FASE 4 — Checklist de execução

1. [ ] Localizar o script axe/Playwright existente e decidir: reaproveitar ou criar `apps/web/scripts/axe-audit.mjs`. Subir backend + web.
2. [ ] Smoke de gravação (crit. 1, 2) com registro de evidências (prints/Network) no plano.
3. [ ] Rodar axe nas telas; registrar violações numa tabela (tela, regra, severidade, alvo).
4. [ ] Corrigir violações `serious`/`critical`. → `🐛 fix(web): …` (1 por regra)
5. [ ] Teclado + NVDA nos 3 fluxos; corrigir o que falhar. → `🐛 fix(web): …`
6. [ ] D13 se houver cota no MCP. → `👌 style(web): use figma login illustration`
7. [ ] Inativar massa de teste; atualizar este plano e `gerenciador-web.md` (critérios 5 e 9 → ✅). → `📚 docs(tasks): log web admin validation`

---

## FASE 5 — Verificação

- [ ] Perguntas bloqueadoras respondidas
- [x] Checklist ≤ 10 itens
- [x] Critérios objetivos

**Gate = Rascunho** (confirmar as perguntas no início da sessão)
