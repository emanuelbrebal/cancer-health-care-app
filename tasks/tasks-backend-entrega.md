# Backend — Checklist de Entrega

> **Contexto**: API NestJS + Prisma + PostgreSQL. Módulos de auth, media e diary já existem. Faltam: mudança de senha, tratamentos, notificações locais e ajustes de exceção.
> Relatório de origem: `tasks/integration-report.md`

---

## Progresso Geral

| | Concluído | Total | % |
|---|---|---|---|
| **Módulo 1 — Auth e Conta** | 5 | 6 | 83% |
| **Módulo 2 — Media (Books/Movies/Series)** | 3 | 4 | 75% |
| **Módulo 3 — Lazer (Leisures)** | 2 | 2 | 100% ✅ |
| **Módulo 4 — Diário** | 5 | 6 | 83% |
| **Módulo 5 — Tratamentos** | 5 | 5 | 100% ✅ |
| **Módulo 6 — Notificações** | 4 | 4 | 100% ✅ |
| **Módulo 7 — Campanhas de Saúde** | 2 | 2 | 100% ✅ |
| **Módulo 8 — Qualidade e Exceções** | 4 | 5 | 80% |

> Atualize manualmente ao marcar cada `[ ]` como `[x]`.

---

## MÓDULO 1 — Auth e Conta de Usuário

### 1.1 Existente e funcionando
- [x] `POST /auth/register` — cadastro de usuário
- [x] `POST /auth/login` — login com retorno de JWT + dados do usuário

### 1.2 Backend existe, mobile não conecta
- [x] **Wiring de `PATCH /users/:id`** — `OnboardingForm` conectado. `UpdateUserDto` corrigido: `@Type(() => Date)` + `@IsDate()` no campo `birthday`. `ValidationPipe({ transform: true })` em `main.ts`.
- [x] **Wiring de `DELETE /users/:id`** — `AccountConfigurations` conectado: `Alert` de confirmação + `api.delete` + `logout()` + redirect.

### 1.3 Criar no backend
- [x] **`PATCH /auth/change-password`** — endpoint implementado em `auth.controller.ts` com `JwtAuthGuard`, `ChangePasswordDto` e `authService.changePassword`.
- [ ] **`POST /auth/forgot-password`** ⚠️ pós-entrega — envio de e-mail com token de reset (nodemailer + JWT temporário de 15min).
- [ ] **`POST /auth/reset-password`** ⚠️ pós-entrega — valida token e salva nova senha.

---

## MÓDULO 2 — Media (Books / Movies / Series)

### 2.1 Existente e funcionando
- [x] `GET /books` — lista livros (seed com 8 itens)
- [x] `GET /movies` — lista filmes (seed com 13 itens)
- [x] `GET /series` — lista séries (seed com 6 itens)

### 2.2 Correções aplicadas
- [x] **`findAll` não lança 404 quando vazio** — corrigido em `books.service.ts`, `movies.service.ts`, `series.service.ts`. Agora retornam array vazio.

### 2.3 Pendências
- [ ] **Executar seed** — dados existem em `prisma/seed.ts` mas banco pode estar vazio. Rodar: `cd apps/backend && npx prisma db seed`

---

## MÓDULO 3 — Atividades de Lazer (Leisures)

### 3.1 Existente e funcionando
- [x] `GET /leisures` — lista atividades (seed com 8 itens, `findAll` já retorna array vazio sem 404)

### 3.2 Pendências
- [x] **`findAll` não lança 404 quando vazio** — confirmado: `leisures.service.ts` retorna `this.repository.findAll()` sem lançar exceção. ✅

---

## MÓDULO 4 — Diário Virtual (Daily Logs)

### 4.1 Existente e funcionando
- [x] `POST /daily-logs` — criar entrada
- [x] `GET /daily-logs` — listar por usuário
- [x] `PATCH /daily-logs/:id` — atualizar
- [x] `DELETE /daily-logs/:id` — deletar
- [x] `GET /daily-logs/:id` — buscar por ID

### 4.2 Pendências
- [ ] **Expor `GET /daily-logs/report/pdf`** no mobile — endpoint já existe em `daily-logs.controller.ts`. Ação: criar botão "Exportar PDF" na tela `Diary/index.tsx` com download via `expo-file-system` + `expo-sharing`.

---

## MÓDULO 5 — Tratamentos e Medicamentos

> ⚠️ Nenhum endpoint existe. Mobile usa mock sem persistência (`router.back()` sem salvar).

### 5.1 Schema Prisma (criar migration)

```prisma
model Treatment {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String
  frequency       String
  startTime       String
  endDate         DateTime
  doctorName      String?
  doctorContact   String?
  hospitalName    String?
  status          String    @default("ACTIVE")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("treatments")
}
```

### 5.2 Endpoints a criar

- [x] **`POST /treatments`** — implementado em `treatments.controller.ts` com JWT guard
- [x] **`GET /treatments`** — lista apenas `status = ACTIVE` do usuário autenticado
- [x] **`PATCH /treatments/:id`** — atualiza com validação de ownership
- [x] **`DELETE /treatments/:id`** — soft delete (`status = INACTIVE`)

### 5.3 Estrutura de arquivos a criar

```
apps/backend/src/personal/treatments/
├── treatments.module.ts
├── treatments.controller.ts
├── treatments.service.ts
├── treatments.repository.ts
├── dto/
│   ├── create-treatment.dto.ts
│   └── update-treatment.dto.ts
└── mappers/
    └── treatment-mapper.ts
```

- [x] **Registrar módulo** — `TreatmentsModule` registrado em `app.module.ts`

---

## MÓDULO 6 — Notificações

> ⚠️ Abordagem recomendada para entrega: **notificações locais via `expo-notifications`** (sem backend). Backend de notificações push fica para pós-entrega.

### 6.1 Mobile — `expo-notifications` (sem backend)

- [x] **Instalar e configurar** `expo-notifications` — instalado, `notificationService.ts` criado, handler de foreground configurado, listener em `_layout.tsx`.
- [x] **Agendar ao criar tratamento** — `scheduleTreatmentNotifications()` + `scheduleEndOfTreatmentNotification()` chamados em `Treatment/create`. IDs salvos no AsyncStorage.
- [x] **Cancelar ao deletar tratamento** — `cancelTreatmentNotifications(item.notificationIds)` chamado em `Treatment/index` antes de remover do storage.
- [x] **Histórico na tela `Notifications/index.tsx`** — carrega histórico do AsyncStorage + `getAllScheduledNotificationsAsync`. Seções: Novas, Anteriores, Agendadas.

### 6.2 Backend — pós-entrega

> Não implementar agora. Registrar como dívida técnica.

```
POST   /notifications           → criar notificação
GET    /notifications           → listar por usuário
PATCH  /notifications/:id/read  → marcar como lida
```

---

## MÓDULO 7 — Campanhas de Saúde (Conscientização)

> Abordagem: mock local mapeado por mês. Sem backend por enquanto.

### 7.1 Mobile — array mock local

- [x] **Campanhas oncológicas implementadas** — mapa com 6 campanhas em `Calendar/index.tsx`: Fevereiro Laranja, Março Lilás, Junho Laranja, Setembro Dourado, Outubro Rosa, Novembro Azul. Card não exibido em meses sem campanha oncológica.
- [x] **Integrado no `Calendar/index.tsx`** — card dinâmico exibido no topo com base em `new Date().getMonth() + 1`.

---

## MÓDULO 8 — Qualidade, Exceções e Seed

### 8.1 Exceções — corrigido
- [x] `books.service.ts` — `findAll` retorna array vazio (não lança 404)
- [x] `movies.service.ts` — `findAll` retorna array vazio (não lança 404)
- [x] `series.service.ts` — `findAll` retorna array vazio (não lança 404)

### 8.2 Exceções — pendente
- [x] **Verificar `leisures.service.ts`** — confirmado: `findAll` retorna array sem lançar 404. ✅
- [ ] **Padrão de resposta de erro** — garantir que todos os controllers retornem erros no formato `{ message, statusCode }` sem expor stack trace em produção. Revisar `app.module.ts` para filtro global de exceções.

### 8.3 Seed
- [ ] **Executar seed no banco de dados**:
  ```bash
  cd apps/backend
  npx prisma db seed
  ```
  Popula: 8 livros, 13 filmes, 6 séries, 8 atividades de lazer, 3 usuários de teste.

---

## Ordem de Execução Recomendada

```
1. Executar seed (Módulo 8.3)           → desbloqueia Books/Movies/Series/Leisures
2. PATCH /auth/change-password           → desbloqueia "Mudar senha" no mobile
3. Wiring PATCH /users/:id              → desbloqueia OnboardingForm
4. Wiring DELETE /users/:id             → desbloqueia exclusão de conta
5. Módulo Treatments (schema + CRUD)    → desbloqueia Treatment screens
6. expo-notifications no mobile         → desbloqueia Notificações locais
7. Mock de campanhas (Módulo 7)         → desbloqueia Calendar dinâmico
8. Exportar PDF do Diário               → feature extra, baixa prioridade
```

---

## Resumo de Endpoints por Status

| Endpoint | Método | Status |
|----------|--------|--------|
| `/auth/register` | POST | ✅ |
| `/auth/login` | POST | ✅ |
| `/auth/change-password` | PATCH | ✅ |
| `/auth/forgot-password` | POST | ⏳ pós-entrega |
| `/auth/reset-password` | POST | ⏳ pós-entrega |
| `/users/:id` | PATCH | ✅ conectado + UpdateUserDto corrigido |
| `/users/:id` | DELETE | ✅ conectado |
| `/books` | GET | ✅ |
| `/movies` | GET | ✅ |
| `/series` | GET | ✅ |
| `/leisures` | GET | ✅ |
| `/daily-logs` | GET/POST/PATCH/DELETE | ✅ |
| `/daily-logs/report/pdf` | GET | ⚙️ existe, não exposto |
| `/ai-support/ask` | POST | ✅ |
| `/treatments` | GET/POST/PATCH/DELETE | ✅ |
| `/notifications` | GET/POST/PATCH | ⏳ pós-entrega |
| `/campaigns/current-month` | GET | ⏳ pós-entrega (mock local por ora) |
