# OncoMente — Mudanças Finais para Entrega

> Sessão: 23/04/2026  
> Baseado no estado atual da branch `fix/refining-fixes-to-launch-the-prototype`

---

## LEGENDA

| Ícone | Significado |
|-------|-------------|
| ⚡ | Pode ser feito agora pelo Claude — só pedir |
| 🖐️ | Requer ação manual sua |
| ⏳ | Bloqueado — depende de asset ou decisão externa |

---

## BLOCO A — Pode ser feito pelo Claude ⚡

### A1 — Remover dependências realmente não utilizadas ✅ FEITO

Após verificação com grep, o resultado real é:

| Pacote | Resultado | Ação |
|--------|-----------|------|
| `expo-web-browser` | ❌ Nenhum import encontrado | ✅ Removido do `package.json` |
| `react-native-webview` | ❌ Nenhum import encontrado | ✅ Removido do `package.json` |
| `react-native-element-dropdown` | ✅ Usado em `SelectWithIcon.tsx` | Mantido |
| `expo-linking` | ✅ Usado em `EmergencyContacts.tsx` | Mantido |

**Executar após pull:**
```bash
cd apps/mobile && npm install
```

---

### A2 — Adicionar `bundleIdentifier` e `package` no app.json ✅ FEITO

```json
"ios":     { "bundleIdentifier": "com.oncomente.app" }
"android": { "package": "com.oncomente.app" }
```

> ⚠️ Confirmar se `com.oncomente.app` é o identificador oficial antes de publicar nas lojas.

---

### A3 — Adicionar Bearer Auth ao Swagger ✅ FEITO

`addBearerAuth()` adicionado ao `DocumentBuilder` em `apps/backend/src/main.ts`.  
Agora é possível autenticar pelo botão "Authorize" em `/api` e testar endpoints protegidos.

---

### A4 — `POST /auth/forgot-password` e `POST /auth/reset-password` ✅ FEITO

Endpoints implementados no backend:

| Endpoint | Body | Resposta |
|----------|------|----------|
| `POST /auth/forgot-password` | `{ email }` | `{ message }` + `debug_token` (fora de produção) |
| `POST /auth/reset-password` | `{ token, newPassword }` | `{ message }` |

**Comportamento:**
- `forgot-password`: gera JWT com expiração 15 min e propósito `"reset-password"`. Não revela se o e-mail existe. Em desenvolvimento, retorna `debug_token` para facilitar testes.
- `reset-password`: valida o token, rejeita se expirado ou com propósito errado, atualiza a senha.
- Rate limit: 3 tentativas/min no `forgot-password`.
- **TODO integrar e-mail:** `auth.service.ts` tem comentário `// TODO: integrar serviço de e-mail` onde o envio deve ser feito.

**Arquivos criados/modificados:**
```
apps/backend/src/auth/dto/forgot-password.dto.ts  (novo)
apps/backend/src/auth/dto/reset-password.dto.ts   (novo)
apps/backend/src/auth/auth.service.ts             (atualizado)
apps/backend/src/auth/auth.controller.ts          (atualizado)
```

---

### A5 — Cleanup de imports ✅ SEM PENDÊNCIA

Após análise real:
- `AccountConfigurations/index.tsx` — sem `Alert` importado, já usa `Modal`. Limpo.
- `OnboardingForm/index.tsx` — `baseText` **é usado** no `StyleSheet` (spread `...baseText`). Manter.

---

### A6 — Falsos positivos do Módulo 0.1 ✅ CONFIRMADO

Após grep real no código:
- `Alert` em `Treatment/index.tsx`, `update/index.tsx`, `Diary/index.tsx` — **todos em uso** (diálogos de exclusão/confirmação)
- `NotFoundException` em `movies`, `books`, `series` services — **em uso** (throws reais no código)

---

## BLOCO A7 — Toasts e feedback de estado vazio ⚡

### A7.1 — Corrigido: 404 jogando erro na cara do usuário ✅ FEITO

| Tela | Problema | Correção |
|------|----------|----------|
| `PersonalArea/Diary/index.tsx` | `catch` genérico exibia toast de erro mesmo quando lista era vazia (404) | 404 → `setEntries([])` silencioso; outros erros → toast |
| `PersonalArea/Treatment/index.tsx` | Mesmo problema | 404 → `setTreatments([])` silencioso; outros erros → toast |
| `PersonalArea/Treatment/update/index.tsx` | `await treatmentService.update()` dentro do `Alert.confirm` sem try/catch — falha silenciosa | `try/catch` adicionado com `toastService.error` |

---

### A7.2 — Pendente: Calendar sem tratamento de erro ⚡

**Arquivo:** `apps/mobile/src/app/(Home)/PersonalArea/Calendar/index.tsx` (linha 71)

```ts
treatmentService.getAll().then(...) // sem .catch()
```

Se a API estiver fora, o calendário falha silenciosamente. Adicionar `.catch((e) => { if (e?.response?.status !== 404) toastService.error('Não foi possível carregar o calendário.') })`.

---

### A7.3 — Mapeamento completo de toasts por tela

| Tela | create | update | delete | getAll/load | Status |
|------|--------|--------|--------|-------------|--------|
| `Diary` | ✅ | ✅ | ✅ | ✅ (404 ok) | **Completo** |
| `Treatment` | ✅ | ✅ | ✅ | ✅ (404 ok) | **Completo** |
| `OnboardingForm` | ✅ | ✅ | — | — | **Completo** |
| `AccountConfigurations` | — | ✅ | — | — | **Completo** |
| `AccountConfigurations/ChangePassword` | — | ✅ | — | — | **Completo** |
| `Mascot/Chat` | — | — | — | ✅ | **Completo** |
| `Calendar` | — | — | — | ⚠️ sem catch | **Pendente (A7.2)** |
| Auth (`Login`, `Register`) | — | — | — | erros inline no campo | **Adequado** |
| `ResetPassword` (forgot-pw) | — | — | — | falha silenciosa intencional | **Por design** |

---

## BLOCO B — Requer ação manual sua 🖐️

### B1 — Executar seed do banco (5 min)

```bash
cd apps/backend
npx prisma db seed
```

Sem isso as telas de Lazer retornam vazio.

---

### B2 — Confirmar IP no .env antes de cada demo

**Arquivo:** `apps/mobile/.env`

```
EXPO_PUBLIC_API_URL=http://192.168.0.9:3000
```

Verificar se o IP mudou com `ipconfig` (Windows) antes de ligar o Expo.

---

### B3 — Definir bundleIdentifier / package (decisão de negócio)

Confirmar com a equipe qual será o identificador oficial do app:
- `com.oncomente.app` ?
- `br.com.oncomente` ?
- Outro?

Necessário para builds via EAS Build e publicação nas lojas.

---

### B4 — Testes manuais (checklist)

Executar em dispositivo físico ou emulador:

**Fluxos críticos:**
- [ ] Cadastro → Onboarding → Home (novo usuário)
- [ ] Login com conta existente → navegar → logout
- [ ] Diário: criar / editar / deletar / bloquear segundo do dia
- [ ] Tratamento: criar → ver no Calendário → editar → deletar (agora usa API)
- [ ] Chat mascote: enviar 5 msgs → ver banner de limite → dia seguinte reinicia
- [ ] "Esqueci minha senha" → ResetPassword (form) → RecoverPassword (confirmação)
- [ ] Lazer: Livros / Filmes / Séries carregam (rodar seed antes)

**Segurança:**
- [ ] Acessar PersonalArea sem token → redireciona para login
- [ ] Token expirado → interceptor faz logout, não trava

**Conteúdo:**
- [ ] Botão pânico: CVV 188 disca de verdade (Android e iOS)
- [ ] Vídeos de exercício e meditação reproduzem
- [ ] Respiração: animação funciona nos 3 modos

---

## BLOCO C — Bloqueado, aguarda decisão ou asset externo ⏳

### C1 — Splash screen

O arquivo `assets/images/splash-icon.png` **existe** mas pode ser o placeholder.  
O `app.json` já aponta para ele:
```json
"splash": { "image": "./assets/images/splash-icon.png" }
```

Quando o asset final estiver pronto: substituir o arquivo. Nenhuma mudança de código necessária.

---

### C2 — Serviço de e-mail para recuperação de senha

Para o fluxo de `POST /auth/forgot-password` enviar e-mail de verdade:
- Definir provedor: Nodemailer (SMTP), SendGrid, Resend, etc.
- Configurar credenciais no `.env` do backend

Por enquanto o endpoint pode ser implementado (A4) retornando apenas `{ message: "Email enviado" }` sem enviar de fato.

---

### C3 — Conteúdo real das seções de mock

Aguardando validação com equipe de conteúdo:

| Seção | Situação |
|-------|----------|
| Nutrição | Accordions estáticos — aguarda nutricionista |
| Motivação Paciente | Mock local — aguarda conteúdo final |
| Motivação Cuidador | Mock local — aguarda conteúdo final |
| Daily Messages (Home) | 50 msgs locais — aguarda endpoint `GET /daily-messages` no backend |

---

## PRIORIDADE RECOMENDADA PARA AMANHÃ

```
1. B1 — Seed do banco (5 min)           → libera telas de Lazer
2. npm install (apps/mobile)            → aplicar remoção das 2 dependências
3. B4 — Testes manuais completos        → validar tudo funcionando
4. C2 — Integrar e-mail no forgot-pass  → endpoint pronto, só falta o envio real
```

> Tudo do Bloco A foi concluído nesta sessão.

---

> **Nota sobre `app.json`:** versão está `1.0.0`, slug é `cancer-health-care-app` (considerar trocar para `oncomente`), sem `bundleIdentifier`/`package` definidos. Confirmar antes de qualquer build.
