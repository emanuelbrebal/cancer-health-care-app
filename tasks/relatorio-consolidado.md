# OncoMente — Relatório Consolidado de Entrega

> Gerado em: 2026-04-20
> Fontes: `mobile-entrega.md`, `tasks-backend-entrega.md`, `entrega-mobile-pt2.md`

---

## Visão Geral

| Frente | Concluído | Total | % |
|---|---|---|---|
| **Mobile (todos os blocos)** | ~115 | ~137 | **~84%** |
| **Backend (todos os módulos)** | 26 | 30 | **87%** |
| **Auth Mobile (pt2)** | 17 | 17 | **100% ✅** |

---

## 🟢 CONCLUÍDO

### Mobile

#### Identidade Visual
- [x] Ícone do app (`icon.jpg`)
- [x] Tela "Sobre o Projeto" com créditos e versão
- [x] Rota `/About` no Hub

#### Telas (todas implementadas)
- [x] Oncologia: Leisure, Nutrition, SpiritualArea, LegalArea
- [x] Saúde Mental: BreathingExercises, PsychologicalSupport, Motivational (Patient + Caregiver), PanicButtonContacts
- [x] Área Pessoal: OnboardingForm, AccountConfigurations, Treatment (index + create + update), Calendar, Notifications, ReportsArea, Diary (index + create + update)
- [x] Listagem + detalhe: Books, Movies, Series, Activities, PhysicalExercises

#### Integrações com Backend
- [x] Auth: login, register, change-password, logout, delete account
- [x] Onboarding: `PATCH /users/:id` com upload de avatar (base64)
- [x] Diário: `GET/POST/PATCH/DELETE /daily-logs`
- [x] Lazer: `GET /books`, `/movies`, `/series`, `/leisures`
- [x] Mascote: `POST /ai-support/ask`

#### Funcionalidades Avançadas
- [x] Calendário interativo: multi-dot por tratamento, modal por dia, métricas de progresso, campanhas oncológicas (6 meses)
- [x] Notificações push locais: agendamento por dose, cancelamento ao deletar, histórico
- [x] Toast feedback em todas as ações: `react-native-toast-message` instalado, `toastService` unificado
- [x] Auth-gate com `useFocusEffect` em Mascot e PersonalArea
- [x] Interceptor JWT 401 com logout automático
- [x] Persistência de sessão via Zustand + AsyncStorage

#### Componentes Reutilizáveis
- [x] `DateInput` com máscara DD/MM/AAAA
- [x] `PhoneInput` com máscara (XX) XXXXX-XXXX
- [x] `SearchBar` com filtro local (Books, Movies, Series, Activities)
- [x] `SoftLoginModal` (sem handle bar, oculto se autenticado)

#### UX e Polimento
- [x] Exercícios de respiração com animação pulsante e countdown
- [x] Meditação guiada redesenhada com cards e metadata
- [x] Apoio Psicológico redesenhado com badges e links externos
- [x] Contatos de Emergência com accordions coloridos e badges de número
- [x] Campos opcionais sinalizados em formulários
- [x] `KeyboardAvoidingView` em todos os formulários

---

### Backend

- [x] `POST /auth/register` e `/auth/login`
- [x] `PATCH /auth/change-password` com `JwtAuthGuard`
- [x] `PATCH /users/:id` com `UpdateUserDto` corrigido (`@Type(() => Date)`)
- [x] `DELETE /users/:id`
- [x] `GET /books`, `/movies`, `/series`, `/leisures` (sem 404 em lista vazia)
- [x] `GET/POST/PATCH/DELETE /daily-logs` com auditoria
- [x] `POST /ai-support/ask`
- [x] **`GET/POST/PATCH/DELETE /treatments`** — módulo criado do zero (migration + schema + CRUD completo)
- [x] `ValidationPipe({ transform: true })` em `main.ts`
- [x] Limite de payload 5MB para upload de avatar

---

## 🔴 BLOQUEADORES DE ENTREGA

> Itens que precisam ser resolvidos antes do deploy/apresentação.

### 1. Executar Seed no Banco
```bash
cd apps/backend
npx prisma db seed
```
Popula: 8 livros, 13 filmes, 6 séries, 8 atividades, 3 usuários de teste.
**Impacto**: sem seed, as telas de Lazer (Books, Movies, Series, Activities) aparecem vazias.

### 2. Integrar Treatment com o Backend *(recém desbloqueado)*
O backend de `treatments` foi implementado ontem. O mobile ainda usa AsyncStorage.

**Mobile a fazer:**
- Criar `treatmentService.ts` com `GET/POST/PATCH/DELETE /treatments`
- Substituir AsyncStorage em `Treatment/index`, `create` e `update` por chamadas à API

### 3. Bloco 6 — Validação Final (7 testes manuais)
- [ ] Fluxo completo: cadastro → login → navegação → logout
- [ ] Botão de Pânico (discagem automática CVV/SAMU/CAVIDA)
- [ ] Visualização de vídeos (exercícios físicos, meditação, sono)
- [ ] Diário: criar, editar, excluir entrada
- [ ] Responsividade em Android e iOS
- [ ] Auth-gate redireciona corretamente
- [ ] Versão correta no `app.json`

---

## 🟡 PENDENTE (não-bloqueante)

| Item | Arquivo | Prioridade |
|---|---|---|
| Splash screen e logos CESMAC | Bloco 1 | Alta (aguarda arquivos externos) |
| Padronização de estilos inline | Bloco 4 / 8.8 | Baixa |
| Redesenhar ReportsArea (chips + cards de denúncia) | Bloco 8.7 | Baixa |
| Exportar PDF do Diário no mobile | Módulo 4.2 backend | Baixa |
| Padrão global de resposta de erro no backend | Módulo 8.2 | Média |
| Transformar mocks em seeders (motivacional, respiração, etc.) | Bloco 7 | Baixa |

---

## ⏳ PÓS-ENTREGA (dívida técnica conhecida)

| Item | Descrição |
|---|---|
| `POST /auth/forgot-password` | Reset de senha por e-mail (nodemailer + JWT 15min) |
| `POST /auth/reset-password` | Validação de token e salvamento de nova senha |
| `GET/POST/PATCH /notifications` | Backend de notificações push (push remoto) |
| `GET /campaigns/current-month` | Endpoint de campanhas (hoje é mock local) |
| Validar token ao focar no app | Verificação de expiração do JWT ao retornar ao app |
| Notificações push remotas | Expo Push Token + envio pelo backend |
| `expo-notifications` no dev build | Funcionalidade completa requer build nativo |

---

## 📋 Próximos Passos Recomendados (ordem)

```
1. npx prisma db seed                    → desbloqueia telas de Lazer
2. Criar treatmentService.ts             → migra Treatment de mock para API
3. Substituir AsyncStorage em Treatment  → completa integração
4. Bloco 6 — validação manual            → smoke test pré-entrega
5. Splash screen / logos                 → aguarda arquivos do cliente
```

---

## Endpoints por Status

| Endpoint | Método | Status |
|---|---|---|
| `/auth/register` | POST | ✅ |
| `/auth/login` | POST | ✅ |
| `/auth/change-password` | PATCH | ✅ |
| `/auth/forgot-password` | POST | ⏳ pós-entrega |
| `/auth/reset-password` | POST | ⏳ pós-entrega |
| `/users/:id` | PATCH | ✅ |
| `/users/:id` | DELETE | ✅ |
| `/books` | GET | ✅ |
| `/movies` | GET | ✅ |
| `/series` | GET | ✅ |
| `/leisures` | GET | ✅ |
| `/daily-logs` | GET/POST/PATCH/DELETE | ✅ |
| `/daily-logs/report/pdf` | GET | ⚙️ existe no backend, não exposto no mobile |
| `/ai-support/ask` | POST | ✅ |
| `/treatments` | GET/POST/PATCH/DELETE | ✅ |
| `/notifications` | GET/POST/PATCH | ⏳ pós-entrega |
| `/campaigns/current-month` | GET | ⏳ pós-entrega |
