# 03 — Bibliotecas não utilizadas e higiene de dependências

> Gerado em 2026-11-16 · Persona: engenheiro de build sênior (monorepo npm, Expo SDK 57 / RN 0.86, NestJS 11, Prisma 6)
> Escopo: raiz, `apps/mobile`, `apps/backend`, `packages/shared`. `apps/web` ignorado.
> **Somente leitura**: nada foi instalado, removido ou editado. Este relatório é o gate do item 8 (`refactor/ReleaseCleanup`).
> Método: busca de `import`/`require` por pacote + leitura de `app.json`, `babel.config.js`, `metro.config.js`, `eas.json`, configs de ESLint/Jest/Nest, `prisma.config.ts`, `Dockerfile` + grafo de dependentes em `node_modules` + `npx depcheck` (conferido manualmente) + `npx expo install --check` + `npx expo-doctor`.

## 1. Resumo

| Workspace | Total | Usada | Uso implícito | Não usada (candidata) | Mal posicionada |
|---|---|---|---|---|---|
| `apps/mobile` | 47 | 28 | 14 | 5 | 0 |
| `apps/backend` | 53 | 21 | 23 | 4 | 5 |
| raiz | 4 | 1 | 1 | 1 | 1 |
| `packages/shared` | 1 (+1 peer) | 1 | 1 (peer) | 0 | 0 |

Achados que vão além de "lib sobrando" (detalhe na seção 6):

1. **`apps/backend/package-lock.json` está obsoleto** e é o lockfile que o `Dockerfile` usa → `npm ci` tende a falhar no build da imagem.
2. **Quatro libs de runtime estão em `devDependencies`** do backend (`dotenv`, `pg`, `@prisma/adapter-pg`, `prisma`) e a imagem final instala com `--omit=dev`.
3. **`@prisma/adapter-pg` 7.8.0 instalado com `@prisma/client` 6.19.3** (major diferente).
4. **`express` é importado em runtime sem estar declarado** (`apps/backend/src/main.ts:7`).

## 2. `apps/mobile`

| Pacote | Tipo | Classificação | Evidência | Ação proposta | Risco da remoção |
|---|---|---|---|---|---|
| `@expo-google-fonts/montserrat` | dep | USADA | `src/app/_layout.tsx:11` | manter | — |
| `@expo/ngrok` | dep | **NÃO USADA** | nenhum import; nenhum script usa `--tunnel`; único dependente é o próprio app | remover | baixo: `expo start --tunnel` passa a pedir a instalação |
| `@expo/vector-icons` | dep | USADA | `src/app/(Home)/index.tsx:11` (51 arquivos) | manter | — |
| `@react-native-async-storage/async-storage` | dep | USADA | `src/app/(Home)/index.tsx:13` | manter | — |
| `@react-native-community/datetimepicker` | dep | USADA | `src/components/ui/Inputs/BirthdayDateInput.tsx:3` + plugin `app.json:41` | manter | — |
| `axios` | dep | USADA | `src/services/api.ts:1` | manter | — |
| `expo` | dep | USADA | `metro.config.js:1`; peer de todos os `expo-*` | manter | — |
| `expo-calendar` | dep | USADA | `src/app/(Home)/PersonalArea/Treatment/create/index.tsx:8` (`expo-calendar/legacy`) | manter (suspeita derrubada) | — |
| `expo-constants` | dep | USADA | `src/services/resolveApiBaseUrl.ts:1` | manter | — |
| `expo-dev-client` | dep | USO IMPLÍCITO | `eas.json:9` (`developmentClient: true`); sem import | manter (suspeita derrubada) | alto: perfil `development` do EAS deixa de gerar dev client |
| `expo-font` | dep | USO IMPLÍCITO | plugin `app.json:40`; peer de `@expo/vector-icons`; base do `useFonts` | manter | — |
| `expo-haptics` | dep | USADA | `src/components/ds/SosButton.tsx:2` (chamada na linha 21) | manter (suspeita derrubada) | — |
| `expo-image` | dep | USADA | `src/components/ui/Images/Avatar.tsx:3` + plugin `app.json:42` | manter | — |
| `expo-image-picker` | dep | USADA | `src/app/(Home)/PersonalArea/OnboardingForm/index.tsx:9` | manter | — |
| `expo-linear-gradient` | dep | USADA | `src/app/_layout.tsx:2` | manter | — |
| `expo-linking` | dep | USO IMPLÍCITO | peer obrigatória de `expo-router` (`^57.0.13`); o código usa `Linking` de `react-native` | manter | alto: quebra o expo-router |
| `expo-navigation-bar` | dep | USADA | `src/app/index.tsx:5` (chamadas nas linhas 12–20) | manter (suspeita derrubada) | — |
| `expo-notifications` | dep | USADA | `src/app/_layout.tsx:4` + plugin `app.json:35` | manter | — |
| `expo-router` | dep | USADA | `main` do `package.json`; 61 arquivos | manter | — |
| `expo-secure-store` | dep | USO IMPLÍCITO (reservada) | só o plugin em `app.json:32`; **nenhum import em `src/`** | **manter** — será usada em `feat/PersistentSession` | — |
| `expo-splash-screen` | dep | USO IMPLÍCITO | plugin com configuração em `app.json:44-49`; sem import | manter | médio: splash nativa perde a configuração |
| `expo-status-bar` | dep | USADA | `src/app/(auth)/LoginScreen.tsx:8` (10 arquivos) | manter | — |
| `expo-video` | dep | USADA | `src/components/ui/Media/MediaViewer.tsx:4` + plugin `app.json:33` | manter | — |
| `expo-web-browser` | dep | **NÃO USADA** | única referência é o plugin `app.json:52`; nenhum import; nenhum pacote instalado depende dela | remover **e** tirar a linha 52 do `app.json` | baixo-médio: se o plugin ficar no `app.json`, o prebuild falha |
| `lodash` | dep | **NÃO USADA** | nenhum import nem uso de `_.`; continua instalada como dependência de `react-native-calendars` e `react-native-element-dropdown` | remover | baixo |
| `lottie-react-native` | dep | USADA | `src/app/index.tsx:4` | manter | — |
| `react` | dep | USADA | 62 arquivos | manter | — |
| `react-dom` | dep | USO IMPLÍCITO | peer de `react-native-web`; `metro.config.js:37`; script `web` | manter (Expo Web é usado para os prints) | — |
| `react-native` | dep | USADA | 109 arquivos | manter | — |
| `react-native-calendars` | dep | USADA | `src/app/(Home)/PersonalArea/Calendar/index.tsx:3` | manter | — |
| `react-native-element-dropdown` | dep | USADA | `src/components/ui/Inputs/SelectWithIcon.tsx:3` (usado em `RegisterForm` e `OnboardingForm`) | manter (suspeita derrubada) | — |
| `react-native-reanimated` | dep | USO IMPLÍCITO | sem import em `src/`; peer **opcional** do `expo-router` e peer de `react-native-drawer-layout` (trazido pelo router) | manter. Confiança: LOW — não testei o app sem ela | alto se removida sem teste |
| `react-native-safe-area-context` | dep | USADA | `src/app/(Home)/index.tsx:14` | manter | — |
| `react-native-screens` | dep | USO IMPLÍCITO | peer do `expo-router` (`^4.26.0`) | manter | alto |
| `react-native-toast-message` | dep | USADA | `src/app/_layout.tsx:5` | manter | — |
| `react-native-web` | dep | USO IMPLÍCITO | script `web`; `app.json:25-29` | manter | — |
| `react-native-webview` | dep | USO IMPLÍCITO | exigida por `react-native-youtube-iframe` (`lib/commonjs/WebView.native.js`) | manter | alto: player do YouTube quebra |
| `react-native-worklets` | dep | USO IMPLÍCITO | peer de `react-native-reanimated` (`0.10.x`) | manter enquanto a reanimated ficar | alto |
| `react-native-youtube-iframe` | dep | USADA | `src/components/ui/Media/MediaViewer.tsx:5` | manter | — |
| `zustand` | dep | USADA | `src/store/useAuthStore.ts:2` | manter | — |
| `@types/react` | dev | USO IMPLÍCITO | tipos do `react` para o `tsc` | manter | — |
| `babel-plugin-module-resolver` | dev | USO IMPLÍCITO | `babel.config.js:7` (aliases `@` e `@assets`) | manter (suspeita derrubada) | alto: todo import `@/...` quebra no Metro |
| `eslint` | dev | USADA | `eslint.config.js:2`; script `lint` | manter | — |
| `eslint-config-expo` | dev | USADA | `eslint.config.js:3` | manter | — |
| `expo-module-scripts` | dev | **NÃO USADA** | nenhuma referência em config, script ou código; nenhum dependente. Arrasta `jest-expo@51` e `typescript@^5` | remover | baixo |
| `react-test-renderer` | dev | **NÃO USADA** | o mobile não tem Jest configurado nem arquivo de teste rastreado; únicos dependentes vêm do `expo-module-scripts` | remover | baixo |
| `typescript` | dev | USO IMPLÍCITO | `tsconfig.json`; `npx tsc --noEmit` (critério de aceite 11) | manter | — |

Fora do `package.json` do mobile: `playwright` é importado em `scripts/capture-screens.mjs:4` e `scripts/smoke-flow.mjs:3` e só está declarado na raiz (ver seção 4).

## 3. `apps/backend`

| Pacote | Tipo | Classificação | Evidência | Ação proposta | Risco da remoção |
|---|---|---|---|---|---|
| `@nestjs/common` | dep | USADA | `src/app.controller.ts:1` (50 arquivos) | manter | — |
| `@nestjs/core` | dep | USADA | `src/main.ts:2` | manter | — |
| `@nestjs/jwt` | dep | USADA | `src/auth/auth.module.ts:2` | manter | — |
| `@nestjs/mapped-types` | dep | USADA (range `*`) | `src/media/books/dto/update-book.dto.ts:1` (6 DTOs) | fixar em `^2.1.1` (versão instalada, a mesma que o swagger exige) | — |
| `@nestjs/passport` | dep | USADA | `src/auth/auth.module.ts:3` | manter | — |
| `@nestjs/platform-express` | dep | USO IMPLÍCITO | adaptador HTTP padrão carregado pelo `NestFactory.create` (`src/main.ts:10`); traz o `express` | manter | alto |
| `@nestjs/schedule` | dep | **NÃO USADA** | nenhum import; nenhum `@Cron`, `@Interval` ou `ScheduleModule` em `src/` | remover | baixo |
| `@nestjs/swagger` | dep | USADA | `src/main.ts:6` + plugin `nest-cli.json:12` | manter | — |
| `@nestjs/throttler` | dep | USADA | `src/app.module.ts:14` | manter | — |
| `@prisma/client` | dep | USADA | `src/prisma/prisma.service.ts:2` | manter | — |
| `@types/nodemailer` | dep | **MAL POSICIONADA** | tipos em `dependencies` | mover para `devDependencies` | nenhum |
| `bcrypt` | dep | USADA | `src/auth/auth.service.ts:8` | manter | — |
| `class-transformer` | dep | USADA | `src/mascot/dto/ask-ai.ts:11` | manter | — |
| `class-validator` | dep | USADA | `src/auth/dto/change-password.dto.ts:1` | manter | — |
| `nodemailer` | dep | USADA | `src/mailer/mailer.service.ts:2` | manter | — |
| `openai` | dep | USADA | `src/mascot/mascot.service.ts:9`; cliente apontado para a Groq na linha 32 (`baseURL`) | manter (suspeita derrubada) | alto: mascote para |
| `passport` | dep | USO IMPLÍCITO | peer de `@nestjs/passport` | manter | alto |
| `passport-jwt` | dep | USADA | `src/auth/strategies/jwt.strategy.ts:3` | manter | — |
| `pdfkit` | dep | USADA | `src/personal/daily-logs/daily-logs-report.service.ts:3`, registrado em `daily-logs.module.ts:9` | manter (suspeita derrubada) | alto: relatório PDF do diário |
| `reflect-metadata` | dep | USO IMPLÍCITO | peer de `@nestjs/common` e `@nestjs/core` | manter | alto |
| `rxjs` | dep | USO IMPLÍCITO | peer de `@nestjs/common` e `@nestjs/core` | manter | alto |
| `@eslint/eslintrc` | dev | **NÃO USADA** | `eslint.config.mjs` é flat config sem `FlatCompat`; segue instalada como dependência do `eslint` | remover | baixo |
| `@eslint/js` | dev | USADA | `eslint.config.mjs:2` | manter | — |
| `@nestjs/cli` | dev | USO IMPLÍCITO | scripts `build`, `start`, `start:dev` | manter | — |
| `@nestjs/schematics` | dev | USO IMPLÍCITO | `nest-cli.json:3` (`collection`) | manter | — |
| `@nestjs/testing` | dev | USADA (versão errada) | `src/app.controller.spec.ts:1` (17 specs); instalada 10.4.22 com Nest 11.1.19 — a peer pede `@nestjs/common ^10` | subir para `^11.1.18` | — |
| `@prisma/adapter-pg` | dev | **MAL POSICIONADA** + versão | import em runtime: `src/prisma/prisma.service.ts:3`; instalada 7.8.0 com client 6.19.3 | mover para `dependencies` e alinhar em `^6.19.3` | — |
| `@types/bcrypt` | dev | USO IMPLÍCITO | tipos de `bcrypt` | manter | — |
| `@types/express` | dev | USO IMPLÍCITO | tipos de `express` (`common/filters/http-exception.filter.ts:8`) | manter | — |
| `@types/jest` | dev | USO IMPLÍCITO | 17 arquivos `*.spec.ts` | manter (depcheck acusou; falso positivo) | — |
| `@types/node` | dev | USO IMPLÍCITO | `path`, `fs`, `process` em `src/` | manter | — |
| `@types/passport-jwt` | dev | USO IMPLÍCITO | tipos de `passport-jwt` | manter | — |
| `@types/pdfkit` | dev | USO IMPLÍCITO | tipos de `pdfkit` | manter | — |
| `@types/pg` | dev | USO IMPLÍCITO | tipos de `pg` | manter | — |
| `@types/supertest` | dev | USO IMPLÍCITO | tipos de `supertest` | manter | — |
| `dotenv` | dev | **MAL POSICIONADA** | import em runtime: `src/main.ts:1`, `src/prisma/prisma.service.ts:5`, `prisma.config.ts:3` | mover para `dependencies` | — |
| `eslint` | dev | USO IMPLÍCITO | script `lint` | manter | — |
| `eslint-config-prettier` | dev | USO IMPLÍCITO | carregada por `eslint-plugin-prettier/recommended` (`eslint.config.mjs:3`) | manter | — |
| `eslint-plugin-prettier` | dev | USADA | `eslint.config.mjs:3` | manter | — |
| `globals` | dev | USADA | `eslint.config.mjs:4` | manter | — |
| `jest` | dev | USO IMPLÍCITO | scripts `test*`; bloco `jest` do `package.json` | manter | — |
| `pg` | dev | **MAL POSICIONADA** | import em runtime: `src/prisma/prisma.service.ts:4` | mover para `dependencies` | — |
| `prettier` | dev | USO IMPLÍCITO | script `format`; peer de `eslint-plugin-prettier` | manter | — |
| `prisma` | dev | **MAL POSICIONADA** (para o Docker) | `Dockerfile:17` roda `npx prisma migrate deploy` na imagem com `--omit=dev`; `prisma.config.ts:4` importa `prisma/config` | mover para `dependencies` **ou** rodar a migration no estágio builder (decisão do usuário) | — |
| `source-map-support` | dev | **NÃO USADA** | nenhuma referência; o Nest CLI 11 usa `--enable-source-maps` (`@nestjs/cli/actions/start.action.js:111`) | remover | baixo |
| `supertest` | dev | USADA | `test/app.e2e-spec.ts:3` | manter | — |
| `ts-jest` | dev | USO IMPLÍCITO | `transform` do Jest (`package.json:88`, `test/jest-e2e.json:7`) | manter | — |
| `ts-loader` | dev | **NÃO USADA** | `nest-cli.json` não liga `webpack`; nenhum `webpack.config` | remover | baixo |
| `ts-node` | dev | USO IMPLÍCITO | script `test:debug` (`-r ts-node/register`) | manter | — |
| `tsconfig-paths` | dev | USO IMPLÍCITO | script `test:debug` (`-r tsconfig-paths/register`) | manter (depcheck acusou; falso positivo) | — |
| `tsx` | dev | USO IMPLÍCITO | seed em `prisma.config.ts:10` (`tsx prisma/seed.ts`) | manter (depcheck acusou; falso positivo) | — |
| `typescript` | dev | USO IMPLÍCITO | `tsconfig.json`; `nest build`; `ts-jest` | manter | — |
| `typescript-eslint` | dev | USADA | `eslint.config.mjs:5` | manter | — |

**Dependência faltando:** `express` — import de runtime em `src/main.ts:7` (`express.json`, `express.urlencoded`) e de tipos em `common/filters/http-exception.filter.ts:8` e `src/personal/daily-logs/daily-logs.controller.ts:18`. Hoje resolve por ser dependência do `@nestjs/platform-express`. Ação: declarar `express` em `dependencies` na mesma major que o platform-express traz (5.x).

## 4. Raiz e `packages/shared`

| Pacote | Workspace | Tipo | Classificação | Evidência | Ação proposta | Risco da remoção |
|---|---|---|---|---|---|---|
| `docx` | raiz | dev | USADA | `docs/av2/src/build.mjs:10`, executado da raiz | manter na raiz — `docs/` não pertence a nenhum workspace (suspeita de workspace errado derrubada) | perde a regeração do DOCX da AV2 |
| `lerna` | raiz | dev | USO IMPLÍCITO | scripts `start:*`, `build`, `test` + `lerna.json` | manter | — |
| `playwright` | raiz | dev | **MAL POSICIONADA** (workspace errado) | só é importado em `apps/mobile/scripts/capture-screens.mjs:4` e `smoke-flow.mjs:3` | mover para `devDependencies` do mobile (funciona hoje só por hoisting) | — |
| `typescript` | raiz | dev | **NÃO USADA** (redundante) | nenhum script da raiz usa `tsc`; cada workspace declara a própria; a 5.9.3 hoistada continua vindo de backend, web e lerna | remover. Confiança: MEDIUM — o `tsconfig.json` da raiz (estende `expo/tsconfig.base`) não é referenciado por nenhum workspace, mas pode ser usado pelo editor | baixo |
| `zustand` | shared | dep | USADA | `packages/shared/store/useAuthStore.ts:1` | manter; opcional: virar `peerDependency` para garantir instância única com o mobile | — |
| `react` | shared | peer | USO IMPLÍCITO | exigida pelo `create` do zustand | manter | — |

## 5. Versões divergentes, overrides e lockfiles

| Tema | Situação verificada | Ação proposta |
|---|---|---|
| `typescript` | mobile `~6.0.3` (cópia própria em `apps/mobile/node_modules`); backend `^5.9.3`, raiz `^5.0.0` e web `~5.9.3` → 5.9.3 hoistada. `expo-module-scripts` é quem ainda pede `^5.1.3` do lado do mobile | divergência intencional e inofensiva (mobile só faz `tsc --noEmit`). Remover `expo-module-scripts` e o `typescript` da raiz reduz o ruído |
| `eslint` | mobile `^9.0.0`, backend `^9.18.0`, web `^9.39.1` → uma única 9.39.4 | nenhuma; opcional alinhar os ranges |
| `zustand` | mobile e shared `^5.0.12` → uma única 5.0.13 | nenhuma |
| `dotenv` | três cópias: 17.4.2 (backend), 16.4.7 (hoistada, transitiva), 16.6.1 (dentro de `c12`) | nenhuma; some sozinha com o tempo |
| Prisma | `prisma` e `@prisma/client` 6.19.3; `@prisma/adapter-pg` e `@prisma/driver-adapter-utils` **7.8.0** | alinhar o adapter em `^6.19.3`. Confiança: LOW sobre o efeito em runtime — o backend sobe hoje, não testei a combinação |
| Nest | core/common 11.1.19; `@nestjs/testing` **10.4.22** | subir testing para 11 |
| override `react` / `react-dom` `19.2.3` | mobile fixa `19.2.3`; web pede `^19.1.0`. Sem o override o web pode resolver outra 19.x e duplicar o React hoistado, que o `metro.config.js:35-39` assume único | **manter** |
| override `@nestjs/swagger` `^11.4.4` | o backend já declara exatamente `^11.4.4` e é o único dependente no lockfile | **redundante — pode sair**. Confiança: MEDIUM |
| `.npmrc` `legacy-peer-deps=true` | esconde conflitos de peer (ex.: `@nestjs/testing` 10 com Nest 11) | manter por ora; reavaliar depois dos alinhamentos |
| `allowScripts` (raiz) | versões fixadas batem com as instaladas (`bcrypt 6.0.0`, `esbuild 0.27.7`, `nx 22.7.1`, `prisma 6.19.3`, `unrs-resolver 1.11.1`) | atualizar junto sempre que uma dessas versões mudar |

**Lockfiles.** O efetivo com workspaces é o `package-lock.json` da **raiz** (v3, lista `apps/backend`, `apps/mobile`, `apps/web`, `packages/shared`); `npm install` em qualquer workspace só lê e grava nele. O `apps/backend/package-lock.json` é um resto do commit `bf0f93b` ("integrate backend into monorepo") e não é atualizado desde então:

- não contém 15 das 21 `dependencies` atuais (`@nestjs/jwt`, `@nestjs/swagger`, `bcrypt`, `openai`, `pdfkit`, `nodemailer`, `passport`...) nem `pg`, `@prisma/adapter-pg` e `tsx`;
- registra `@prisma/client` e `prisma` em **7.4.0** (o `package.json` pede `^6.19.3`) e `@nestjs/testing` 11.1.14.

Ele só é lido pelo `apps/backend/Dockerfile` (`COPY package*.json` + `npm ci`, linhas 3-4 e 11-12; contexto `./apps/backend` em `docker-compose.prod.yml:20`). Com lock e `package.json` fora de sincronia, o `npm ci` aborta. Confiança: MEDIUM — a divergência está verificada; não executei `docker build` (fora do escopo). Decisão para o item 3 do plano ("unificar lockfile"): ou o Dockerfile passa a construir a partir da raiz usando o lockfile da raiz, ou o lock do backend é regenerado e mantido — hoje nenhuma das duas coisas acontece.

## 6. Risco de produção: runtime em `devDependencies`

A imagem final faz `npm ci --omit=dev` (`Dockerfile:12`) e executa `npx prisma migrate deploy && node dist/main` (`Dockerfile:17`).

| Pacote | Onde é carregado em runtime | Efeito com `--omit=dev` |
|---|---|---|
| `dotenv` | `src/main.ts:1`, `src/prisma/prisma.service.ts:5` | `Cannot find module` na subida |
| `pg` | `src/prisma/prisma.service.ts:4` | idem |
| `@prisma/adapter-pg` | `src/prisma/prisma.service.ts:3` | idem |
| `prisma` (CLI) | `Dockerfile:17` | o `npx` baixa a versão mais recente do registro em vez da 6.19.3 |

Observação relacionada. Confiança: LOW — não executei: o estágio final copia só `dist`, `.prisma` e `prisma/` (`Dockerfile:13-15`); o `prisma.config.ts`, que aponta o schema para `prisma/schema/schema.prisma`, fica de fora, então o `migrate deploy` pode não localizar o schema.

## 7. `expo install --check` e `expo-doctor`

Ambos rodaram em `apps/mobile` sem alterar arquivos (nenhuma correção foi aceita; `git status` igual antes e depois).

- `npx expo-doctor`: **20 de 21 verificações passaram**. A única falha é a de versões.
- `npx expo install --check`: 9 pacotes um patch atrás do esperado pelo SDK 57:

| Pacote | Instalado | Esperado |
|---|---|---|
| `expo` | 57.0.30 | ~57.0.33 |
| `expo-calendar` | 57.0.5 | ~57.0.6 |
| `expo-constants` | 57.0.22 | ~57.0.24 |
| `expo-dev-client` | 57.0.20 | ~57.0.21 |
| `expo-image-picker` | 57.0.20 | ~57.0.21 |
| `expo-linking` | 57.0.13 | ~57.0.14 |
| `expo-notifications` | 57.0.23 | ~57.0.25 |
| `expo-router` | 57.0.28 | ~57.0.31 |
| `expo-splash-screen` | 57.0.10 | ~57.0.11 |

Só patches; correção com `npx expo install --fix` em commit próprio (`🔧 chore(deps)`), separado das remoções.

`npx depcheck` (conferência): acusou como não usadas, além das candidatas abaixo, `expo-dev-client`, `expo-secure-store`, `expo-splash-screen`, `react-native-worklets`, `typescript` (mobile) e `@nestjs/schematics`, `@types/jest`, `tsconfig-paths`, `tsx` (backend) — todas falsos positivos pelos vínculos das tabelas acima.

## 8. Candidatas a remoção — lista para aprovação

Marque o que aprova. Um commit por pacote ou grupo coeso (política de commits).

**Mobile**
- [ ] `lodash` — `npm uninstall lodash -w cancer-health-care-app`
- [ ] `expo-module-scripts` — `npm uninstall expo-module-scripts -w cancer-health-care-app`
- [ ] `react-test-renderer` — `npm uninstall react-test-renderer -w cancer-health-care-app`
- [ ] `@expo/ngrok` — `npm uninstall @expo/ngrok -w cancer-health-care-app`
- [ ] `expo-web-browser` — `npm uninstall expo-web-browser -w cancer-health-care-app` + remover `"expo-web-browser"` de `apps/mobile/app.json:52`

**Backend**
- [ ] `@nestjs/schedule` — `npm uninstall @nestjs/schedule -w backend`
- [ ] `ts-loader` — `npm uninstall ts-loader -w backend`
- [ ] `source-map-support` — `npm uninstall source-map-support -w backend`
- [ ] `@eslint/eslintrc` — `npm uninstall @eslint/eslintrc -w backend`

**Raiz**
- [ ] `typescript` — `npm uninstall typescript` (na raiz)

**Não remover (registrado a pedido):** `expo-secure-store` — sem uso em `src/` hoje, entra em `feat/PersistentSession`.

**Reposicionamentos e correções (não são remoções; aprovar em separado)**
- [ ] `npm install dotenv pg @prisma/adapter-pg@^6.19.3 -w backend` (passam de dev para `dependencies`; adapter alinhado ao client)
- [ ] `prisma` em `dependencies` do backend **ou** ajuste do Dockerfile
- [ ] `npm install -D @types/nodemailer -w backend`
- [ ] `npm install express@^5 -w backend` (declarar o que já é importado)
- [ ] `npm install -D @nestjs/testing@^11.1.18 -w backend`
- [ ] `@nestjs/mapped-types`: trocar `*` por `^2.1.1`
- [ ] `playwright`: `npm uninstall playwright` na raiz + `npm install -D playwright -w cancer-health-care-app`
- [ ] remover o override `@nestjs/swagger` do `package.json` da raiz
- [ ] `apps/backend/package-lock.json`: remover ou regenerar, junto com a decisão do Dockerfile
- [ ] `npx expo install --fix` em `apps/mobile` (9 patches)

O nome do workspace do mobile é `cancer-health-care-app` (campo `name` de `apps/mobile/package.json`); `-w apps/mobile` também funciona.

## 9. Como validar após remover

Rodar depois de cada commit de remoção:

1. Raiz: `npm install` sem `npm error`; `npm ls --depth=0 --workspaces` sem `invalid`, `UNMET` ou `missing`.
2. Mobile (`apps/mobile`): `npx tsc --noEmit` · `npm run lint` · `npx expo-doctor` · `npx expo install --check` · `npx expo start` e abrir o app (Metro sem `Unable to resolve module`). Conferir à mão: campos de seleção do cadastro e do onboarding (`react-native-element-dropdown`), calendário, vídeo do YouTube, botão SOS.
3. Backend (`apps/backend`): `npx tsc --noEmit -p tsconfig.json` · `npm run lint` · `npm test` · `npm run build` · `npm run start:dev` até "Nest application successfully started" · `GET /api` (Swagger) responde.
4. Após os reposicionamentos: `npm ci --omit=dev` em cópia limpa do backend seguido de `node dist/main`, para provar que nada de runtime ficou em dev.
5. `git diff --stat main -- apps/web` continua vazio (critério de aceite 2). Atenção: o lockfile da raiz inclui o web, então o `package-lock.json` muda, mas nenhum arquivo dentro de `apps/web` deve mudar.

Linha de base: não medi `tsc`, `jest` nem `lint` antes das remoções (pertence ao relatório 01). Medir antes de começar, para não atribuir às remoções falhas que já existem.
