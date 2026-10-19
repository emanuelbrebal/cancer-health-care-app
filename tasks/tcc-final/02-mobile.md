# 02 — Aplicativo Móvel: Finalização e Compatibilidade

> Stack verificada (`apps/mobile/package.json`): Expo ~57.0.30, React Native 0.86.3, React 19.2.3, Expo Router ~57, Reanimated 4.5.1, Zustand 5, Axios 1.13, TypeScript ~6.0.3.

## FASE 1 — Escopo

**Objetivo:** app sem erros de tipo, integrado aos novos endpoints, cobrindo os RFs pendentes, estável em Android e iOS (2 últimas versões principais — RNF18), acessível (RNF03) e apontando para a API de nuvem por variável de build.

**Escopo:** limpeza/compat, integrações (conteúdo dinâmico, dial-log, meses de conscientização, mensagens, tratamento estendido), lacunas funcionais (luto, LGPD, onboarding pular, PDF do diário, política de senha, biometria), UX de erro/loading/offline, acessibilidade.
**Não-escopo:** fórum, push remoto, tablet-first (manter `supportsTablet` mas validar só layout básico).

**Critérios de aceite**
1. `npx tsc --noEmit` = 0 erros; `npx expo lint` = 0 erros; `npx expo-doctor` sem falhas.
2. Build `eas build -p android --profile preview` gera APK que funciona contra a URL de nuvem em aparelho sem Metro.
3. Matriz de dispositivos (abaixo) passa no roteiro de smoke test.
4. Toda tela com dados remotos tem estados loading / vazio / erro com "Tentar novamente".
5. Todos os botões/ícones interativos têm `accessibilityLabel` e área de toque ≥ 44×44.
6. Conteúdo cadastrado no web (livro com capa por URL, mês de conscientização, mensagem diária) aparece no app sem novo build.

**Matriz de dispositivos (mínimo)**

| Plataforma | Versões | Como |
|---|---|---|
| Android | duas últimas principais (ex.: 15 e 16 — confirmar na data do teste) + 1 aparelho antigo (Android 10/11) | APK preview em aparelho físico + emulador |
| iOS | duas últimas principais | Expo Go / TestFlight (D6) + simulador |
| Telas | ~5" (360×640 dp) e ~6.7" | emulador |

## FASE 2 — Evidências

| Arquivo | Fato |
|---|---|
| `src/components/ui/Buttons/Overlay/NewPublication/NewPublication.tsx:3` | Importa rota `SocialArea` removida (erro TS) |
| `src/components/ui/Inputs/InputWithIcon.tsx:19` / `Navigation/HomeNavigationGrid.tsx:34` | Erros de tipo com tipos do RN 0.86 |
| `src/services/resolveApiBaseUrl.ts` | Release sem `EXPO_PUBLIC_API_URL` cai em `http://localhost:3000` |
| `src/constants/mediaImageMap.ts` | Capas só por `require()` local |
| `src/app/(Home)/PersonalArea/Calendar/index.tsx:31-36` | Meses de conscientização hardcoded |
| `src/components/ui/Buttons/Overlay/PanicButton/EmergencyContacts.tsx:25-29` | `canOpenURL('tel:')` antes de abrir; sem log de auditoria |
| `src/app/(auth)/RegisterScreen.tsx:32` | Senha validada só por tamanho |

## FASE 3 — Decisões

**Bloco 1 — Camada de dados remota**
| Opção | Prós | Contras |
|---|---|---|
| A. Manter services + `useEffect` por tela (atual) | Zero dependência nova | Loading/erro/retry duplicados em ~15 telas |
| B. TanStack Query sobre os services existentes | Cache, retry, estados padronizados, refetch on focus | Nova dependência; migração tela a tela |
| C. Zustand stores por domínio com fetch | Já usado no auth | Reimplementa cache/retry à mão |

**Escolha: B**, migrando apenas telas com dados remotos (lazer, diário, tratamento, calendário, mensagem diária). Services continuam sendo a única camada que fala com Axios — contrato preservado e reversível.

**Bloco 2 — Fallback offline para conteúdo estático**
Escolha: conteúdo dinâmico vindo da API com fallback para os mocks atuais (`constants/Mocks/*`) quando a requisição falhar, e aviso discreto "modo offline". Mantém a área pública útil sem rede (perfil vulnerável, conexão 3G — RNF05).

**Bloco 3 — Biometria (D2)**
Escolha: `expo-local-authentication` como desbloqueio do token já salvo (não substitui a senha no servidor). Após o 1º login, modal pergunta se o usuário quer ativar; preferência em SecureStore.

## FASE 4 — Checklist de execução

**M1 — Limpeza e compatibilidade** · branch `fix/mobile-compat-cleanup`
1. [ ] Resolver diff pendente de `package.json` (ver 00, pré-requisito); remover `NewPublication/` (código morto do fórum), `@expo/ngrok` e `expo-module-scripts` das deps — `🗑️ remove(components): drop forum leftovers` · `🔧 chore(deps): remove unused mobile deps`
2. [ ] Corrigir os 2 erros de tipo restantes — `🐛 fix(components): fix rn 0.86 type errors` · *verif.: tsc 0 erros*
3. [ ] `npx expo install --check` + `npx expo-doctor`; `app.json`: `android.minSdkVersion`/`ios.deploymentTarget` explícitos via `expo-build-properties` conforme RNF18, `userInterfaceStyle` (`automatic` sem dark theme implementado → `light`), versão do app lida de `expo-constants` na tela Sobre (remove "Versão 1.0.0" hardcoded) — `🐛 fix(mobile): pin platform targets`
4. [ ] Discagem: chamar `Linking.openURL('tel:…')` em try/catch sem depender de `canOpenURL` (Android 11+ exige `<queries>`), com fallback "copiar número" — `🐛 fix(mental-health): reliable emergency dialing` · *verif.: APK Android 11+ abre o discador*
5. [ ] Safe areas, teclado (`KeyboardAvoidingView` nos formulários) e fonte escalável (`allowFontScaling` + layout que não quebra com fonte 130%) — `👌 style(components): handle safe area and font scale`

**M2 — Integrações** · branch `feat/mobile-dynamic-content` (após plano 04 B3)
6. [ ] TanStack Query + `QueryClientProvider`; migrar lazer/diário/tratamento/calendário — `♻️ refactor(services): adopt react query`
7. [ ] `getMediaImage`: aceitar URL remota (`expo-image` com cache) mantendo mapa local — `✨ feat(oncology): support remote cover images`
8. [ ] Mensagem diária e mensagens motivacionais via `/daily-messages` (fallback mock); meses de conscientização via `/awareness-months`; progresso via `/personal/treatments/progress` — `✨ feat(home): load daily message from api` · `✨ feat(personal-area): load awareness months from api`
9. [ ] Dial-log: `POST /emergency-dial-logs` best-effort (não bloqueia a discagem, fila em AsyncStorage se offline) — `✨ feat(mental-health): log emergency dial`
10. [ ] Tratamento: `startDate` e `hospitalContact` no formulário, status (ativo/finalizado/cancelado), "alterar data-fim" com histórico — `✨ feat(personal-area): extend treatment form`

**M3 — Lacunas funcionais** · branch `feat/mobile-requirements-gaps`
11. [ ] Cadastro: regex de senha forte com checklist visual, confirmação de senha, modal "Deseja realmente cancelar?" — `✨ feat(auth): strong password validation` (aceite de termos, idade e responsável → **plano 10 C1/C2**)
12. [ ] Onboarding: botão "Pular por agora" + reexibir após 24 h (timestamp em AsyncStorage) — `✨ feat(personal-area): allow skipping onboarding`
13. [ ] Hub da Área Pessoal: botão "Por que coletamos esses dados?" (RF-019) abre a Central de Privacidade → **plano 10 item 12**
14. [ ] Saúde Mental: telas "Estágios do luto" e "Superando o luto" (RF-012 1.a/1.b) com conteúdo revisado — `✨ feat(mental-health): add grief stages screens`
15. [ ] Diário: busca por conteúdo/data/emoção + "Exportar relatório de emoções (PDF)" via `GET /daily-logs/report/pdf` + `expo-sharing` — `✨ feat(personal-area): export emotions report`
16. [ ] Biometria (D2) — `✨ feat(auth): add biometric unlock`
17. [ ] Tratar respostas de lockout (423/429) e conta desativada no login com mensagem clara — `✨ feat(auth): handle locked account`

**M4 — Qualidade** · branch `test/mobile-quality`
18. [ ] Acessibilidade: labels/roles em NavCard, botões overlay, inputs; contraste de `purplePrimary` sobre branco conferido (AA) — `👌 style(components): add accessibility labels`
19. [ ] Testes: `jest-expo` + Testing Library para validadores (senha, datas), `resolveApiBaseUrl`, `treatmentStorage` (cálculos) — `🧪 test(mobile): cover validators and services`
20. [ ] Roteiro de smoke test manual (`tasks/tcc-final/smoke-test.md`, a criar) executado na matriz de dispositivos; registrar resultados — `📚 docs(tasks): add device smoke test results`

## FASE 5 — Verificação

- [x] Regras (autorização, cálculos de progresso, auditoria) no backend; app só apresenta
- [x] Services continuam como única fronteira HTTP
- [x] Critérios objetivos (tsc/lint/doctor, APK na matriz)
- [x] Fases ≤ 10 itens cada
- [x] 3 opções avaliadas no bloco principal
- [x] Evidências ≤ 7
- [x] Dependências: M2 exige plano 04 B3; item 16 depende de D2

**Gate = Livre para execução** (M1 pode começar já).

**Confiança: MEDIUM** no item 4 — não confirmei se o prebuild do SDK 57 já injeta `<queries>` para `tel`; testar no APK antes de decidir se basta o try/catch.
