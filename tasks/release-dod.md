# Release DoD — Rodada final até "código pronto para lançar"

> Gerado em: 2026-11-17 · Persona: engenheiro de release sênior (Expo SDK 57, NestJS 11/Prisma 7, Jest/Supertest, Docker)
> Base: `main` em `c26c8c0` (release-final mergeado via PR #53) · Branch: `fix/ReleaseDoD` (única, PR único para `main` — sem pilha)
> Status: **Gate Livre — aguardando aprovação do usuário para `/exec`**

---

## FASE 1 — Scope Analysis

**Objetivo:** fechar o Definition of Done "código pronto para lançar, sem deploy": mobile sem erros de lint e sem telas de debug em release, URL da API garantida por perfil de build, aceites críticos de LGPD provados por e2e com banco real e deploy parametrizado e agnóstico de provedor.

**Módulos afetados:** `apps/mobile` (MediaViewer, BreathingExercises, `_layout`, `design-system`, config do Expo/EAS, 8 telas com aspas), `apps/backend` (`main.ts`, `pseudonym.util`, `daily-logs-report.service`, `test/`), raiz (`docker-compose.prod.yml`, `docker-compose.test.yml` novo), `docs/release/`.

**Escopo**
1. Corrigir os 10 erros de `expo lint` do mobile sem mudança visual.
2. Bloquear `/design-system` e `DebugStatePanel` fora de `__DEV__`.
3. URL da API obrigatória nos perfis `preview`/`production` do EAS, com falha no build se ausente, loopback ou placeholder.
4. Suíte e2e com Postgres de teste isolado cobrindo os aceites 5, 13 e 14 do `release-final.md`.
5. Deploy agnóstico: `docker-compose.prod.yml` completo, `.env.example` completo, `PSEUDONYM_KEY` obrigatória em produção, checklist de deploy.
6. Avisos de lint do backend com risco real (`main.ts:54`, `daily-logs-report.service.ts:20`).

**Não-escopo**
- Deploy, escolha de provedor, build EAS, publicação em loja.
- `apps/web` (frontend oficial em andamento).
- Mudança visual em qualquer tela; avisos `no-unsafe-argument` em arquivos `*.spec.ts` (mocks de teste, sem risco em runtime).
- Provedor de SMTP (só variáveis e checklist).

**Impacto técnico**
- Dados: nenhum schema novo; e2e usa banco próprio (`oncomente_test`, porta 5433).
- APIs: nenhuma rota muda. Bootstrap passa a recusar subir em produção sem `PSEUDONYM_KEY` forte.
- UI: nenhuma mudança visível em release; `/design-system` redireciona para `/` fora de dev.
- Infra: `app.json` → `app.config.ts` (estende o JSON); `docker-compose.test.yml` novo; script `test:e2e` passa a exigir banco de teste.

**Critérios de aceite**
1. `npx expo lint` (mobile) 0 erros; `npx tsc --noEmit` mobile e backend sem erros.
2. `npm test` (backend) verde e `npm run test:e2e` verde contra o Postgres de teste, provando:
   a. aceite 5 — sem consentimento, rotas de diário/tratamento → `403 CONSENT_REQUIRED` (`HEALTH_DATA`) e `POST /mascot/ask` → `403 CONSENT_REQUIRED` (`AI_MASCOT`); com consentimento, a rota de diário responde 2xx;
   b. aceite 13 — `DELETE /users/me` com senha correta → 200 e zero linhas ligadas ao `userId` em diário, tratamentos, conversas do mascote, consentimentos e refresh tokens; `UserDeletionLog` sem e-mail/nome;
   c. aceite 14 — conta suspensa: login → `403 ACCOUNT_SUSPENDED`, refresh tokens revogados, dados intactos; login com `reactivate: true` devolve acesso e os dados.
3. Fora de `__DEV__`, `/design-system` redireciona para `/` e o `DebugStatePanel` não é montado.
4. `APP_ENV=preview|production` sem `EXPO_PUBLIC_API_URL`, ou com host loopback/placeholder, faz `npx expo config` falhar com mensagem clara.
5. `.env.example` contém todas as 17 variáveis lidas via `process.env` no backend; `docker-compose.prod.yml` repassa todas; checklist cobre migrate, seed bloqueado, secrets, CORS e SMTP.
6. `git diff --stat main -- apps/web` vazio; nenhum `StyleSheet.create` existente alterado.
7. `bootstrap()` com falha encerra o processo com código ≠ 0; geração de PDF com erro rejeita a promise (sem request pendurada).

**Perguntas bloqueadoras:** nenhuma (DoD, hospedagem e e2e decididos em 2026-11-17).

**Premissas**
- O throttler é em memória por instância do app; cada suíte e2e cria a própria instância → contadores zeram por suíte. Usuários de teste são criados via Prisma (o register tem limite 3/min) e só a suíte de suspensão usa `/auth/login` (≤ 5 chamadas, limite 5/min).
- `GROQ_API_KEY` e `SMTP_*` recebem valores fictícios no `.env.test`; nenhum teste chama a Groq (o 403 do guard ocorre antes do handler).
- Placeholder de URL nos perfis EAS: `https://api.oncomente.invalid` (TLD reservado, nunca resolve). O usuário troca pela URL real ao escolher o provedor.

---

## FASE 2 — Evidence Gathering

| # | Evidência | Âncora | Implicação |
|---|---|---|---|
| 1 | `useVideoPlayer` e `useEffect` depois de `if (!url) return null` | `apps/mobile/src/components/ui/Media/MediaViewer.tsx:24,31,37` | Viola rules-of-hooks; trocar `url` vazio↔preenchido quebra a ordem de hooks. `VideoSource` aceita `null` (expo-video 57.0.5, `VideoPlayer.types.d.ts:296`) |
| 2 | `useRef(new Animated.Value()).current` e `setCountdown` síncrono no efeito | `apps/mobile/src/app/(Home)/MentalHealth/BreathingExercises/index.tsx:48,76` | Erros do React Compiler; o countdown pode ser definido nos handlers e na virada de fase |
| 3 | `Stack.Screen name="design-system"` e `<DebugStatePanel />` sem guarda; store de debug persistida | `apps/mobile/src/app/_layout.tsx:60,64`; `src/store/useUxDebugStore.ts:17-19` | Rota de debug acessível em release; `panelVisible` persistido pode reabrir o painel |
| 4 | Fallback `http://localhost:3000` fora de dev; `eas.json` sem `EXPO_PUBLIC_API_URL`; config estática em `app.json` | `apps/mobile/src/services/resolveApiBaseUrl.ts:22,42`; `apps/mobile/eas.json:21-44` | APK de release não conecta. Sem `app.config.ts`, não há ponto para validar no build |
| 5 | e2e só tem o scaffold; `jest-e2e.json` sem `moduleNameMapper` de `src/` e `common/`; bootstrap (pipes/filtro) só em `main.ts` | `apps/backend/test/app.e2e-spec.ts`; `test/jest-e2e.json`; `package.json:92-95`; `src/main.ts:20-24` | e2e não resolveria imports nem reproduziria `ValidationPipe`/`AllExceptionsFilter` |
| 6 | Compose prod sem `CORS_ORIGINS`, `JWT_ACCESS_TTL`, `REFRESH_TTL_DAYS`, `CONSENT_TERM_VERSION`, `PSEUDONYM_KEY`; healthcheck fixo em `-U postgres`; `.env.example` sem `AI_MASTER_PROMPT`; pseudônimo cai no `JWT_SECRET` | `docker-compose.prod.yml:13,26-38`; `apps/backend/.env.example`; `src/shared/utils/pseudonym.util.ts:8` | Produção sobe sem CORS e com chave de pseudônimo acoplada ao JWT |
| 7 | `bootstrap()` sem `.catch`; Promise do PDF sem `reject` e `chunk` como `any` | `apps/backend/src/main.ts:54`; `src/personal/daily-logs/daily-logs-report.service.ts:16-21` | Falha de boot sem exit code; erro no PDF deixa a request pendurada |

**Fluxo atual:** build EAS lê `eas.json` (env por perfil) → Metro inlina `EXPO_PUBLIC_*` → `resolveApiBaseUrl` decide a URL. Backend: `Dockerfile` CMD roda `prisma migrate deploy && node dist/src/main` (migrations no start já existem).

**Incertezas:** comportamento exato de `npx expo config` com `app.config.ts` lançando erro (esperado: exit ≠ 0 com a mensagem) — validar no item 4.

---

## FASE 3 — Architecture Planning

**Bloco 1 — Garantia da URL da API em release**

| Abordagem | Corretude | Blast radius | Manutenção | Alinhamento | Total |
|---|---|---|---|---|---|
| A. Só placeholder no `eas.json` | 2 | 5 | 4 | 4 | 15 |
| B. Placeholder + `app.config.ts` que falha no build se ausente/loopback/placeholder (`.invalid`) | 5 | 4 | 4 | 5 | **18** |
| C. Só checagem em runtime (log/erro na tela quando URL inválida) | 3 | 3 | 3 | 3 | 12 |

Vencedora **B**: impede gerar APK quebrado (falha cedo, no build), sem mudar código de runtime. A descartada: placeholder esquecido gera APK sem conexão. C descartada: o erro só aparece no aparelho do usuário. `resolveApiBaseUrl` só ganha `console.error` quando fora de dev cair no fallback (defesa em profundidade, sem efeito visual).

**Bloco 2 — Banco dos e2e**

| Abordagem | Corretude | Blast radius | Manutenção | Alinhamento | Total |
|---|---|---|---|---|---|
| A. `docker-compose.test.yml` (Postgres 15, porta 5433, `tmpfs`) + `globalSetup` com `prisma migrate deploy` + `TRUNCATE ... CASCADE` por suíte | 5 | 5 | 4 | 5 | **19** |
| B. Testcontainers | 5 | 4 | 3 | 3 | 15 |
| C. Schema separado no banco de dev | 4 | 2 | 4 | 4 | 14 |

Vencedora **A**: mesma imagem do compose existente, sem dependência nova, sem risco ao banco de dev. B adiciona lib e tempo de boot. C mistura dados com o banco local.

**Bloco 3 — Paridade do bootstrap nos e2e**
Decisão: extrair `configureApp(app)` (CORS, body limit, `ValidationPipe`, `AllExceptionsFilter`) de `main.ts` para `src/bootstrap/configure-app.ts`, usado por `main.ts` e pelos e2e. Descartado duplicar a config nos testes (diverge com o tempo). Refactor no-op, commit próprio.

**Bloco 4 — Telas de debug**
Decisão: guarda dupla — `design-system.tsx` retorna `<Redirect href="/" />` quando `!__DEV__`; `_layout.tsx` monta `Stack.Screen design-system` e `<DebugStatePanel />` só em `__DEV__`. Descartado remover a rota (perde a ferramenta de dev da AV2) e descartado só esconder o painel (a rota continuaria acessível por deep link).

**Validações:** regras de negócio continuam em services/guards; e2e não altera produção; tudo reversível por commit; nenhum contrato de API muda.

---

## FASE 4 — Execution Planning

Branch única `fix/ReleaseDoD` → 1 PR para `main` (merge commit).

| # | Item | Arquivos | Commits previstos | Verificação |
|---|---|---|---|---|
| 1 | Plano | `tasks/release-dod.md` | `📚 docs(tasks): add release dod plan` | arquivo existe |
| 2 | Hooks do MediaViewer: hooks antes do `return null`; `useVideoPlayer(isVideo ? url : null, ...)`; deps do efeito completas | `MediaViewer.tsx:21-45` | `🐛 fix(components): call media hooks unconditionally` | `npx expo lint` sem erro no arquivo; vídeo local da Meditação toca/pausa |
| 3 | BreathingExercises: `Animated.Value` via `useState(() => ...)`; countdown definido em `handleStart`/`handleSelectTech` e na virada de fase do intervalo | `BreathingExercises/index.tsx:46-108` | `🐛 fix(mental-health): stabilize breathing timer state` | lint sem erro; ciclo 4-7-8 conta 4→1, 7→1, 8→1 e repete |
| 4 | Aspas escapadas (`&quot;`/`“ ”`) nas 8 telas/componentes | Nutrition, AccountConfigurations, Calendar, Treatment, RecoverPassword, SoftLoginModal, CancelButton, SearchBar | `👌 style(screens): escape quotes in jsx text` | `npx expo lint` → 0 erros; texto renderizado idêntico |
| 5 | Guardas `__DEV__` (Bloco 4) | `_layout.tsx:16,60,64`; `src/app/design-system.tsx` | `🐛 fix(navigation): hide debug tools in release` | `npx expo export --platform android` (sem dev) não inclui o painel; leitura do bundle/guarda |
| 6 | `app.config.ts` + placeholders no `eas.json` + `console.error` no fallback (Bloco 1) | `apps/mobile/app.config.ts` (novo, estende `app.json`); `eas.json:21-44`; `resolveApiBaseUrl.ts:41-42` | `🔧 chore(mobile): require api url in release` | `APP_ENV=preview npx expo config` falha; com `EXPO_PUBLIC_API_URL=https://x.dev` passa; `APP_ENV=development` passa sem URL |
| 7 | Hardening do backend: `configureApp` extraído (refactor); `bootstrap().catch` com exit 1; `PSEUDONYM_KEY` obrigatória e ≠ `JWT_SECRET` em produção; fallback só fora de produção; PDF com `reject` e `chunk: Buffer` | `src/main.ts`; `src/bootstrap/configure-app.ts` (novo); `pseudonym.util.ts:8-10`; `daily-logs-report.service.ts:16-21` | `♻️ refactor(backend): extract app configuration` · `🐛 fix(backend): fail fast on boot errors` · `🐛 fix(personal): reject failed pdf report` | `npm run lint` sem esses avisos; `npm test` verde; `NODE_ENV=production` sem chave → erro no boot |
| 8 | Infra de e2e (Bloco 2): `docker-compose.test.yml`, `.env.test.example`, `jest-e2e.json` com `moduleNameMapper` + `globalSetup` + `runInBand`, helpers (app, usuário via Prisma, token, truncate); remover scaffold "Hello World" | raiz; `apps/backend/test/` | `🧪 test(backend): add e2e database harness` | `docker compose -f docker-compose.test.yml up -d` + `npm run test:e2e` roda suíte vazia verde |
| 9 | Suítes e2e: `consent.e2e-spec.ts` (aceite 5), `account-deletion.e2e-spec.ts` (aceite 13), `account-suspension.e2e-spec.ts` (aceite 14) | `apps/backend/test/` | `🧪 test(consent): prove consent gate e2e` · `🧪 test(user): prove account deletion e2e` · `🧪 test(auth): prove account suspension e2e` | `npm run test:e2e` verde; cada aceite da Fase 1 com asserção explícita |
| 10 | Deploy agnóstico + docs: compose prod com todas as variáveis (`${VAR:?}` para `JWT_SECRET`, `PSEUDONYM_KEY`, `CORS_ORIGINS`), healthcheck com `$POSTGRES_USER`; `.env.example` + `AI_MASTER_PROMPT`; `.env.prod.example` na raiz; `docs/release/deploy-checklist.md`; README do backend com `test:e2e`; log de execução neste plano | `docker-compose.prod.yml`; `apps/backend/.env.example`; `.env.prod.example`; `docs/release/` | `🔧 chore(infra): complete production compose env` · `📚 docs(release): add deploy checklist` · `📚 docs(tasks): log release dod` | `docker compose -f docker-compose.prod.yml config` sem `PSEUDONYM_KEY` falha; diff de variáveis `process.env` × `.env.example` vazio |

Ordem: 2–5 (mobile, independentes) → 6 → 7 (refactor antes do e2e) → 8 → 9 → 10. Ao final: `git diff --stat main -- apps/web` vazio, `git diff main -- '*.tsx' | grep StyleSheet.create` sem linhas alteradas em arquivos existentes, PR único para `main`.

---

## FASE 5 — Verificação do Plano

- [x] Regras de negócio permanecem em guards/services; e2e só observa
- [x] Sem acoplamento novo: `configureApp` é usado por `main.ts` e testes, sem dependência reversa
- [x] Critérios de aceite objetivos, com comando de verificação por item
- [x] Checklist com 10 itens
- [x] 3 abordagens avaliadas nos blocos 1 e 2; uma escolhida por bloco, com justificativa
- [x] Evidências em 7 linhas, cada uma com arquivo:linha
- [x] Sem perguntas bloqueadoras (respondidas em 2026-11-17)

**Gate = Livre para execução** (após aprovação do usuário).

---

## Histórico de execução

### 2026-11-17 — `/exec` (branch `fix/ReleaseDoD`, 17 commits)

**Stage de Execução — Entregáveis**

| # | Entregável | Caminho | Status |
|---|---|---|---|
| 1 | Plano | `tasks/release-dod.md` | ✅ |
| 2 | Hooks do MediaViewer incondicionais; fonte `null` quando não é vídeo | `apps/mobile/src/components/ui/Media/MediaViewer.tsx` | ✅ |
| 3 | `Animated.Value` via `useState`; countdown definido no start e na virada de fase | `apps/mobile/src/app/(Home)/MentalHealth/BreathingExercises/index.tsx` | ✅ |
| 4 | Aspas escapadas | `apps/mobile/src/app/(Home)/Oncology/Nutrition/index.tsx` | ✅ (desvio 1) |
| 5 | `/design-system` → `Redirect` fora de dev; `Stack.Screen` e `DebugStatePanel` só em `__DEV__` | `apps/mobile/src/app/design-system.tsx`, `_layout.tsx` | ✅ |
| 6 | `app.config.ts` valida URL em `preview`/`production`; placeholder `.invalid` no `eas.json`; `console.error` no fallback | `apps/mobile/app.config.ts`, `eas.json`, `src/services/resolveApiBaseUrl.ts` | ✅ |
| 7a | `configureApp` extraído (no-op) | `apps/backend/src/bootstrap/configure-app.ts`, `src/main.ts` | ✅ |
| 7b | `bootstrap().catch` → exit 1; `PSEUDONYM_KEY` obrigatória e ≠ `JWT_SECRET` em produção; sem fallback em produção | `src/main.ts`, `src/shared/utils/pseudonym.util.ts` | ✅ |
| 7c | PDF rejeita em erro; `chunk: Buffer` | `src/personal/daily-logs/daily-logs-report.service.ts` | ✅ |
| 8a | **Migration retroativa** da tabela `user_deletion_logs` | `apps/backend/prisma/migrations/20260424000001_add_user_deletion_logs/` | ✅ (desvio 2) |
| 8b | Harness e2e: Postgres 5433 descartável, `e2e.env`, guarda `_test`, `globalSetup` com `migrate deploy`, helpers, `--runInBand` | `docker-compose.test.yml`, `apps/backend/test/*`, `package.json` | ✅ |
| 9 | Suítes: consentimento (8), exclusão (4), suspensão (4) + fumaça (3) | `apps/backend/test/*.e2e-spec.ts` | ✅ |
| 10a | Compose prod: `${VAR:?}` em `POSTGRES_PASSWORD`/`JWT_SECRET`/`PSEUDONYM_KEY`, 5 variáveis novas, healthcheck parametrizado, `AI_MASTER_PROMPT` removida | `docker-compose.prod.yml`, `apps/backend/.env.example` | ✅ (desvios 3 e 4) |
| 10b | Checklist de deploy + README do e2e | `docs/release/06-deploy-checklist.md`, `apps/backend/README.md` | ✅ |

**Desvios do plano**
1. Item 4: só `Nutrition` tinha erro de `no-unescaped-entities`; os outros 7 arquivos listados tinham apenas avisos. Commit com scope `oncology`.
2. Item 8 (achado): em banco novo `prisma migrate deploy` falhava em `20261116020000_account_lifecycle` — o model `UserDeletionLog` entrou no schema (`a4ae244`) sem migration (tabela criada por `db push` no banco local). **O container de produção não subiria.** Corrigido com migration retroativa `CREATE TABLE IF NOT EXISTS` (no-op em bancos que já têm a tabela).
3. Item 10: `CORS_ORIGINS` ficou opcional (vazio) no compose, não `${VAR:?}`: vazio em produção já nega todas as origens (`configure-app.ts`) e o app nativo não usa CORS.
4. Item 10: `AI_MASTER_PROMPT` não é lido por nenhum `.ts` (só citado em `PROMPT_REFACTOR_PLAN.md`); removido do compose em vez de adicionado ao `.env.example`. Total real: 16 variáveis.
5. Rota do mascote é `POST /ai-support/ask` (o plano dizia `/mascot/ask`).
6. `.env.prod.example` na raiz não foi criado: o `.gitignore` da raiz ignora `.env.*`. O modelo ficou no checklist (seção 1).

**Pendência aberta (decisão do usuário)**
- `prisma migrate diff --from-migrations … --to-schema-datamodel …` ainda mostra drift: as migrations criam `Comment`, `Post`, `Topic`, `Community` (Área Social, removida do escopo), ausentes no schema e no banco local. A migration `DROP TABLE IF EXISTS … CASCADE` foi bloqueada pelo classificador de ações destrutivas e aguarda aprovação. Sem ela, um banco novo nasce com 4 tabelas órfãs vazias (não quebra o deploy).

**Stage de Execução — Validação**

| Critério | Resultado | Observação |
|---|---|---|
| 1. `expo lint` 0 erros; `tsc` mobile e backend | ✅ | mobile: 0 erros / 15 avisos; `tsc` exit 0 nos dois |
| 2. `npm test` e `npm run test:e2e` | ✅ | unit 50/50; e2e 4 suítes, 19/19 contra Postgres 15 descartável |
| 2a. Aceite 5 (403 `CONSENT_REQUIRED` por finalidade) | ✅ | diário e tratamentos (GET/POST) → `HEALTH_DATA`; `/ai-support/ask` → `AI_MASCOT`; revogação bloqueia e preserva histórico/dados |
| 2b. Aceite 13 (exclusão total) | ✅ | 0 linhas em user, diário, tratamentos, consentimentos, refresh tokens, conversas do mascote e auditoria com id cru; log pseudonimizado sem e-mail/nome; senha errada → 403 sem apagar |
| 2c. Aceite 14 (suspensão) | ✅ | 403 `ACCOUNT_SUSPENDED`, refresh revogado (401), dados intactos, reativação devolve acesso e diário; resposta de login sem `password` |
| 3. Debug inacessível em release | ✅ | `expo export --no-bytecode`: `design-system` reduzido a `Redirect href="/"`; `Stack.Screen` ausente |
| 4. Release não resolve para localhost | ✅ | `expo config` falha com placeholder, sem URL e com localhost; passa com URL real e em `development` |
| 5. `.env.example` e compose completos; checklist | ✅ | 16/16 variáveis; compose sem segredos → exit 1; checklist cobre migrate, seed, secrets, CORS, SMTP, rollback |
| 6. `apps/web` intocado; nenhum `StyleSheet.create` existente alterado | ✅ | ambos os diffs vazios |
| 7. Boot com falha → exit ≠ 0; PDF rejeita | ✅ | produção sem `PSEUDONYM_KEY` → exit 1; `doc.on('error', reject)` |
| Lint backend | ✅ | 0 erros; 8 avisos restantes só em `*.spec.ts` (mocks, fora de escopo) |
