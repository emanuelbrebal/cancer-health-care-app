# OncoMente — Pendências para Verificação Manual

> Gerado em: 22/04/2026  
> Branch: `fix/refining-fixes-to-launch-the-prototype`

---

## 🔴 CRÍTICO — Fazer antes de qualquer demonstração

### 1. Atualizar IP do backend no `.env`

**Arquivo:** `apps/mobile/.env`

```
EXPO_PUBLIC_API_URL=http://<SEU_IP_AQUI>:3000
```

- **Android Emulator:** `http://10.0.2.2:3000`
- **Dispositivo físico / iOS Simulator:** `http://<IP_DA_MÁQUINA_NA_REDE>:3000`
- Descubra o IP com `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)

---

### 2. Executar seed do banco de dados

```bash
cd apps/backend
npx prisma db seed
```

Cria: 8 livros, 13 filmes, 6 séries, 8 atividades, 3 usuários de teste.

---

### 3. Confirmar variáveis de ambiente do backend

**Arquivo:** `apps/backend/.env`

```
DATABASE_URL=...
OPENAI_API_KEY=...
JWT_SECRET=...
NODE_ENV=production  # para deploy
```

---

## 🟡 IMPORTANTE — Fazer antes da entrega

### 4. Foto do mascote nas notificações (Android)

As notificações já têm texto no estilo do mascote. Para exibir a **imagem do mascote** nas notificações Android, é necessário:

1. Gerar um ícone de notificação no formato correto: PNG 24x24dp branco com fundo transparente
2. Nomear como `ic_notification.png` e colocar em `apps/mobile/android/app/src/main/res/drawable/`
3. No `notificationService.ts`, alterar `smallIcon: 'ic_launcher'` para `smallIcon: 'ic_notification'`

> **Nota:** No iOS, a foto do mascote em notificações requer configuração de `attachments`, que é mais complexa e pode ser feito pós-protótipo.

---

### 5. Endpoint de recuperação de senha (backend)

Os endpoints abaixo ainda não existem no backend:

- `POST /auth/forgot-password` — envio de e-mail com link de redefinição
- `POST /auth/reset-password` — validação do token JWT e atualização da senha

O fluxo mobile já está configurado: o botão "Enviar" em `ResetPassword.tsx` tenta chamar a API e, caso falhe (endpoint inexistente), navega para a tela de confirmação assim mesmo, mostrando a mensagem de suporte.

**Para ativar completamente:** implementar os dois endpoints no backend e configurar o serviço de e-mail (SendGrid, Nodemailer, etc.).

---

### 6. Serviço de e-mail verificar disponibilidade (Bug 5.2)

Antes de habilitar o fluxo de recuperação de senha, verificar se há um serviço de envio de e-mail disponível (SMTP, SendGrid, etc.) e configurá-lo no backend.

---

### 7. Splash screen

**Arquivo:** `apps/mobile/app.json` — campo `splash.image`

O asset final da splash screen ainda não foi fornecido. Quando disponível:
1. Colocar o arquivo em `apps/mobile/assets/`
2. Atualizar `app.json` → `expo.splash.image`

---

### 8. Confirmar versão e identificadores do app

**Arquivo:** `apps/mobile/app.json`

```json
{
  "expo": {
    "version": "1.0.0",
    "ios": { "bundleIdentifier": "com.oncomente.app" },
    "android": { "package": "com.oncomente.app" }
  }
}
```

Confirmar se estes valores são os corretos para a entrega.

---

## 🟢 POLIMENTO — Pós-entrega aceitável

### 9. Dados antigos do AsyncStorage de tratamentos

Usuários que tinham tratamentos salvos no AsyncStorage (antes da migração para API) perderão esses dados — eles não são migrados automaticamente. Para o protótipo com usuários novos isso não é problema.

### 10. Imagem do mascote nas notificações (iOS)

Ver item 4 acima. iOS requer `attachments` com URL local, mais complexo para configurar.

### 11. Limpeza de importações não utilizadas (Módulo 0 do task original)

Os arquivos abaixo podem conter imports, estilos ou `console.log` legados que não foram removidos nesta rodada (não causam bugs, apenas acúmulo técnico):

| Arquivo | Item suspeito |
|---------|---------------|
| `Treatment/index.tsx` | `Alert` ainda importado (usado no delete — OK manter) |
| `Treatment/update/index.tsx` | `Alert` ainda importado (usado no confirm dialog — OK manter) |
| `Diary/index.tsx` | `Alert` ainda importado (usado no delete — OK manter) |
| `AccountConfigurations/index.tsx` | Verificar `Alert` |
| `OnboardingForm/index.tsx` | Verificar `baseText` (importado mas pode não ser usado) |
| `RecoverPassword.tsx` | `SendResetForm` component — não está mais referenciado no JSX, mas foi removido da tela |
| `BreathingExercises/index.tsx` | Verificar estilos de animação não referenciados |

### 12. Dependências do package.json a confirmar e remover

Executar `grep -r "expo-web-browser\|react-native-webview\|react-native-element-dropdown\|expo-linking" apps/mobile/src` para confirmar se são usadas antes de remover.

### 13. Conteúdo dinâmico (Daily Messages)

A tela `Home/index.tsx` usa `mockDailyMessages` (50 mensagens locais). O endpoint `GET /daily-messages` do backend ainda não existe. Criar o endpoint e substituir o mock após o protótipo.

### 14. Swagger — adicionar autenticação Bearer

O Swagger está ativo em `/api`. Para testar endpoints autenticados pelo Swagger UI, adicionar `addBearerAuth()` ao `DocumentBuilder` em `main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle(...)
  .addBearerAuth()
  .build();
```

---

## 📋 Testes manuais obrigatórios (Módulo 6 do task original)

Estes testes não podem ser automatizados e precisam ser feitos em dispositivo/emulador:

- [ ] Cadastro → Onboarding → Home (fluxo completo novo usuário)
- [ ] Login → navegar todas as abas → logout
- [ ] Diário: criar / editar / deletar (mesma entrada no mesmo dia deve bloquear)
- [ ] Tratamento: criar via API → ver no Calendário → editar → deletar
- [ ] Chat do mascote: 5 mensagens → limite exibido → reinicia no dia seguinte
- [ ] Botão de pânico: CVV 188 discagem funciona em Android/iOS
- [ ] Lazer: Livros / Filmes / Séries carregam do backend (rodar seed primeiro)
- [ ] Auth-gate: tentar acessar `/PersonalArea` sem token → redireciona para login
- [ ] "Esqueci minha senha" → ResetPassword (form) → RecoverPassword (confirmação)
- [ ] Vídeos de meditação e exercícios reproduzem
- [ ] Respiração: animação pulsante nos 3 modos

---

## ✅ O que foi feito nesta rodada

| Item | Status |
|------|--------|
| `treatmentService.ts` criado (integra com `/personal/treatments`) | ✅ |
| `Treatment/index`, `create`, `update` migrados para API | ✅ |
| `Calendar/index.tsx` migrado para API | ✅ |
| `api.ts` usa `EXPO_PUBLIC_API_URL` do `.env` | ✅ |
| `.env` e `.env.example` criados | ✅ |
| Fluxo senha: LoginScreen → ResetPassword (form) → RecoverPassword (confirmação) | ✅ |
| `authService.forgotPassword()` adicionado | ✅ |
| Notificações com texto estilo mascote | ✅ |
| Chat: `console.log` removido | ✅ |
| Chat: limite de 5 mensagens/dia com banner visual | ✅ |
| `UpdateUserDto.phone_number` com `@MaxLength(20)` | ✅ |
| Onboarding exibido após cadastro (`firstTime` param) | ✅ |
| Swagger já estava ativo em `main.ts` (não estava comentado) | ✅ |
| Diário já tinha search bar implementada | ✅ |
