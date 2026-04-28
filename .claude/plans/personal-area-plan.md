# Planejamento — Área Pessoal (OncoMente)

> Gerado em: 2026-04-24  
> Branch de referência: `fix/refining-fixes-to-launch-the-prototype`  
> Escopo: todos os 8 módulos da Área Pessoal — análise, inconsistências e ordem de execução

---

## Visão Geral dos Módulos

| # | Módulo | Tela Mobile | Backend | Status |
|---|--------|-------------|---------|--------|
| 1 | Diário Virtual | `PersonalArea/Diary/` | `personal/daily-logs/` | ⚠️ Parcial |
| 2 | Tratamentos | `PersonalArea/Treatment/` | `personal/treatments/` | ⚠️ Parcial |
| 3 | Calendário | `PersonalArea/Calendar/` | — (local) | 🟡 Funcional |
| 4 | Notificações | `PersonalArea/Notifications/` | — (local) | 🟡 Funcional |
| 5 | Configurações de Conta | `PersonalArea/AccountConfigurations/` | `user/`, `auth/` | ⚠️ Parcial |
| 6 | Editar Perfil | `PersonalArea/OnboardingForm/` | `user/` | ⚠️ Parcial |
| 7 | Espaço de Denúncias | `PersonalArea/ReportsArea/` | — (hardcoded) | 🔵 Informativo |
| 8 | Hub (navegação) | `PersonalArea/Hub/` | — | ✅ OK |

**Legenda**: ✅ Pronto · 🟡 Funcional sem bugs críticos · ⚠️ Problemas a corrigir · 🔴 Quebrado

---

## Fluxo de Dados Global

```
Tela Mobile
    ↓
useAuthStore (Zustand + AsyncStorage)   ← token JWT (sem refresh)
    ↓
Service (api.ts + axios interceptor)
    ↓
NestJS Controller  →  Guard JWT
    ↓
Service + Repository
    ↓
Prisma ORM → PostgreSQL
```

**AsyncStorage keys em uso:**
```
oncomente-auth                     → Zustand auth state (token + user)
oncomente-treatments               → treatmentStorage (IDs locais)
oncomente:notification-history     → histórico de notificações
oncomente:notifications:consent    → consentimento LGPD
oncomente-treatment-local-ids      → IDs de agendamentos Expo + eventos de calendário
```

---

## Análise Detalhada por Módulo

---

### 1. Diário Virtual

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/Diary/index.tsx`
- `apps/mobile/src/app/(Home)/PersonalArea/Diary/create/index.tsx`
- `apps/mobile/src/app/(Home)/PersonalArea/Diary/update/index.tsx`
- `apps/mobile/src/services/diaryService.ts`
- `apps/backend/src/personal/daily-logs/` (controller, service, repository, DTOs, mapper)

**Endpoints consumidos pelo mobile:**

| Método | Rota | Payload/Params | Uso |
|--------|------|----------------|-----|
| GET | `/daily-logs` | — | Listar entradas |
| GET | `/daily-logs/:id` | path: id | Expandir entrada |
| POST | `/daily-logs` | `{title, content, emotes[], date?}` | Criar |
| PATCH | `/daily-logs/:id` | `{title?, content?, emotes?}` | Editar |
| DELETE | `/daily-logs/:id` | path: id | Excluir |

**Endpoints backend não consumidos pelo mobile:**
- `GET /daily-logs?search=&date=&emote=` — busca com filtros (nunca chamada)
- `GET /daily-logs/report/pdf` — export PDF (throttled, nunca chamada)

**Estrutura de dados:**

```typescript
// Mobile (interface local)
interface DailyLog {
  id: string;
  title: string;
  emotes: string[];
  date: string;         // "YYYY-MM-DD"
  createdAt: string;
  content?: string;     // lazy-loaded via GET /:id
}

// Backend response DTO (lista — sem content)
// Backend response DTO (individual — com content)
// Criar: { title, content, emotes[], date? }
// Atualizar: Partial<criar>
```

**Regras de negócio:**
- Apenas **1 entrada por dia por usuário** (index único `userId + date` no Prisma)
- Conteúdo lazy-loaded: lista retorna sem `content`, detalhe retorna com `content`
- Streak calculado localmente contando dias consecutivos com entrada
- Backend faz auditoria de toda operação em `DailyLogAudit`

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| D-1 | 🟡 Média | `useFocusEffect` recarrega lista inteira toda vez que a tela recebe foco — sem cache | `Diary/index.tsx` |
| D-2 | 🟡 Média | Busca com filtros (search, date, emote) disponível no backend nunca é usada | `Diary/index.tsx` |
| D-3 | 🟢 Baixa | `contentMap` é um objeto em memória — perde conteúdo ao sair e voltar | `Diary/index.tsx` |
| D-4 | 🟢 Baixa | Data: frontend envia `YYYY-MM-DD` local, backend converte para `T12:00:00.000Z` — pode gerar drift em fusos extremos | `daily-logs.service.ts` |

---

### 2. Tratamentos

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/Treatment/index.tsx`
- `apps/mobile/src/app/(Home)/PersonalArea/Treatment/create/index.tsx`
- `apps/mobile/src/app/(Home)/PersonalArea/Treatment/update/index.tsx`
- `apps/mobile/src/services/treatmentService.ts`
- `apps/mobile/src/services/treatmentStorage.ts`
- `apps/mobile/src/services/notificationService.ts`
- `apps/backend/src/personal/treatments/` (controller, service, repository, mapper, DTOs)

**Endpoints consumidos pelo mobile:**

| Método | Rota | Payload | Uso |
|--------|------|---------|-----|
| GET | `/personal/treatments` | — | Listar ativos |
| POST | `/personal/treatments` | ver abaixo | Criar |
| PATCH | `/personal/treatments/:id` | parcial | Editar |
| DELETE | `/personal/treatments/:id` | path: id | Soft delete |

**Payload de criação/edição:**
```typescript
{
  name: string;           // nome do remédio
  frequency: string;      // "8 em 8 horas (3x ao dia)" | "12 em 12 horas (2x ao dia)" | "24 em 24 horas (1x ao dia)"
  startTime: string;      // "HH:MM"
  endDate: string;        // "YYYY-MM-DD" (ISO — após conversão)
  doctorName?: string;
  doctorContact?: string; // telefone
  hospitalName?: string;
}
```

**Mapeamento de campos mobile → backend:**
```
mobile              → backend
nome                → name
frequencia          → frequency
horaInicio          → startTime
dataFim             → endDate
nomeMedico          → doctorName
contatoMedico       → doctorContact
nomeHospital        → hospitalName
```
Conversão feita em `treatmentService.ts`.

**Funções de cálculo local:**
- `getTreatmentDates(t)` → array de `YYYY-MM-DD` de startDate a endDate (usado no Calendário)
- `getDaysRemaining(t)` → número de dias até endDate
- `getProgress(t)` → porcentagem decorrida do ciclo
- `ddmmyyyyToISO(str)` / `isoToDDMMYYYY(str)` → conversão de formatos

**Notificações agendadas localmente via Expo:**
- Agendamento diário por horário calculado a partir de `horaInicio` e `frequencia`
- Notificação de fim de ciclo 1 dia antes do `endDate`
- IDs armazenados em `oncomente-treatment-local-ids` (AsyncStorage)

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| T-1 | 🔴 Alta | Formato de data inconsistente: mobile armazena e exibe `DD/MM/YYYY`, backend espera e retorna `ISO YYYY-MM-DD`; conversão em `treatmentService.ts` é frágil (split('/')) | `treatmentService.ts` |
| T-2 | 🟡 Média | `frequencia` é string hardcoded — qualquer variação quebra o cálculo de horários de notificação | `notificationService.ts` + `Treatment/create/index.tsx` |
| T-3 | 🟡 Média | Notificações armazenadas apenas no device — reinstalação do app perde todos os agendamentos | `treatmentStorage.ts` |
| T-4 | 🟡 Média | Tela não recarrega automaticamente ao voltar de create/update — depende de useFocusEffect | `Treatment/index.tsx` |
| T-5 | 🟢 Baixa | Backend `GET /treatments/:id` nunca é chamado pelo mobile | — |
| T-6 | 🟢 Baixa | Trigger de notificação `DATE` para fim de ciclo pode vencer se `endDate` for no passado | `notificationService.ts` |

---

### 3. Calendário Interativo

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/Calendar/index.tsx`

**Sem chamadas de API** — 100% local.

**Dados usados:**
- Tratamentos via `treatmentService.getAll()` (que chama a API)
- Datas geradas localmente via `getTreatmentDates()`
- Campanhas mensais hardcoded

**Campanhas hardcoded:**
```
Fev → Fevereiro Laranja (câncer intestinal)
Mar → Março Lilás (câncer de colo de útero)
Jun → Junho Laranja (leucemia)
Set → Setembro Dourado (câncer infantil)
Out → Outubro Rosa (câncer de mama)
Nov → Novembro Azul (câncer de próstata)
```

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| C-1 | 🟢 Baixa | Campanhas mensais hardcoded — requer nova versão para atualizar | `Calendar/index.tsx` |
| C-2 | 🟢 Baixa | Sem cache — recarrega toda lista de tratamentos via API ao focar na tela | `Calendar/index.tsx` |
| C-3 | 🟢 Baixa | Modal do dia não atualiza se tratamento for editado sem voltar ao calendário | `Calendar/index.tsx` |

---

### 4. Notificações

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/Notifications/index.tsx`
- `apps/mobile/src/services/notificationService.ts`

**Sem chamadas de API** — histórico e agendamentos são 100% locais.

**Fluxo:**
1. Primeira vez: tela de consentimento LGPD → salva em `oncomente:notifications:consent`
2. Normal: lista histórico de `oncomente:notification-history` + busca agendadas via Expo
3. Marcar como lida → atualiza AsyncStorage

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| N-1 | 🟡 Média | Histórico não é populado automaticamente — nenhum listener de notificação recebida está ativo | `Notifications/index.tsx` |
| N-2 | 🟡 Média | Reinstalação ou troca de device perde todo histórico e agendamentos | `notificationService.ts` |
| N-3 | 🟢 Baixa | Trigger DAILY não se adapta a mudanças de timezone após agendamento | `notificationService.ts` |

---

### 5. Configurações de Conta

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/index.tsx`
- `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/ChangePassword/index.tsx`
- `apps/backend/src/user/user.controller.ts`
- `apps/backend/src/user/user.service.ts`
- `apps/backend/src/auth/auth.controller.ts`
- `apps/backend/src/auth/auth.service.ts`

**Endpoints consumidos pelo mobile:**

| Método | Rota | Payload | Uso |
|--------|------|---------|-----|
| PATCH | `/auth/change-password` | `{currentPassword, newPassword}` | Alterar senha |
| DELETE | `/users/:id` | path: id | Deletar conta |

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| A-1 | 🔴 Alta | `DELETE /users/:id` é **hard delete** — dados do usuário são perdidos permanentemente | `user.service.ts` |
| A-2 | 🟡 Média | Logout no mobile não limpa AsyncStorage — tratamentos e diário ficam expostos | `useAuthStore.ts` |
| A-3 | 🟡 Média | `GET /users` sem paginação — pode retornar todos os usuários | `user.controller.ts` |
| A-4 | 🟢 Baixa | Senha sem validação de força — apenas min 6 chars | `change-password.dto.ts` |
| A-5 | 🟢 Baixa | `findAll()` lança NotFoundException quando lista está vazia (comportamento incorreto) | `user.service.ts` |

---

### 6. Editar Perfil (Onboarding)

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/OnboardingForm/index.tsx`
- `apps/backend/src/user/dto/update-user.dto.ts`
- `apps/backend/src/user/user.service.ts`

**Endpoints consumidos pelo mobile:**

| Método | Rota | Payload | Uso |
|--------|------|---------|-----|
| PATCH | `/users/:id` | `{name?, pronoun?, phone_number?, birthday?, profile_picture?}` | Atualizar perfil |

**Campos e mapeamento:**
- `pronoun`: enum `SR | SRA | SRTA | NOT_INFORMED` — frontend exibe "Prefiro não informar" que mapeia para `NOT_INFORMED`
- `profile_picture`: base64 (quality 0.7, crop 1:1)
- `birthday`: Date object → enviado como ISO string
- `phone_number`: formatado pelo `PhoneInput` componente

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| O-1 | 🟡 Média | Imagem enviada como base64 — sem limite de tamanho além de quality 0.7; pode exceder payload limits | `OnboardingForm/index.tsx` |
| O-2 | 🟡 Média | Sem validação de `birthday` — usuário pode inserir data futura ou inválida | `OnboardingForm/index.tsx` |
| O-3 | 🟢 Baixa | Sem feedback visual claro de sucesso — apenas toast rápido | `OnboardingForm/index.tsx` |
| O-4 | 🟢 Baixa | Store não é atualizada após PATCH bem-sucedido em todas as implementações | `OnboardingForm/index.tsx` |

---

### 7. Espaço de Denúncias

**Arquivos relevantes:**
- `apps/mobile/src/app/(Home)/PersonalArea/ReportsArea/index.tsx`

**Sem chamadas de API** — 100% hardcoded.

**Canais de denúncia hardcoded:**
```
Ouvidoria SUS          → tel:136
ANS                    → tel:08007019656
Defensoria Pública     → tel:129
CREMAL                 → https://cremal.org.br/ouvidoria/
Procon Alagoas         → https://www.procon.al.gov.br
```

**Inconsistências encontradas:**

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| R-1 | 🟢 Baixa | Hardcoded para Alagoas (CREMAL, Procon AL) — não portável para outros estados | `ReportsArea/index.tsx` |
| R-2 | 🟢 Baixa | Links e telefones não são validados remotamente — podem ficar desatualizados | `ReportsArea/index.tsx` |

---

### 8. Hub (Navegação)

**Arquivo:** `apps/mobile/src/app/(Home)/PersonalArea/Hub/index.tsx`

Tela de entrada da Área Pessoal com botões de navegação. Sem problemas críticos.

---

## Problemas Transversais

### Auth & Token

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| X-1 | 🔴 Alta | JWT sem refresh token — expiração não é tratada; usuário fica "logado" sem acesso real | `useAuthStore.ts` + `api.ts` |
| X-2 | 🟡 Média | Interceptor de 401 no axios não existe — erros de auth chegam como erros genéricos | `api.ts` |

### Validações Backend

| ID | Severidade | Problema | Localização |
|----|-----------|---------|-------------|
| V-1 | 🟡 Média | `startTime` (HH:MM) não validado no backend DTO — qualquer string é aceita | `create-treatment.dto.ts` |
| V-2 | 🟡 Média | `phone_number` sem validação de formato — apenas max 20 chars | `update-user.dto.ts` |
| V-3 | 🟢 Baixa | `profile_picture` sem validação — pode ser qualquer string arbitrária | `update-user.dto.ts` |

---

## Priorização de Correções

### 🔴 Alta Prioridade (bloqueantes para o protótipo)

| ID | Problema | Ação |
|----|---------|------|
| X-1 | JWT sem refresh | Adicionar interceptor 401 que faz logout + redireciona para login |
| A-1 | Hard delete de usuário | Adicionar campo `deletedAt` no schema e filtrar nas queries |
| T-1 | Datas inconsistentes em Treatment | Padronizar: armazenar e exibir `DD/MM/YYYY` no mobile; converter para ISO antes de enviar |

### 🟡 Média Prioridade (estabilidade)

| ID | Problema | Ação |
|----|---------|------|
| A-2 | Logout não limpa AsyncStorage | Limpar `oncomente-treatments`, `oncomente:notification-history` no logout |
| N-1 | Histórico de notificações vazio | Adicionar listener `addNotificationReceivedListener` no app root |
| T-2 | `frequencia` hardcoded como string | Extrair enum/constante compartilhada e validar no backend |
| X-2 | Sem interceptor 401 | Adicionar `response interceptor` no axios |
| O-1 | Base64 sem limite | Comprimir ou usar upload multipart (pré-assinado S3/similar) |
| O-2 | Birthday sem validação | Validar que data é no passado e plausível |
| A-3 | GET /users sem paginação | Adicionar paginação ou ao menos limitar via query params |
| V-1 | startTime sem validação | Adicionar `@Matches(/^\d{2}:\d{2}$/)` no DTO |

### 🟢 Baixa Prioridade (melhorias)

| ID | Problema | Ação |
|----|---------|------|
| D-1 | useFocusEffect sem cache | Adicionar timestamp de última busca + revalidar apenas se > 30s |
| D-2 | Busca não usada | Implementar campo de busca na tela do Diário |
| C-1 | Campanhas hardcoded | Mover para backend ou config remoto |
| R-1 | ReportsArea hardcoded para AL | Aceitar como escopo de protótipo |
| A-4 | Senha sem força | Adicionar regex básico de força |
| A-5 | findAll() lança NotFoundException | Retornar array vazio |

---

## Ordem de Execução Recomendada

```
1. X-1  → Interceptor 401 + logout automático         (auth, transversal)
2. A-2  → Limpar AsyncStorage no logout               (auth, mobile)
3. T-1  → Padronizar datas em Treatment               (treatment, mobile+backend)
4. V-1  → Validar startTime no DTO                    (treatment, backend)
5. A-1  → Soft delete de usuário                      (user, backend)
6. N-1  → Listener de notificação recebida            (notifications, mobile)
7. X-2  → Interceptor axios para respostas            (http, mobile)
8. O-2  → Validar birthday no OnboardingForm          (onboarding, mobile)
9. A-3  → Paginar GET /users                          (user, backend)
10. A-5 → findAll retornar array vazio                (user, backend)
```

---

## Estado do Schema Prisma (Resumo)

```prisma
model User {
  id              String        @id @default(uuid())
  name            String?
  email           String        @unique
  password        String
  role            UserRole
  pronoun         PronounEnum?
  phone_number    String?
  birthday        DateTime?
  profile_picture String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  // deletedAt   DateTime?     ← AUSENTE (necessário para soft delete)
  dailyLogs       DailyLog[]
  treatments      Treatment[]
}

model DailyLog {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String
  emotes    String[]
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  // index único: userId + date
}

model Treatment {
  id              String          @id @default(uuid())
  userId          String
  name            String
  frequency       String
  startTime       String
  endDate         DateTime
  doctorName      String?
  doctorContact   String?
  hospitalName    String?
  status          TreatmentStatus @default(ACTIVE)
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

---

## Endpoints Backend Completos (Área Pessoal)

### Daily Logs (`/daily-logs`)
```
POST   /daily-logs                  → criar entrada do diário
GET    /daily-logs                  → listar entradas (com filtros: search, date, emote)
GET    /daily-logs/report/pdf       → exportar PDF (throttle: 2/min)
GET    /daily-logs/:id              → detalhar entrada (com content)
PATCH  /daily-logs/:id              → atualizar entrada
DELETE /daily-logs/:id              → excluir (soft delete via auditoria)
```

### Treatments (`/personal/treatments`)
```
POST   /personal/treatments         → criar tratamento
GET    /personal/treatments         → listar ativos do usuário
GET    /personal/treatments/:id     → detalhar tratamento
PATCH  /personal/treatments/:id     → atualizar tratamento
DELETE /personal/treatments/:id     → soft delete (status INACTIVE)
```

### User (`/users`)
```
GET    /users                       → listar todos (sem paginação — problema A-3)
GET    /users/:id                   → detalhar usuário
PATCH  /users/:id                   → atualizar perfil
DELETE /users/:id                   → deletar conta (hard delete — problema A-1)
```

### Auth (`/auth`)
```
POST   /auth/register               → criar conta (PATIENT ou CAREGIVER)
POST   /auth/login                  → autenticar (retorna JWT + user)
PATCH  /auth/change-password        → alterar senha (autenticado)
POST   /auth/forgot-password        → solicitar reset por e-mail (throttle: 3/min)
POST   /auth/reset-password         → aplicar nova senha via token
```
