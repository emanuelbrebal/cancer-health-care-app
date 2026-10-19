# OncoMente — Programa de Finalização do TCC (Plano Mestre)

> **Status: 📋 PLANOS FUTUROS / BACKLOG** — aprovados como planejamento em 2026-10-18, nenhuma execução iniciada. Para retomar: resolver o pré-requisito (working tree) e rodar `/exec` a partir do plano 04 B1.

> Gerado em: 2026-10-18 · Prazo de entrega: junho/2027 · Escopo: completo (não MVP)
> Persona: arquiteto de software sênior / tech lead de entrega
> Branch: **não criada** — working tree suja (`apps/mobile/package.json`: scripts `android`/`ios` trocados para `expo run:*`). Commitar ou descartar essa mudança antes de iniciar a execução (ver "Pré-requisito" abaixo).

---

## Mapa dos planos (ordem de dependência)

| # | Arquivo | Entregável TCC | Depende de |
|---|---|---|---|
| 01 | `01-diagnostico.md` | Base para todos | — |
| 04 | `04-backend.md` | Backend integrado | 01 |
| 09 | `09-auditoria-observabilidade.md` | Auditoria + observabilidade + painel de KPIs (backend, web, mobile, docs) | 04 (B1–B2); bloco C depende de 03 itens 1–4 |
| 10 | `10-conformidade-legal.md` | LGPD + leis aplicáveis + consentimentos por área + documentos legais | 04 (B1); L2 depende de L1; L3 depende de 03 itens 1–4 |
| 03 | `03-web-admin.md` | Gerenciador web | 04 (Fases B1–B3) |
| 02 | `02-mobile.md` | Aplicativo móvel | 04 (Fases B1–B4) |
| 05 | `05-deploy.md` | Distribuição (APK/iOS/nuvem) | 02, 03, 04 |
| 06 | `06-requisitos-diff.md` | Documento de requisitos atualizado | 02, 03, 04 (rascunho já possível) |
| 08 | `08-manual-instalacao.md` | Manual de instalação + tecnologias | 05 |
| 07 | `07-manual-uso.md` | Manual de uso | 02, 03 congelados |

Sequência sugerida (≈ 8 meses disponíveis):

```
Out–Nov/26  04 backend (segurança + novos módulos)  ── 01 já feito
Nov/26      09 bloco A (auditoria + métricas no backend) logo após 04 B1/B2 · 10 L1 (consentimento no backend)
Dez/26      10 L4 rascunho dos documentos legais → enviar ao orientador para revisão jurídica (D9–D11)
Nov/26–Fev/27  03 web admin  ∥  02 mobile (integrações + compat)
Jan–Fev/27  09 blocos B/C (consentimento no app + dashboard/auditoria/saúde da API no web)
Mar/27      05 deploy (staging na nuvem + EAS preview)
Abr/27      congelamento de features · testes em dispositivos · 06 relatório de diferenças
Mai/27      07 manual de uso (prints da versão congelada) · 08 manual de instalação
Jun/27      entrega
```

---

## FASE 1 — Scope Analysis

**Objetivo:** levar os 6 entregáveis ao estado final, com o app rodando em Android/iOS contra um backend em nuvem e o painel web gerenciando todo o conteúdo dinâmico consumido pelo app.

**Módulos afetados:** `apps/backend` (todos os módulos + novos), `apps/web` (do zero), `apps/mobile` (integrações, compat, limpeza), `packages/shared`, infra (Dockerfile, compose, EAS), documentação.

**Escopo**
- Corrigir falhas de segurança e build do backend; criar módulos ausentes exigidos pelos RFs.
- Construir o gerenciador web (hoje é o template padrão do Vite).
- Fechar lacunas funcionais do mobile frente aos RFs; patches de compatibilidade SDK 57 / Android / iOS.
- Deploy reproduzível por terceiros (instituição).
- Relatório de diferenças do doc de requisitos, manual de uso, manual de instalação.

**Não-escopo**
- Fórum / Área Social (RF-015..018 marcados REMOVER no doc).
- Push remoto via servidor (notificações seguem locais — RNF10 atendido por mecanismo nativo do SO).
- Publicação em lojas (Play Store / App Store pública) — entrega é APK + TestFlight/Expo Go.

**Impacto técnico**
- Dados: novas tabelas (AuditLog, EmergencyDialLog, AwarenessMonth, MascotConfig, …), novas colunas (User.status, Treatment.startDate, …) → migrations Prisma.
- APIs: guards de role em todas as rotas de escrita de conteúdo; novos endpoints admin.
- UI: painel web completo; ajustes mobile.
- Infra: Dockerfile corrigido, CORS, env por ambiente, EAS com `EXPO_PUBLIC_API_URL`.

**Critérios de aceite (programa)**
1. Toda funcionalidade do CLAUDE.md e do doc aparece em `01-diagnostico.md` com status + evidência.
2. `npx tsc --noEmit` sem erros em mobile e web; `npm test` do backend com 100% das suítes executando (hoje 13/16 falham por resolução de módulo).
3. Nenhuma rota de escrita de conteúdo acessível sem JWT + role ADMIN.
4. APK de `preview` instala e funciona contra a URL de nuvem, sem a máquina do desenvolvedor.
5. Relatório de diferenças cobre RF-001..RF-026, RNF01..18, RS001..005 e APF.
6. Manuais com prints da versão congelada.

**Perguntas bloqueadoras / decisões pendentes** (defaults recomendados — confirmar antes da fase indicada)

| # | Decisão | Default recomendado | Antes de |
|---|---|---|---|
| D1 | Provedor de nuvem | Imagem Docker portável + Render (web service) + Neon (Postgres) — ver `05-deploy.md` | Plano 05 |
| D2 | Biometria no login (RF-004 obs. 2) | Implementar com `expo-local-authentication` (prioridade Desejável) | Plano 02 F4 |
| D3 | RNF09 (diário imutável) × RF-022 (diário editável) | Manter edição (RF-022) e reescrever RNF09 no doc | Plano 06 |
| D4 | Criptografia em repouso do diário (RS002) | Criptografia em nível de aplicação (AES-256-GCM) em `content` | Plano 04 B4 |
| D5 | Imagens de capa cadastradas via web | URL externa + upload opcional para object storage (ver 03) | Plano 03 |
| D6 | Conta Apple Developer (TestFlight exige conta paga) | Se indisponível: iOS via Expo Go + build de simulador | Plano 05 |
| D7 | Retenção da trilha de auditoria | ✅ **Decidida:** escalonada (acesso/segurança 12 meses — Marco Civil art. 15 exige ≥ 6; auditoria admin 5 anos; analytics brutos 180 dias; agregados indefinidos), configurável por env | — |
| D9 | Controlador e encarregado (DPO) | Instituição como controladora após a entrega | Plano 10 L4 |
| D10 | Base legal para enviar contexto à Groq (EUA) | Consentimento específico (LGPD art. 33 VIII) + aviso | Plano 10 L1 |
| D11 | Consentimento parental para 12–17 anos | Exigir (conservador) | Plano 10 L1 |
| D8 | Sentry para rastrear erros | ✅ **Decidida:** não usar. `ErrorLog` próprio agrupado por fingerprint, exibido em Saúde da API | — |

**Premissas explícitas**
- Mascote usa **Groq** (`llama-3.3-70b-versatile`, API compatível com OpenAI) — CLAUDE.md diz "OpenAI": corrigir CLAUDE.md e doc.
- Planos anteriores em `.claude/plans/` e `tasks/*.md` são histórico; itens deles revalidados aqui.

---

## FASE 2 — Evidence Gathering (síntese; detalhe em 01)

| Evidência | Âncora | Implicação |
|---|---|---|
| Rotas POST/PATCH/DELETE de conteúdo sem guard | `apps/backend/src/media/books/books.controller.ts:20-56` (idem movies, series, leisures) | Qualquer anônimo altera o catálogo — **crítico** |
| Login retorna `user` cru (inclui hash de senha) | `apps/backend/src/auth/auth.service.ts` (`return { access_token, user: user }`) | Vazamento de hash — **crítico** |
| `GET /users` lista todos para qualquer autenticado | `apps/backend/src/user/user.controller.ts:23` | Vazamento de PII — **crítico** |
| Sem `enableCors` | `apps/backend/src/main.ts` | Web admin no browser bloqueado |
| Throttle global 10 req/min | `apps/backend/src/app.module.ts` (`ThrottlerModule.forRoot`) | 429 em uso normal do app/painel |
| Dockerfile `CMD node dist/main` mas build gera `dist/src/main.js`; `prisma` é devDependency e runner usa `--omit=dev` | `apps/backend/Dockerfile`, `apps/backend/package.json` | Container não sobe |
| Jest sem `moduleNameMapper` para `src/*` | `apps/backend/package.json` (bloco `jest`) | 13/16 suítes falham |
| Web = template Vite | `apps/web/src/App.tsx` | Entregável inteiro a construir |
| Imagens de mídia resolvidas por mapa local de `require()` | `apps/mobile/src/constants/mediaImageMap.ts` | Conteúdo novo via web aparece sem capa |
| Mobile `tsc` com 3 erros (import de `SocialArea` removido etc.) | `apps/mobile/src/components/ui/Buttons/Overlay/NewPublication/NewPublication.tsx:3` | Código morto / build frágil |

---

## FASE 3 — Architecture Planning (decisão principal do programa)

**Bloco único: como estruturar a finalização**

| Abordagem | Descrição |
|---|---|
| A — Feature-first | Fechar RF por RF verticalmente (backend+web+mobile por feature) |
| B — Camada-first | Backend completo → web → mobile → deploy → docs |
| C — Híbrido por fases com contrato | Backend em fases (segurança/infra → novos módulos), web e mobile em paralelo consumindo cada fase; docs ao final sobre versão congelada |

| Critério | A | B | C |
|---|---|---|---|
| Corretude técnica | 3 | 4 | 5 |
| Blast radius | 3 (mexe em tudo sempre) | 4 | 4 |
| Custo de manutenção | 3 | 4 | 4 |
| Alinhamento (commits sem misturar mobile+backend) | 2 | 5 | 5 |
| Aproveitamento do prazo (paralelismo) | 4 | 2 | 5 |

**Vencedora: C.** Segurança do backend é pré-requisito de tudo (rotas abertas hoje), mas web e mobile não precisam esperar todos os módulos novos. A foi descartada porque viola "não misturar mobile+backend" na política de commits; B serializa e desperdiça prazo.

Validações: regra de negócio no backend (guards/roles, cálculos de tratamento expostos via API) ✓ · sem acoplamento novo entre apps (contrato = REST + Swagger) ✓ · reversível por fase/branch ✓ · contratos existentes preservados (mudanças de resposta versionadas nos planos) ✓

---

## FASE 4 — Execution Planning

Pré-requisito: resolver o diff de `apps/mobile/package.json` (`expo run:*` exige build nativo local; para Expo Go o correto é `expo start --android`). Recomendo **reverter** e criar scripts separados (`android:native`) — commit `🔧 chore(mobile): split native run scripts`.

1. [ ] Ler `01-diagnostico.md` e confirmar decisões D1–D6 — *verificação: tabela D preenchida*
2. [ ] Plano 04 Fase B1 (segurança crítica) — *verificação: testes e2e de 401/403 passam*
3. [ ] Plano 04 Fase B2 (infra: Docker, CORS, Jest, throttle) — *verificação: `docker compose -f docker-compose.prod.yml up` sobe e `/api` responde*
4. [ ] Plano 04 Fase B3 (endpoints admin + novos módulos de conteúdo) — *verificação: Swagger lista rotas admin protegidas*
5. [ ] Plano 03 (web) em paralelo com Plano 02 Fases M1–M3 (mobile) — *verificação: critérios de cada plano*
6. [ ] Plano 04 Fase B4 (auditoria, LGPD, criptografia) + Plano 02 Fase M4 — *verificação: AuditLog populado em CRUDs*
7. [ ] Plano 05 (staging em nuvem + EAS preview) — *verificação: APK instala em aparelho limpo e loga contra nuvem*
8. [ ] Congelamento + Plano 06 (relatório de diferenças) — *verificação: 100% dos itens do doc na tabela*
9. [ ] Plano 08 e Plano 07 — *verificação: terceiro segue o manual de instalação sem ajuda*
10. [ ] Atualizar CLAUDE.md (Groq, web, novos módulos) — `📚 docs(readme): update project context`

---

## FASE 5 — Verificação do Plano

- [x] Nenhuma regra de negócio na camada errada (autorização e cálculos no backend)
- [x] Nenhum acoplamento desnecessário entre módulos (apps só via REST)
- [x] Critérios de aceite objetivos e testáveis
- [x] Checklist ≤ 10 itens
- [x] 3 abordagens avaliadas, 1 escolhida com justificativa
- [~] Evidências: a síntese do programa lista 10 (excede o limite de 7 porque cobre 3 apps); cada sub-plano respeita ≤ 7
- [x] Perguntas bloqueadoras explicitadas (D1–D6, com defaults e momento-limite)

**Gate = Livre para execução** (condicionado ao pré-requisito de working tree limpa).
