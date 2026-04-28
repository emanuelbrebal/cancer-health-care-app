# Plano de Ação — Correção do Fluxo de Auth Completo

**Data:** 2026-04-24  
**Branch:** `fix/refining-fixes-to-launch-the-prototype`  
**Status geral:** ~60% funcional (login/register OK, reset de senha quebrado, vários riscos de tipagem e segurança)

---

## Diagnóstico Resumido

| Fluxo | Estado |
|---|---|
| Login | ✅ Funcional |
| Cadastro | ⚠️ Funcional (sem coleta de nome) |
| Forgot Password | ❌ Quebrado (sem email, sem tela de reset) |
| Reset Password | ❌ Não implementado no mobile |
| Change Password | ❌ Backend OK, mobile sem interface |
| PronounEnum | ❌ Valores incompatíveis frontend ↔ backend |

---

## PRIORIDADE 1 — Crítico (Bloqueador de lançamento)

### TASK 1.1 — Corrigir PronounEnum no shared types

**Arquivo:** `packages/shared/types/user.ts`

**Problema:** Os valores do enum no frontend (`HE_HIM='ELE/DELE'`, `SHE_HER='ELA/DELA'`) não correspondem ao schema do Prisma (`SR`, `SRA`, `SRTA`, `CUSTOM`, `NOT_INFORMED`), causando falha silenciosa na serialização.

**O que fazer:**
- Alinhar `PronounEnum` no shared types com os valores do Prisma:
  ```typescript
  export enum PronounEnum {
    SR = 'SR',
    SRA = 'SRA',
    SRTA = 'SRTA',
    CUSTOM = 'CUSTOM',
    NOT_INFORMED = 'NOT_INFORMED',
  }
  ```
- Atualizar todos os usos no mobile (OnboardingForm, AccountConfigurations, etc.)

---

### TASK 1.2 — Implementar método `resetPassword` no authService mobile

**Arquivo:** `apps/mobile/src/services/auth.ts`

**Problema:** O backend tem `POST /auth/reset-password` com body `{ token, newPassword }`, mas o authService mobile não expõe esse método.

**O que fazer:**
```typescript
async resetPassword(token: string, newPassword: string) {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
},
```

---

### TASK 1.3 — Refatorar tela `ResetPassword.tsx` → Coleta de email e envia token

**Arquivo:** `apps/mobile/src/app/(auth)/ResetPassword.tsx`

**Problema atual:** Chama `forgotPassword` mas não captura o token retornado, e não navega para uma tela de confirmação útil.

**O que fazer:**
- Capturar o token retornado pelo backend (campo `debug_token` em dev ou via email em prod)
- Navegar para `RecoverPassword` passando o email via params (para exibição)
- Tratar erros de form (email não encontrado → 404)
- Implementar try/catch explícito com feedback ao usuário

---

### TASK 1.4 — Refatorar tela `RecoverPassword.tsx` → Formulário de nova senha

**Arquivo:** `apps/mobile/src/app/(auth)/RecoverPassword.tsx`

**Problema atual:** Tela puramente cosmética. Não tem campos de entrada, não chama nenhum endpoint.

**O que fazer:**
- Receber `token` via params de rota (enviado por email no futuro, ou `debug_token` em dev)
- Adicionar campo "Nova senha" e "Confirmar nova senha"
- Chamar `authService.resetPassword(token, newPassword)` ao submeter
- Em caso de sucesso: navegar para `LoginScreen` com mensagem de confirmação
- Em caso de erro: exibir mensagem (token expirado, inválido, etc.)

**Observação:** Para funcionar em produção, o token deve chegar ao usuário via email (deep link ou código manual). Por ora, o fluxo de dev usa `debug_token` retornado pelo endpoint.

---

### TASK 1.5 — Implementar envio de email no backend (Mailer)

**Arquivo:** `apps/backend/src/auth/auth.service.ts` + novo `MailerModule`

**Problema:** `forgotPassword` no backend gera o token mas tem `TODO` onde deveria enviar o email. Sem email, o fluxo de reset é inutilizável em produção.

**O que fazer:**
1. Instalar dependência:
   ```bash
   cd apps/backend && npm install @nestjs-modules/mailer nodemailer
   ```
2. Criar `apps/backend/src/mailer/mailer.module.ts` e `mailer.service.ts`
3. Configurar com variáveis de ambiente (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`)
4. Criar template de email para reset de senha com o link/código
5. Substituir o `TODO` em `auth.service.ts` pela chamada real ao `MailerService`

---

## PRIORIDADE 2 — Alto (Segurança e UX)

### TASK 2.1 — Adicionar coleta de `name` no RegisterScreen

**Arquivo:** `apps/mobile/src/app/(auth)/RegisterScreen.tsx`

**Problema:** Backend aceita `name` opcional no `UpdateUserDto`, mas o cadastro nunca coleta esse campo. Usuários ficam sem nome no perfil.

**O que fazer:**
- Adicionar campo de texto "Nome completo" no formulário de cadastro
- Incluir `name` no objeto enviado para `authService.register()`
- Validar: mínimo 2 caracteres, não vazio

---

### TASK 2.2 — Validação de ownership em `user.controller.ts`

**Arquivo:** `apps/backend/src/user/user.controller.ts`

**Problema:** Qualquer usuário autenticado pode chamar `PATCH /users/:id` e `DELETE /users/:id` para qualquer outro usuário.

**O que fazer:**
- Nos endpoints `update()` e `remove()`, comparar `req.user.userId` com o `id` da rota
- Admins podem operar em qualquer usuário; pacientes/cuidadores apenas no próprio
- Retornar `403 Forbidden` em caso de violação

---

### TASK 2.3 — Verificar duplicação de email no `update-user.dto` / service

**Arquivo:** `apps/backend/src/user/user.service.ts`

**Problema:** `update()` aceita novo email sem checar se já existe no banco.

**O que fazer:**
- Antes de atualizar, se `dto.email` estiver presente, verificar `findUnique({ where: { email } })`
- Se encontrar outro usuário com esse email, lançar `ConflictException`

---

### TASK 2.4 — Adicionar interface de `changePassword` no mobile

**Arquivo:** a criar em `apps/mobile/src/app/(Home)/PersonalArea/AccountConfigurations/`

**Problema:** Endpoint `PATCH /auth/change-password` existe no backend mas o mobile não tem tela.

**O que fazer:**
- Criar tela com campos: "Senha atual", "Nova senha", "Confirmar nova senha"
- Adicionar método `changePassword(currentPassword, newPassword)` no `authService`
- Navegar de volta após sucesso com confirmação

---

## PRIORIDADE 3 — Médio (Qualidade e segurança)

### TASK 3.1 — Remover URL hardcoded em `api.ts`

**Arquivo:** `apps/mobile/src/services/api.ts` linha 6

**O que fazer:**
- Garantir que `EXPO_PUBLIC_API_URL` esteja definido em `.env` e `.env.example`
- Remover o fallback `http://192.168.0.5:3000` ou trocá-lo por `http://localhost:3000`

---

### TASK 3.2 — Melhorar tratamento de erro no `SoftLoginModal`

**Arquivo:** `apps/mobile/src/components/home/SoftLoginModal/SoftLoginModal.tsx`

**O que fazer:**
- Diferenciar erros: 401 (credenciais erradas) vs 404 (usuário não encontrado) vs sem conexão
- Adicionar vibração ou feedback tátil no erro

---

### TASK 3.3 — Garantir `JWT_SECRET` obrigatório no backend

**Arquivo:** `apps/backend/src/auth/strategies/jwt.strategy.ts` e `auth.module.ts`

**O que fazer:**
- Usar `ConfigService` do NestJS e lançar erro na startup se `JWT_SECRET` não estiver definido
- Remover fallback `'secretKey'`

---

### TASK 3.4 — Validar `_layout.tsx` da auth para garantir deep link de reset

**Arquivo:** `apps/mobile/src/app/(auth)/_layout.tsx`

**O que fazer:**
- Verificar se `RecoverPassword` aceita params `?token=xxx` via Expo Router
- Configurar o `app.json` com scheme para deep links de reset de senha (ex: `oncomente://reset-password?token=xxx`)

---

## Ordem de execução recomendada

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5   (fluxo de reset de senha)
2.1                              (nome no cadastro, independente)
2.2 → 2.3                       (segurança de ownership, após ter users com nome)
2.4                              (change password, usa authService atualizado de 1.2)
3.1 → 3.2 → 3.3 → 3.4          (polish e segurança, pode ser feito ao longo)
```

---

## Arquivos envolvidos (resumo)

| Arquivo | Tasks |
|---|---|
| `packages/shared/types/user.ts` | 1.1 |
| `apps/mobile/src/services/auth.ts` | 1.2, 2.4 |
| `apps/mobile/src/app/(auth)/ResetPassword.tsx` | 1.3 |
| `apps/mobile/src/app/(auth)/RecoverPassword.tsx` | 1.4 |
| `apps/mobile/src/app/(auth)/RegisterScreen.tsx` | 2.1 |
| `apps/mobile/src/app/(auth)/_layout.tsx` | 3.4 |
| `apps/mobile/src/services/api.ts` | 3.1 |
| `apps/mobile/src/components/home/SoftLoginModal/SoftLoginModal.tsx` | 3.2 |
| `apps/backend/src/auth/auth.service.ts` | 1.5 |
| `apps/backend/src/mailer/` (novo) | 1.5 |
| `apps/backend/src/user/user.controller.ts` | 2.2 |
| `apps/backend/src/user/user.service.ts` | 2.3 |
| `apps/backend/src/auth/strategies/jwt.strategy.ts` | 3.3 |
| `apps/backend/src/auth/auth.module.ts` | 3.3 |
| PersonalArea/AccountConfigurations/ (novo) | 2.4 |
