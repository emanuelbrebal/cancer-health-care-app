# Roadmap — Gerenciador web (pós PR #55)

> Criado em 2026-11-25, depois do merge de `feat/GerenciadorWeb` (PR #55, `0e207ce`).
> Cada sessão abaixo tem um plano próprio em `tasks/`. Rode `/exec tasks/<plano>.md` **depois** de
> confirmar as perguntas bloqueadoras do plano. Status em 2026-11-26: 1 e 2 entregues (PRs #57, #58); 3 e 3b com Gate = Livre.

## Ordem das sessões

| # | Sessão | Plano | Branch sugerida | Depende de | Tamanho |
|---|---|---|---|---|---|
| 1 | Validação do painel entregue | `web-admin-validacao.md` | `fix/WebAdminValidacao` | — | P |
| 2 | Correções de backend achadas no painel | `backend-admin-fixes.md` | `fix/AdminBackendFixes` | — (pode correr junto com 1) | P |
| 3 | Catálogo completo: gêneros, inativos, reativar, sinopse | `admin-catalogo.md` | `feat/AdminCatalogo` | 2 | G |
| 3b | Capas por upload: padronização, compressão, app híbrido | `admin-capas.md` | `feat/AdminCapas` | 3 | M |
| 4 | Contas: suspender/reativar pelo admin, status, motivo | `admin-contas.md` | `feat/AdminContas` | 2 | M |
| 5 | Privacidade e consentimentos (PRD 05) | `admin-privacidade.md` | `feat/AdminPrivacidade` | 4 | M |
| 6 | Manual de uso (mobile + web) | `manual-de-uso.md` | `docs/ManualDeUso` | 1; idealmente 3–5 | M |

**Por que essa ordem**
- 1 e 2 fecham pendências do que já está na `main` (critérios 5 e 9 parciais, riscos P6/P7 no backend).
- 3 e 4 tiram os "Em breve" do painel; 3 é a maior (backend + web + impacto no app).
- 5 depende do status de conta (4) para a tela de detalhe.
- 6 pode rodar a qualquer momento depois de 1, mas cada entrega de 3–5 muda telas e prints. Se o TCC
  precisar do manual antes, rode o 6 logo após o 1 e reabra só as seções afetadas depois.

## Regras que valem para todas

- PRD manda no comportamento, Figma no visual (cópia `VMXbv1C2tgGO6TtCAaIxny`; tokens em
  `tasks/gerenciador-web.md` → "Tokens do Figma"). O MCP do Figma é plano Starter: poucas chamadas por sessão.
- Backend e web em commits separados; mobile só muda quando o plano disser.
- e2e do backend precisam do Docker: `docker compose -f docker-compose.test.yml up -d --wait`.
- Seed **apaga o banco**: não rodar no banco de dev sem pedir. Admin do seed: `admin@oncomente.com`.
- `stash@{0}` pertence à `feat/HeuristicasNielsen`.

## Origem das pendências

| Pendência (plano `gerenciador-web.md`) | Vai para |
|---|---|
| Smoke de gravação (critério 5), auditoria WCAG (critério 9), ilustração do login (D13) | 1 |
| P5, P6, P7, P9, P10 (parcial) | 2 |
| G4 gêneros, G5 inativos/paginação, G6 reativar, G7 synopsis, P8 `updatedAt`/`genreId`, P10 | 3 |
| W04-4/5 suspender/reativar, P8 status, P11 motivo, auditoria W04 crit. 6 | 4 |
| PRD 05 inteiro (G10) | 5 |
| G8 imagem de capa (decidido 2026-11-26: upload) | 3b |
