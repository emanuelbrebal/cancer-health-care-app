# 01 — Diagnóstico Geral (matriz funcionalidade → status → evidência)

> Varredura em 2026-10-18 na branch `chore/allow-install-scripts` (HEAD `795c9df`).
> Legenda: ✅ pronto · 🟡 parcial · ❌ ausente · 💥 quebrado/inseguro · ➖ removido do escopo
> Caminhos relativos a `apps/`. M = mobile, B = backend, W = web.

## Saúde do build

| Check | Resultado | Evidência |
|---|---|---|
| Backend `tsc --noEmit` | ✅ 0 erros | — |
| Backend `jest` | 💥 13/16 suítes falham (`Cannot find module 'src/auth/guards/jwt-auth.guard'`), 1 teste falha | `backend/package.json` bloco `jest` sem `moduleNameMapper` |
| Mobile `tsc --noEmit` | 💥 3 erros | `NewPublication.tsx:3` (import de `SocialArea` removido) · `InputWithIcon.tsx:19` (TextStyle em View) · `HomeNavigationGrid.tsx:34` (keyExtractor retorna number) |
| Web | ❌ template Vite | `web/src/App.tsx` |
| Docker prod | 💥 `CMD node dist/main` (arquivo real: `dist/src/main.js`); runner sem CLI `prisma` (devDependency + `--omit=dev`) | `backend/Dockerfile` |

## Matriz por requisito

| Req | Funcionalidade | M | B | W | Evidência / observação |
|---|---|---|---|---|---|
| RF-001 | Cadastro rápido | 🟡 | 🟡 | — | `M (auth)/RegisterScreen.tsx:32` valida só `length < 6`; doc exige maiúscula+minúscula+número+especial. Sem modal "Deseja realmente cancelar?". Sem consentimento LGPD. `B auth/dto/register.dto.ts` só `MinLength(6)` |
| RF-002 | Cadastro progressivo | 🟡 | 🟡 | — | `M PersonalArea/OnboardingForm` existe; sem "Pular agora" + re-exibir após 1 dia; foto: sem validação de formato/2 MB (`B user/dto/update-user.dto.ts` aceita string base64 livre) |
| RF-003 | Gerenciar perfil | 🟡 | 💥 | ❌ | Exclusão é **física** (`B user/user.service.ts` `usersRepository.delete`) com `UserDeletionLog`; doc pede status (desativada/suspensa/cancelada). Sem histórico de alterações. Busca por nome inexistente |
| RF-004 | Login | 🟡 | 💥 | ❌ | `B auth/auth.service.ts` login devolve `user` com hash de senha. Sem bloqueio após 5 falhas (RS001). Sem biometria (nenhum `expo-local-authentication`). JWT 7d sem refresh |
| RF-005 | Menu inferior | ✅ | — | — | `M (Home)/_layout.tsx` 5 tabs, gate de auth nas linhas 84/110. Doc ainda cita aba "Social" |
| RF-006 | Tela inicial | 🟡 | — | — | `M (Home)/index.tsx` + `About/index.tsx:16` ("Versão 1.0.0" hardcoded). Verificar accordions "O que somos / Ajuda / Objetivos" |
| RF-007 | Área oncológica | ✅ | — | — | `M (Home)/Oncology/*` (Nutrição, Exercícios, Sono, Espiritual, Lazer, Legal). Conteúdo estático/mocks |
| RF-008 | Livros | 🟡 | 💥 | ❌ | `B media/books/books.controller.ts:20-56` escrita **sem auth**. Soft delete via `INACTIVE` ✅ (`media/common/base-media.repository.ts`). Sem busca/filtros. Sem histórico. `visitCount` existe, sem endpoint de incremento. Capa via mapa local (`M constants/mediaImageMap.ts`) |
| RF-009 | Séries | 🟡 | 💥 | ❌ | idem (`series.controller.ts`). Busca por showrunner/temporadas ausente |
| RF-010 | Filmes | 🟡 | 💥 | ❌ | idem (`movies.controller.ts`) |
| RF-011 | Atividades em casa | 🟡 | 💥 | ❌ | idem (`leisures/leisures.controller.ts`) |
| — | Gêneros (dependência de RF-008..010) | — | ❌ | ❌ | Model `Genre` existe; **nenhum controller** → web não consegue popular o select |
| RF-012 | Saúde mental | 🟡 | — | — | Meditação, Respiração, Apoio psicológico, Motivacional existem. **Estágios do luto (1.a/1.b) ausentes** (nenhuma ocorrência de "luto") |
| RF-013 | Botão de emergência | ✅ | — | — | `M MentalHealth/_layout.tsx:7` (só na área de saúde mental, conforme doc) |
| RF-014 | Discar número + log de auditoria | 🟡 | ❌ | ❌ | Discagem via `tel:` em `M components/ui/Buttons/Overlay/PanicButton/EmergencyContacts.tsx:25`. **Log de auditoria inexistente** (sem tabela/endpoint). `canOpenURL('tel:')` no Android 11+ — verificar no APK |
| RF-015..018 | Fórum | ➖ | ➖ | ➖ | Resto de código morto: `M components/ui/Buttons/Overlay/NewPublication/` |
| RF-019 | Área pessoal | 🟡 | — | — | `M PersonalArea/index.tsx`, `Hub/`. Modal "Por que coletamos esses dados?" (LGPD) ausente |
| RF-020 | Tratamento | 🟡 | 🟡 | — | `B personal/treatments` CRUD + ownership. Schema sem `startDate` e sem `hospitalContact` (`schema.prisma` model `Treatment`); `startDate` gerado só no client (`M services/treatmentStorage.ts`). `status` é String livre (não enum). Sem histórico de nova data-fim (obs. 1) |
| RF-021 | Notificações | ✅ (local) | ➖ | — | `M services/notificationService.ts` agenda DAILY/DATE locais; histórico em AsyncStorage. Doc descreve entidade server-side → atualizar doc |
| RF-022 | Diário | 🟡 | 🟡 | — | `B personal/daily-logs` (1 por dia via `@@unique([userId,date])` ✅, audit `DailyLogAudit` ✅, PDF `report/pdf` ✅). `M Diary/index.tsx:183` busca só por título; **sem exportar PDF/relatório de emoções no app**. Conteúdo não criptografado (RS002) |
| RF-023 | Calendário | 🟡 | ❌ | ❌ | `M PersonalArea/Calendar/index.tsx:31-36` meses de conscientização **hardcoded**; doc exige tabela gerida pelo web. Progresso/dias restantes calculados no client |
| RF-024 | Mascote IA | ✅ | ✅ | — | `B mascot/*` Groq `llama-3.3-70b-versatile`, JWT + throttle, prompt modular, `PatientSupportLog`. Limite 30 msg/dia |
| RF-025 | Manter mascote (admin) | — | ❌ | ❌ | Prompt lido de arquivos `.md` (`B mascot/prompt-loader.service.ts:35`); sem config em banco, sem histórico de versões, sem ativar/desativar |
| RF-026 | Canais de denúncia | ✅ | — | — | `M PersonalArea/ReportsArea/index.tsx` (orientações + 136, ANS, 129, Procon) |
| — | Mensagem diária | 🟡 | 🟡 | ❌ | Model `DailyMessage` (title/message `VarChar(25)` — curto demais) sem endpoint; mobile usa `constants/Mocks/mockDailyMessages.ts` |

## Requisitos não funcionais e de segurança

| Req | Status | Evidência / gap |
|---|---|---|
| RNF01/02/04 | 🟡 | Toasts/feedback existem (`M services/toastService.ts`); padronizar mensagens do doc |
| RNF03 Acessibilidade | ❌ | Sem `accessibilityLabel`/`accessibilityRole` sistemáticos; validar contraste e área de toque ≥ 44pt |
| RNF05/06 Desempenho | ⚠️ | Throttle global 10 req/min (`B app.module.ts`) gera 429 em navegação normal |
| RNF07 Disponibilidade 99% | ❌ | Depende do provedor (plano 05); free tiers hibernam |
| RNF08 Exclusão lógica | 🟡 | Mídia/lazer ✅; usuário ❌ (físico); direito LGPD de exclusão total ✅ parcial |
| RNF09 Imutabilidade | ⚠️ | Conflita com RF-022 (edição do diário) — decisão D3 |
| RNF10 Notificações nativas | ✅ | expo-notifications local |
| RNF11 Controle de acesso | 💥 | Rotas de conteúdo abertas; sem `RolesGuard` em lugar algum |
| RNF12 Hash de senha | ✅ | bcrypt (`B auth/auth.service.ts`) |
| RNF13 LGPD | ❌ | Sem consentimento/política de privacidade |
| RNF14 Pseudo-anonimato (fórum) | ➖ | Remover |
| RNF15 Diário confidencial | ✅ | Ownership em findOne/update/remove |
| RNF16 Auditoria | 🟡 | Só diário e exclusão de usuário; sem AuditLog genérico |
| RNF17 Modularidade | ✅ | Módulos NestJS por domínio |
| RNF18 Android/iOS 2 últimas versões | ⚠️ | Não testado em dispositivos; `app.json` sem `minSdkVersion`/`deploymentTarget` explícitos (defaults do SDK 57) |
| RS001 Força bruta | 🟡 | Throttle no login ✅; bloqueio após 5 falhas ❌; política de senha forte ❌ |
| RS002 Acesso/criptografia | 🟡 | Ownership ✅; roles ❌; criptografia em repouso ❌ |
| RS003 HTTPS | ❌ | Depende do deploy; fallback de produção é `http://localhost:3000` (`M services/resolveApiBaseUrl.ts`) e `eas.json` não define `EXPO_PUBLIC_API_URL` |
| RS004 Sanitização | 🟡 | `ValidationPipe({ transform: true })` sem `whitelist`/`forbidNonWhitelisted` (`B main.ts`) |
| RS005 LGPD | ❌ | idem RNF13 |

## Infra / distribuição

| Item | Status | Evidência |
|---|---|---|
| URL da API por ambiente | 💥 | `eas.json` sem `EXPO_PUBLIC_API_URL`; build release cai em `localhost` |
| EAS profiles | 🟡 | `eas.json` ok; `submit.ios` com `ascAppId`/`appleTeamId` vazios |
| Docker backend | 💥 | ver "Saúde do build" |
| Web build/hosting | ❌ | — |
| Seed | ✅ | `backend/prisma/seed.ts` (usuários de teste em `tasks/test-users.md`); roda via `tsx` (devDependency) |
| Swagger | ✅ | `/api` (`B main.ts`) |
| Dependências suspeitas no mobile | ⚠️ | `@expo/ngrok` e `expo-module-scripts` em deps de app; `react-test-renderer` sem testes |

## Resumo quantitativo

- Backend: 4 críticos de segurança · 6 módulos/endpoints ausentes (genres, audit, dial-log, awareness-month, mascot-config, daily-messages) · build Docker/Jest quebrados.
- Web: 100% a construir.
- Mobile: 3 erros de tipo · 6 lacunas funcionais (luto, LGPD, PDF diário, pular onboarding, biometria, política de senha) · integrações com novos endpoints · acessibilidade.
