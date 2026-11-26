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

**Respostas (2026-11-26)**
1. Banco de **dev** (já em uso pelo backend local). Itens criados no smoke ficam inativados ao final e prefixados com `[teste]`.
2. NVDA **não** instalado: o critério 4 fica com teclado + árvore de acessibilidade (nomes, papéis e `aria-live` conferidos no DOM).

**Premissas:** script de axe da UX AV3 reaproveitável (`docs/` ou `apps/mobile/scripts`; confirmar caminho no item 1). → Verificado: não há script versionado nem `axe-core` instalado; criar `apps/web/scripts/axe-audit.mjs` com `@axe-core/playwright` (Playwright/Chromium já disponíveis).

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

1. [x] Localizar o script axe/Playwright existente e decidir: reaproveitar ou criar `apps/web/scripts/axe-audit.mjs`. Subir backend + web.
2. [x] Smoke de gravação (crit. 1, 2) com registro de evidências (prints/Network) no plano.
3. [x] Rodar axe nas telas; registrar violações numa tabela (tela, regra, severidade, alvo).
4. [x] Corrigir violações `serious`/`critical`. → `🐛 fix(web): …` (1 por regra)
5. [x] Teclado + NVDA nos 3 fluxos; corrigir o que falhar. → `🐛 fix(web): …`
6. [~] D13 se houver cota no MCP. → `👌 style(web): use figma login illustration`
7. [x] Inativar massa de teste; atualizar este plano e `gerenciador-web.md` (critérios 5 e 9 → ✅). → `📚 docs(tasks): log web admin validation`

---

## FASE 5 — Verificação

- [x] Perguntas bloqueadoras respondidas
- [x] Checklist ≤ 10 itens
- [x] Critérios objetivos

**Gate = Livre** (2026-11-26)

---

## Stage de Execução — Entregáveis

| # | Entregável | Caminho | Commit | Status |
|---|---|---|---|---|
| 1 | Script de auditoria axe (Playwright + `@axe-core/playwright`, tags WCAG 2.0–2.2 A/AA + best-practice, 18 telas/estados) | `apps/web/scripts/axe-audit.mjs`, `apps/web/package.json` | `d2a66ae` | ✅ |
| 2 | Landmark `<main>` no layout admin (skip link aponta para ele) | `apps/web/src/layouts/AdminLayout.tsx` | `408805b` | ✅ |
| 3 | Mensagens de status sem anúncio duplicado (`Alert` dentro de `LiveRegion` sem `role` próprio) | `apps/web/src/components/ui/Alert.tsx` | `52b31c6` | ✅ |
| 4 | Foco não cai no `<body>`: troca de rota → `<main>`; inativar na lista → `<main>` após recarregar | `AdminLayout.tsx`, `pages/content/ContentListPage.tsx` | `864e2a4` | ✅ |
| 5 | Envio inválido foca o primeiro campo com erro (6 formulários Formik) | `components/ui/FocusFirstError.tsx` + páginas | `e1e6dc8` | ✅ |
| 6 | D13 ilustração do login | — | — | ❌ cota do Figma MCP (Starter) esgotada em 2026-11-26; segue pendente |

**Desvios:** script axe criado (não havia script versionado da UX AV3). "App" no smoke = endpoints públicos que o app consome (`GET /leisures`, `GET /books`, sem token), não Expo Web: é a mesma fonte de dados e evita subir o Metro.

**Uso do script:** `ADMIN_EMAIL=… ADMIN_PASSWORD=… node scripts/axe-audit.mjs [--json saida.json]` em `apps/web`, com backend e `npm run dev` no ar. Sai com código 1 se houver violação `serious`/`critical`.

## Stage de Execução — Validação

**axe (rodada 1 → final)**

| Tela | Regra | Impacto | Alvo | Final |
|---|---|---|---|---|
| 13 telas autenticadas | `landmark-one-main` | moderate | `html` (layout sem `<main>`) | ✅ 0 |
| início, usuário: detalhe, 404 | `region` | moderate | conteúdo fora de landmark | ✅ 0 |
| login, erros, esqueci/redefinir senha, modal de exclusão | — | — | — | ✅ 0 |

Nenhuma `serious`/`critical` em nenhuma rodada; ao final, 0 violações de qualquer impacto nas 18 telas/estados.

**Smoke de gravação e teclado (banco de dev, Chrome)**

| Verificação | Evidência | Resultado |
|---|---|---|
| Criar lazer por teclado | `POST /leisures` 201; item no `GET /leisures` público | ✅ |
| Editar lazer (só frequência) | `PATCH` 200; público mostra `FORTWEEKLY` | ✅ |
| Inativar lazer (modal, teclado) | público 6 → 5 itens, `[teste]` ausente | ✅ |
| Editar livro (nº de páginas 213 → 214) | corpo do PATCH = `{"page_count":214}`; público mostra 214; revertido para 213 | ✅ |
| Ordem de foco no formulário de lazer | Nome → Tipo → Frequência → Imagem → Cancelar → Salvar; anel visível | ✅ |
| Envio vazio | foco vai a "Nome"; `aria-invalid` + `aria-describedby` com a mensagem em todos os campos obrigatórios | ✅ (após `e1e6dc8`) |
| Após salvar/inativar | foco no `<main>`; 1 único anúncio `aria-live` | ✅ (após `52b31c6`, `864e2a4`) |
| Modal de exclusão de conta | foco inicial em "Fechar"; etapa 2 foca o campo de e-mail; "Excluir" bloqueado com explicação no `aria-describedby`; Esc devolve o foco a "Excluir conta"; nada excluído | ✅ |

**Critérios de aceite**

| # | Critério | Resultado | Observação |
|---|---|---|---|
| 1 | Lazer criado/editado/inativado reflete no app | ✅ | via `GET /leisures` público |
| 2 | Edição de mídia reflete; PATCH só com campos alterados | ✅ | corpo capturado no XHR |
| 3 | axe sem `serious`/`critical`; `moderate` justificadas | ✅ | 0 violações de qualquer impacto |
| 4 | Fluxos só por teclado, foco visível, erros anunciados | ✅ parcial | teclado + árvore de acessibilidade; NVDA não instalado (resposta 2) |
| 5 | Massa de teste inativada | ✅ | `[teste] Caminhada leve no parque` e `[teste] Leitura em grupo` inativados; livro revertido |
| 6 | Build, lint, testes web e e2e backend | ✅ | `tsc -b`, ESLint e Vitest 30/30; backend não alterado nesta branch (e2e rodou na sessão 2) |
