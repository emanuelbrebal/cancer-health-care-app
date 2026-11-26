# CLAUDE.md

# ONCOMENTE - Contexto do Projeto

## Visão Geral

O **OncoMente** é um sistema de apoio a pacientes oncológicos e cuidadores, focado em saúde mental, adesão ao tratamento e combate ao estigma associado ao câncer. Democratiza conhecimento sobre prevenção e autocuidado, promovendo esperança na cura por meio de conteúdo informativo, acompanhamento gamificado e interação com mascote virtual.

## Arquitetura do Sistema

- **Aplicação móvel** (`apps/mobile`): interface principal para pacientes e cuidadores.
- **Gerenciador web** (`apps/web`): painel administrativo para alimentar conteúdo.
- **Backend** (`apps/backend`): API REST que serve ambos os clientes.

## Público-alvo

- **Pacientes** diagnosticados com câncer (qualquer tipo, gravidade ou idade).
- **Cuidadores** (acompanhantes e profissionais responsáveis pelo paciente).

---

## Funcionalidades do Sistema

### 1. Área Oncológica (pública)
- **Autocuidados**: nutrição, exercícios físicos, sono, espiritualidade.
- **Lazer**: recomendações de atividades para pacientes.
- **Benefícios legais**: direitos garantidos por lei (ex.: Lei dos 60 dias).

### 2. Área de Saúde Mental (pública)
- Conteúdo motivacional segmentado por role (Paciente vs Cuidador).
- Exercícios de respiração, meditação e apoio psicológico.
- **Botão de Emergência**: discagem automática para CVV, CAVIDA e SAMU.

### 3. Área Pessoal (requer autenticação)
- Configurações de conta e onboarding.
- **Diário virtual** com registro de humor e emoções.
- **Calendário interativo** e gerenciamento de tratamento gamificado.
- **Canal de denúncias** de preconceito e abusos.
- **Mascote** com IA via Groq (`llama-3.3-70b-versatile`, SDK `openai` com `baseURL` da Groq) integrado a notificações.

---

## Monorepo Structure

Lerna monorepo com npm workspaces:

- **`apps/mobile`** — React Native + Expo (cliente principal)
- **`apps/backend`** — NestJS REST API com Prisma + PostgreSQL
- **`apps/web`** — React 19 + Vite 7 + Tailwind 4 (painel administrativo, só ADMIN; ver `apps/web/README.md`)
- **`apps/postman`** — Collection de testes da API
- **`packages/shared`** — Store Zustand de autenticação e tipos compartilhados

## Common Commands

```bash
# From root
npm run start:mobile        # Start Expo dev server
npm run start:backend       # Start NestJS in watch mode
npm run start:web           # Start Vite dev server

# From apps/mobile/
npx expo start
npx expo start --android
npx expo start --ios

# From apps/backend/
npm run start:dev           # NestJS watch mode
npm run test                # Jest
npm run lint                # ESLint --fix

# From apps/web/
npm run dev                 # VITE_API_URL em apps/web/.env (ver .env.example)
npm run lint
npm run test                # Vitest
```

---

## Mobile App Architecture

**Routing**: Expo Router v6 (file-based). Routes em `src/app/`.

- `(Home)/` — Tab group com 5 tabs (labels em PT-BR, pastas em inglês):
  - `index` → Início
  - `Oncology/` → Oncologia
  - `MentalHealth/` → Saúde Mental
  - `Mascot/` → Mascote Virtual *(auth-gated)*
  - `PersonalArea/` → Meu Perfil *(auth-gated)*
- `(auth)/` — Fluxos de autenticação

**Subrotas — Oncology:**
`Leisure/`, `Nutrition/`, `PhysicalExercises/`, `Sleep/`, `SpiritualArea/`, `LegalArea/`

**Subrotas — MentalHealth:**
`Motivational/` (→ `Patient/`, `CaringTheCaregiver/`), `Meditation/`, `BreathingExercises/`, `PsychologicalSupport/`, `PanicButtonContacts/`

**Subrotas — PersonalArea:**
`AccountConfigurations/`, `Calendar/`, `Diary/`, `Hub/`, `Notifications/`, `OnboardingForm/`, `ReportsArea/`, `Treatment/`

**State Management**: Zustand v5 com persist middleware. Auth store: `packages/shared/store/useAuthStore.ts`, persistido via AsyncStorage. Store key: `'oncomente-auth'`.

**HTTP Client**: Axios em `src/services/api.ts`. A baseURL vem de `src/services/resolveApiBaseUrl.ts`: `EXPO_PUBLIC_API_URL` ou, em `__DEV__`, o IP da LAN exposto pelo Metro (porta 3000). Interceptor envia o access token e, em 401, renova a sessão uma vez (refresh token em `expo-secure-store`, `src/services/sessionStorage.ts`).

**Styling**: React Native StyleSheet. Estilos globais em `src/styles/global.ts`, paleta em `src/constants/Colors.ts`. Fonte: Montserrat. Cores: `purplePrimary` (#9B5DE0), `purpleSecondary` (#4E56C0).

**Path aliases**: `@/*` → raiz do projeto, `@assets/*` → `assets/`.

**Idioma**: Labels e conteúdo em português. Nomes de pastas, variáveis e componentes em inglês.

---

## Backend Architecture

Módulos NestJS em `apps/backend/src/`:
- `auth/` — Strategies JWT, guards, login/register. Mobile: `POST /auth/{login,refresh,logout}` com refresh no corpo. Painel web: `POST /auth/web/{login,refresh,logout}` (só ADMIN, refresh em cookie HttpOnly `Path=/auth/web`, header `X-Requested-With: oncomente-admin`)
- `user/` — CRUD de usuários e gestão de roles
- `media/` — Livros, Filmes, Séries (gerenciados via admin web)
- `leisures/` — Atividades de lazer
- `personal/` — Diário virtual / mood tracking e tratamentos
- `mascot/` — Respostas do mascote IA via Groq
- `consent/` — Consentimento LGPD por finalidade (`HEALTH_DATA`, `AI_MASCOT`, `NOTIFICATIONS`), `ConsentGuard` + `@RequiresConsent`
- `prisma/` — Prisma client service

Patterns: DTOs, Mappers, Strategy pattern. User roles: `PATIENT`, `CAREGIVER`, `ADMIN`.

**Shared Types**: `packages/shared/types/user.ts` define `UserRole` e `PronounEnum` usados em todos os apps.

---

## Mapeamento Funcionalidades → Código

| Funcionalidade | Localização |
|---|---|
| Área Oncológica | `apps/mobile/src/app/(Home)/Oncology/` + `backend/media`, `backend/leisures` |
| Área Saúde Mental | `apps/mobile/src/app/(Home)/MentalHealth/` |
| Mascote Virtual | `apps/mobile/src/app/(Home)/Mascot/` + `backend/mascot` (Groq) |
| Área Pessoal | `apps/mobile/src/app/(Home)/PersonalArea/` + `backend/personal` |
| Autenticação / Perfil | `backend/auth`, `backend/user`, `packages/shared/store` |
| Conteúdo moderado | `apps/web` (admin) → `backend/media` |

---

## Git Workflow

Branch principal: `main`. PRs de features e fixes vão direto para `main`.

```
main ←── feat/* / fix/* / refactor/* ←── desenvolvimento
```

Convenção de nomes:
```
feat/<NomeDaFeature>
fix/<NomeDoFix>
refactor/<NomeDoRefactor>
```

---

## Convenções

Ver `.claude/rules/commits.md` para a política completa de commits.

### Formato resumido
```
<emoji> <type>(<scope>): <subject>
```

Exemplos: `✨ feat(mobile): add breathing exercises screen` · `🐛 fix(auth): token refresh on 401`

---

## Responda sempre em Português (pt-BR)