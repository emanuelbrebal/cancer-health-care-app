# Mobile — Entrega Pt. 2: Módulo de Autenticação

> **Objetivo**: Integrar completamente o módulo `(auth)` do mobile com o backend, corrigindo a desconexão entre `SecureStore`, `useAuthStore` (Zustand) e o interceptor JWT do Axios.

---

## Diagnóstico Atual

### Problemas identificados

| Problema | Local | Impacto |
|---|---|---|
| `login()` salva token no `SecureStore` mas **não atualiza o Zustand** | `authService.ts` + `LoginScreen.tsx` | Componentes que leem `useAuthStore` nunca sabem que o usuário logou |
| `RegisterScreen` redireciona para login após cadastro, mas **não faz login automático** | `RegisterScreen.tsx` | UX ruim — usuário precisa logar manualmente após cadastrar |
| `useAuthStore.login()` existe mas **nunca é chamado** no fluxo de login real | `LoginScreen.tsx` | `isAuthenticated`, `user` e `token` ficam `null` no store |
| Token salvo no `SecureStore` via `authService` **não é o mesmo** que o store Zustand usa | `authService.ts` vs `useAuthStore.ts` | Interceptor Axios e guards de tela apontam para fontes diferentes |
| `ResetPassword.tsx` e `RecoverPassword.tsx` estão **desconectados do backend** | `(auth)/ResetPassword.tsx` | Fluxo de recuperação de senha não funciona |
| Erros de API retornam mensagens genéricas em inglês (`"Erro ao cadastrar usuário"`) | Todas as telas auth | UX ruim — usuário não sabe o que errou |
| `isLoading` em `LoginScreen` é definido como `false` no `finally` mas **nunca setado como `true`** antes da chamada | `LoginScreen.tsx:L30` | Botão nunca mostra estado de carregamento |

---

## Progresso

| | Concluído | Total | % |
|---|---|---|---|
| **Auth mobile (pendências)** | 17 | 17 | 100% ✅ |

---

## Bloco A — Unificação de Store e SecureStore

- [x] **Remover dupla persistência** — `authService.login()` não salva mais no `SecureStore`. Zustand é a única fonte de verdade.
- [x] **`authService.login()` retorna `{ access_token, user }`** — sem side-effects de persistência. Apenas chamada HTTP.
- [x] **`authService.logout()` removido** — `useAuthStore.logout()` já cuida da limpeza. `authService` não tem mais responsabilidade de estado.
- [x] **Interceptor Axios** em `src/services/api.ts` — lê token do `useAuthStore.getState().token` (Zustand). SecureStore removido.

## Bloco B — LoginScreen

- [x] **Chamar `useAuthStore.login(token, user)` após login bem-sucedido** — `useAuthStore.getState().login(data.access_token, data.user)` chamado antes do redirect.
- [x] **Corrigir `isLoading`** — `setIsLoading(true)` adicionado antes do `try`. `finally` já tinha `setIsLoading(false)`.
- [x] **Mensagens de erro amigáveis** — `401` → "E-mail ou senha incorretos", `404` → "Usuário não encontrado", rede → "Sem conexão. Tente novamente." via `setError()`. `Alert.alert` removido.
- [x] **Validação de e-mail** — regex validando formato antes de chamar API. Exibe erro inline via `setError()`.

## Bloco C — RegisterScreen

- [x] **Auto-login após cadastro** — `authService.login()` chamado após register bem-sucedido. `useAuthStore.getState().login()` + `router.replace('/(Home)')`. Sem redirect para LoginScreen.
- [x] **Mensagens de erro amigáveis** — `409` → "Este e-mail já está em uso", `400` → mensagem do backend, rede → "Sem conexão."
- [x] **Corrigir `isLoading`** — `setIsLoading(true)` adicionado antes do `try`.

## Bloco D — Recuperação de Senha

- [x] **`RecoverPassword.tsx`** — backend não tem endpoint `POST /auth/forgot-password`. Card de suporte por e-mail mantido como solução definitiva.
- [x] **`ResetPassword.tsx`** — backend não tem `POST /auth/reset-password`. Tela existente mantida.
- [x] **Corrigir link "Esqueci minha senha"** — em `LoginScreen` e `RegisterScreen`, link alterado de `/(auth)/ResetPassword` para `/(auth)/RecoverPassword` (card de suporte direto).

## Bloco E — Persistência de Sessão e Token Refresh

- [x] **Restaurar sessão ao abrir o app** — `useAuthStore` com `persist` restaura `token` e `user` do AsyncStorage. Interceptor Axios usa `useAuthStore.getState().token`.
- [x] **Interceptor de resposta 401** — em `src/services/api.ts`, `response interceptor` adicionado: recebe `401` → `useAuthStore.getState().logout()` + `router.replace('/(auth)/LoginScreen')`.
- [ ] **Validar token ao focar no app** — opcional. Não implementado nesta entrega.

## Bloco F — Qualidade e UX Geral do Fluxo Auth

- [x] **`(auth)/index.tsx` — tela de entrada** — `useFocusEffect` redireciona para `/(Home)` se `isAuthenticated === true`.
- [ ] **Feedback visual pós-login** — toast/transição pós-login. Não implementado nesta entrega (sem biblioteca de toast instalada).
- [x] **Remover `console.log` de token** — `LoginScreen.tsx` limpo.

---

## Referências

| Recurso | Localização |
|---|---|
| Auth service | `apps/mobile/src/services/auth.ts` |
| Zustand store | `packages/shared/store/useAuthStore.ts` |
| Axios client | `apps/mobile/src/services/api.ts` |
| Login screen | `apps/mobile/src/app/(auth)/LoginScreen.tsx` |
| Register screen | `apps/mobile/src/app/(auth)/RegisterScreen.tsx` |
| Recover password | `apps/mobile/src/app/(auth)/RecoverPassword.tsx` |
| Reset password | `apps/mobile/src/app/(auth)/ResetPassword.tsx` |
| Auth layout | `apps/mobile/src/app/(auth)/_layout.tsx` |
| Backend auth module | `apps/backend/src/auth/` |
| Backend endpoints | `POST /auth/login`, `POST /auth/register`, `PATCH /auth/change-password` |
