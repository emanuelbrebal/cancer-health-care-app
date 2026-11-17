# 02 — Varredura DevSecOps (mobile + backend + shared + raiz + histórico git)

> Persona: engenheiro DevSecOps sênior (NestJS/Prisma, RN/Expo, LGPD saúde) · 2026-11-16 · branch `fix/ReleaseSecurityHardening` · somente leitura.
> Nenhum valor de secret, senha ou dado pessoal é reproduzido aqui: só local, tipo e ação.
> Método: leitura de código, `git ls-files`, `git log --all -p -G/-S` (364 commits, todas as branches locais e remotas + 4 commits dangling), `npm audit --json` (npm 11.16.0). `gitleaks`/`trufflehog` não instalados.

## Resumo

| Gravidade | Qtde | IDs |
|---|---|---|
| Crítica | 3 | B1, B2, B3 |
| Alta | 12 | S2, S3, B4, B5, B6, B7, B8, M1, M2, C1, C2, L1 |
| Média | 14 | S6, S7, B9, B10, B11, B12, B13, B14, B15, M3, M4, M5, C3, L2 |
| Baixa | 16 | S4, S5, S8, S9, B16, B17, B18, M6, M7, M8, M9, C4, C5, C6, C7, L3 |

- **Secret real no histórico: não encontrado.** Nenhum `.env`, keystore, `.pem/.p8/.p12/.jks`, `google-services.json` ou service account jamais foi commitado (únicos arquivos sensíveis por nome no histórico: `.npmrc`, `apps/backend/.env.example`, `apps/mobile/.env.example`).
- O que existe versionado são **credenciais padrão conhecidas** (S2, S3) e um **e-mail pessoal** (S4).
- Confiança: MÉDIA na ausência de secrets — a busca cobre padrões (Groq `gsk_`, `sk-`, AWS, Google `AIza`, GitHub, Slack, SendGrid, Expo, Postman, PEM, JWT, URL com credencial, connection string, atribuições literais de `secret/apiKey/password/token`), não entropia genérica. Rodar `gitleaks detect --log-opts="--all"` antes de tornar o repositório público.

---

## 1. Secrets e informação sensível

| ID | Achado | Onde | Gravidade | Correção |
|---|---|---|---|---|
| S1 | Sem secret real em arquivos rastreados nem no histórico; únicos hits de connection string são placeholders de dev | `apps/backend/.env.example:1` (commits `42cc81e`, `c155fd6`); `docker-compose.prod.yml:27` (`b3f3481`, só interpolação) | Info | Nenhuma |
| S2 | `JWT_SECRET` do `.env.example` é uma frase-exemplo pública e o `.env` local usa **o mesmo valor**; o boot só falha se a variável estiver vazia, não se for o exemplo | `apps/backend/.env.example:2`; `src/auth/auth.module.ts:17-23`; `src/auth/strategies/jwt.strategy.ts:8-13` | Alta | Trocar o exemplo por valor vazio + instrução (`openssl rand -base64 48`); recusar boot se `JWT_SECRET` < 32 chars ou igual ao exemplo; gerar segredo novo para qualquer ambiente já usado (invalida tokens emitidos) |
| S3 | Seed cria 3 usuários, **um ADMIN**, com a mesma senha padrão; a senha está em claro no código, é impressa no console e documentada; não há trava por `NODE_ENV` | `apps/backend/prisma/seed.ts:29,33-35,38,441-443`; `tasks/test-users.md:3,7-9`; `apps/mobile/scripts/capture-screens.mjs:11-12`; `apps/mobile/scripts/smoke-flow.mjs:5` | Alta | Seed de usuários só com `NODE_ENV !== 'production'`; ADMIN de produção criado por variável (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) ou script interativo; tirar a senha dos `.md`/scripts (usar `CAPTURE_PASSWORD` obrigatória); trocar a senha de qualquer banco que já rodou o seed |
| S4 | E-mail pessoal (Apple ID) versionado | `apps/mobile/eas.json:54` (entrou em `1adb84e`, permanece no histórico) | Baixa | Remover do arquivo e passar por `eas submit --apple-id` / variável; reescrever histórico só se o repo for virar público |
| S5 | Senha literal de Postgres (dev) e porta 5432 publicada em todas as interfaces | `docker-compose.yml:8,10-11` | Baixa | `127.0.0.1:5432:5432`; senha via `.env` do compose |
| S6 | `docker-compose.prod.yml` aceita **senha padrão** de Postgres por fallback `:-`; `JWT_SECRET` sem `:?` (vazio só é barrado no boot do Nest) | `docker-compose.prod.yml:8,27,28` | Média | Usar `${POSTGRES_PASSWORD:?obrigatória}` e `${JWT_SECRET:?obrigatória}`; sem defaults para segredos |
| S7 | `eas.json` aponta para `./google-service-account.json` e nenhum `.gitignore` cobre esse nome (arquivo ainda não existe) | `apps/mobile/eas.json:50`; `apps/mobile/.gitignore`; `.gitignore:23-31` | Média | Adicionar `google-service-account*.json`, `google-services.json`, `GoogleService-Info.plist`, `*.jks`, `*.keystore` ao `.gitignore` raiz antes de criar o arquivo |
| S8 | Identificadores de conta versionados (EAS `projectId` + `owner`; id do workspace Postman); pasta `.expo/` rastreada apesar de ignorada | `app.json:5,8`; `apps/.postman/config.json:3`; `.expo/README.md`, `.expo/devices.json` | Baixa | Não são segredos; `git rm --cached -r .expo`; avaliar mover `owner` para variável |
| S9 | README afirma que o token JWT fica em `expo-secure-store`; o código usa AsyncStorage (ver M1) | `README.md:49` | Baixa | Corrigir após M1 |
| — | Collection Postman: **não existe no repo** (só `globals` vazio) — nada a vazar | `apps/postman/globals/workspace.postman_globals.json` | Info | Ao criar a collection (item 9 do plano), usar variáveis `{{token}}`, nunca valor |
| — | `apps/backend/.env` local (não versionado, nunca commitado): chaves presentes `DATABASE_URL, JWT_SECRET, NODE_ENV, PORT, GROQ_API_KEY, SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM`. SMTP está com os placeholders do exemplo (e-mail de reset não envia); `GROQ_API_KEY` é a única chave real | local | Info | Rotacionar a chave Groq apenas se o arquivo tiver sido compartilhado fora da máquina |

---

## 2. Backend — configuração e código

### 2.1 Tabela de rotas (todas)

Throttle global: 10 req/min por IP (`app.module.ts:32-37`). "Dono" = serviço compara `userId` do recurso com o do token.

| Método | Caminho | Guard | Role exigida | Checagem de dono | Situação |
|---|---|---|---|---|---|
| GET | `/` | — | — | — | pública (ok) |
| GET | `/api`, `/api-json` (Swagger) | — | — | — | **pública em qualquer ambiente** |
| POST | `/auth/register` | throttle 3/min | — | — | pública (ok); role limitada a PATIENT/CAREGIVER |
| POST | `/auth/login` | throttle 5/min | — | — | pública (ok) |
| PATCH | `/auth/change-password` | JWT | — | próprio token | ok |
| POST | `/auth/forgot-password` | throttle 3/min | — | — | pública; devolve `debug_token` fora de produção (B4) |
| POST | `/auth/reset-password` | só throttle global | — | token JWT | pública (B5) |
| GET | `/users` | JWT | **nenhuma** | **não** | **desprotegida (B2)** |
| GET | `/users/:id` | JWT | **nenhuma** | **não** | **desprotegida (B2)** |
| PATCH | `/users/:id` | JWT | dono ou ADMIN | sim (controller) | mass assignment (B3) |
| DELETE | `/users/:id` | JWT | dono ou ADMIN | sim (controller) | ok na autorização; ver B14 |
| GET | `/books`, `/books/:id` | — | — | — | pública (ok, catálogo) |
| POST / PATCH / DELETE | `/books`, `/books/:id` | **—** | **—** | — | **desprotegida (B1)** |
| GET | `/movies`, `/movies/:id` | — | — | — | pública (ok) |
| POST / PATCH / DELETE | `/movies`, `/movies/:id` | **—** | **—** | — | **desprotegida (B1)** |
| GET | `/series`, `/series/:id` | — | — | — | pública (ok) |
| POST / PATCH / DELETE | `/series`, `/series/:id` | **—** | **—** | — | **desprotegida (B1)** |
| GET | `/leisures`, `/leisures/:id` | — | — | — | pública (ok) |
| POST / PATCH / DELETE | `/leisures`, `/leisures/:id` | **—** | **—** | — | **desprotegida (B1)** |
| POST | `/daily-logs` | JWT | — | userId do token | ok |
| GET | `/daily-logs`, `/daily-logs/search` | JWT | — | filtro por userId | ok |
| GET | `/daily-logs/report/pdf` | JWT + 2/min | — | filtro por userId | ok (ver B17) |
| GET | `/daily-logs/:id` | JWT | — | sim | ok |
| PATCH | `/daily-logs/:id` | JWT | — | sim | mass assignment de `userId` (B3) |
| DELETE | `/daily-logs/:id` | JWT | — | sim | ok |
| POST / GET | `/personal/treatments` | JWT | — | userId do token | ok |
| GET / DELETE | `/personal/treatments/:id` | JWT | — | sim | ok |
| PATCH | `/personal/treatments/:id` | JWT | — | sim | mass assignment de `userId`/`status` (B3) |
| POST | `/ai-support/ask` | JWT + 10/min | — | userId do token | ok na autorização; ver B7, B8 |
| GET | `/ai-support/context` | JWT + 30/min | — | userId do token | ok |

Não existe `RolesGuard`; `ADMIN` só é verificado à mão em `user.controller.ts:42,51`. **14 rotas desprotegidas**: 12 escritas de catálogo + 2 leituras de usuários.

### 2.2 Achados

| ID | Achado | Onde | Gravidade | Correção |
|---|---|---|---|---|
| B1 | Anônimo cria, altera e remove livros, filmes, séries e lazer — inclusive `externalLink`/`eduCapesLink`/`image_path`, que o app abre com `Linking.openURL` (phishing contra pacientes) | `media/books/books.controller.ts:20,41,52`; `media/movies/movies.controller.ts:21,48,57`; `media/series/series.controller.ts:20,41,58`; `leisures/leisures.controller.ts:20,41,58` | Crítica | `JwtAuthGuard` + `RolesGuard` + `@Roles(ADMIN)` nas escritas |
| B2 | Qualquer conta (cadastro é aberto) lista até 500 usuários com e-mail, telefone, nascimento, papel (paciente oncológico/cuidador) e foto | `user/user.controller.ts:23-34`; `user/user.mapper.ts:5-15` | Crítica | `GET /users` só ADMIN; `GET /users/:id` dono ou ADMIN; DTO reduzido para listagem (sem foto/telefone) |
| B3 | `ValidationPipe` sem `whitelist`/`forbidNonWhitelisted`: campos fora do DTO chegam ao Prisma. `UpdateUserDto` não declara `role`, mas `PATCH /users/:id` com `role` promove a própria conta a ADMIN e com `password` grava senha sem hash. Mesmo padrão permite trocar `userId` de diário/tratamento e `status` | `main.ts:17`; `user/user.service.ts:37`; `user/user.repository.ts:21-23`; `personal/daily-logs/daily-logs.repository.ts:48-53`; `personal/treatments/treatments.repository.ts:8-11,25-28`; `leisures/leisures.repository.ts:8-14,30-35` | Crítica | `new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })`; repositórios montam `data` campo a campo; teste e2e "PATCH com role → 400". Confiança: ALTA por leitura de código (não executado) |
| B4 | `forgot-password` devolve o token de redefinição no corpo quando `NODE_ENV !== 'production'`: se a variável faltar no deploy, qualquer pessoa toma qualquer conta sabendo o e-mail | `auth/auth.service.ts:104-107`; consumido em `apps/mobile/src/services/auth.ts:23` | Alta | Remover `debug_token` (em dev, logar no console do servidor) |
| B5 | Token de reset é um JWT assinado com o mesmo segredo do access token: (a) é aceito como Bearer por `JwtStrategy` (não confere `purpose`); (b) é reutilizável durante 15 min; (c) redefinir/trocar senha não invalida sessões; (d) `reset-password` sem throttle próprio | `auth/auth.service.ts:95-98,110-129`; `auth/strategies/jwt.strategy.ts:21-23`; `auth/auth.controller.ts:57-61` | Alta | Token opaco aleatório com hash no banco, uso único e expiração; `JwtStrategy` rejeita payload com `purpose`; revogar sessões na troca; `@Throttle(3/min)` |
| B6 | JWT único de 7 dias, sem revogação; `role` vai no payload (rebaixar/excluir usuário só vale após expirar) | `auth/auth.module.ts:23`; `auth/auth.service.ts:59-62` | Alta | Item 4 do plano (access 15 min + refresh rotativo); validar existência/status do usuário no refresh |
| B7 | Mascote: `treatmentData` e `calendarData` são `any[]` vindos do cliente, sem validação de conteúdo nem tamanho (só 20 itens; corpo até 5 MB), serializados **dentro do system prompt**; `history` aceita turnos `assistant` forjados; `render()` encadeia `replace` (um valor pode conter outro `{{placeholder}}` ou `$&`) | `mascot/dto/ask-ai.ts:29-44`; `mascot/mascot.service.ts:166-176,319-332`; `mascot/prompt-loader.service.ts:45-53` | Alta | Backend monta o contexto a partir do banco (já existe `getUserContext`) e ignora o que vem do cliente; DTO aninhado com `MaxLength`; dados do usuário em mensagem separada delimitada, nunca no system; `replace` com função. Mitigação existente: resposta validada (280 chars, sem dosagem/markdown) |
| B8 | Dado sensível sai do país sem consentimento nem base legal registrada: nome, pronome, papel, idade, tratamentos, emoções de 7 dias, pergunta e 8 mensagens de histórico vão para a Groq | `mascot/mascot.service.ts:159-181`; `mascot/prompt/user-context.md:3-5` | Alta | Itens 5 e 7 do plano (`AI_MASCOT` + payload sem nome); ver seção 5 |
| B9 | CORS reflete qualquer origem quando `CORS_ORIGINS` não está definida (não está no `.env.example` nem no compose de produção) | `main.ts:12-14` | Média | Em produção, exigir lista explícita; default fechado |
| B10 | Swagger `/api` e `/api-json` públicos em qualquer ambiente (mapa completo das rotas desprotegidas) | `main.ts:29-30` | Média | Montar só com `NODE_ENV !== 'production'` |
| B11 | Sem `helmet`; sem `trust proxy` (atrás de proxy todos os usuários dividem o mesmo IP no throttle); limite global 10/min gera 429 em uso normal; `ThrottlerGuard` aplicado duas vezes no mascote | `main.ts`; `app.module.ts:32-37`; `mascot/mascot.controller.ts:19,26` | Média | `helmet()`; `app.set('trust proxy', 1)` conforme a infra; global ~100/min com limites estritos por rota; tirar o guard duplicado |
| B12 | Logs com dado pessoal: e-mail do usuário no log de envio; filtro global loga a URL completa (inclui `?term=` da busca no diário) e o objeto de exceção | `mailer/mailer.service.ts:45,47`; `common/filters/http-exception.filter.ts:27` | Média | Logar `userId` pseudonimizado; logar `request.path` sem query; para 4xx só status + mensagem |
| B13 | Foto de perfil é base64 (até 2.000.000 chars) em coluna `String`, devolvida no login e em cada item de `GET /users` (resposta de centenas de MB); limite de corpo de 5 MB vale para todas as rotas, inclusive públicas; não se valida que é imagem | `user/dto/update-user.dto.ts:31-34`; `user/user.mapper.ts:13`; `main.ts:15-16` | Média | 5 MB só na rota de perfil (demais 100 kb); validar prefixo `data:image/(jpeg|png|webp);base64,`; tirar a foto das listagens; ideal: armazenamento de objetos |
| B14 | Exclusão de conta não é transacional: grava `UserDeletionLog` (e-mail + nome) e depois o `delete` falha por FK `RESTRICT` de `DailyLog` → usuário continua existindo e o log fica; `PatientSupportLog` e `DailyLogAudit` nunca são apagados | `user/user.service.ts:40-51`; `prisma/schema/schema.prisma:65-75,210,215-233` | Média | Item 7 do plano (`$transaction`, cascade, log sem identificador direto) |
| B15 | Senha mínima de 6 caracteres, sem complexidade nem lista de senhas comuns | `auth/dto/register.dto.ts:30`; `reset-password.dto.ts:8`; `change-password.dto.ts:8` | Média | Mínimo 8–10 + bloqueio de senhas triviais; manter mensagem única |
| B16 | Enumeração de contas: cadastro responde 409 "E-mail já cadastrado"; login não roda bcrypt quando o usuário não existe (diferença de tempo) | `auth/auth.service.ts:28,49-51` | Baixa | Aceitável com throttle; opcional: comparar contra hash fictício |
| B17 | PDF: `start`/`end` sem validação (data inválida → 500), período ilimitado, `userId` no nome do arquivo. Sem injeção: pdfkit recebe texto puro, sem HTML | `personal/daily-logs/daily-logs.controller.ts:52-68`; `daily-logs-report.service.ts:71-78` | Baixa | DTO de query com `IsDateString` e teto de 1 ano; nome de arquivo sem id |
| B18 | Campos sem `MaxLength` (`name` no cadastro vs `VarChar(50)` → 500; campos de tratamento; itens de `emotes`) | `auth/dto/register.dto.ts:20-22`; `personal/treatments/dto/create-treatment.dto.ts:10-38`; `personal/daily-logs/dto/create-daily-log.dto.ts:21-23` | Baixa | `MaxLength` + `IsString({ each: true })` + `ArrayMaxSize` |

Verificado e sem problema: hash de senha nunca sai nas respostas (`UserMapper`); filtro global não devolve stack ao cliente; nenhuma query raw (`$queryRaw`/`$executeRaw` ausentes); cadastro não aceita `ADMIN`; `forgot-password` responde de forma genérica; diário e tratamentos checam dono.

---

## 3. Mobile

| ID | Achado | Onde | Gravidade | Correção |
|---|---|---|---|---|
| M1 | Token JWT de 7 dias e objeto `user` (e-mail, telefone, nascimento, foto base64) em AsyncStorage, texto puro; `expo-secure-store` instalado e sem uso | `apps/mobile/src/store/useAuthStore.ts:12-15`; `packages/shared/store/useAuthStore.ts:30-33` | Alta | Item 4 do plano: tokens em SecureStore; persistir no store só o mínimo do perfil (`partialize`) |
| M2 | Dado de saúde em AsyncStorage, texto puro: tratamentos (nome, médico, contato, hospital), conversa com o mascote, histórico de notificações | `src/services/treatmentStorage.ts:3,32`; `src/app/(Home)/Mascot/Chat/index.tsx:25,109`; `src/services/notificationService.ts:5,150` | Alta | Reduzir o que fica local (servidor é a fonte); o que ficar, cifrar com chave guardada no SecureStore; apagar tudo na exclusão/suspensão |
| M3 | Logout não apaga a conversa do mascote (`oncomente:chat-history` e o contador não estão em `LOCAL_DATA_KEYS`): o próximo usuário do aparelho lê a conversa anterior | `src/store/useAuthStore.ts:5-10`; `src/app/(Home)/Mascot/Chat/index.tsx:25,122` | Média | Incluir as duas chaves (ou prefixar chaves por `userId` e limpar por prefixo) |
| M4 | URL da API sem exigência de HTTPS: fallback `http://localhost:3000`; perfil `production` do `eas.json` não define `EXPO_PUBLIC_API_URL`. `usesCleartextTraffic` não está habilitado (bom: Android release bloqueia HTTP) | `src/services/resolveApiBaseUrl.ts:21-43`; `apps/mobile/eas.json:34-45`; `apps/mobile/app.json` | Média | Fora de `__DEV__`, lançar erro se a URL não for `https://`; definir a variável no perfil de produção |
| M5 | Bloqueio de área autenticada só no `tabPress`: deep link `cancerhealthcareapp://PersonalArea/...` abre a tela sem sessão (API responde 401, mas dados locais de M2 aparecem); rota `design-system` e painel de simulação vão no bundle de produção | `src/app/(Home)/_layout.tsx:107,134`; `src/app/design-system.tsx`; `src/components/ds/DebugStatePanel.tsx` | Média | Guard por layout (`Redirect` quando `!isAuthenticated`) em `PersonalArea/_layout` e `Mascot/_layout`; `design-system` só em `__DEV__` |
| M6 | `Linking.openURL` com URL vinda da API sem allowlist de esquema (agrava B1) | `Oncology/Leisure/Books/[id].tsx:23`; `Movies/[id].tsx:71`; `Series/[id].tsx:74` | Baixa | Aceitar só `https:` |
| M7 | Nome do tratamento aparece na notificação (tela bloqueada) e é gravado na agenda do aparelho (sincroniza com conta Google/iCloud) | `src/services/notificationService.ts:78,117`; `PersonalArea/Treatment/create/index.tsx:40` | Baixa | Texto neutro por padrão ("Hora do seu cuidado") com opção de mostrar o nome; avisar no consentimento |
| M8 | `app.json` não declara nem bloqueia permissões: o manifesto final depende dos plugins (agenda, notificações, galeria) | `apps/mobile/app.json:17-24,30-53` | Baixa | Declarar `android.permissions` mínimo e `blockedPermissions` (`RECORD_AUDIO`, `CAMERA` se não usados). Confiança: LOW — manifesto mesclado não foi gerado (sem prebuild) |
| M9 | `@expo/ngrok` em `dependencies` (túnel de dev; advisory moderado sem correção) | `apps/mobile/package.json:14` | Baixa | Remover (ver relatório 03) |

Verificado e sem problema: nenhum `console.*` em `src/`; WebView só via `react-native-youtube-iframe` com `videoId` extraído por regex, sem `injectedJavaScript`; sem exceção de ATS no iOS; diário não é guardado localmente.

---

## 4. Cadeia de suprimentos

**`npm audit` (raiz, workspaces):** com dev — 4 críticas, 39 altas, 48 moderadas, 2 baixas (93). `--omit=dev` — **2 críticas, 17 altas, 15 moderadas, 1 baixa (35)**. Recorte backend `--omit=dev`: 1 crítica, 8 altas, 5 moderadas, 1 baixa.
Críticas (todas transitivas): `proxy-addr`, `shell-quote` (produção); `handlebars`, `tar` (dev).

| Pacote direto | App | Escopo | Gravidade | Origem | Correção | Breaking? |
|---|---|---|---|---|---|---|
| `axios` 1.15.0 | mobile | prod | Alta | GHSA-pmwg-cvhr-8vh7, GHSA-w9j2-pvgh-6h63, GHSA-3w6x-2g7m-8v23 | > 1.19.0 | Não |
| `@nestjs/platform-express` 11.1.19 | backend | prod | Alta | via `multer` | > 11.1.27 | Não |
| `nodemailer` 8.0.7 | backend | prod | Alta | GHSA-p6gq-j5cr-w38f, GHSA-268h-hp4c-crq3, GHSA-wqvq-jvpq-h66f | 10.6.0 | **Sim** (major) |
| `expo-router` 57.0.28 | mobile | prod | Alta | via `query-string` | 58.0.31 | **Sim** (SDK 58) |
| `@nestjs/swagger` 11.4.7 | backend | prod | Moderada | via `js-yaml` | fora de 11.4.6–11.4.7 | Não |
| `@expo/ngrok` | mobile | prod | Moderada | via `uuid` | sem correção → remover | — |
| `prisma` 6.19.3 | backend | dev | Alta | via `@prisma/config` | 7.10.1 | **Sim** |
| `lerna` 9.x | raiz | dev | Alta | `tar`, `pacote`, `js-yaml` e outros | 10.0.1 | **Sim** |
| `expo-module-scripts` | mobile | dev | Alta | `babel-preset-expo`, `jest-expo` | disponível | Não (candidata a remoção) |
| `@nestjs/cli` | backend | dev | Moderada | via `glob` | 12.0.13 | **Sim** |
| `jest` 30 | backend | dev | Moderada | `@jest/core` | npm sugere 29.7.0 (downgrade) | **Sim** |
| `babel-plugin-module-resolver` | mobile | dev | Moderada | via `glob` | npm sugere 5.0.0 (downgrade) | **Sim** |
| `typescript-eslint` | backend | dev | Moderada | pacotes `@typescript-eslint/*` | disponível | Não |
| `vite` (apps/web, menção) | web | dev | Alta | `launch-editor` | disponível | Não |

Os identificadores acima são os devolvidos pelo `npm audit`; não foram validados um a um contra o código (ex.: `nodemailer` — as opções afetadas `raw`/`jsonTransport` não são usadas em `mailer.service.ts`, então a exploração direta é improvável. Confiança: MÉDIA).

| ID | Achado | Onde | Gravidade | Correção |
|---|---|---|---|---|
| C1 | 35 vulnerabilidades em dependências de produção (2 críticas, 17 altas); 4 diretas com correção | `package-lock.json` | Alta | `npm audit fix` (sem `--force`) resolve `axios`, `platform-express`, `swagger`; `nodemailer` 10 em commit próprio com teste de envio; `expo-router` só junto do SDK 58 (registrar como risco aceito) |
| C2 | Imagem de produção não é reproduzível e provavelmente não sobe: (a) `npm ci` usa `apps/backend/package-lock.json`, parado desde 2026-02-18 e fora de sincronia com o `package.json` (sem `bcrypt`, `nodemailer`, `openai`, `pdfkit`, `passport-jwt`; `prisma` 7.4.0 vs `^6.19.3`); (b) `pg`, `@prisma/adapter-pg` e `dotenv` são importados em runtime mas estão em `devDependencies` e saem com `--omit=dev`; (c) `npx prisma migrate deploy` baixa o CLI sem versão fixa a cada start; (d) roda como root; (e) sem `.dockerignore` — `COPY . .` leva `.env` e `node_modules` para a camada de build | `apps/backend/Dockerfile:3-4,5,12,17`; `apps/backend/package-lock.json`; `apps/backend/package.json:51,58,60,66`; `src/prisma/prisma.service.ts:3-5`; `src/main.ts:1` | Alta | Um lockfile só (raiz) com build a partir da raiz, ou regenerar o do backend; mover as três libs para `dependencies`; `prisma` fixo na imagem; `USER node`; `.dockerignore` (`.env*`, `node_modules`, `dist`, `test`). Confiança: MÉDIA — build não executado (regra da tarefa) |
| C3 | Ranges e majors inconsistentes: `@nestjs/mapped-types: "*"`; `@nestjs/testing ^10` com Nest 11; `@prisma/adapter-pg ^7` (7.8.0) com `@prisma/client` 6.19.3; `@types/nodemailer` em `dependencies` | `apps/backend/package.json:26,33,50,51` | Média | Fixar `^2.1.0`, `^11`, alinhar adapter ao major do client, mover types para dev |
| C4 | `legacy-peer-deps=true` global esconde conflitos de peer (é o que permite C3) | `.npmrc:1` | Baixa | Remover após alinhar C3 |
| C5 | `allowScripts` na raiz fixa por versão os 7 pacotes com script de instalação e nega `@nestjs/core` e `@scarf/scarf` (telemetria) — bom. Não há `ignore-scripts=true` no `.npmrc` | `package.json:26-36` | Baixa | Confiança: LOW — não verifiquei se o npm 11.16 aplica `allowScripts` nativamente; confirmar com `npm ci --foreground-scripts` em ambiente limpo |
| C6 | Transitivas depreciadas: `glob` 7/9/10/11, `inflight`, `rimraf` 2, `uuid` 3/7, `@xmldom/xmldom` 0.7.13, `abab`, `domexception` | `package-lock.json` | Baixa | Saem com a atualização de `lerna`/Expo |
| C7 | Sem CI, Dependabot/Renovate ou varredura de secrets (`.github/` não existe); `docker-compose.prod.yml` publica o backend em `3000` sem TLS/proxy | raiz; `docker-compose.prod.yml:24-25` | Baixa | Workflow mínimo: `npm ci`, lint, test, `npm audit --omit=dev --audit-level=high`, gitleaks; proxy com TLS na frente |

Verificado e sem problema: os três lockfiles (raiz 2.398 pacotes, backend 805, web 226) são `lockfileVersion 3`, 100% `registry.npmjs.org`, todos com `integrity`; nenhuma dependência por git/URL/arquivo; nenhum `preinstall/postinstall` próprio; nenhum nome suspeito de typosquatting entre as dependências diretas (revisão manual); Dockerfile é multi-stage e o `.env` não chega à imagem final.

---

## 5. Mapa LGPD mínimo

| Dado | Categoria | Onde fica | Para onde sai | Observação |
|---|---|---|---|---|
| E-mail, nome, telefone, nascimento, pronome, foto | Pessoal | `User` (`email`, `name`, `phone_number`, `birthday`, `pronoun`, `profile_picture`); AsyncStorage `oncomente-auth` | SMTP (e-mail, só no reset); Groq (nome, pronome, idade) | Exposto a qualquer conta por B2 |
| Papel paciente/cuidador | **Sensível por inferência** (saúde) | `User.role`; JWT | Groq ("paciente oncológico") | |
| Senha | Credencial | `User.password` (bcrypt) | — | Nunca devolvida |
| Diário: título, texto, emoções, data | **Sensível** (saúde mental) | `DailyLog` (`title`, `content`, `emotes`, `date`), texto puro | Groq (emoções de 7 dias); PDF baixado | Sem criptografia em repouso |
| Tratamentos: nome, frequência, horário, fim, médico, contato, hospital | **Sensível** + dado de terceiro (médico) | `treatments`; AsyncStorage `oncomente-treatments`; agenda e notificações do aparelho | Groq (nome, frequência, horário, fim) | Médico/hospital não vão à Groq pelo fluxo normal |
| Conversa com o mascote | **Sensível** (inclui ideação suicida) | `PatientSupportLog` (`userId`, `prompt`, `response`, `context`); AsyncStorage `oncomente:chat-history` | Groq (pergunta + 8 turnos), servidores fora do Brasil | Sem retenção definida |
| Trilha do diário | Pessoal | `DailyLogAudit` (`logId`, `userId`, `action`) | — | Sem relação com `User` |
| Registro de exclusão | Pessoal | `user_deletion_logs` (`userId`, `email`, `name`, `role`, `reason`) | — | Identifica quem pediu para ser esquecido |
| Logs do servidor | Pessoal / sensível | stdout | operador da infra | E-mail e termos de busca do diário (B12) |
| Consentimento | — | **não existe** no servidor; só `oncomente:notifications:consent` local | — | Itens 5–6 do plano |

| ID | Achado | Onde | Gravidade | Correção |
|---|---|---|---|---|
| L1 | `PatientSupportLog` guarda toda conversa (inclusive mensagens de emergência) com `userId` em claro, sem relação, sem prazo e sem exclusão junto com a conta | `schema.prisma:226-233`; `mascot/mascot.service.ts:148,363-376` | Alta | `userId` → `HMAC-SHA256(userId, PSEUDONYM_KEY)`; retenção (ex.: 90 dias); apagar na exclusão; não gravar `context` |
| L2 | Diário em texto puro no banco; `UserDeletionLog` com e-mail e nome | `schema.prisma:65-75,197-213` | Média | Log de exclusão só com pseudônimo + `role` + data; criptografia de `content` segue no backlog (`tcc-final` D4) |
| L3 | `DailyLogAudit.userId` e nome do PDF com identificador direto | `schema.prisma:215-221`; `daily-logs.controller.ts:66` | Baixa | Pseudonimizar na exclusão da conta; nome de arquivo sem id |

Pontos de pseudonimização: `UserDeletionLog.userId/email/name`, `PatientSupportLog.userId`, `DailyLogAudit.userId`, logs (`mailer.service.ts:45,47`, filtro global), campo `nome` do prompt da Groq. Transferência internacional (Groq) exige consentimento específico e destacado (art. 33) — rascunho de termo precisa de revisão jurídica.

---

## Ordem de correção recomendada

1. **B3** — `whitelist` + `forbidNonWhitelisted` no `ValidationPipe`. Vem antes de B1/B2: sem isso, qualquer usuário vira ADMIN e o `RolesGuard` não protege nada.
2. **B1 + B2** — `RolesGuard`, `@Roles(ADMIN)` nas escritas de catálogo, `GET /users` restrito (item 3 do plano).
3. **B4 + B5** — remover `debug_token`; token de reset opaco e de uso único; `JwtStrategy` rejeita `purpose`; throttle em `reset-password`.
4. **S2 + S3 + S6** — `JWT_SECRET` forte e validado no boot; seed de usuários fora de produção; compose de produção sem defaults de segredo.
5. **B9 + B10 + B11 + B12** — CORS fechado, Swagger só fora de produção, `helmet`, `trust proxy`, throttle recalibrado, logs sem dado pessoal.
6. **C1 + C2 + C3** — `npm audit fix` sem breaking; lockfile único; Dockerfile (deps de runtime, usuário não-root, `.dockerignore`, prisma fixo).
7. **B6 + M1 + M3** — sessão com refresh rotativo e SecureStore; limpar conversa no logout (item 4 do plano).
8. **B7 + B8 + L1** — contexto do mascote montado no servidor, sem nome, condicionado a consentimento; pseudonimizar e limitar `PatientSupportLog` (itens 5 e 7).
9. **B14 + L2 + L3 + M2** — exclusão transacional, log de exclusão sem identificador, dados locais cifrados ou removidos (item 7).
10. **Restante** — B13, B15–B18, M4–M9, S4, S5, S7–S9, C4–C7.
