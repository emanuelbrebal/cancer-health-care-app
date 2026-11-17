# 01 — Prontidão para entrega (mobile + backend + shared)

> Persona: engenheiro de release sênior · Gerado em 2026-11-16 · Branch `fix/ReleaseSecurityHardening` (HEAD `b165d10`)
> Escopo: `apps/mobile`, `apps/backend`, `packages/shared`. `apps/web` ignorado. Varredura somente leitura: nada foi editado, instalado, formatado ou buildado.
> Método: checagens executadas localmente; código morto por grafo de imports (script descartável, aliases `@/` e `src/`) + `grep`; arquivos versionados por `git ls-files`.

## Resumo

| Gravidade | Qtde | Significado |
|---|---|---|
| Bloqueia | 6 | Impede o critério de aceite 11 ou deixa o app inutilizável em build de release |
| Alta | 8 | Defeito funcional, de privacidade ou de execução em produção |
| Média | 16 | Inconsistência ou resto que deve sair antes da entrega |
| Baixa | 19 | Higiene |

- O que está são: `tsc` do backend limpo; todos os módulos Nest registrados; todas as rotas chamadas pelo app existem no backend; nenhuma tela órfã além de `design-system`; nenhum `dist`, `.env`, `coverage` ou `.tsbuildinfo` versionado.
- O que não foi executado: build (`nest build`, EAS), Docker, app em dispositivo. Itens que dependem disso estão marcados com confiança.

## 1. Estado das checagens

| Checagem | Comando | Resultado |
|---|---|---|
| tsc mobile | `npx tsc --noEmit` | **6 erros** em 5 arquivos (exit 2) |
| tsc backend | `npx tsc --noEmit` | **0 erros** (exit 0) |
| jest backend | `npx jest` | **13 suítes falham, 3 passam** (16) · testes: 1 falha, 24 passam (25) |
| lint backend | `npx eslint "src/**/*.ts"` (sem `--fix`) | **172 problemas: 151 erros, 21 avisos** (17 corrigíveis com `--fix`) |
| lint mobile | `npx eslint src` | **25 problemas: 11 erros, 14 avisos** |

Primeiras linhas de erro:
- tsc mobile: `src/app/(Home)/Oncology/PhysicalExercises/index.tsx(59,40): error TS2322: Type '…mockDataOncologyMedias").MediaItem[]' is not assignable to type '…MediaList").MediaItem[]' … Type 'number' is not assignable to type 'string'.`
- jest: `Cannot find module 'src/prisma/prisma.service' from 'personal/daily-logs/daily-logs.repository.ts'`
- lint backend: `src/auth/auth.controller.ts 47:48 error Unsafe member access .user on an 'any' value @typescript-eslint/no-unsafe-member-access`
- lint mobile: `src/app/(Home)/MentalHealth/BreathingExercises/index.tsx 48:21 error Cannot access refs during render react-hooks/refs`

Suítes que passam (por eliminação das 13 listadas como FAIL): `app.controller.spec`, `mascot/mascot.service.spec`, `mascot/prompt-loader.service.spec`.

| # | Achado | Onde | Gravidade | Ação |
|---|---|---|---|---|
| 1.1 | tsc mobile, 6 erros: tipo `MediaItem` duplicado e incompatível (3); comparação `ImageSourcePropType` com `""` (1); import de módulo inexistente (1); `StyleProp<TextStyle>` passado a `View` (1) | `Oncology/PhysicalExercises/index.tsx:59,77`; `Oncology/Sleep/index.tsx:54`; `components/home/DailyMessage/DailyMessage.tsx:60`; `components/ui/Buttons/Overlay/NewPublication/NewPublication.tsx:3`; `components/ui/Inputs/InputWithIcon.tsx:26` | Bloqueia | Unificar `MediaItem` (um tipo só, `id: string`); corrigir a comparação; apagar `NewPublication.tsx` (2.1); tipar o estilo do contêiner como `ViewStyle` |
| 1.2 | Jest — causa A (12 suítes): imports absolutos `src/...` (20 imports em 19 arquivos) não resolvem porque o Jest tem `rootDir: "src"` sem `moduleNameMapper`/`modulePaths` | `apps/backend/package.json:77-93`; ex.: `mascot/mascot.controller.ts:13`, `user/user.controller.ts:15` | Bloqueia | Adicionar `"moduleNameMapper": {"^src/(.*)$": "<rootDir>/$1"}` ou trocar os 20 imports por relativos |
| 1.3 | Jest — causa B (1 suíte, 1 teste): `AuthService` instanciado sem `PrismaService`, `JwtService` e `MailerService` (spec de scaffold) | `src/auth/auth.service.spec.ts:8-10` | Bloqueia | Fornecer mocks dos 3 providers. Confiança: LOW — as 12 suítes da causa A são specs de scaffold parecidas e podem cair nesta causa depois de A ser corrigida; não verificado |
| 1.4 | Lint backend: 151 erros. Regras: `no-unsafe-member-access` 70, `no-unsafe-assignment` 52, `no-unsafe-argument` 20, `prettier/prettier` 16, `no-unused-vars` 4, demais 10 | origem comum: `@Req() req: any` e `payload: any` — ex.: `auth/auth.controller.ts:47`, `auth/auth.service.ts:113-124`, `auth/auth.module.ts:16` | Bloqueia | Tipar `req` (interface `AuthenticatedRequest`) e o payload JWT; rodar `--fix` só para os 17 de formatação, em commit `style` separado |
| 1.5 | Lint mobile: 11 erros — `react-hooks/refs` 5 + `set-state-in-effect` 1; `rules-of-hooks` 2; `no-unescaped-entities` 2; `import/no-unresolved` 1 | `MentalHealth/BreathingExercises/index.tsx:48,76`; `components/ui/Media/MediaViewer.tsx:31,37`; `Oncology/Nutrition/index.tsx:110`; `NewPublication.tsx:3` | Bloqueia | Corrigir um a um; os 14 avisos são imports/variáveis sem uso e `exhaustive-deps` |
| 1.6 | Hooks chamados condicionalmente (`useVideoPlayer` e `useEffect` depois de retorno antecipado): quebra a ordem de hooks quando o tipo de mídia muda | `components/ui/Media/MediaViewer.tsx:31,37` | Alta | Separar em subcomponentes por tipo de mídia ou mover os hooks para antes do retorno |

## 2. Código morto

| # | Achado | Onde | Gravidade | Ação |
|---|---|---|---|---|
| 2.1 | Resto da Área Social: componente sem nenhum importador que importa `SocialArea/Forum/CreationsHub/BottomSheet` (pasta inexistente). Gera 1 erro de tsc e 1 de lint | `components/ui/Buttons/Overlay/NewPublication/NewPublication.tsx:3` | Alta | Apagar o arquivo e a pasta |
| 2.2 | Arquivos sem nenhum importador | `components/ui/Buttons/BackButton.tsx`, `components/ui/Cards/NavCard.tsx`, `components/ui/Inputs/SearchBar.tsx` (o usado é `components/ui/SearchBar/index.tsx`), `styles/Form.ts`, `constants/Mocks/mockDataMentalHealth.ts` | Baixa | Apagar |
| 2.3 | CRUD local de tratamentos (export default e chave `oncomente-treatments`) sem uso: só os helpers de data e o tipo são importados | `services/treatmentStorage.ts:20-53,89-90` | Baixa | Manter tipo + helpers; remover o CRUD e a chave de `store/useAuthStore.ts:6` |
| 2.4 | Layout da Área Pessoal ainda se chama `SocialStackLayout` | `app/(Home)/PersonalArea/_layout.tsx:22` | Baixa | Renomear |
| 2.5 | Entidades backend sem nenhum import | `media/movies/entities/movie.entity.ts`, `media/series/entities/series.entity.ts`, `personal/daily-logs/entities/daily-log.entity.ts` | Baixa | Apagar |
| 2.6 | `media-response-dto.ts` duplicado; DTOs de resposta de filme e série dentro de `books/dto` | `media/books/dto/media-response-dto.ts` × `media/common/dto/media-response-dto.ts`; `media/books/dto/movie-response.dto.ts`, `series-response-dto.ts` | Baixa | Manter o de `common/dto`; mover os dois DTOs para suas pastas |
| 2.7 | Rota pública `GET /` devolve `Hello World!`; o único teste e2e cobre só ela | `src/app.controller.ts:8`; `src/app.service.ts`; `test/app.e2e-spec.ts` | Baixa | Trocar por health check ou remover |
| 2.8 | Model `DailyMessage` sem uso no backend e no seed; o app usa `mockDailyMessages` local | `prisma/schema/schema.prisma:77` | Baixa | Remover o model (migration) ou registrar como backlog |
| 2.9 | `main` aponta para `index.ts`, que não existe; o app importa por caminho relativo | `packages/shared/package.json:4`; `apps/mobile/src/store/useAuthStore.ts:3` | Baixa | Criar o `index.ts` ou remover o campo |
| 2.10 | 38 assets versionados sem referência em `src/` nem `app.json` (≈15,5 MB): 25 dos 49 vídeos de exercícios e `Banners/caringTheCaregiverBanner.png` (1,2 MB) | `apps/mobile/assets/videos/**`, `assets/images/Banners/` | Média | Confirmar e apagar; entram no bundle. Método: busca pelo nome do arquivo |
| 2.11 | Pacotes com 0 imports em `src/`: `expo-secure-store`, `expo-web-browser`, `expo-linking`, `lodash`, `expo-dev-client` | `apps/mobile/package.json` | Baixa | Tratar em `03-dependencias.md` (`expo-secure-store` passa a ser usado no item 4 do plano) |

Verificado sem achado: módulos de `app.module.ts` (o `MailerModule` entra por `auth/auth.module.ts:14`); 7 dos 8 mocks estão em uso; nenhum model ou módulo de Área Social no schema ou em `src/` (`LeisureType.SOCIAL`, em `schema.prisma:134`, é tipo de lazer legítimo); todas as rotas do Expo Router têm navegação de entrada, exceto `design-system` (4.2).

## 3. Inconsistências mobile × backend

Contratos conferidos e coerentes: `/auth/*`, `/daily-logs` (CRUD), `/personal/treatments` (CRUD), `/books`, `/movies`, `/series`, `/leisures`, `/ai-support/ask`, `/ai-support/context`, `PATCH /users/:id`.

| # | Achado | Onde | Gravidade | Ação |
|---|---|---|---|---|
| 3.1 | Histórico e contador do chat do mascote ficam em AsyncStorage e **não são apagados no logout**: as chaves `oncomente:chat-history` e `oncomente:chat-daily-limit` não estão em `LOCAL_DATA_KEYS`. O próximo usuário do aparelho vê a conversa anterior | `app/(Home)/Mascot/Chat/index.tsx:24-25,109`; `store/useAuthStore.ts:5-10` | Alta | Incluir as duas chaves na limpeza de logout (ou prefixar por `userId`) |
| 3.2 | Token de redefinição de senha é um JWT com o mesmo segredo e a estratégia não verifica `purpose`: o código enviado por e-mail é aceito como Bearer por 15 min | `auth/auth.service.ts:95-98`; `auth/strategies/jwt.strategy.ts:21-23` | Alta | Rejeitar payload com `purpose` na estratégia (detalhar em `02-devsecops.md`) |
| 3.3 | Botão "Desativar conta" chama `DELETE /users/:id` (exclusão definitiva) | `PersonalArea/AccountConfigurations/index.tsx:30,48,70` | Alta | Já previsto no item 7 do plano |
| 3.4 | Limite diário de mensagens do mascote só existe no cliente; no servidor há apenas throttle de 10/min | `Mascot/Chat/index.tsx:60-71`; `mascot/mascot.controller.ts:20` | Média | Aplicar o limite no backend ou assumir como limite apenas de interface |
| 3.5 | Capas de mídia vêm de mapa estático no bundle indexado por `image_path` do seed: conteúdo criado pelo painel aparece com imagem placeholder | `constants/mediaImageMap.ts:7,49-52` | Média | Aceitar URL remota em `getMediaImage` ou documentar a limitação |
| 3.6 | Foto de perfil enviada como data URI base64 no corpo do `PATCH` e guardada no usuário persistido; sem base64, o app envia a URI local do aparelho | `PersonalArea/OnboardingForm/index.tsx:62-67,92`; `user/dto/update-user.dto.ts:34` | Média | Enviar somente base64 válido; remover o fallback para `asset.uri` |
| 3.7 | Endpoints sem consumidor no app: busca do diário e relatório emocional em PDF | `personal/daily-logs/daily-logs.controller.ts:36,51` | Média | Ligar a uma tela ou declarar fora da entrega no documento de requisitos |
| 3.8 | Consentimento de notificações só local | `PersonalArea/Notifications/index.tsx:24,152` | Média | Já previsto no item 6 do plano |
| 3.9 | Calendário chama `treatmentService.getAll()` sem `catch`: erro de rede vira rejeição não tratada e tela vazia, sem aviso | `PersonalArea/Calendar/index.tsx:70-90` | Média | Usar `useAsyncResource` como as demais telas |
| 3.10 | `JSON.parse` de AsyncStorage sem `try`; `catch` vazio ao buscar o contexto do mascote | `Mascot/Chat/index.tsx:62,95,103` | Baixa | Proteger o parse |
| 3.11 | Campos declarados no app que o backend não devolve: `LeisureActivity.description`; `debug_token` tipado e nunca lido | `services/leisureService.ts:47`; `services/auth.ts:23` | Baixa | Remover dos tipos |

## 4. Itens que impedem a versão "final"

| # | Achado | Onde | Gravidade | Ação |
|---|---|---|---|---|
| 4.1 | URL da API em release cai em `http://localhost:3000`: fora de `__DEV__` vale só `EXPO_PUBLIC_API_URL`, e nenhum perfil do `eas.json` a define (`.env.example` também aponta para localhost) | `services/resolveApiBaseUrl.ts:23,40-42`; `eas.json:18-20,30-32,42-44`; `.env.example:7` | Bloqueia | Definir `EXPO_PUBLIC_API_URL` (https) em `preview` e `production`. Confiança: LOW sobre variáveis cadastradas no painel do EAS — não verificável daqui |
| 4.2 | Painel de debug montado no layout raiz em qualquer build e tela `/design-system` registrada sem guarda de `__DEV__`. Fica oculto por padrão (`EXPO_PUBLIC_UX_DEBUG`), mas a rota abre por deep link (`cancerhealthcareapp://design-system`) e o seu interruptor liga o painel de forma persistente; o painel força erro/vazio nas telas de dados e no chat | `app/_layout.tsx:16,60,64`; `app/design-system.tsx:77`; `store/useUxDebugStore.ts:19,24`; `hooks/useAsyncResource.ts:58-65`; `Mascot/Chat/index.tsx:116-118` | Alta | Condicionar painel e rota a `__DEV__` (ou a um flag de build) |
| 4.3 | Start de produção aponta para arquivo que o build não gera: `node dist/main`, mas a saída é `dist/src/main.js`, porque `common/`, `prisma.config.ts` e `scripts/` ficam fora de `src/` (o próprio `nest-cli.json` copia assets para `dist/src`). O `dist` local não tem `dist/main.js` | `apps/backend/Dockerfile:17`; `package.json:14`; `nest-cli.json:8`; `src/main.ts:5` | Alta | Mover `common/` para `src/` e excluir `scripts/`, `prisma/seed.ts` e `prisma.config.ts` do build, ou apontar para `dist/src/main`. Build não executado; evidência é o `dist` local |
| 4.4 | `main.ts` importa `dotenv/config`, mas `dotenv` é devDependency e a imagem final instala com `--omit=dev`; `prisma` (usado no `CMD`) também é devDependency | `src/main.ts:1`; `package.json:60,68`; `Dockerfile:12,17` | Alta | Mover `dotenv` e `prisma` para `dependencies`. Confiança: LOW — imagem não construída |
| 4.5 | `expo-image-picker` e `expo-calendar` são usados, mas não estão em `plugins` nem há textos de permissão de iOS | `app.json:30-53`; `PersonalArea/OnboardingForm/index.tsx:52`; `PersonalArea/Treatment/create/index.tsx:26` | Média | Adicionar os dois plugins com as mensagens. Confiança: LOW — efeito em iOS não testado |
| 4.6 | `projectId` e `owner` do EAS estão no `app.json` da raiz; o de `apps/mobile` (onde está o `eas.json`) não tem `extra.eas` | `app.json:5,8` (raiz); `apps/mobile/app.json` | Média | Levar `extra.eas.projectId` e `owner` para `apps/mobile/app.json`; apagar o da raiz. Confiança: LOW — `eas build` não executado |
| 4.7 | Submit do EAS incompleto: `ascAppId` e `appleTeamId` vazios; `appleId` com e-mail pessoal | `apps/mobile/eas.json:54-56` | Média | Preencher ou remover o bloco `submit` (o `appleId` já está no item 3 do plano) |
| 4.8 | Versão sem fonte única: `app.json` 1.0.0; backend `0.0.1`; tela Sobre com "Versão 1.0.0" fixa; Swagger `1.0`; sem `android.versionCode` nem `ios.buildNumber` | `app.json:5`; `apps/backend/package.json:3`; `app/(Home)/About/index.tsx:16`; `src/main.ts:25` | Média | Ler a versão de `expo-constants` na tela Sobre; alinhar o backend em 1.0.0 |
| 4.9 | `npm run start:mobile` usa `--scope mobile`, mas o pacote se chama `cancer-health-care-app` | `package.json:16` (raiz); `apps/mobile/package.json:2` | Média | Renomear o pacote para `mobile` ou ajustar o scope. Verificado por leitura; comando não executado |
| 4.10 | Texto lorem ipsum como fallback do subtítulo das telas de autenticação (a prop é obrigatória no tipo) | `components/layouts/AuthLayout/AuthLayout.tsx:24` | Baixa | Remover o fallback |
| 4.11 | Identificadores de template: `slug` `cancer-health-care-app`, `scheme` `cancerhealthcareapp`, nome exibido "Oncomente" (marca é "OncoMente") | `apps/mobile/app.json:3-4,8` | Baixa | Ajustar o nome; slug e scheme só se o projeto EAS permitir |
| 4.12 | Plugins declarados sem uso em `src/`: `expo-secure-store`, `expo-web-browser` | `apps/mobile/app.json:32,52` | Baixa | Remover `expo-web-browser`; `expo-secure-store` fica (item 4 do plano) |

Verificado sem achado: nenhum `console.log`, `TODO` ou `FIXME` em `src/`; nenhum IP fixo em `src/` (o `192.168.0.5` citado no `CLAUDE.md` não existe mais em `services/api.ts`); telas de "Espaço de denúncias" e "Sobre" têm conteúdo real.

## 5. Arquivos que não deveriam estar versionados

| # | Achado | Onde | Gravidade | Ação |
|---|---|---|---|---|
| 5.1 | Plano solto dentro de `src` | `apps/backend/src/mascot/PROMPT_REFACTOR_PLAN.md` | Média | Mover para `tasks/` ou apagar |
| 5.2 | Script de teste manual do mascote; hoje é compilado para `dist/scripts` | `apps/backend/scripts/test-mascot-personas.ts` | Média | Excluir do build (4.3) ou apagar |
| 5.3 | Lockfile duplicado no workspace | `apps/backend/package-lock.json` | Média | Unificar (já no item 3 do plano); o `Dockerfile:3-4` depende dele |
| 5.4 | Credenciais de teste do seed (senha padrão) em arquivo versionado | `tasks/test-users.md` | Média | Remover do repositório ou garantir que o seed não rode em produção |
| 5.5 | Pasta `.expo` da raiz versionada apesar do `.gitignore:14` | `.expo/README.md`, `.expo/devices.json` | Baixa | `git rm --cached` |
| 5.6 | `app.json` duplicado na raiz | `app.json` | Baixa | Ver 4.6 |
| 5.7 | Planos e relatórios de sessão versionados (31 arquivos) | `tasks/**`, `.claude/plans/*.md` | Baixa | Decidir o que fica na entrega |
| 5.8 | Scripts de captura e smoke manuais com `localhost` fixo, dependentes do `playwright` da raiz | `apps/mobile/scripts/capture-screens.mjs`, `smoke-flow.mjs` | Baixa | Manter se a AV2 for regerada; senão mover para `docs/av2/src` |
| 5.9 | Binário gerado versionado | `docs/av2-oncomente.docx` | Baixa | Manter só o `.md` e o gerador |

Verificado sem achado: nenhum `dist/`, `coverage/`, `.env`, `*.log`, `*.tsbuildinfo`, keystore ou `google-service-account.json` em `git ls-files`.

## Bloqueadores da versão final

1. **Jest do backend: 13 de 16 suítes falham** (1.2, 1.3) — resolver o alias `src/` no Jest e os mocks do `AuthService`.
2. **tsc do mobile: 6 erros** (1.1) — um deles some ao apagar `NewPublication.tsx` (2.1).
3. **Lint do backend: 151 erros** (1.4) — tipar `req` e o payload JWT.
4. **Lint do mobile: 11 erros** (1.5), incluindo hooks condicionais em `MediaViewer.tsx` (1.6).
5. **URL da API de release cai em `localhost`** (4.1).
6. Logo abaixo dos bloqueadores, por risco: chat do mascote sobrevive ao logout (3.1); token de redefinição aceito como Bearer (3.2); painel de debug e `/design-system` acessíveis em produção (4.2); start de produção do backend quebrado (4.3, 4.4).
