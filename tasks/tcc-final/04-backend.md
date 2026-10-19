# 04 — Backend: Auditoria de Arquitetura e Finalização

> Stack verificada (`apps/backend/package.json`): NestJS 11, Prisma 6.19, class-validator 0.14, @nestjs/throttler 6, @nestjs/swagger 11, openai SDK 6 (apontando para Groq), bcrypt 6, pdfkit.

## FASE 1 — Escopo

**Objetivo:** API segura, testável e implantável que atenda todos os RFs dependentes de servidor e forneça os endpoints admin do painel web.

**Escopo:** segurança (auth/roles/PII), infra (Docker, CORS, Jest, throttle, env), novos módulos (genres, audit, emergency-dial-log, awareness-months, daily-messages, mascot-config), ajustes de schema (User.status, lockout, Treatment), LGPD/criptografia.
**Não-escopo:** refresh token rotativo (manter JWT 7d; documentar), push remoto, fórum.

**Critérios de aceite**
1. Requisição anônima a qualquer `POST/PATCH/DELETE` de conteúdo → 401; autenticado não-ADMIN → 403 (teste e2e).
2. Nenhuma resposta da API contém o campo `password` (teste e2e em `/auth/login`, `/users/:id`).
3. `npm test` executa 16/16 suítes; `npm run test:e2e` cobre auth, roles, ownership.
4. `docker compose -f docker-compose.prod.yml up --build` sobe, aplica migrations e responde `GET /api`.
5. Swagger documenta todas as rotas com `@ApiBearerAuth` e tags.
6. Cada CRUD admin grava linha em `AuditLog` (quem, o quê, quando, payload resumido).

## FASE 2 — Evidências

| Arquivo | Âncora | Fato |
|---|---|---|
| `src/media/books/books.controller.ts` | 20–56 | Sem `@UseGuards` em escrita (idem movies/series/leisures) |
| `src/auth/auth.service.ts` | `login()` | `return { access_token, user: user }` (inclui hash) |
| `src/user/user.controller.ts` | 23 | `GET /users` sem role ADMIN |
| `src/main.ts` | `bootstrap()` | Sem `enableCors`; `ValidationPipe` sem `whitelist` |
| `src/app.module.ts` | `ThrottlerModule.forRoot` | 10 req/min global |
| `Dockerfile` | `CMD` | `node dist/main` ≠ `dist/src/main.js`; prisma CLI ausente no runner |
| `prisma/schema/schema.prisma` | `User`, `Treatment`, `DailyMessage` | Sem status/lockout; Treatment sem startDate/hospitalContact; DailyMessage VarChar(25) |

## FASE 3 — Decisões

**Bloco 1 — Autorização por papel**
| Opção | Prós | Contras |
|---|---|---|
| A. `@Roles()` + `RolesGuard` global (APP_GUARD) com `@Public()` | Seguro por padrão | Exige marcar rotas públicas |
| B. `@UseGuards(JwtAuthGuard, RolesGuard)` por rota | Explícito | Fácil esquecer (é o bug atual) |
| C. Prefixo `/admin/*` com controllers separados | Separação clara web×mobile | Duplica controllers |

**Escolha: A** — "seguro por padrão" elimina a classe de bug encontrada. GETs públicos de conteúdo recebem `@Public()`. C descartada por duplicação; B é o estado atual que falhou.

**Bloco 2 — Auditoria (RNF16)**
Escolha: tabela única `AuditLog { id, actorId, action, entity, entityId, diff Json, createdAt }` + `AuditService.record()` chamado nos services (não interceptor — interceptor não conhece o diff). Descartado: triggers no Postgres (fora do ORM, difícil de testar).

**Bloco 3 — Exclusão de usuário (RF-003 × RNF08 × LGPD)**
Escolha: `User.status` (`ACTIVE | DEACTIVATED | SUSPENDED | CANCELLED`) para desativação; endpoint separado `DELETE /users/me/data` para exclusão LGPD total (mantém `UserDeletionLog` atual). Login recusa status ≠ ACTIVE.

**Bloco 4 — Criptografia do diário (RS002, decisão D4)**
Escolha: AES-256-GCM na camada repository (`content` cifrado, chave em `DIARY_ENC_KEY`). Busca por conteúdo passa a ser feita após decifrar no service (volume por usuário é pequeno). Descartado: `pgcrypto` (chave trafega em SQL).

## FASE 4 — Checklist de execução

Branches e commits por fase (1 commit = 1 mudança lógica):

**B1 — Segurança crítica** · branch `fix/backend-security-hardening`
1. [ ] `UserMapper` em todas as respostas de auth/user; remover `password` — `🐛 fix(auth): strip password from responses` · *verif.: e2e sem campo password*
2. [ ] `RolesGuard` + decorators `@Roles`/`@Public`, registrados como APP_GUARD junto do JWT; aplicar ADMIN em escrita de books/movies/series/leisures e em `GET /users` — `✨ feat(auth): add global roles guard` · *verif.: e2e 401/403*
3. [ ] `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` — `🐛 fix(auth): reject unknown payload fields` · *verif.: payload com campo extra → 400*
4. [ ] Política de senha forte no `RegisterDto`/`ChangePasswordDto`/`ResetPasswordDto` (regex: maiúscula, minúscula, número, especial, ≥ 6) — `✨ feat(auth): enforce strong password policy`
5. [ ] Lockout: colunas `failedLoginAttempts`, `lockedUntil`; bloquear 15 min após 5 falhas (RS001) + migration — `✨ feat(auth): lock account after failed logins`

**B2 — Infra** · branch `chore/backend-infra-fixes`
6. [ ] Alinhar `@nestjs/testing` (hoje `^10.4.22`, major diferente do Nest `^11.1.18`) para `^11`; Jest `moduleNameMapper` (`^src/(.*)$`, `^common/(.*)$`) e corrigir o teste que falha — `🧪 test(backend): fix module path mapping` · *verif.: 16/16 suítes*
7. [ ] `enableCors({ origin: CORS_ORIGINS.split(',') })`; throttle default 100/min mantendo limites estritos em auth/mascot — `🔧 chore(backend): enable cors and tune throttle`
8. [ ] Dockerfile: `CMD node dist/src/main` (ou ajustar `sourceRoot`/`tsconfig.build` para gerar `dist/main`), `prisma` em `dependencies`, script `start:prod` coerente, `HEALTHCHECK`; endpoint `GET /health` — `🐛 fix(ci): repair production docker image` · *verif.: compose prod sobe*
9. [ ] (logs estruturados, request id e health checks ficam no plano 09 itens 1–2) Validação de env na inicialização (`@nestjs/config` + schema: DATABASE_URL, JWT_SECRET, CORS_ORIGINS, GROQ_API_KEY opcional, SMTP_*) e `.env.example` atualizado — `🔧 chore(backend): validate env on boot`

**B3 — Endpoints admin e novos módulos de conteúdo** · branch `feat/backend-admin-content`
10. [ ] Módulo `genres` (CRUD admin + `GET /genres?type=`) — `✨ feat(media): add genres crud`
11. [ ] Busca/filtro/paginação em books/movies/series/leisures (`?q=&genreId=&year=&status=&page=`) e `includeInactive` para admin; `POST /books/:id/visit` (contador eduCAPES) — `✨ feat(media): add search and pagination`
12. [ ] `image_path` aceitar URL absoluta (`@IsUrl` ou caminho relativo legado) — `✨ feat(media): accept remote cover urls`
13. [ ] Módulo `awareness-months` (mês, título, subtítulo, cor, emoji, status) + seed com os 6 meses hoje hardcoded no mobile — `✨ feat(personal): add awareness months module`
14. [ ] Módulo `daily-messages` (ampliar VarChar para 255; segmentação por role PATIENT/CAREGIVER; `GET /daily-messages/today`) + seed a partir de `mobile/src/constants/Mocks/mockDailyMessages.ts` — `✨ feat(personal): expose daily messages`
15. [ ] Módulo `emergency-dial-logs`: `POST` (userId opcional — rota pública, RF-013 não exige login), `GET` admin com filtros — `✨ feat(personal): log emergency dial events`
16. [ ] `mascot-config` (RF-025): tabela `MascotConfig` versionada (`masterPrompt`, `personality`, `status`, `version`, `updatedBy`); `PromptLoaderService` usa versão ativa do banco com fallback para os `.md` atuais; endpoints admin GET/POST/PATCH status; se inativo → `/ai-support/ask` responde 503 amigável — `✨ feat(mascot): manage config from database`
17. [ ] Endpoints admin de usuários: `GET /users?q=&role=&status=`, `PATCH /users/:id/status`, `POST /users/admin` (criar ADMIN, RF-001 regra 4) — `✨ feat(user): add admin user management`
18. [ ] ~~`GET /admin/stats`~~ → **movido para o plano 09** (endpoints `/admin/kpis/*` e `/admin/api-health`)

**B4 — Dados, LGPD, auditoria** · branch `feat/backend-audit-lgpd`
19. [ ] ~~`AuditLog` + `AuditService`~~ → **movido para o plano 09** (bloco A, itens 4–5 e 8)
20. [ ] `User.status` + login bloqueia não-ACTIVE; `DELETE /users/:id` vira desativação; `DELETE /users/me/data` exclusão LGPD — `✨ feat(user): soft delete with status`
21. [ ] ~~`User.consentAcceptedAt`~~ → **substituído pelo plano 10** (`ConsentRecord` por finalidade + `ConsentGuard`)
22. [ ] Treatment: `startDate` (DateTime), `hospitalContact`, `status` enum (`ACTIVE|FINISHED|CANCELLED`), tabela `TreatmentEndDateHistory` (RF-020 obs. 1); `GET /personal/treatments/progress` com dias cumpridos/restantes calculados no servidor (RF-023) — `✨ feat(personal): extend treatment model`
23. [ ] Criptografia AES-256-GCM em `DailyLog.content` + migration de dados existente (script idempotente) — `✨ feat(personal): encrypt diary content at rest`
24. [ ] Upload de foto de perfil: validar mime (png/jpeg/avif/webp) e tamanho ≤ 2 MB (RF-002) — `🐛 fix(user): validate profile picture`

**B5 — Qualidade** · branch `test/backend-e2e`
25. [ ] e2e (supertest) para auth, roles, ownership, lockout, dial-log; unit dos novos services — `🧪 test(backend): add e2e security suite`
26. [ ] Swagger: tags, `@ApiBearerAuth`, DTOs de resposta; remover dead code (`media/movies/entities`, `media/series/entities`, DTOs de movie/series dentro de `books/dto`) — `♻️ refactor(media): remove dead entities` + `📚 docs(backend): complete swagger annotations`
27. [ ] Atualizar `apps/postman` com as novas rotas — `🧪 test(postman): update collection`

> Agrupamento ≤ 10 itens por fase respeitado; total do plano > 10 porque cobre 5 sub-branches independentes.

## FASE 5 — Verificação

- [x] Autorização no servidor (RS002), cálculos de tratamento no servidor
- [x] Novos módulos isolados (um por domínio), sem dependência circular prevista (Audit é provider compartilhado)
- [x] Critérios objetivos (status HTTP, contagem de suítes, compose up)
- [x] 3 opções avaliadas no bloco principal, 1 escolhida
- [x] Evidências ≤ 7
- [x] Pendências: D4 (criptografia) — default definido

**Gate = Livre para execução** (B1 e B2 podem começar imediatamente).

**Confiança: MEDIUM** no item 8 — preciso rodar `nest build` limpo para confirmar se aliases `src/*`/`common/*` são reescritos no JS emitido (se não forem, adicionar `tsconfig-paths` em runtime ou converter para imports relativos).
