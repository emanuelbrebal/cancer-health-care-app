# 09 — Auditoria, Observabilidade e Painel de KPIs

> Consolida e substitui os itens 18 (`/admin/stats`) e 19 (`AuditLog`) do plano 04 e o item 9 (Dashboard) do plano 03.
> Base existente: `DailyLogAudit`, `UserDeletionLog`, `PatientSupportLog` (`apps/backend/prisma/schema/schema.prisma`), `@nestjs/schedule` já instalado (`apps/backend/package.json`), `AllExceptionsFilter` com `console.error` (`apps/backend/common/filters/http-exception.filter.ts`).

## FASE 1 — Escopo

**Objetivo:** (1) trilha de auditoria completa e consultável ("quem fez o quê, quando" — RNF16, RF-003, RF-014, RF-025); (2) observabilidade técnica da API (saúde, latência, erros, uso da IA); (3) painel de KPIs de produto e de operação no gerenciador web; (4) documentação de tudo (catálogo de eventos, catálogo de KPIs, operação).

**Três pilares**

| Pilar | O que registra | Quem consome |
|---|---|---|
| Auditoria | Ações de escrita de admins e usuários sobre registros importantes; eventos de segurança (login falho, lockout, mudança de senha, mudança de status, exclusão LGPD); discagens de emergência | Admin (tela Auditoria), banca/jurídico |
| Observabilidade técnica | Requisições (rota, método, status, latência), erros 5xx com correlation id, health de DB/SMTP/Groq, consumo e falhas da IA, 429/rate limit | Admin (tela Saúde da API), operador (logs/`/metrics`) |
| Analytics de produto | Eventos de domínio agregados (cadastro, login, diário, tratamento, mascote, conteúdo, emergência) | Admin (Dashboard de KPIs) |

**Restrições de privacidade (não negociáveis)**
- RNF15: nenhuma tela ou endpoint mostra conteúdo de diário, texto de conversas com o mascote ou dados de tratamento individuais. Só **agregados**.
- Agregados de bem-estar (emoções) só exibidos quando o grupo tem ≥ 5 usuários distintos (k-anonimato simples); abaixo disso, mostrar "dados insuficientes".
- Eventos analíticos guardam `userId` pseudonimizado (HMAC-SHA256 com `ANALYTICS_SALT`), nunca e-mail ou nome.
- Eventos de app (telemetria de telas) só com consentimento (flag `analyticsConsent` no usuário — RNF13).
- Retenção escalonada (D7 decidida), aplicada pelo job noturno de limpeza:

| Dado | Retenção | Fundamento |
|---|---|---|
| Eventos de segurança e acesso (`LOGIN_*`, `ACCOUNT_LOCKED`, `PASSWORD_*`) | 12 meses | Marco Civil da Internet, art. 15: mínimo de 6 meses para registros de acesso a aplicações. 12 meses dá folga para investigação |
| Auditoria de ações administrativas e de status de conta (`AuditLog` de conteúdo/usuários/mascote) | 5 anos | Baixo volume, serve de prova de moderação. Sem conteúdo sensível |
| `EmergencyDialLog` | 12 meses | RF-014 (verificação de golpe). Em seguida, anonimizar `userId` e manter só para agregados |
| `ErrorLog` | 90 dias | Diagnóstico técnico |
| `AnalyticsEvent` brutos | 180 dias | Minimização (LGPD art. 6º, III). O histórico continua em `DailyKpi` |
| `ApiMetric5m` | 90 dias | Técnico |
| `DailyKpi` (agregado, sem pessoa) | indefinida | Não é dado pessoal |
| Exclusão LGPD do titular | imediata: remove `AnalyticsEvent` com o hash do titular. `AuditLog` mantém só `actorId` pseudonimizado | Direito de eliminação × guarda legal do Marco Civil |

Os prazos ficam em variáveis (`RETENTION_*_DAYS`) para a instituição ajustar à sua política. O orientador valida apenas a redação no documento de requisitos.

**Não-escopo:** APM distribuído, tracing OpenTelemetry completo, alertas por SMS. (Ficam como evolução; `/metrics` Prometheus deixa a porta aberta.)

**Critérios de aceite**
1. Toda escrita em media, leisures, genres, users (status/role), mascot-config, awareness-months, daily-messages gera 1 linha em `AuditLog` com ator, ação, entidade, id, diff (campos alterados antes/depois, sem senha/hash/conteúdo de diário). Teste e2e por recurso.
2. Eventos de segurança (`LOGIN_FAILED`, `ACCOUNT_LOCKED`, `PASSWORD_CHANGED`, `PASSWORD_RESET`, `STATUS_CHANGED`, `LGPD_DATA_DELETED`) registrados.
3. Toda resposta carrega `X-Request-Id`; erro 5xx no log estruturado contém esse id; o mesmo id aparece no toast de erro do web (para suporte).
4. `GET /health` (liveness) e `GET /health/ready` (DB + Groq configurado + SMTP configurado) respondem em < 500 ms.
5. Tela "Saúde da API" mostra req/min, taxa de erro 5xx, p95 de latência por rota (últimas 24 h e 7 dias), 429 por rota, chamadas/falhas Groq.
6. Dashboard exibe todos os KPIs do catálogo abaixo com filtro de período (7/30/90 dias) e comparação com o período anterior; carrega em < 2 s com 100k eventos (índices + rollup diário).
7. Nenhum endpoint de observabilidade/KPI acessível sem role ADMIN; `/metrics` protegido por token próprio (`METRICS_TOKEN`).
8. Documentação publicada (ver Fase 4, bloco D).

## FASE 2 — Evidências

| Arquivo | Âncora | Fato |
|---|---|---|
| `apps/backend/prisma/schema/schema.prisma` | `DailyLogAudit`, `UserDeletionLog`, `PatientSupportLog` | Auditoria fragmentada por domínio, sem ator/diff padronizados |
| `apps/backend/common/filters/http-exception.filter.ts` | `console.error(...)` | Log não estruturado, sem correlation id |
| `apps/backend/src/app.module.ts` | imports | Nenhum interceptor global; `ScheduleModule` não registrado (pacote instalado) |
| `apps/backend/src/mascot/mascot.service.ts` | ~177 (`model: 'llama-3.3-70b-versatile'`) | Chamada Groq sem métrica de latência/tokens/erro |
| `apps/backend/src/personal/daily-logs/daily-logs.repository.ts` | `updateWithAudit` | Padrão de auditoria já existe → generalizar |
| `apps/web/package.json` | deps | Sem biblioteca de gráficos |

## FASE 3 — Decisões

**Bloco 1 — Stack de observabilidade técnica**

| Opção | Corretude | Blast radius | Manutenção | Alinhamento / portabilidade | Custo |
|---|---|---|---|---|---|
| A. Prometheus + Grafana (+ Loki) auto-hospedados no compose | 5 | 4 | 2 (3 serviços a mais para a instituição operar) | 3 | 0 |
| B. Embutida: interceptor + `prom-client` em memória → snapshot a cada 5 min no Postgres; logs JSON (pino) em stdout; telas no próprio painel web; `/metrics` exposto para quem quiser plugar Grafana | 4 | 5 | 4 | 5 (zero serviço extra; funciona em qualquer host) | 0 |
| C. SaaS (Sentry + Grafana Cloud/Datadog) | 5 | 4 | 4 | 2 (dependência externa, dados de saúde saindo do ambiente da instituição — LGPD) | free tiers limitados |

**Escolha: B.** É a única que mantém tudo dentro do ambiente da instituição sem exigir que ela opere uma stack de monitoramento, e entrega as telas no gerenciador web (o que a banca vê). A fica como **opcional documentado** (perfil `observability` no compose usando o `/metrics`).

**D8 decidida: sem Sentry.** No lugar dele entra a tabela `ErrorLog`, alimentada pelo `AllExceptionsFilter` em todo 5xx, agrupando por *fingerprint* (hash de nome do erro + rota + 1ª linha do stack). Ela guarda contagem, primeira e última ocorrência, último `requestId` e mensagem truncada, nunca o corpo da requisição. Com isso a página Saúde da API ganha "Erros recentes" com o mesmo valor prático do Sentry, sem dependência externa e sem dado de saúde saindo do ambiente (LGPD). Uma integração com Sentry fica descrita em `operacao.md` como extensão possível, mas não é instalada.

**Bloco 2 — Modelo de dados**

```
AuditLog          id, actorId?, actorRole?, action (enum), entity, entityId?, diff Json?, ip?, requestId, createdAt
                  índices: (entity, entityId), (actorId, createdAt), (action, createdAt)
AnalyticsEvent    id, type (enum), subjectHash?, role?, props Json, source (SERVER|APP), createdAt
                  índices: (type, createdAt)
DailyKpi          date, metric (string), dimension? (ex.: role, emote, contentType), value Float   PK(date, metric, dimension)
ApiMetric5m       bucketStart, route, method, statusClass, count, errorCount, p50Ms, p95Ms, maxMs
                  PK(bucketStart, route, method, statusClass)
ErrorLog          fingerprint (PK), errorName, route, method, messageTrunc (≤ 300), count,
                  firstSeenAt, lastSeenAt, lastRequestId, resolvedAt?, resolvedBy?
EmergencyDialLog  (plano 04 item 15 — passa a ser também fonte de KPI)
```
- `DailyLogAudit` e `UserDeletionLog` **mantidos** (compatibilidade); novos registros também vão para `AuditLog`. Migração dos dados antigos para `AuditLog` por script idempotente.
- Rollup noturno (`@Cron('0 3 * * *')`) calcula `DailyKpi` do dia anterior → dashboard lê de `DailyKpi` (rápido) e só o "hoje" é calculado ao vivo.

**Bloco 3 — Onde emitir eventos**
Escolha: **server-side nos services** via `AuditService.record()` e `AnalyticsService.track()` (injetáveis, fire-and-forget com `try/catch` — falha de log nunca derruba a operação). Telemetria de app (screen views, tempo em tela) apenas em lote via `POST /analytics/events` com consentimento. Descartado: interceptor genérico para auditoria (não conhece o diff nem a semântica de negócio).

## Catálogo de KPIs (o que o painel mostra)

| Grupo | KPI | Fórmula / fonte | Privacidade |
|---|---|---|---|
| **Visão geral** | Usuários ativos (DAU / WAU / MAU) e stickiness (DAU/MAU) | distintos `subjectHash` em eventos `LOGIN`/`APP_OPEN` | agregado |
| | Novos cadastros por período e por perfil (paciente × cuidador) | `USER_REGISTERED` por `role` | agregado |
| | Taxa de conclusão do cadastro progressivo | usuários com perfil completo ÷ cadastrados; % que pulou | agregado |
| | Retenção D1 / D7 / D30 (coortes semanais) | cadastrados na semana X que voltaram em D+n | agregado |
| | Contas desativadas / exclusões LGPD | `STATUS_CHANGED`, `LGPD_DATA_DELETED` | agregado |
| **Bem-estar** | Distribuição de emoções registradas no diário (período) | contagem de `emotes` em `DIARY_CREATED` | agregado, k ≥ 5 |
| | Tendência semanal de emoções positivas × negativas | classificação fixa dos emotes (`mobile/src/constants/Emotes.ts`) | agregado, k ≥ 5 |
| | Frequência média de escrita no diário (entradas/usuário ativo/semana) | `DIARY_CREATED` | agregado |
| **Tratamento** | Tratamentos ativos, criados, finalizados, cancelados | `Treatment.status` | agregado |
| | Progresso médio dos tratamentos ativos (% dias cumpridos) | `startDate`/`endDate` (plano 04 item 22) | agregado |
| | Usuários com notificações ativas (app) | evento `NOTIFICATIONS_ENABLED` | agregado, com consentimento |
| **Mascote IA** | Mensagens/dia, usuários que conversaram, mensagens por usuário | `PatientSupportLog` | agregado |
| | Latência p95 e taxa de erro da Groq; usuários que atingiram o limite de 30/dia | `MASCOT_REPLIED`/`MASCOT_FAILED`/`MASCOT_LIMIT_REACHED` | agregado |
| | Gatilhos de emergência disparados pelo mascote | evento `MASCOT_EMERGENCY_TRIGGER` | agregado |
| | Status da configuração (versão ativa, última alteração, por quem) | `MascotConfig` + `AuditLog` | admin |
| **Saúde mental / emergência** | Acessos à central de contatos e discagens por contato (CVV, CAVIDA, SAMU) | `EmergencyDialLog` | agregado; lista detalhada só em Auditoria |
| | Distribuição por hora do dia/dia da semana (heatmap) | idem | agregado |
| **Conteúdo** | Top 10 livros/filmes/séries/atividades por visualizações; cliques eduCAPES | `CONTENT_VIEWED`, `BookDetail.visitCount` | agregado |
| | Itens ativos × inativos por tipo; itens sem capa | tabelas de mídia | admin |
| | Áreas mais acessadas (Oncologia, Saúde Mental, subáreas) | `SCREEN_VIEWED` (app, consentimento) | agregado |
| **Segurança & auditoria** | Logins falhos, contas bloqueadas, resets de senha | eventos de segurança | agregado + lista |
| | Ações administrativas por admin e por entidade | `AuditLog` | admin |
| **Saúde da API** | Uptime (health checks), req/min, taxa 5xx, p95 por rota, 429 por rota | `ApiMetric5m` | técnico |
| | Versão em produção, último deploy, migrations aplicadas | `/health/ready` | técnico |
| | Erros recentes agrupados (ocorrências, última vez, rota) + marcar como resolvido | `ErrorLog` | técnico |
| | Uso do limite da Groq (requisições/min vs. limite do plano) | métrica do item A3 | técnico |

> Observação: os KPIs de bem-estar são **indicadores de uso populacional**, não instrumento clínico. A tela precisa de aviso explícito; registrar isso também no documento de requisitos.

## FASE 4 — Checklist de execução

**A — Backend** · branch `feat/backend-observability` (depois do plano 04 B1/B2)
1. [ ] `RequestIdMiddleware` (`X-Request-Id`, aceita o recebido ou gera UUID) + logger estruturado (`nestjs-pino`) com redaction de `authorization`, `password`, `content`, `userQuestion`; `AllExceptionsFilter` passa a logar via pino com `requestId` e devolvê-lo no corpo do erro — `✨ feat(backend): add structured logging with request id`
2. [ ] `@nestjs/terminus`: `GET /health`, `GET /health/ready` (DB, presença de GROQ_API_KEY/SMTP, versão do app e da última migration) — `✨ feat(backend): add health checks`
3. [ ] `MetricsInterceptor` com `prom-client` (histograma de latência por rota normalizada `/books/:id`, contadores de status e de 429) + `GET /metrics` com `METRICS_TOKEN` + job a cada 5 min persistindo `ApiMetric5m`; instrumentar chamada Groq (latência, erro, tokens se retornados) — `✨ feat(backend): add api metrics`
4. [ ] Models `AuditLog`, `AnalyticsEvent`, `DailyKpi`, `ApiMetric5m`, `ErrorLog` + migration + índices; `AllExceptionsFilter` faz upsert em `ErrorLog` por fingerprint, protegido por `try/catch` — `✨ feat(prisma): add audit and analytics tables`
5. [ ] Módulo `audit`: `AuditService.record()` com cálculo de diff e lista de campos sensíveis bloqueados; aplicar em todos os services de escrita (1 commit por domínio); script de migração de `DailyLogAudit`/`UserDeletionLog` → `AuditLog` — `✨ feat(backend): add audit module` · `✨ feat(media): audit content changes` …
6. [ ] Módulo `analytics`: `AnalyticsService.track()` (pseudonimização HMAC), emissão nos pontos do catálogo; `POST /analytics/events` (lote ≤ 50, validação de tipos permitidos, exige consentimento) — `✨ feat(backend): add analytics events`
7. [ ] Rollup noturno → `DailyKpi` + job de retenção conforme a tabela D7 (`RETENTION_*_DAYS`, anonimização do `EmergencyDialLog` após 12 meses) com `ScheduleModule.forRoot()` — `✨ feat(backend): add daily kpi rollup`
8. [ ] Endpoints ADMIN: `GET /admin/kpis/{overview|wellbeing|treatment|mascot|emergency|content|security}?from&to&compare=true`, `GET /admin/api-health?window=24h|7d`, `GET /audit-logs?actor&entity&action&from&to&page` + export CSV — aplicação do k ≥ 5 **no servidor** — `✨ feat(backend): expose admin kpi endpoints`
9. [ ] Testes: unit do diff/redaction/k-anonimato/pseudonimização; e2e de 403 para não-admin e de "auditoria gerada" por recurso; teste de carga simples (seed de 100k eventos + medir endpoint de overview) — `🧪 test(backend): cover audit and kpis`

**B — Mobile** · branch `feat/mobile-analytics-consent` (após A6)
10. [ ] Toggle "Compartilhar dados de uso anônimos" (finalidade `USAGE_ANALYTICS` = modal C11 do plano 10, gerenciado na Central de Privacidade), fila local de eventos com envio em lote (a cada 30 s ou ao ir para background), `SCREEN_VIEWED` via listener do Expo Router; propagar `X-Request-Id` dos erros para o toast — `✨ feat(services): add consented usage analytics`

**C — Web** · branch `feat/web-admin-dashboard` (após A8 e plano 03 itens 1–4)
11. [ ] Biblioteca de gráficos (Recharts) + componentes `KpiCard` (valor, variação vs período anterior, sparkline), `TimeSeriesChart`, `BarList`, `Heatmap`, `PeriodFilter`, estado "dados insuficientes (k < 5)" — `✨ feat(components): add dashboard widgets`
12. [ ] Páginas: Visão geral · Engajamento & retenção (coortes) · Bem-estar (com aviso não-clínico) · Tratamento · Mascote IA · Emergência · Conteúdo · Segurança — 1 commit por página — `✨ feat(web): add overview dashboard` …
13. [ ] Página Auditoria (tabela filtrável, detalhe com diff lado a lado, export CSV) e Saúde da API (cards de status dos health checks, gráficos de req/min, 5xx, p95, top rotas lentas, 429) — `✨ feat(web): add audit log page` · `✨ feat(web): add api health page`
14. [ ] Toasts de erro do painel exibem o `requestId` ("Código para suporte: …") — `✨ feat(web): show request id on errors`

**D — Documentação** · branch `docs/observability`
15. [ ] `docs/observability/eventos.md` — catálogo de eventos de auditoria e analytics (nome, quando dispara, campos, origem, retenção, base legal LGPD) — `📚 docs(observability): add event catalog`
16. [ ] `docs/observability/kpis.md` — catálogo de KPIs (definição, fórmula, fonte, privacidade, como interpretar, limitações) = tabela acima expandida
17. [ ] `docs/observability/operacao.md` — logs (formato, como filtrar por requestId), health checks, `/metrics` + perfil opcional Prometheus/Grafana no compose, política de retenção (tabela D7 e fundamento legal), variáveis (`METRICS_TOKEN`, `ANALYTICS_SALT`, `LOG_LEVEL`, `RETENTION_*_DAYS`), uso do `ErrorLog`, extensão opcional com Sentry, roteiro de incidentes (API fora, Groq falhando, pico de 429, DB cheio)
18. [ ] Integrar nos entregáveis: seção "Gerenciador Web → Painel e Auditoria" no manual de uso (plano 07), seção "Observabilidade" no manual de instalação (plano 08), novos RF/RNF no relatório de diferenças (plano 06), diagrama de arquitetura com o fluxo de eventos

## FASE 5 — Verificação

- [x] Regras de privacidade (k-anonimato, pseudonimização, redaction) aplicadas no servidor, não no painel
- [x] Auditoria/analytics como providers isolados; falha de log não afeta operação de negócio
- [x] Critérios objetivos (testes e2e, tempos de resposta, cobertura do catálogo)
- [x] 3 abordagens avaliadas, B escolhida com justificativa
- [x] Evidências ≤ 7
- [ ] Checklist com 18 itens (> 10): dividido em 4 blocos independentes (A ≤ 9 itens); aceito pelo tamanho do escopo
- [x] Decisões D7 (retenção escalonada) e D8 (sem Sentry, `ErrorLog` próprio) fechadas

**Compatibilidade das libs** (verificada no registro npm em 2026-10-18):

| Lib | Última versão | Peer relevante | Compatível? |
|---|---|---|---|
| `nestjs-pino` | 5.3.1 | `@nestjs/common/core ^11.0.8 \|\| ^12`, `pino ^10`, `pino-http ^11` | ✅ Nest ^11.1.18 |
| `pino-http` | 11.0.0 | — | ✅ |
| `@nestjs/terminus` | 12.1.0 | `@nestjs/* ^11 \|\| ^12`; demais peers (typeorm, mongoose…) opcionais | ✅ (usar o indicador Prisma) |
| `prom-client` | 15.1.3 | — | ✅ |
| `recharts` | 3.10.1 | `react ^16.8…^19`, **`react-is`** | ✅ React 19.2.3. Instalar `react-is@19.2.3` explicitamente para casar com o override |

Regra de instalação: fixar versão exata (sem `^`) e preferir a última versão publicada há pelo menos 14 dias (ex.: recharts 3.10.1 foi publicado há poucos dias, então usar a anterior se a 3.10.1 tiver menos de 2 semanas na data da instalação). Adicionar as entradas de `allowScripts` na raiz se alguma lib exigir install script.

**Gate = Livre para execução** do bloco A após o plano 04 B1/B2. Nenhuma decisão pendente neste plano.
