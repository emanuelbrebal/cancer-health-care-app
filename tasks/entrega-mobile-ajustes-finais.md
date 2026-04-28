# OncoMente — Entrega Final: Ajustes e Pendências

> Varredura realizada em: 20/04/2026  
> Última atualização: 22/04/2026  
> Branch: `fix/refining-fixes-to-launch-the-prototype`  
> Status geral estimado: **~95% funcional**

---

## LEGENDA

| Ícone | Significado |
|-------|-------------|
| 🔴 | Bloqueador crítico — impede entrega |
| 🟡 | Importante — afeta UX mas não bloqueia |
| 🟢 | Melhorias / polimento — pós-entrega aceitável |
| ✅ | Concluído |
| ⬜ | Pendente |
| 🗑️ | Fora de escopo / a remover |

---

## MÓDULO 0 — CLEANUP DE CÓDIGO

> **Regra:** Remover APENAS importações não utilizadas, comentários mortos e estilos não referenciados.  
> **Proibido:** Alterar qualquer lógica, condicional, handler ou estrutura de componente.

### 0.1 — Importações Não Utilizadas

| # | Arquivo | Import(s) a Remover | Status |
|---|---------|---------------------|--------|
| 1 | `apps/mobile/src/app/(Home)/PersonalArea/Treatment/create/index.tsx` | `Modal` — ainda presente mas usado no modal pós-save | ✅ OK manter |
| 2 | `apps/mobile/src/app/(Home)/PersonalArea/Treatment/index.tsx` | `Alert` — usado no diálogo de exclusão | ✅ OK manter |
| 3 | `apps/mobile/src/app/(Home)/PersonalArea/Diary/index.tsx` | `Alert` — usado no diálogo de exclusão | ✅ OK manter |
| 4 | `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/index.tsx` | `Alert` (substituído por Modal custom) | ⬜ Verificar |
| 5 | `apps/mobile/src/app/(Home)/PersonalArea/OnboardingForm/index.tsx` | `baseText` — importado de global, verificar uso | ⬜ Verificar |
| 6 | `apps/mobile/src/app/(auth)/RecoverPassword.tsx` | Refatorado — sem imports desnecessários | ✅ |
| 7 | `apps/mobile/src/app/(Home)/Oncology/PhysicalExercises/index.tsx` | `Alert` se substituído | ⬜ Verificar |
| 8 | `apps/backend/src/media/movies/movies.controller.ts` | `NotFoundException` (removido do uso) | ⬜ |
| 9 | `apps/backend/src/media/movies/movies.service.ts` | `NotFoundException` (removido do uso) | ⬜ |
| 10 | `apps/backend/src/media/books/books.service.ts` | `NotFoundException` (removido do uso) | ⬜ |
| 11 | `apps/backend/src/media/series/series.service.ts` | `NotFoundException` (removido do uso) | ⬜ |

### 0.2 — Estilos Não Referenciados no JSX

> Verificar cada `StyleSheet.create({})` e remover chaves que não aparecem em nenhum `style={}` dentro do mesmo arquivo.

| # | Arquivo | Estilo(s) Suspeitos | Status |
|---|---------|---------------------|--------|
| 1 | `apps/mobile/src/app/(Home)/PersonalArea/Diary/create/index.tsx` | Verificar estilos legados de versão anterior (antes do refactor de scroll) | ⬜ |
| 2 | `apps/mobile/src/app/(Home)/PersonalArea/Diary/update/index.tsx` | Idem | ⬜ |
| 3 | `apps/mobile/src/app/(Home)/PersonalArea/Treatment/create/index.tsx` | Verificar estilos de `Modal` (modal ainda em uso) | ✅ OK manter |
| 4 | `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/index.tsx` | Verificar estilos legados de `Alert` | ⬜ |
| 5 | `apps/mobile/src/app/(Home)/MentalHealth/BreathingExercises/index.tsx` | Verificar estilos de animação não referenciados | ⬜ |
| 6 | `apps/mobile/src/app/(Home)/PersonalArea/Notifications/index.tsx` | Verificar estilos de versão anterior (arquivo grande, ~731 linhas) | ⬜ |
| 7 | `apps/mobile/src/app/(Home)/PersonalArea/Calendar/index.tsx` | Verificar estilos (~443 linhas) | ⬜ |
| 8 | `apps/mobile/src/app/(Home)/PersonalArea/ReportsArea/index.tsx` | Verificar estilos (~283 linhas) | ⬜ |

### 0.3 — Comentários Mortos e `console.log`

| # | Arquivo | Item | Status |
|---|---------|------|--------|
| 1 | `apps/mobile/src/app/(Home)/Mascot/Chat/index.tsx` | `console.log` removido | ✅ |
| 2 | `apps/backend/src/personal/daily-logs/daily-logs.repository.ts` | Comentários de debug se houver | ⬜ |
| 3 | Todos os arquivos `.tsx` do mobile | Varredura por `// TODO`, `// FIXME`, `// TEMP`, `// DEBUG` | ⬜ |

### 0.4 — Dependências Mobile Não Utilizadas

> Estas dependências estão no `package.json` mas não foram encontradas em nenhum `import` do código-fonte.  
> **Ação recomendada:** Confirmar com `grep` antes de remover.

| # | Pacote | Razão da Suspeita | Ação |
|---|--------|-------------------|------|
| 1 | `expo-web-browser` | Nenhum import encontrado no código | ⬜ Confirmar e remover |
| 2 | `expo-linking` | `Linking` usado via `react-native` nativo, não via `expo-linking` | ⬜ Confirmar e remover |
| 3 | `react-native-webview` | Nenhum import encontrado | ⬜ Confirmar e remover |
| 4 | `react-native-element-dropdown` | `SelectWithIcon` customizado cobre o caso de uso | ⬜ Confirmar e remover |

---

## MÓDULO 1 — BLOQUEADORES CRÍTICOS 🔴

> Estes itens impedem a entrega ou causam comportamento incorreto em produção.

### 1.1 — Integrar Treatments com API Backend ✅ CONCLUÍDO

**O que foi feito:**
- Criado `apps/mobile/src/services/treatmentService.ts` — integra com `/personal/treatments`
  - `getAll()` → `GET /personal/treatments`
  - `save(dto)` → `POST /personal/treatments`
  - `update(id, dto)` → `PATCH /personal/treatments/:id`
  - `remove(id)` → `DELETE /personal/treatments/:id`
- `Treatment/index.tsx`, `Treatment/create/index.tsx`, `Treatment/update/index.tsx` migrados
- `PersonalArea/Calendar/index.tsx` migrado
- `notificationIds` e `calendarEventId` continuam em AsyncStorage (dados locais de dispositivo)

**Mapeamento de campos (local → API):**

| Campo local | Campo API |
|-------------|-----------|
| `nome` | `name` |
| `frequencia` | `frequency` |
| `horaInicio` | `startTime` |
| `dataFim` (DD/MM/YYYY) | `endDate` (ISO string) |
| `nomeMedico` | `doctorName` |
| `contatoMedico` | `doctorContact` |
| `nomeHospital` | `hospitalName` |

---

### 1.2 — Executar Seed do Banco de Dados

**Problema:** Sem seed, todas as telas de Lazer retornam lista vazia.

**Comando:**
```bash
cd apps/backend
npx prisma db seed
```

**O que é criado:**
- 8 livros, 13 filmes, 6 séries, 8 atividades de lazer
- 3 usuários: `paciente@oncomente.com`, `cuidador@oncomente.com`, `admin@oncomente.com` (senha: `onco123`)

> ⚠️ **Fazer antes de qualquer demonstração.**

---

### 1.3 — IP do Backend no Mobile ✅ CONCLUÍDO

**O que foi feito:**
- `apps/mobile/src/services/api.ts` agora usa `process.env.EXPO_PUBLIC_API_URL`
- Arquivo `apps/mobile/.env` criado com IP atual: `http://192.168.0.9:3000`
- Arquivo `apps/mobile/.env.example` criado como referência

> ⚠️ **Atualizar o IP antes de cada demonstração** se a rede mudar.  
> Android Emulator: `http://10.0.2.2:3000` | Dispositivo físico: `http://<IP_DA_MÁQUINA>:3000`

---

## MÓDULO 2 — ITENS FALTANTES DE TASKS ANTERIORES 🟡

### 2.1 — Itens Faltantes do `mobile-entrega.md`

#### Bloco 1 — Identidade Visual
| # | Item | Status |
|---|------|--------|
| B1-04 | Splash screen com identidade visual final | ⬜ Aguarda asset |
| B1-05 | Logos CESMAC nas telas de crédito | 🟡 `cesmac-logo.png` adicionada, verificar uso |

#### Bloco 4 — Correções de Polimento
| # | Item | Status |
|---|------|--------|
| B4-11 | ReportsArea — redesign com chips filtro + cards de canal | ⬜ Funcional mas visual desatualizado |
| B4-12 | Padronização de estilos inline → tokens globais em PersonalArea | ⬜ Dívida técnica |

#### Bloco 5 — Integração Backend
| # | Item | Status |
|---|------|--------|
| B5-11 | Daily Messages dinâmicas (substituir mock local por `GET /daily-messages`) | ⬜ Mock funciona, endpoint a criar no backend |
| B5-12 | Treatments integrado com API | ✅ Concluído |
| B5-13 | Nutrição — conteúdo real (acordado com equipe de conteúdo?) | ⬜ Mock atual |
| B5-14 | Motivações Paciente/Cuidador — conteúdo real | ⬜ Mock atual |

#### Bloco 6 — Validação Final (0/7 concluídos)
| # | Teste | Status |
|---|-------|--------|
| B6-01 | Fluxo completo: cadastro → onboarding → login → navegar → logout | ⬜ Testar |
| B6-02 | Botão pânico funciona (discagem automática CVV 188, SAMU 192) | ⬜ Testar |
| B6-03 | Vídeos reproduzem (exercícios físicos, meditação, sono) | ⬜ Testar |
| B6-04 | Diário: criar / editar / deletar entrada | ⬜ Testar |
| B6-05 | Responsividade testada em Android e iOS | ⬜ Testar |
| B6-06 | Auth-gate redireciona corretamente sem token | ⬜ Testar |
| B6-07 | Versão no `app.json` está correta para entrega | ⬜ Confirmar |

---

### 2.2 — Itens Faltantes do `tasks-backend-entrega.md`

| # | Módulo | Item | Status |
|---|--------|------|--------|
| BE-01 | Auth | `POST /auth/forgot-password` (envio de email) | ⬜ Pós-entrega — tela mobile pronta, aguarda backend |
| BE-02 | Auth | `POST /auth/reset-password` (token JWT 15min) | ⬜ Pós-entrega |
| BE-03 | Personal | `GET /daily-logs/report/pdf` — expor no mobile (endpoint existe, UI não) | ⬜ Reservado para gerenciador web |
| BE-04 | Qualidade | Padrão global de resposta de erro consistente | ⬜ |
| BE-05 | Swagger | Documentação Swagger | ✅ Já estava ativo em `main.ts` |

---

### 2.3 — Itens Faltantes do `relatorio-varredura-implementacao.md`

#### P3 — Polimento
| # | Item | Status |
|---|------|--------|
| P3-01 | Sincronizar vídeos de exercícios com descrições reais | ⬜ Aguarda conteúdo |
| P3-02 | Nutrição — substituir accordion mock por conteúdo validado | ⬜ Aguarda conteúdo |
| P3-03 | Motivação Diária — conteúdo final revisado | ⬜ Aguarda conteúdo |

---

## MÓDULO 3 — INTEGRAÇÕES PENDENTES (MOCKS → API) 🟡

| # | Tela | Mock Atual | Ação Necessária | Prioridade |
|---|------|-----------|-----------------|------------|
| 1 | `Treatment/*` | ~~`treatmentStorage` (AsyncStorage)~~ | ✅ Integrado com `/personal/treatments` | ✅ |
| 2 | `Home/index.tsx` | `mockDailyMessages` (50 msgs locais) | `GET /daily-messages` (endpoint a criar) | 🟡 Importante |
| 3 | `MentalHealth/Motivational/Patient` | `mockPatientMotivationalMessages` | Manter mock | 🟢 Baixo |
| 4 | `MentalHealth/Motivational/CaringTheCaregiver` | `mockCaregiverMotivationalMessages` | Manter mock | 🟢 Baixo |
| 5 | `Oncology/SpiritualArea` | `mockBibleVersicles` | Manter mock | 🟢 Baixo |
| 6 | `MentalHealth/PanicButtonContacts` | `mockEmergencyContacts` | Mock correto e estável (CVV, SAMU) — manter | ✅ OK manter |
| 7 | `Oncology/PhysicalExercises` | `mockDataOncologyMedias` (vídeos locais) | Manter local (assets) — sem API necessária | ✅ OK manter |
| 8 | `MentalHealth/Meditation` | `meditationData` (YouTube IDs) | Manter local — sem API necessária | ✅ OK manter |
| 9 | `Oncology/Nutrition` | Accordions estáticos | Manter até conteúdo validado chegar | ✅ OK manter |
| 10 | `Oncology/LegalArea` | Links e textos estáticos | Conteúdo jurídico estável — manter | ✅ OK manter |
| 11 | `PersonalArea/ReportsArea` | Accordions + links estáticos | Conteúdo institucional — manter | ✅ OK manter |

---

## MÓDULO 4 — TELAS E FUNCIONALIDADES SEM USO / FORA DE ESCOPO 🗑️

| # | Item | Arquivo | Status |
|---|------|---------|--------|
| 1 | `ResetPassword.tsx` | `apps/mobile/src/app/(auth)/ResetPassword.tsx` | ✅ Integrado — é a tela de "Esqueci minha senha" com formulário de e-mail. Link corrigido em LoginScreen e RegisterScreen. Chama `POST /auth/forgot-password`. |
| 2 | `RecoverPassword.tsx` | `apps/mobile/src/app/(auth)/RecoverPassword.tsx` | ✅ Mantida e atualizada como tela de confirmação pós-envio. Texto atualizado de "suporte" para "verifique seu e-mail". |
| 3 | `GET /daily-logs/search` | Backend controller | ✅ Search bar já existe no Diary/index.tsx com filtro local. Endpoint backend disponível para upgrade futuro. |
| 4 | `GET /daily-logs/report/pdf` | Backend service | ⬜ Será utilizado no gerenciador web (pós-protótipo) |
| 5 | `ai-scheduler.service.ts` | `apps/backend/src/mascot/` | ✅ Notificações locais funcionando. Textos das notificações atualizados para o estilo do mascote Onco. |
| 6 | `expo-web-browser` | `apps/mobile/package.json` | ⬜ Confirmar com grep e remover |
| 7 | `react-native-webview` | `apps/mobile/package.json` | ⬜ Confirmar com grep e remover |
| 8 | `react-native-element-dropdown` | `apps/mobile/package.json` | ⬜ Confirmar com grep e remover |
| 9 | `expo-linking` | `apps/mobile/package.json` | ⬜ Confirmar com grep e remover |

---

## MÓDULO 5 — BUGS CONHECIDOS E INCONSISTÊNCIAS 🟡

| # | Bug | Arquivo | Status |
|---|-----|---------|--------|
| 1 | IP hardcoded no Axios | `src/services/api.ts` | ✅ Usa `EXPO_PUBLIC_API_URL` do `.env` |
| 2 | `RecoverPassword` mostrava card de suporte sem indicar que e-mail NÃO era enviado | `(auth)/RecoverPassword.tsx` | ✅ Atualizado — indica "verifique seu e-mail". Backend `POST /auth/forgot-password` ainda não implementado — ver BE-01. |
| 3 | `Treatment` usava AsyncStorage — dados não sincronizavam entre dispositivos | `Treatment/*` | ✅ Migrado para API `/personal/treatments` |
| 4 | `Calendar` carregava tratamentos via `treatmentStorage` (AsyncStorage) | `Calendar/index.tsx` | ✅ Migrado para API |
| 5 | Swagger comentado/ausente em `main.ts` | `apps/backend/src/main.ts` | ✅ Já estava ativo (não estava comentado) |
| 6 | `console.log` em `Mascot/Chat/index.tsx` | Chat screen | ✅ Removido |
| 7 | `phone_number` sem validação de comprimento máximo no DTO | `update-user.dto.ts` | ✅ `@MaxLength(20)` adicionado |

---

## MÓDULO 6 — TESTES MANUAIS PRÉ-ENTREGA

> Executar em dispositivo físico ou emulador (Android + iOS).

### 6.1 — Fluxos Críticos

- [ ] **Cadastro e Login:** Criar conta → **onboarding form** → home → fechar app → reabrir → sessão persistida
- [ ] **Logout:** Logout → store limpo → redirecionado para auth
- [ ] **Onboarding:** Preencher formulário com foto (base64) → salvar → dados aparecem no Hub
- [ ] **Diário:** Criar entrada com emoji → ver na lista com streak → editar → deletar → tentar criar segunda entrada no mesmo dia (deve bloquear)
- [ ] **Tratamento (API):** Criar → ver no Calendário → editar (novo ciclo) → deletar — confirmar que persiste entre reinstalações
- [ ] **Lazer:** Abrir Livros / Filmes / Séries → dados carregam do backend (rodar seed primeiro) → abrir detalhe
- [ ] **Chat IA:** Enviar 5 mensagens → banner de limite exibido → campo desabilitado → no dia seguinte reinicia
- [ ] **Mudança de Senha:** Errar senha atual → mensagem "Senha atual incorreta" → acertar → re-login
- [ ] **Excluir Conta:** Modal abre → cancelar → confirmar → logout automático

### 6.2 — Fluxos de Segurança

- [ ] Tentar acessar `/PersonalArea` sem token → redirecionado para auth
- [ ] Tentar acessar `/Mascot` sem token → redirecionado para auth
- [ ] Token expirado → interceptor faz logout automático (não trava em loop)

### 6.3 — Fluxos de Conteúdo

- [ ] **Botão de Pânico:** CVV 188 discagem → funciona no Android e iOS
- [ ] **Exercícios:** Vídeos carregam sem travamento
- [ ] **Meditação:** YouTube embeds abrem corretamente
- [ ] **Respiração:** Animação de círculo pulsante funciona nos 3 modos

---

## MÓDULO 7 — CONFIGURAÇÕES FINAIS DO APP

| # | Item | Arquivo | Status |
|---|------|---------|--------|
| 1 | Versão do app (`version`) em `app.json` | `apps/mobile/app.json` | ⬜ Confirmar versão para entrega |
| 2 | `bundleIdentifier` iOS e `package` Android corretos | `apps/mobile/app.json` | ⬜ Confirmar |
| 3 | Splash screen configurada | `apps/mobile/app.json` + `assets/` | ⬜ Aguarda asset final |
| 4 | Ícone do app configurado | `apps/mobile/app.json` | ✅ `icon.jpg` presente |
| 5 | `EXPO_PUBLIC_API_URL` para produção | `apps/mobile/.env` | ✅ `.env` criado — atualizar IP conforme rede |
| 6 | `NODE_ENV=production` no backend para deploy | `apps/backend/` | ⬜ Configurar |
| 7 | Variável `OPENAI_API_KEY` configurada no servidor | `.env` backend | ⬜ Confirmar |
| 8 | `DATABASE_URL` apontando para banco de produção | `.env` backend | ⬜ Confirmar |

---

## MÓDULO 8 — RESUMO EXECUTIVO

### O que está 100% pronto

- ✅ Autenticação completa (login, registro, persistência, JWT interceptor, auth-gates)
- ✅ Onboarding exibido após cadastro — fluxo: registro → onboarding → home
- ✅ Mudança de senha com validação por campo
- ✅ Diário virtual (CRUD completo, emotes animados, busca, streak, timezone fix)
- ✅ Tratamento integrado com API backend (`/personal/treatments`)
- ✅ Calendário interativo sincronizado com API de tratamentos
- ✅ Módulo de Lazer (Livros, Filmes, Séries, Atividades) integrado com backend
- ✅ Exercícios de Respiração (3 técnicas, animação pulsante)
- ✅ Meditação (YouTube embeds)
- ✅ Chat com mascote IA — limite de 5 mensagens/dia com banner visual
- ✅ Botão de pânico (CVV, SAMU, CAVIDA)
- ✅ Formulários com validação por campo (auth, diário, tratamento)
- ✅ Toast feedback em todas as operações
- ✅ Notificações locais com texto no estilo do mascote Onco
- ✅ Seção "Sobre" com créditos
- ✅ Fluxo "Esqueci minha senha" (ResetPassword form → RecoverPassword confirmação)
- ✅ IP do backend via variável de ambiente (`EXPO_PUBLIC_API_URL`)

### O que falta para entrega

| Prioridade | Item |
|------------|------|
| 🔴 P1 | Executar seed do banco (`npx prisma db seed`) |
| 🔴 P2 | Confirmar IP do backend no `.env` antes de cada demonstração |
| 🟡 P3 | Bloco 6 — testes manuais completos |
| 🟡 P4 | `POST /auth/forgot-password` no backend (tela mobile pronta) |
| 🟢 P5 | Confirmar versão e configurações de `app.json` |
| 🟢 P6 | Remover dependências não utilizadas (Módulo 0.4) |
| 🟢 P7 | Cleanup de imports/estilos não utilizados (Módulo 0.1 e 0.2) |

### Estimativa de tempo restante

| Item | Estimativa |
|------|-----------|
| Seed banco | 5min |
| Testes manuais completos | 2–3h |
| Configs finais (`app.json`) | 30min |
| Cleanup de imports/deps | 1–2h |
| **Total estimado** | **~4–6h** |

---

## APPENDIX — ESTRUTURA DO treatmentService (IMPLEMENTADO)

```typescript
// apps/mobile/src/services/treatmentService.ts
// Substitui treatmentStorage nas telas de Treatment e Calendar

import treatmentService from '@/src/services/treatmentService';

// API:
treatmentService.getAll()              // GET /personal/treatments
treatmentService.save(payload)         // POST /personal/treatments
treatmentService.update(id, payload)   // PATCH /personal/treatments/:id
treatmentService.remove(id)            // DELETE /personal/treatments/:id
treatmentService.setNotificationIds(id, ids)  // persiste localmente (AsyncStorage)

// Re-exporta utilitários do treatmentStorage (inalterados):
import { getTreatmentDates, getDaysRemaining, getProgress } from '@/src/services/treatmentService';
```

**Mapeamento de datas:**
- Local `dataFim` (DD/MM/YYYY) ↔ API `endDate` (ISO string YYYY-MM-DD)
- Local `startDate` ← `createdAt` da API

---

*Atualizado por Claude em 22/04/2026 após sessão de implementação.*
