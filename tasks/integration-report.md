# Relatório de Integração Backend — OncoMente Mobile

> Gerado em: 2026-04-18  
> Branch: `feat/mobile-tasks-pt2`

---

## 1. Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Integrado e funcionando |
| ⚙️ | Backend existe, mas NÃO está conectado no mobile |
| ❌ | Backend NÃO existe — endpoint a ser criado |
| 🟡 | Parcialmente integrado ou com ressalvas |
| 🔒 | Requer autenticação JWT |

---

## 2. Estado Atual por Módulo

### 2.1 Autenticação (`/auth`)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Registro | `POST /auth/register` | ✅ Integrado |
| Login | `POST /auth/login` | ✅ Integrado |
| Logout | — (JWT stateless, clear Zustand) | ⚙️ Frontend não implementado |
| Recuperar senha por e-mail | — | ❌ Não existe |
| Resetar senha (autenticado) | — | ❌ Não existe |

**Observação**: `auth.controller.ts` tem apenas `register` e `login`. Para logout basta limpar o store Zustand (sem chamada backend). Para reset de senha é necessário criar endpoint + lógica de e-mail (nodemailer).

---

### 2.2 Usuário (`/users`) 🔒

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar todos | `GET /users` | ⚙️ Admin only, não usado no mobile |
| Buscar por ID | `GET /users/:id` | ⚙️ Existe, mas não usado |
| Atualizar perfil | `PATCH /users/:id` | ⚙️ Existe, OnboardingForm NÃO salva |
| Deletar conta | `DELETE /users/:id` | ⚙️ Existe, AccountConfigurations NÃO chama |

**Problema crítico**: `OnboardingForm/index.tsx` coleta dados do usuário mas não faz `PATCH /users/:id`. Os dados nunca são salvos no backend.

---

### 2.3 Diário Virtual (`/daily-logs`) 🔒

| Operação | Endpoint | Status |
|----------|----------|--------|
| Criar entrada | `POST /daily-logs` | ✅ Integrado |
| Listar entradas | `GET /daily-logs` | ✅ Integrado |
| Buscar por ID | `GET /daily-logs/:id` | ✅ Integrado |
| Atualizar | `PATCH /daily-logs/:id` | ✅ Integrado |
| Deletar | `DELETE /daily-logs/:id` | ✅ Integrado |
| Exportar PDF | `GET /daily-logs/report/pdf` | ⚙️ Existe no backend, não exposto no mobile |

---

### 2.4 Livros (`/books`)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar | `GET /books` | ✅ Integrado |
| Detalhe | `GET /books/:id` | 🟡 Serviço existe, tela usa params de rota |

---

### 2.5 Filmes (`/movies`)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar | `GET /movies` | ✅ Integrado |
| Detalhe | `GET /movies/:id` | 🟡 Serviço existe, tela usa params de rota |

---

### 2.6 Séries (`/series`)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar | `GET /series` | ✅ Integrado |
| Detalhe | `GET /series/:id` | 🟡 Serviço existe, tela usa params de rota |

---

### 2.7 Atividades de Lazer (`/leisures`)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar | `GET /leisures` | ✅ Integrado |
| Detalhe | `GET /leisures/:id` | 🟡 Serviço existe, tela usa params de rota |

---

### 2.8 Mascote Virtual (`/ai-support`) 🔒

| Operação | Endpoint | Status |
|----------|----------|--------|
| Perguntar ao mascote | `POST /ai-support/ask` | ✅ Integrado |

---

### 2.9 Tratamentos / Medicamentos

| Operação | Endpoint | Status |
|----------|----------|--------|
| Criar tratamento/remédio | — | ❌ Não existe |
| Listar tratamentos | — | ❌ Não existe |
| Atualizar | — | ❌ Não existe |
| Deletar | — | ❌ Não existe |

**Impacto**: `Treatment/create`, `Treatment/update`, `Treatment/index.tsx` todos mockados e não salvam dados. Funcionalidade completamente desconectada.

---

### 2.10 Notificações

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar notificações | — | ❌ Não existe |
| Criar notificação | — | ❌ Não existe |
| Marcar como lida | — | ❌ Não existe |
| Push Notification scheduling | — | ❌ Não existe |

**Observação**: `Notifications/index.tsx` exibe mock estático. Não há integração com sistema de push real.

---

### 2.11 Calendário / Eventos

| Operação | Endpoint | Status |
|----------|----------|--------|
| Criar evento | — | ❌ Não existe |
| Listar eventos | — | ❌ Não existe |
| Integrar calendário nativo | — | ❌ Não implementado |

**Observação**: `Calendar/index.tsx` é estático. Dados hardcoded. Sem interação real.

---

### 2.12 Campanhas de Saúde (Conscientização)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Listar campanhas do mês | — | ❌ Não existe |

**Observação**: Apenas o "Março Lilás" está hardcoded no Calendar. Deve ser seed mock no backend ou array local.

---

### 2.13 Espaço de Denúncias (ReportsArea)

| Operação | Endpoint | Status |
|----------|----------|--------|
| Submeter denúncia | — | ❌ Não existe |
| Listar canais externos | — | ✅ Dados locais estáticos (correto) |

---

## 3. Resumo Quantitativo

| Categoria | Qtd |
|-----------|-----|
| ✅ Totalmente integrado | 12 operações |
| ⚙️ Backend existe, mobile NÃO conecta | 6 operações |
| ❌ Backend NÃO existe | 14 operações |

---

## 4. Prioridades para Entrega (com redução de escopo)

### CRÍTICO — Fazer antes da entrega

| Item | Abordagem recomendada | Esforço |
|------|-----------------------|---------|
| **Logout** | Limpar store Zustand + `router.replace('/(auth)/LoginScreen')` — sem backend | Baixo (1h) |
| **Deletar conta** | Chamar `DELETE /users/:id` (endpoint já existe) + limpar store | Baixo (2h) |
| **Salvar perfil** | Chamar `PATCH /users/:id` no `OnboardingForm` (endpoint já existe) | Baixo (2h) |
| **Reset de senha (autenticado)** | `PATCH /users/:id` com campo `password` — sem e-mail | Médio (4h) |
| **Notificações locais** | `expo-notifications` para agendar no dispositivo ao criar tratamento — sem backend | Médio (6h) |
| **Calendário nativo** | `expo-calendar` para criar evento no Google Calendar / calendário do device ao criar tratamento | Médio (6h) |

### REDUZIR ESCOPO — Simplificar para entrega

| Item original | Versão reduzida para entrega |
|---------------|------------------------------|
| Backend de tratamentos completo | Manter mock local com AsyncStorage; criar backend após entrega |
| Backend de notificações | Usar `expo-notifications` local; disparar ao cadastrar tratamento |
| Recuperar senha por e-mail | Não entregar na v1 — exibir mensagem "Contate o suporte" |
| Campanhas de conscientização | Array mock local mapeado por mês (sem backend) |
| Métricas de tratamento | Calcular a partir dos dados locais mockados |

### PODE ESPERAR — Pós-entrega

| Item | Justificativa |
|------|---------------|
| Backend de tratamentos | Exige Prisma migration + módulo completo |
| Backend de notificações push | Exige Firebase FCM ou serviço externo |
| Recuperação de senha por e-mail | Exige configuração de SMTP / SES |
| Exportar PDF do diário | Endpoint existe, mas integração no mobile é baixa prioridade |
| Módulo de denúncias formal | Canal externo já resolve o caso de uso |

---

## 5. Pendências Críticas Detectadas

1. **`OnboardingForm` não salva** — usuário preenche nome/pronome/telefone/nascimento mas os dados nunca chegam ao backend. `PATCH /users/:id` não é chamado.
2. **`AccountConfigurations > "Encerrar sessão"` não funciona** — `securityData` tem a rota mas sem handler de logout.
3. **`AccountConfigurations > "Desativar conta"` não funciona** — sem confirmação, sem chamada API.
4. **`Treatment/create` não persiste** — `handleUpdate` apenas faz `router.back()`.
5. **Calendário completamente estático** — `markedDates` e barra de progresso são hardcoded.
6. **"Mudar senha" em `AccountConfigurations`** — rota aponta para `/(auth)/RecoverPassword` que provavelmente não existe ou não está implementada para mudança de senha autenticada.

---

## 6. Endpoints a Criar no Backend (por prioridade)

### Alta prioridade (bloqueia funcionalidade core)

```
PATCH  /auth/change-password    → troca senha autenticada (requer senha atual + nova)
```

### Média prioridade (feature completa)

```
POST   /treatments              → criar tratamento/remédio
GET    /treatments              → listar por usuário
PATCH  /treatments/:id          → atualizar
DELETE /treatments/:id          → deletar (soft delete)
```

### Baixa prioridade (pós-entrega)

```
POST   /auth/forgot-password    → envia e-mail com link de reset
POST   /auth/reset-password     → valida token + troca senha
GET    /campaigns/current-month → retorna campanhas do mês atual
POST   /notifications           → criar notificação para usuário
GET    /notifications           → listar por usuário
PATCH  /notifications/:id/read  → marcar como lida
```
