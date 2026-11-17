# OncoMente — Relação de Requisitos Implementados

> Base: branch `feat/ReleaseDocs` (16/11/2026). Cada item cita onde está no código.
> Uso: transcrever para o documento oficial de requisitos. Itens marcados **Parcial** ou **Não implementado** devem constar como tal.
> Caminhos: mobile = `apps/mobile/src/app/(Home)/…`; backend = `apps/backend/src/…`.

---

## 1. Requisitos funcionais

### 1.1 Autenticação e conta

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-A01 | Cadastro com nome, e-mail, senha e tipo de conta (Paciente/Cuidador) | Implementado | `(auth)/RegisterScreen.tsx`; `POST /auth/register` |
| RF-A02 | Login com e-mail e senha | Implementado | `(auth)/LoginScreen.tsx`; `POST /auth/login` |
| RF-A03 | Recuperação de senha por código enviado por e-mail (uso único) | Implementado | `(auth)/RecoverPassword.tsx`, `ResetPassword.tsx`; `POST /auth/forgot-password`, `/auth/reset-password` |
| RF-A04 | Troca de senha com a senha atual | Implementado | `PersonalArea/AccountConfigurations/ChangePassword`; `PATCH /auth/change-password` |
| RF-A05 | Encerrar sessão invalidando-a no servidor | Implementado | `POST /auth/logout`; `apps/mobile/src/services/auth.ts` |
| RF-A06 | Edição de perfil: nome, pronome, telefone, nascimento e foto | Implementado | `PersonalArea/OnboardingForm`; `PATCH /users/:id` (dono ou ADMIN) |
| RF-A07 | Suspender acesso preservando os dados; reativar no login com confirmação | Implementado | `AccountConfigurations/index.tsx`; `POST /users/me/suspend`; `auth.service.ts` (`ACCOUNT_SUSPENDED`, `reactivate`) |
| RF-A08 | Excluir conta e todos os dados do titular de forma definitiva | Implementado | `AccountConfigurations/index.tsx`; `DELETE /users/:id` (dono ou ADMIN); `user/user.service.ts` (`remove`) |

### 1.2 Área Oncológica (pública)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-O01 | Autocuidado: sono, nutrição, exercícios físicos e espiritualidade | Implementado (conteúdo estático no app) | `Oncology/Sleep`, `Nutrition`, `PhysicalExercises`, `SpiritualArea` |
| RF-O02 | Lazer: livros, filmes, séries e atividades, com tela de detalhe | Implementado | `Oncology/Leisure/*`; `GET /books`, `/movies`, `/series`, `/leisures` |
| RF-O03 | Direitos do paciente (Lei 12.732/2012, FGTS, auxílio-doença, IR) | Implementado | `Oncology/LegalArea` |
| RF-O04 | Lei 13.896/2019 (30 dias para exames) | **Não implementado** | — |

### 1.3 Saúde Mental (pública)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-S01 | Exercícios de respiração guiados (4-7-8, quadrada, calma rápida) | Implementado | `MentalHealth/BreathingExercises` |
| RF-S02 | Meditação guiada em vídeo | Implementado | `MentalHealth/Meditation` |
| RF-S03 | Onde buscar apoio psicológico gratuito | Implementado | `MentalHealth/PsychologicalSupport` |
| RF-S04 | Conteúdo motivacional segmentado (paciente × cuidador), o do papel do usuário primeiro | Implementado | `MentalHealth/Motivational/*`; `MentalHealth/index.tsx` |
| RF-S05 | Botão de emergência (fixo nas telas de Saúde Mental) com discagem para CVV (188), SAMU (192), CAVIDA e Disque Saúde (136), sem login nem consentimento | Implementado | `MentalHealth/_layout.tsx`; `components/ui/Buttons/Overlay/PanicButton/*`; `MentalHealth/PanicButtonContacts` |

### 1.4 Área Pessoal (autenticada)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-P01 | Diário: criar, listar, editar e excluir; um registro por dia; humor por emoji | Implementado | `PersonalArea/Diary/*`; `/daily-logs` |
| RF-P02 | Busca no diário pelo título | Implementado (filtro local) | `Diary/index.tsx` |
| RF-P03 | Busca no servidor por termo, data e humor | Implementado só no backend | `GET /daily-logs/search` |
| RF-P04 | Relatório emocional em PDF por período | Implementado só no backend | `GET /daily-logs/report/pdf` (2 req/min) |
| RF-P05 | Tratamentos: cadastrar, listar, editar e excluir (medicamento, frequência, horário, término, médico, hospital) | Implementado | `PersonalArea/Treatment/*`; `/personal/treatments` |
| RF-P06 | Lembretes locais de medicação e de fim de tratamento | Implementado | `services/notificationService.ts` |
| RF-P07 | Calendário com dias de tratamento, campanha de conscientização do mês e eventos do dia | Implementado | `PersonalArea/Calendar` |
| RF-P08 | Histórico de notificações e preferência de notificações | Implementado | `PersonalArea/Notifications` |
| RF-P09 | Orientações sobre discriminação e canais de denúncia | Implementado (informativo) | `PersonalArea/ReportsArea` |
| RF-P10 | Registro de denúncia dentro do app | **Não implementado** (o app direciona a canais externos) | — |

### 1.5 Mascote Virtual (autenticado)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-M01 | Conversa com mascote de IA (Groq, `llama-3.3-70b-versatile`) | Implementado | `Mascot/Chat`; `POST /ai-support/ask`; `mascot/mascot.service.ts` |
| RF-M02 | Contexto personalizado (tratamentos ativos e humor de 7 dias) montado no servidor | Implementado | `mascot.service.ts` (`getUserContext`) |
| RF-M03 | Validação da resposta (sem dosagem, sem promessa de cura, sem markdown, pt-BR) com fallback | Implementado | `mascot.service.ts` (`validateResponse`); `mascot.service.spec.ts` |
| RF-M04 | Protocolo de emergência por palavras-chave, sem chamar a IA | Implementado | `mascot.service.ts` (`isEmergency`) |
| RF-M05 | Limite de 30 mensagens/dia e histórico local das últimas 20 | Implementado (no app) | `Mascot/Chat/index.tsx` |
| RF-M06 | Mascote customizável (aparência) | **Não implementado** | — |

### 1.6 Privacidade e consentimento (LGPD)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-L01 | Consentimento granular por finalidade: `HEALTH_DATA`, `AI_MASCOT`, `NOTIFICATIONS`, negado por padrão | Implementado | `consent/*`; `GET /consents`, `PUT /consents/:purpose` |
| RF-L02 | Histórico de consentimento append-only com versão do termo | Implementado | `ConsentRecord`; `GET /consents/history`; `CONSENT_TERM_VERSION` |
| RF-L03 | Bloqueio no servidor sem consentimento (`403 CONSENT_REQUIRED`) | Implementado | `consent/consent.guard.ts`; controllers de diário, tratamentos e mascote |
| RF-L04 | Tela "Privacidade e consentimentos" com o quê/para quê/com quem/se recusar | Implementado | `AccountConfigurations/Privacy`; `constants/consents.ts` |
| RF-L05 | Bloqueio explicativo nas áreas sem consentimento | Implementado | `components/auth/ConsentGate.tsx` (diário, tratamentos, calendário, mascote) |
| RF-L06 | Revogar não apaga dados; só bloqueia | Implementado | `consent.service.ts` |
| RF-L07 | Revogar Notificações cancela lembretes agendados; sem consentimento não agenda | Implementado | `notificationService.ts` (`canNotify`); `Privacy/index.tsx` |

### 1.7 Administração (backend; painel web ainda não entregue)

| ID | Requisito | Status | Onde |
|---|---|---|---|
| RF-W01 | CRUD de livros, filmes, séries e atividades restrito a ADMIN | Implementado (API) | `media/*`, `leisures/*`; `auth/guards/roles.guard.ts` |
| RF-W02 | Listagem de usuários restrita a ADMIN | Implementado (API) | `GET /users` |
| RF-W03 | Painel web administrativo | **Especificado** (PRDs) | `docs/prd-web-admin/` |

---

## 2. Requisitos não funcionais

| ID | Requisito (texto para transcrição) | Onde / evidência |
|---|---|---|
| RNF-01 Sessão | O aplicativo mantém o usuário autenticado enquanto houver uso dentro de uma janela deslizante de 7 dias. Após 7 dias sem uso, logout, troca ou redefinição de senha, suspensão ou exclusão da conta, a sessão é encerrada no servidor. Não há tempo máximo absoluto de sessão. | `auth/session.service.ts`; `REFRESH_TTL_DAYS` |
| RNF-02 Token de acesso | O token de acesso expira em até 15 minutos e é renovado automaticamente, uma única vez por falha, sem ação do usuário. | `JWT_ACCESS_TTL`; `apps/mobile/src/services/api.ts` |
| RNF-03 Refresh rotativo | Cada renovação troca o refresh token; reutilizar um token já trocado revoga toda a família de sessões. O servidor guarda apenas o hash SHA-256. | `session.service.ts`; `session.service.spec.ts` |
| RNF-04 Armazenamento seguro | O refresh token fica no armazenamento seguro do sistema (Keychain/Keystore), fora do estado persistido do app. | `apps/mobile/src/services/sessionStorage.ts` |
| RNF-05 Consentimento | O tratamento de dado sensível de saúde e o envio à IA só ocorrem com consentimento específico, registrado e revogável, verificado no servidor. | RF-L01 a RF-L07 |
| RNF-06 Minimização na IA | O conteúdo enviado ao provedor de IA não contém nome, e-mail nem telefone; tratamentos e humor só vão com consentimento de dados de saúde; o texto do diário nunca é enviado. | `mascot.service.ts`; `mascot.service.spec.ts` |
| RNF-07 Pseudonimização | Registros que sobrevivem à exclusão (auditoria do diário e log de exclusão) guardam o identificador como HMAC-SHA256 com chave fora do banco. | `shared/utils/pseudonym.util.ts`; `PSEUDONYM_KEY` |
| RNF-08 Exclusão | A exclusão da conta remove, em uma transação, diário, tratamentos, consentimentos, sessões e conversas do mascote. | `user.service.ts`; `user.service.spec.ts` |
| RNF-09 Autorização | Escritas de conteúdo exigem perfil ADMIN; dados de usuário só são lidos pelo dono ou por ADMIN. | `roles.guard.ts`; `user.controller.ts` |
| RNF-10 Limite de requisições | 120 req/min por cliente; limites menores em login, cadastro, recuperação de senha, mascote e PDF. | `app.module.ts`; decorators `@Throttle` |
| RNF-11 Produção | Em produção: CORS restrito, Swagger desligado, `JWT_SECRET` forte obrigatório, seed bloqueado. | `main.ts`; `prisma/seed.ts` |
| RNF-12 Emergência | O botão de emergência funciona sem login e sem consentimento, e não depende do servidor (abre o discador do aparelho). | `EmergencyContacts.tsx` |
| RNF-13 Acessibilidade | Rótulos de acessibilidade, alvos de toque e contraste revisados nos componentes do design system. | `docs/release/05-wcag-padronizacao.md` |

---

## 3. Diferenças em relação ao plano e pendências

| Item | Situação |
|---|---|
| Exclusão de conta | Rota é `DELETE /users/:id` (dono ou ADMIN), **sem confirmação de senha** — o plano previa `DELETE /users/me` com senha |
| Testes e2e | Aceites de consentimento, exclusão e suspensão estão cobertos por **testes unitários** com Prisma simulado, não por e2e com banco |
| Criptografia do diário em repouso | Não implementada (backlog `tasks/tcc-final`) |
| Consentimento parental, portabilidade, ROPA/RIPD | Fora deste corte (`tasks/tcc-final/10`) |
| Textos dos consentimentos | Rascunho técnico; exigem revisão jurídica |
| Lint do mobile | 10 erros remanescentes (hooks em `MediaViewer.tsx` e outros); `tsc` sem erros |
