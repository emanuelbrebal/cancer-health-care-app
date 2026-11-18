# Release Final — Corte de Entrega (mobile + backend)

> Gerado em: 2026-11-16 · Persona: engenheiro de release sênior (RN/Expo, NestJS/Prisma, DevSecOps, LGPD)
> Relação com `tasks/tcc-final/`: este é o **corte enxuto de entrega**. Substitui o plano 10 (consentimento reduzido de C1–C15 para 3 finalidades) e absorve o 04-B1 (segurança crítica). O restante de `tcc-final/` segue como backlog.
> Branch: `fix/ReleaseSecurityHardening` a partir de `main` (alterações de `docs/av2*` commitadas em `fix/ux-av2-stack`, commit `83565e0`).
> Atualizado em 2026-11-16 com as respostas do usuário (Q1–Q5) e a frente nova de ciclo de vida da conta.

---

## FASE 1 — Scope Analysis

**Objetivo:** deixar mobile e backend em estado de versão final (sem gerar build): seguros, enxutos, com consentimento LGPD e sessão persistente, e com a documentação pronta para transcrição.

**Módulos afetados:** `apps/backend` (auth, user, media, leisures, personal, mascot, novo `consent`, prisma), `apps/mobile` (auth, services, store, PersonalArea, Mascot), `packages/shared`, `apps/postman`, `docs/`.

**Escopo**
1. Varredura de prontidão (mobile + backend).
2. Varredura DevSecOps + correção dos achados críticos.
3. Consentimento LGPD granular, negado por padrão, ponta a ponta.
4. Sessão persistente com refresh token rotativo (7 dias deslizantes).
5. Ciclo de vida da conta: exclusão real de conta e dados, suspensão de acesso (dados preservados) e pseudonimização.
6. Limpeza de bibliotecas e comentários (relatório → aprovação → aplicação).
7. Relatório de padronização visual + WCAG (somente leitura).
8. Manual de uso e relação do que foi implementado (para o usuário transcrever no documento de requisitos), em Markdown.
9. PRDs do painel administrativo web.

**Não-escopo**
- Gerar build/APK; publicar em loja; deploy.
- Qualquer alteração em `apps/web` (frontend oficial ainda será entregue).
- Qualquer mudança visual em telas existentes (telas **novas** de consentimento usam os componentes `ds/` atuais, sem novos estilos).
- Consentimento parental, portabilidade/exportação, ROPA/RIPD, auditoria/observabilidade (ficam em `tcc-final/09` e `10`).
- Biometria.

**Impacto técnico**
- Dados: 2 tabelas novas (`ConsentRecord`, `RefreshToken`) + enum `ConsentPurpose`; `User.status`/`suspendedAt`; `DailyLog` passa a `onDelete: Cascade`; `UserDeletionLog` deixa de guardar e-mail e nome → 3 migrations Prisma.
- APIs: novos `POST /auth/refresh`, `POST /auth/logout`, `GET/PUT /consents`, `DELETE /users/me`, `POST /users/me/suspend`; `POST /auth/login` passa a devolver também `refresh_token` (aditivo); rotas de saúde/mascote podem responder `403 CONSENT_REQUIRED`; rotas de escrita de conteúdo passam a exigir `ADMIN`.
- UI: tela nova "Privacidade e consentimentos" + bloqueio com explicação nas áreas sem consentimento.
- Infra: `.env.example` ganha `JWT_ACCESS_TTL`, `REFRESH_TTL_DAYS`, `CONSENT_TERM_VERSION`, `PSEUDONYM_KEY`.

**Critérios de aceite**
1. Cinco relatórios em `docs/release/` (prontidão, devsecops, dependências, comentários, wcag), cada achado com arquivo:linha e ação.
2. `git diff --stat main -- apps/web` vazio ao final.
3. Nenhum arquivo de estilo/tela existente tem alteração visual (diff de `StyleSheet` só em arquivos novos).
4. Usuário recém-criado: `GET /consents` devolve as 3 finalidades com `granted: false`.
5. Sem consentimento ativo: rotas de diário/tratamento e `POST /mascot/ask` respondem `403` com `code: CONSENT_REQUIRED` e a finalidade — coberto por teste e2e por finalidade.
6. Revogar grava novo registro (histórico preservado) e bloqueia na requisição seguinte.
7. Access token expira em ≤ 15 min; `POST /auth/refresh` rotaciona o refresh e estende a validade em 7 dias; reutilizar um refresh já rotacionado revoga a família inteira; `POST /auth/logout` invalida o refresh — testes unitários + e2e.
8. No mobile, 401 dispara **um** refresh (single-flight) e repete a requisição; falha no refresh leva ao login.
9. Rotas `POST/PATCH/DELETE` de books, movies, series e leisures respondem `401` sem token e `403` para role não-ADMIN.
10. Secrets reportados sem reproduzir valor; libs e comentários removidos somente após aprovação, em commits atômicos.
11. `npm run lint` e `npm test` (backend) e `npx tsc --noEmit` (mobile) sem erros ao final.
12. Manual e relação de implementados citam apenas o que existe no código.
13. Excluir conta com diário, tratamentos e conversas do mascote devolve 200 e não sobra nenhuma linha ligada ao `userId` (diário, tratamentos, conversas, consentimentos, refresh tokens); o registro de exclusão não contém e-mail nem nome — teste e2e.
14. Conta suspensa: login responde `403 ACCOUNT_SUSPENDED`, refresh tokens revogados, dados intactos; reativar com credenciais válidas devolve o acesso com os dados — teste e2e.
15. O payload enviado à Groq não contém nome, e-mail nem telefone — teste unitário do montador de prompt.

**Decisões do usuário (2026-11-16)**

| # | Tema | Decisão |
|---|---|---|
| Q1 | Revogar consentimento de dados de saúde | Dados ficam guardados e inacessíveis. Só são apagados na exclusão da conta |
| Q2 | Documento de requisitos | Entregar apenas a relação do que foi feito (`docs/requisitos-implementados.md`); o usuário transcreve para o documento oficial |
| Q3 | Alterações de `docs/av2*` | Commitadas em `fix/ux-av2-stack` |
| Q4 | Teto absoluto de sessão | Não há: com uso dentro da janela de 7 dias o usuário nunca reloga |
| Q5 | Conta | Exclusão apaga os dados; "Suspender acesso" preserva os dados; pseudonimizar o que for relevante para a LGPD |

**Premissas**
- Mascote usa **Groq** (`llama-3.3-70b-versatile`, servidores fora do Brasil) — o CLAUDE.md diz OpenAI e será corrigido.
- Notificações são locais (sem rota de backend): o backend só registra o consentimento; o bloqueio é no app.
- Textos dos termos de consentimento são rascunhos técnicos e precisam de revisão jurídica/orientador.
- O cadastro não exige consentimento de dado sensível; exibe link para a política e a conta nasce com tudo negado.

---

## FASE 2 — Evidence Gathering

| # | Evidência | Âncora | Implicação |
|---|---|---|---|
| 1 | JWT único de 7 dias, sem refresh nem revogação | `apps/backend/src/auth/auth.module.ts:23`; `auth.service.ts:59-64` | Sessão não é deslizante nem revogável; logout é só local |
| 2 | 401 no mobile faz logout direto; token persistido em AsyncStorage (texto puro); `expo-secure-store` instalado e sem uso em `src/` | `apps/mobile/src/services/api.ts:19-30`; `apps/mobile/src/store/useAuthStore.ts:12-15` | Falta fluxo de refresh e armazenamento seguro |
| 3 | `User` sem nenhum campo/relacionamento de consentimento; `RegisterDto` sem aceite | `apps/backend/prisma/schema/schema.prisma:46-63`; `auth/dto/register.dto.ts` | Consentimento inexistente no servidor |
| 4 | Contexto de tratamento e histórico emocional injetado no prompt enviado à Groq | `apps/backend/src/mascot/mascot.service.ts:32,177,326-329` | Dado sensível sai do país sem consentimento |
| 5 | `UseGuards` só existe em auth, mascot, daily-logs, treatments e user; books/movies/series/leisures têm `POST/PATCH/DELETE` sem guard; não há RolesGuard | `apps/backend/src/media/books/books.controller.ts:20,41,52`; `leisures/leisures.controller.ts:20,41,58` | **Crítico:** anônimo altera o catálogo |
| 6 | `GET /users` e `GET /users/:id` protegidos só por JWT: qualquer usuário logado lista e-mail, telefone e nascimento de todos | `apps/backend/src/user/user.controller.ts:23-34` | **Crítico:** vazamento de PII |
| 8 | Exclusão de conta existe (`DELETE /users/:id`), mas `DailyLog` tem FK `ON DELETE RESTRICT`: quem tem diário não consegue excluir; `PatientSupportLog` e `DailyLogAudit` não têm relação e ficam órfãos com `userId`; `UserDeletionLog` grava e-mail e nome em claro | `apps/backend/src/user/user.service.ts:39-51`; `prisma/migrations/20260223212055_*/migration.sql:228`; `schema.prisma` (`UserDeletionLog`, `PatientSupportLog`) | Exclusão quebrada e retenção indevida |
| 9 | App chama a exclusão de "Desativar conta"; não existe suspensão | `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/index.tsx:27-49` | Rótulo engana; falta "Suspender acesso" |
| 7 | Consentimento de notificação existe só localmente | `apps/mobile/src/app/(Home)/PersonalArea/Notifications/index.tsx:24` | Migrar para o servidor como fonte da verdade |

**Achados preliminares de DevSecOps (a detalhar no relatório)**
- Secrets: varredura por padrões (chaves `gsk_`/`sk-`/AWS/PEM, atribuições literais) em arquivos rastreados e no histórico **não encontrou nada**; nenhum `.env` jamais commitado. Cobertura limitada a esses padrões → rodar `gitleaks` no item 2.
- Informação pessoal em arquivo rastreado: `apps/mobile/eas.json:51` (`appleId`).
- `docker-compose.yml:8` com senha de Postgres literal (default de dev).
- `auth.service.ts:104` devolve `debug_token` quando `NODE_ENV !== 'production'`; `POST /auth/reset-password` sem throttle próprio (`auth.controller.ts:57`).
- CORS aberto por padrão (`main.ts:12`); Swagger `/api` público em qualquer ambiente (`main.ts:29`).
- Throttle global de 10 req/min (`app.module.ts:33`) — tende a gerar 429 em uso normal.
- `npm audit --omit=dev`: 2 críticas, 17 altas, 15 moderadas (diretas: `axios`, `expo-router`, `nodemailer`, `@nestjs/platform-express`), todas com correção disponível.
- Cadeia de suprimentos: lockfile duplicado (`apps/backend/package-lock.json` + raiz); `@nestjs/mapped-types: "*"`; `@nestjs/testing ^10` com Nest 11; `@types/nodemailer` em `dependencies`.
- Candidatas a remoção (confirmar uso implícito): mobile `lodash`, `babel-plugin-module-resolver`, `expo-module-scripts`, `react-test-renderer`, `@expo/ngrok`; backend `@nestjs/schedule`, `ts-loader`, `source-map-support`, `@eslint/eslintrc`. **Manter** (peer/implícitas): `react-native-webview`, `expo-linking`, `react-native-screens`, `react-native-reanimated`, `react-native-worklets`, `reflect-metadata`, `rxjs`, `@nestjs/platform-express`.
- Comentários: mobile ~170 linhas em 150 arquivos; backend ~12 em 101; shared 0. Sem `console.log` nem `TODO/FIXME` em `src/`.

**Incertezas**
- Estado atual da suíte Jest do backend (o plano mestre registrava 13/16 falhando) — medir no item 2.
- Erros de `tsc` no mobile — medir no item 2.

---

## FASE 3 — Architecture Planning

### Bloco 1 — Modelo de consentimento

| Abordagem | Descrição |
|---|---|
| A | Três colunas booleanas em `User` |
| B | Tabela `ConsentRecord` append-only (userId, purpose, granted, termVersion, createdAt); estado atual = último registro por finalidade; ausência = negado |
| C | Tabela de estado atual + tabela de histórico separada |

| Critério | A | B | C |
|---|---|---|---|
| Corretude (histórico, versão do termo, prova) | 2 | 5 | 5 |
| Blast radius | 3 (mexe em `User` e mappers) | 5 (tabela nova) | 4 |
| Custo de manutenção | 4 | 4 | 2 |
| Alinhamento com a arquitetura | 4 | 5 | 4 |

**Vencedora: B.** Negado por padrão sai de graça (sem registro = negado) e o histórico é o próprio dado. A descartada por não provar consentimento (LGPD art. 8º §2º); C por duplicar escrita sem ganho neste porte.

Enforcement: decorator `@RequiresConsent(purpose)` + `ConsentGuard` (após `JwtAuthGuard`) nos controllers de `daily-logs`, `treatments` (`HEALTH_DATA`) e `mascot` (`AI_MASCOT`). Finalidades: `HEALTH_DATA`, `AI_MASCOT`, `NOTIFICATIONS`. A regra fica no backend; o app só reflete o estado.

### Bloco 2 — Sessão persistente

| Abordagem | Descrição |
|---|---|
| A | Manter JWT longo e reemitir a cada uso |
| B | Access JWT de 15 min + refresh opaco, hash SHA-256 no banco, rotação a cada uso e detecção de reuso por família |
| C | Refresh como JWT stateless + denylist |

| Critério | A | B | C |
|---|---|---|---|
| Corretude (revogação, logout real) | 1 | 5 | 3 |
| Blast radius | 5 | 3 | 3 |
| Custo de manutenção | 5 | 4 | 3 |
| Alinhamento | 3 | 5 | 3 |

**Vencedora: B.** É a única que atende "logout revoga no backend" e limita o dano de token vazado. A não revoga; C precisa de estado de qualquer forma.

Detalhes: tabela `RefreshToken` (tokenHash, familyId, expiresAt, revokedAt, replacedById). Refresh token guardado no mobile em `expo-secure-store` (fallback AsyncStorage apenas no Expo Web), fora do store Zustand persistido. Troca e redefinição de senha revogam todas as famílias. Login continua devolvendo `access_token` e `user` (contrato preservado, campo novo aditivo).

### Bloco 3 — Organização da execução

| Abordagem | Descrição |
|---|---|
| A | Uma branch única com tudo |
| B | Uma branch/PR por frente, estritamente em série |
| C | Varreduras read-only em paralelo (subagents) primeiro; depois uma branch/PR por frente de código, em série |

**Vencedora: C** (corretude 5, blast radius 5, prazo 5). A viola a política de commits/PRs e dificulta reverter; B desperdiça tempo, pois as cinco varreduras não tocam código.

Branches: `fix/ReleaseSecurityHardening` → `feat/PersistentSession` → `feat/DataConsent` → `refactor/ReleaseCleanup` → `feat/ReleaseDocs` → `fix/AccountDeletionPassword`.

### Bloco 4 — Remoção de comentários

| Abordagem | Descrição |
|---|---|
| A | Script AST removendo tudo fora de uma allowlist |
| B | Revisão orientada pelo relatório, arquivo a arquivo |
| C | Regex em massa |

**Vencedora: B.** São ~180 linhas; revisão manual é barata e evita apagar diretivas. A é desproporcional; C quebra `eslint-disable`/`@ts-expect-error`.

Critério — **fica:** cabeçalhos de arquivo/área e banners de seção (ex.: `schema.prisma`), diretivas de ferramenta, "porquês" não óbvios (workaround de plataforma, regra de segurança/emergência). **Sai:** comentário que repete o código, JSDoc que repete a assinatura, código comentado.

### Bloco 5 — Ciclo de vida da conta e pseudonimização (especificação, sem alternativas concorrentes)

- **Suspender:** `User.status = INACTIVE` + `suspendedAt` (o enum `StatusEnum` já existe); revoga todos os refresh tokens; login responde `403 ACCOUNT_SUSPENDED`; reativação pelo próprio login com credenciais válidas e confirmação explícita. Nada é apagado.
- **Excluir:** `DELETE /users/me` com confirmação de senha, em uma transação: apaga diário, tratamentos, conversas do mascote, consentimentos e refresh tokens; pseudonimiza `DailyLogAudit.userId`; grava o registro de exclusão; apaga o usuário. `DELETE /users/:id` fica restrito a ADMIN.
- **Pseudonimização:** identificador substituído por `HMAC-SHA256(userId, PSEUDONYM_KEY)`, chave só em variável de ambiente. Aplicada em: `UserDeletionLog` (sai e-mail e nome), `DailyLogAudit` após exclusão, logs do servidor, e payload do mascote (sem nome, e-mail ou telefone). Criptografia em repouso do conteúdo do diário continua no backlog (`tcc-final` D4) — é outra medida e não entra neste corte.
- Revogar consentimento não apaga dado: só bloqueia (Q1).

**Validações:** regra de negócio no backend (guards) ✓ · sem acoplamento novo entre apps (REST) ✓ · reversível por branch e por migration ✓ · contratos existentes preservados, exceto bloqueios intencionais (403) ✓

---

## FASE 4 — Execution Planning

Ordem por dependência. Cada item: entregável · arquivos · validação.

1. [x] **Pré-requisito de git** — `docs/av2*` commitado em `fix/ux-av2-stack`; branch `fix/ReleaseSecurityHardening` criada de `main`.

2. [x] **Varreduras em paralelo (5 subagents, somente leitura)** → `docs/release/01-prontidao.md`, `02-devsecops.md` (histórico git, `npm audit`), `03-dependencias.md`, `04-comentarios.md`, `05-wcag-padronizacao.md` (componentes `components/ds/Card.tsx`, `components/ui/Cards/*`, `Accordion`, `Buttons`, `Inputs`; contraste WCAG 2.2 AA + APCA do rascunho WCAG 3, alvo de toque, foco, rótulos; componente · critério · correção sugerida).
   *Validação:* critério de aceite 1. **Gate do usuário:** aprovar 03 e 04 antes do item 8.

3. [x] **`fix/ReleaseSecurityHardening` (backend + config)** — `RolesGuard` + `@Roles(ADMIN)` nas escritas de media/leisures; `GET /users` e `GET /users/:id` só para ADMIN ou dono; remover `debug_token`; throttle em `reset-password`; CORS restrito e Swagger desligado em produção; ajustar throttle global; tirar `appleId` do `eas.json`; `npm audit fix` sem breaking; unificar lockfile.
   *Arquivos:* `auth/guards/roles.guard.ts` (novo), controllers de `media/*`, `leisures`, `user`, `auth.service.ts`, `auth.controller.ts`, `main.ts`, `app.module.ts`, `apps/mobile/eas.json`.
   *Validação:* aceite 9; `npm run lint && npm test`.

4. [x] **`feat/PersistentSession` (backend, depois mobile + shared, em commits separados)** — backend: migration `RefreshToken`; `login` emite par; `POST /auth/refresh` (rotação + reuso revoga família); `POST /auth/logout`; revogação em troca/redefinição de senha; TTLs por env. Mobile: refresh em SecureStore; interceptor com single-flight e repetição da requisição; logout chama o backend; `setToken` no store compartilhado.
   *Arquivos:* `prisma/schema/schema.prisma`, `auth/*`, `.env.example`; `apps/mobile/src/services/api.ts`, `services/auth.ts`, `services/sessionStorage.ts` (novo), `store/useAuthStore.ts`, `packages/shared/store/useAuthStore.ts`.
   *Validação:* aceites 7 e 8; `npx tsc --noEmit`; teste manual com TTL de access de 1 min.

5. [x] **`feat/DataConsent` — backend** — enum + `ConsentRecord` + migration; módulo `consent` (`GET /consents`, `PUT /consents/:purpose`); `ConsentGuard` + `@RequiresConsent`; mascote só monta contexto pessoal com `AI_MASCOT` ativo. Revogar apenas bloqueia.
   *Arquivos:* `prisma/schema/schema.prisma`, `src/consent/*` (novo), controllers de `personal/*` e `mascot`, `app.module.ts`.
   *Validação:* aceites 4, 5, 6.

6. [x] **`feat/DataConsent` — mobile** — tela "Privacidade e consentimentos" em `AccountConfigurations/` (3 chaves desligadas, texto do que/para quê/com quem/como revogar); passo no onboarding; bloqueio explicativo em Diário, Tratamento, Calendário e Mascote ao receber `CONSENT_REQUIRED`; `Notifications` passa a ler do servidor. Botão de emergência **nunca** é bloqueado.
   *Arquivos:* `PersonalArea/AccountConfigurations/Privacy/index.tsx` (novo), `services/consentService.ts` (novo), `OnboardingForm/index.tsx`, `Notifications/index.tsx`, telas de Diary/Treatment/Calendar/Mascot (apenas o estado de bloqueio, com componentes `ds/` existentes).
   *Validação:* `npx tsc --noEmit`; roteiro manual negar → bloquear → conceder → liberar → revogar.

7. [x] **`feat/AccountLifecycle` (backend, depois mobile)** — backend: `User.status`/`suspendedAt`; `POST /users/me/suspend`; reativação no login; `DELETE /users/me` transacional; `DailyLog` com cascade; pseudonimização (Bloco 5); payload do mascote sem identificadores diretos. Mobile: em `AccountConfigurations`, o item atual "Desativar conta" vira dois itens de lista — "Suspender acesso" e "Excluir conta e dados" — com os diálogos de confirmação existentes (sem estilo novo).
   *Arquivos:* `prisma/schema/schema.prisma`, `user/*`, `auth/auth.service.ts`, `mascot/mascot.service.ts`, `mascot/prompt-loader.service.ts`; `AccountConfigurations/index.tsx`, `LoginScreen.tsx` (mensagem de conta suspensa).
   *Validação:* aceites 13, 14, 15.

8. [x] **`refactor/ReleaseCleanup`** — aplicar somente o aprovado em 03 e 04: um commit por lib removida/grupo coeso, um commit de comentários por app.
   *Validação:* aceites 10 e 11; `npx expo-doctor` e `npx expo start` sobem sem erro de módulo.

9. [x] **`feat/ReleaseDocs`** — `docs/manual-de-uso.md` (paciente e cuidador, por área, a partir das rotas reais); `docs/requisitos-implementados.md` (o que foi feito, por área, com âncora de código, mais os RNFs novos de sessão, consentimento, exclusão/suspensão e pseudonimização, redigidos para transcrição); collection Postman com os endpoints novos; corrigir CLAUDE.md (Groq, `resolveApiBaseUrl`).
   *Validação:* aceite 12.

10. [x] **PRDs do painel web** — `docs/prd-web-admin/` (login admin + sessão, CRUD de mídia e lazer, gestão de usuários incluindo suspensão, visão de consentimentos sem expor conteúdo sensível), cada um com objetivo, endpoints consumidos, regras de permissão e critérios de aceite; lacunas de backend listadas.
    *Validação:* aceite 2; todo endpoint citado existe ou está marcado como "a criar".

**Sugestão de RNF (sessão):** "O aplicativo deve manter o usuário autenticado sem novo login enquanto houver uso dentro de uma janela deslizante de 7 dias; após 7 dias de inatividade, logout, troca ou redefinição de senha, suspensão ou exclusão da conta, a sessão é encerrada no servidor. Não há tempo máximo absoluto de sessão."

---

## FASE 5 — Verificação do Plano

- [x] Regra de negócio na camada certa (consentimento, roles e sessão decididos no backend)
- [x] Sem acoplamento desnecessário (apps conversam só por REST; `consent` é módulo próprio)
- [x] Critérios de aceite objetivos e testáveis
- [x] Checklist com 10 itens
- [x] Até 3 abordagens por bloco, 1 escolhida com justificativa; 4 blocos de decisão + 1 de especificação
- [x] Evidências: 9 âncoras (2 acima do limite, acrescentadas pela frente de ciclo de vida da conta)
- [x] Perguntas respondidas pelo usuário (Q1–Q5)

**Gate = Livre para execução.**

---

## Histórico de execução

**2026-11-16 — itens 1, 2, 3 e 10**
- Varreduras: 5 relatórios em `docs/release/`. Linha de base medida: tsc mobile 6 erros; tsc backend 0; Jest 13/16 suítes falhando; lint backend 151 erros; lint mobile 11 erros.
- Jest: alias `src/` mapeado; 13 specs de scaffold (um `should be defined`, sem mocks) removidas. Estado: 4 suítes, 28 testes, tudo passando.
- Hardening aplicado: `RolesGuard` + `@Roles(ADMIN)` nas 12 escritas de books/movies/series/leisures; `GET /users` só ADMIN e `GET /users/:id` dono ou ADMIN; `ValidationPipe` com `whitelist` (achado B3: escalada para ADMIN via `PATCH /users/:id`); CORS fechado e Swagger desligado em produção; `JWT_SECRET` forte exigido em produção; throttle global 120/min; `debug_token` removido; token de redefinição de uso único e recusado como sessão; throttle em `reset-password`; seed bloqueado em produção; `appleId` fora do `eas.json`; histórico do chat apagado no logout.
- `npm audit fix` sem `--force`: produção caiu de 35 (2 críticas, 17 altas) para 12 (0 críticas, 7 altas). Restam: `expo-router` e transitivas (correção só no SDK 58), `nodemailer` (major 10), `axios`/`follow-redirects`/`js-yaml` ainda sinalizados após a atualização.
- Não feito no item 3, movido para o item 8: unificar lockfile e corrigir Dockerfile/posição de dependências (depende das remoções aprovadas).
- Pendências novas vindas dos relatórios (fora do checklist original): URL da API em release (`EXPO_PUBLIC_API_URL` ausente no `eas.json`); rota `/design-system` e `DebugStatePanel` sem guarda de `__DEV__`; hooks condicionais em `MediaViewer.tsx`; contexto do mascote vindo do cliente (`treatmentData`/`calendarData` como `any[]`) — tratar no item 7 junto do payload sem identificadores; lint (151 + 11 erros) e 6 erros de tsc no mobile.
- O e-mail removido do `eas.json` continua no histórico git (desde `1adb84e`); reescrever histórico não foi feito.

**2026-11-16 — itens 4, 5, 6 e 7** (branches empilhadas, não enviadas: `fix/ReleaseSecurityHardening` → `feat/PersistentSession` → `feat/DataConsent` → `feat/AccountLifecycle`)
- Sessão: `RefreshToken` + rotação com detecção de reuso por família, `POST /auth/refresh` e `/auth/logout`; mobile com refresh em SecureStore e interceptor single-flight.
- Consentimento: `ConsentRecord` append-only, módulo `consent`, `ConsentGuard`/`@RequiresConsent` em diário, tratamentos e mascote; mobile com `ConsentGate`, tela de privacidade e notificações sincronizadas com o servidor.
- Ciclo de vida: `User.status`/`suspendedAt`, `POST /users/me/suspend`, `DELETE /users/me` transacional, `DailyLog` em cascade, auditoria do diário e `UserDeletionLog` pseudonimizados (HMAC), contexto do mascote montado no servidor e sem identificadores; mobile com "Suspender acesso" × "Excluir conta e dados" e oferta de reativação no login.
- Medição em `feat/AccountLifecycle`: Jest 7 suítes / 47 testes passando; tsc backend 0; tsc mobile 6 erros (os mesmos da linha de base); lint backend 194 erros (linha de base 151 — sobe com os arquivos novos, tratar no item 8); `git diff main -- apps/web` vazio.
- Lacuna: aceites 5, 13 e 14 pedem teste **e2e**; hoje estão cobertos por testes unitários com Prisma mockado (`test/app.e2e-spec.ts` é scaffold e exige banco).

**2026-11-16 — item 8** (`refactor/ReleaseCleanup`, empilhada sobre `feat/AccountLifecycle`)
- Aprovado pelo usuário: todas as remoções e reposicionamentos do relatório 03; comentários conforme recomendações do 04 (G1 removido; G2, G3, G4 e G5 mantidos); zerar lint do backend.
- Libs removidas: mobile (`lodash`, `expo-module-scripts`, `react-test-renderer`, `@expo/ngrok`, `expo-web-browser`), backend (`@nestjs/schedule`, `ts-loader`, `source-map-support`, `@eslint/eslintrc`), raiz (`typescript`). Lock: só remoções, nenhuma versão alterada.
- Reposicionamentos: `dotenv`, `pg`, `@prisma/adapter-pg` (7.8 → 6.19.3, alinhado ao client), `prisma`, `express` e `@nestjs/mapped-types@^2.1.1` em `dependencies`; `@types/nodemailer` e `@nestjs/testing@^11` em dev; `playwright` no workspace mobile; override de `@nestjs/swagger` removido; `expo install --fix` (8 patches).
- **Desvio:** `apps/backend/package-lock.json` foi **regenerado**, não removido — o `Dockerfile` faz `npm ci` com contexto `apps/backend` e quebraria sem ele. As diretas resolvem com patch/minor mais novos que o lock da raiz (ex.: `@nestjs/core` 11.2.10 × 11.1.19).
- Achado 4.3 do relatório 01 corrigido: `start:prod` e `Dockerfile` apontavam para `dist/main`, mas o build gera `dist/src/main.js`.
- Simulação do Dockerfile em cópia limpa: `npm ci` → `prisma generate` → `build` → `npm ci --omit=dev` → `node dist/src/main` → "Nest application successfully started".
- Bug encontrado pela tipagem: `PATCH /series/:id` mapeava a resposta duas vezes (`imagePath` vazio, gênero "Sem gênero", detalhes nulos) — corrigido.
- Comentários: 14 alterações no backend e 35 no mobile. Componente órfão `NewPublication` removido.
- Medição final: lint backend **0 erros** (10 warnings); Jest 7 suítes / 47 testes; tsc backend 0; tsc mobile **0**; `expo export -p android` ok; `expo install --check` ok; `git diff main -- apps/web` vazio.
- Pendente: lint mobile 10 erros (hooks condicionais em `MediaViewer.tsx`, acesso a ref no render, `no-unescaped-entities`, import não resolvido) — não exigido pelo aceite 11; banco local sem as migrations novas (`consent_records` inexistente) → rodar `npx prisma migrate deploy`.

**2026-11-16 — item 9** (`feat/ReleaseDocs`, empilhada sobre `refactor/ReleaseCleanup`)
- `docs/manual-de-uso.md`, `docs/requisitos-implementados.md` (RF/RNF com âncora de código e seção de diferenças), `apps/postman/OncoMente.postman_collection.json` (53 requisições, login salva tokens), CLAUDE.md corrigido (Groq, `resolveApiBaseUrl`, módulo `consent`).
- Correções achadas ao conferir o manual com o código:
  - Lembretes de tratamento eram agendados sem checar o consentimento `NOTIFICATIONS` → agora exigem o consentimento, e revogar cancela os agendados.
  - Primeiro nome do usuário ia para a Groq (contrariava o aceite 15) → removido do prompt por decisão do usuário; testes unitários do payload (sem nome/e-mail/telefone; sem saúde sem consentimento). Jest: 49 testes.
  - Botão SOS só existe nas telas de Saúde Mental (o manual dizia "todas as telas") → texto corrigido.

**Pendências abertas (fora do que foi executado)**
- Aceites 5, 13 e 14 cobertos por teste unitário, não e2e com banco.
- Banco local sem as migrations novas → `npx prisma migrate deploy` em `apps/backend`.
- Lint mobile: 10 erros; `EXPO_PUBLIC_API_URL` ausente no `eas.json`; rota `/design-system` e `DebugStatePanel` sem guarda de `__DEV__` (relatório 01).
- Branches empilhadas e não enviadas: `fix/ReleaseSecurityHardening` → `feat/PersistentSession` → `feat/DataConsent` → `feat/AccountLifecycle` → `refactor/ReleaseCleanup` → `feat/ReleaseDocs` → `fix/AccountDeletionPassword`.

**2026-11-16 — exclusão com senha** (`fix/AccountDeletionPassword`)
- `DELETE /users/me` exige a senha atual (`403 INVALID_PASSWORD`, não 401, para o interceptor do app não encerrar a sessão); throttle 5/min. `DELETE /users/:id` passa a ser só ADMIN.
- Mobile: campo de senha (`TextField` do DS) no diálogo "Excluir conta e dados"; senha errada mantém o diálogo aberto.
- Jest: 50 testes. Docs, PRD 04 e Postman atualizados.
