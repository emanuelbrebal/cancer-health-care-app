# Plano Final de Lançamento — OncoMente

> Gerado em: 2026-04-26  
> Branch: `fix/refining-fixes-to-launch-the-prototype`  
> Status: varredura completa de todos os planos anteriores consolidada aqui

---

## O que está PRONTO (não tocar)

| Área | Itens confirmados ✅ |
|---|---|
| **Auth** | JWT_SECRET obrigatório na startup · Register coleta name · Mailer implementado · Fluxo reset de senha completo (ResetPassword → RecoverPassword) · changePassword tela + serviço · Interceptor 401 → logout automático · Logout limpa AsyncStorage · Ownership PATCH/DELETE /users · Email duplicado bloqueado · Paginação GET /users |
| **Perfil** | Birthday validada (data no passado) · Store atualizado após PATCH · PronounEnum alinhado (SR/SRA/SRTA/NOT_INFORMED) |
| **Tratamentos** | Path `/personal/treatments` correto · startTime validado com @Matches HH:MM · Conversão de datas isoToDDMMYYYY ↔ ddmmyyyyToISO robusta |
| **Diário** | Ownership em findOne ✅ · Ownership em remove ✅ |
| **Mascote** | Cron job noturno removido · userId do JWT no Chat · GET /context com JwtAuthGuard · Histórico em AsyncStorage · Master prompt completo · { response } padronizado · Emergency triggers |
| **Geral** | userDeletionLog antes do delete · Interceptor axios request (token JWT) |

---

## O que ainda precisa ser feito — 10 itens

---

### 🔴 BLOCKER 1 — `POST /ai-support/ask` sem autenticação

**Arquivo:** `apps/backend/src/mascot/mascot.controller.ts`  
**Arquivo:** `apps/backend/src/mascot/dto/ask-ai.ts`  
**Arquivo:** `apps/backend/src/mascot/mascot.service.ts`

**Problema:** O endpoint `POST /ask` só tem `ThrottlerGuard`. Qualquer pessoa anônima pode consumir a API Groq sem limite real. Além disso, `userId` é aceito do body — um usuário pode enviar o ID de outro.

**Fix no controller (`mascot.controller.ts`):**
```typescript
@UseGuards(JwtAuthGuard, ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Post('ask')
async ask(@Req() req: any, @Body() askAiDto: AskAiDto) {
  return this.aiService.generateResponse(req.user.userId, askAiDto);
}
```

**Fix no DTO (`ask-ai.ts`):** remover o campo `userId`:
```typescript
export class AskAiDto {
  @IsString() @IsNotEmpty() @MaxLength(1000)
  userQuestion: string;

  @IsArray() @IsOptional()
  calendarData: any[];

  @IsArray() @IsOptional()
  treatmentData: any[];
}
```

**Fix no service (`mascot.service.ts`):** ajustar assinatura para receber `userId` como parâmetro:
```typescript
async generateResponse(userId: string, data: AskAiDto) { ... }
// e no logInteraction usar o userId do parâmetro, não do DTO
```

---

### 🔴 BLOCKER 2 — `GET /daily-logs/search` interceptado por `GET /daily-logs/:id`

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.controller.ts`

**Problema:** No controller, `@Get(':id')` está declarado na linha 22 antes de `@Get('search')` na linha 32 e `@Get('report/pdf')` na linha 59. NestJS testa rotas na ordem de declaração — `GET /daily-logs/search` bate em `:id` com id='search' antes de chegar na rota correta.

**Fix:** Mover os `@Get` com path literal para ANTES do `@Get(':id')`:
```
Ordem correta:
1. @Post()
2. @Get('search')      ← mover para cá
3. @Get('report/pdf')  ← mover para cá
4. @Get(':id')
5. @Get()
6. @Patch(':id')
7. @Delete(':id')
```

---

### 🔴 BLOCKER 3 — `req.userId` indefinido no export de PDF

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.controller.ts` (linhas 68 e 74)

**Problema:** O guard JWT coloca o usuário em `req.user.userId`, mas o endpoint de PDF usa `req.userId` → sempre `undefined`. O PDF é gerado para o usuário errado e o filename fica `relatorio-emocional-undefined.pdf`.

**Fix:**
```typescript
// linha 68:
const buffer = await this.reportService.generateEmotionsPdf(
  req.user.userId,   // era: req.userId
  new Date(start),
  new Date(end)
);

// linha 74:
'Content-Disposition': `attachment; filename=relatorio-emocional-${req.user.userId}.pdf`,
```

---

### ⚠️ HIGH 4 — `POST /register` sem throttle

**Arquivo:** `apps/backend/src/auth/auth.controller.ts`

**Problema:** Login tem `@Throttle({ limit: 5, ttl: 60s })` e forgot-password tem `@Throttle({ limit: 3, ttl: 60s })`, mas register não tem nenhum — permite criação massiva de contas.

**Fix:**
```typescript
@Throttle({ default: { limit: 3, ttl: 60000 } })
@Post('register')
async register(@Body() registerDto: RegisterDto) { ... }
```

---

### ⚠️ HIGH 5 — `update` do diário sem verificação de dono

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.service.ts`

**Problema:** O método `update()` verifica se o log existe, mas NÃO verifica se pertence ao `userId` autenticado. O `remove()` faz a verificação corretamente — `update()` precisa do mesmo padrão.

**Fix:**
```typescript
async update(id: string, userId: string, dto: UpdateDailyLogDto) {
  const log = await this.repository.findOne(id);
  if (!log) throw new NotFoundException('Diário não encontrado.');
  if (log.userId !== userId) throw new ForbiddenException('Acesso negado.');   // ← adicionar

  return this.repository.updateWithAudit(id, userId, dto);
}
```

---

### ⚠️ HIGH 6 — `AskAiDto.userQuestion` sem limite de tamanho

**Arquivo:** `apps/backend/src/mascot/dto/ask-ai.ts`

**Problema:** Sem `@MaxLength`, uma pergunta de 100 KB gera uma chamada cara para a API Groq. Já coberto no item BLOCKER 1 — incluído aqui para registro.

**Fix:** já incluído no BLOCKER 1 (`@MaxLength(1000)`).

---

### ⚠️ HIGH 7 — `mascot.entity.ts` vazio — dead code

**Arquivo:** `apps/backend/src/mascot/entities/mascot.entity.ts`

**Problema:** Contém apenas `export class Mascot {}`, não é importado em nenhum lugar.

**Fix:** Deletar o arquivo.

```bash
# verificar que não há imports
grep -r "mascot.entity" apps/backend/src
# depois deletar
```

---

### 🟡 MEDIUM 8 — `profile_picture` sem limite de tamanho

**Arquivo:** `apps/backend/src/user/dto/update-user.dto.ts`

**Problema:** `profile_picture` aceita qualquer string. O mobile envia base64 (quality 0.7, crop 1:1) que pode gerar strings de 300 KB–1 MB, sobrecarregando o parse do NestJS e o banco.

**Fix:**
```typescript
@IsOptional()
@IsString()
@MaxLength(2000000)   // ~1.5 MB de base64
profile_picture?: string;
```

---

### 🟡 MEDIUM 9 — Email de reset envia token JWT bruto

**Arquivo:** `apps/backend/src/mailer/mailer.service.ts`

**Problema:** O email envia o token JWT completo (ex: `eyJhbGci...` com ~200 chars) como "código". O usuário precisa copiar e colar esse token gigante no campo da tela. UX ruim mas tecnicamente funcional para o protótipo.

**Decisão:** Aceitar para o protótipo. O fluxo é funcional. Melhoria futura: usar código numérico de 6 dígitos armazenado no banco com TTL.

**Ação:** Atualizar o template do email para instruir o usuário a "copiar o código completo":
```html
<p>Copie o código completo abaixo e cole no campo indicado no aplicativo:</p>
<div style="...word-break:break-all">
  <span style="font-size:13px;font-family:monospace;">${token}</span>
</div>
```

---

### 🟡 MEDIUM 10 — `RegisterDto.pronoun` não existe mas `PronounEnum` não é coletado no cadastro

**Arquivo:** `apps/backend/src/auth/dto/register.dto.ts`

**Situação:** O pronome não é coletado no cadastro (simplificado). O usuário define o pronome na tela de onboarding após o primeiro login. Isso é comportamento correto e intencional — o campo não precisa estar no `RegisterDto`.

**Ação:** Nenhuma. Documentar como decisão consciente.

---

## Ordem de execução recomendada

```
Sessão 1 — Blockers (prioridade máxima, ~30 min)
  1. BLOCKER 3 → req.userId no PDF (1 arquivo, 2 linhas)
  2. BLOCKER 2 → reordenar rotas daily-logs (1 arquivo, mover blocos)
  3. BLOCKER 1 → JwtAuthGuard no /ask + remover userId do DTO + ajustar service

Sessão 2 — Segurança alta (~20 min)
  4. HIGH 4 → throttle no register (1 linha)
  5. HIGH 5 → ownership no update do diário (3 linhas)
  6. HIGH 7 → deletar mascot.entity.ts (1 arquivo)

Sessão 3 — Qualidade (~15 min)
  7. MEDIUM 8 → MaxLength em profile_picture (1 linha)
  8. MEDIUM 9 → melhorar template do email de reset
```

---

## Resumo de arquivos a editar

| Arquivo | Itens | Prioridade |
|---|---|---|
| `mascot/mascot.controller.ts` | BLOCKER 1 | 🔴 |
| `mascot/dto/ask-ai.ts` | BLOCKER 1 + HIGH 6 | 🔴 |
| `mascot/mascot.service.ts` | BLOCKER 1 | 🔴 |
| `personal/daily-logs/daily-logs.controller.ts` | BLOCKER 2 + BLOCKER 3 | 🔴 |
| `personal/daily-logs/daily-logs.service.ts` | HIGH 5 | ⚠️ |
| `auth/auth.controller.ts` | HIGH 4 | ⚠️ |
| `mascot/entities/mascot.entity.ts` | HIGH 7 (deletar) | ⚠️ |
| `user/dto/update-user.dto.ts` | MEDIUM 8 | 🟡 |
| `mailer/mailer.service.ts` | MEDIUM 9 | 🟡 |

**Total: 9 arquivos · 10 itens · estimativa ~65 minutos de implementação**
