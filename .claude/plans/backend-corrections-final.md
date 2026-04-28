# Backend — Correções Finais (Mascote + Área Pessoal)

Data de geração: 2026-04-25  
Branch: `fix/refining-fixes-to-launch-the-prototype`

---

## BLOCKERS — Travam funcionalidade em produção

### 1. `[MASCOT]` Endpoint `/ai-support/ask` sem autenticação JWT

**Arquivo:** `apps/backend/src/mascot/mascot.controller.ts`

**Problema:** O endpoint `POST /ai-support/ask` não possui `@UseGuards(JwtAuthGuard)`. Qualquer usuário anônimo pode chamar a IA diretamente, consumindo cotas sem restrição.

**Fix:**
```typescript
// Adicionar guard + extrair userId do token (não aceitar do body)
@UseGuards(JwtAuthGuard)
@Post('ask')
async ask(@Req() req: any, @Body() dto: AskAiDto) {
  const userId = req.user.userId; // ← extrair do JWT, não do body
  return this.mascotService.generateResponse(userId, dto);
}
```

**Também corrigir em `mascot.service.ts`:** remover `userId` do DTO e recebê-lo como parâmetro separado. Isso evita que usuário A envie `userId` de usuário B no body.

---

### 2. `[PERSONAL]` Rota de tratamentos com path incorreto

**Arquivo:** `apps/backend/src/personal/treatments/treatments.controller.ts`

**Problema:** Backend registra `@Controller('treatments')`, mas o mobile chama `/personal/treatments`. Todos os 5 endpoints de tratamento falham com 404.

**Fix:**
```typescript
@Controller('personal/treatments') // era: 'treatments'
```

---

### 3. `[PERSONAL]` Bug na exportação de PDF — `req.userId` inexistente

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.controller.ts`

**Problema:** Linha do endpoint de export usa `req.userId`, mas o guard JWT coloca o usuário em `req.user.userId`. O método sempre recebe `undefined`.

**Fix:**
```typescript
// Errado:
await this.reportService.generateEmotionsPdf(req.userId, ...)

// Correto:
await this.reportService.generateEmotionsPdf(req.user.userId, ...)
```

---

### 4. `[PERSONAL]` Rota `GET /daily-logs/search` sendo interceptada por `GET /daily-logs/:id`

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.controller.ts`

**Problema:** A rota `@Get('search')` está declarada DEPOIS de `@Get(':id')`. O NestJS trata "search" como um `:id`, causando erro 500 ou resultado inesperado.

**Fix:** Mover `@Get('search')` para antes de `@Get(':id')` no controller.

---

### 5. `[PERSONAL]` Endpoint de update do diário sem verificação de dono

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.service.ts`

**Problema:** O método `update(id, userId, dto)` não verifica se o log `id` pertence ao `userId` antes de atualizar. Qualquer usuário autenticado pode editar o diário de outro.

**Fix:**
```typescript
async update(id: string, userId: string, dto: UpdateDailyLogDto) {
  // Adicionar verificação antes de atualizar:
  const existing = await this.repository.findOne(id);
  if (!existing || existing.userId !== userId) {
    throw new ForbiddenException('Acesso negado');
  }
  return this.repository.update(id, dto);
}
```

**Aplicar o mesmo padrão no `delete`.**

---

## HIGH — Impacto direto na segurança ou dados

### 6. `[AUTH]` Token de reset de senha reutilizável

**Arquivo:** `apps/backend/src/auth/auth.service.ts`

**Problema:** Após uso do token de reset, ele não é invalidado. Um atacante com o link pode redefinir a senha múltiplas vezes.

**Fix:** Após verificar e usar o token com sucesso, gravar `usedAt = new Date()` no registro e rejeitar tokens já usados:
```typescript
if (resetToken.usedAt) {
  throw new UnauthorizedException('Token já utilizado');
}
// Após update de senha:
await this.prisma.passwordResetToken.update({
  where: { id: resetToken.id },
  data: { usedAt: new Date() },
});
```

---

### 7. `[AUTH]` Sem throttle no endpoint de registro

**Arquivo:** `apps/backend/src/auth/auth.controller.ts`

**Problema:** O login tem `@Throttle({ default: { limit: 5, ttl: 60000 } })`, mas o registro não. Permite criação massiva de contas.

**Fix:**
```typescript
@Throttle({ default: { limit: 3, ttl: 60000 } })
@Post('register')
async register(@Body() dto: RegisterDto) { ... }
```

---

### 8. `[MASCOT]` `userId` aceito do body — risco de spoofing

**Arquivo:** `apps/backend/src/mascot/dto/ask-ai.ts` + `mascot.service.ts`

**Problema:** O body de `POST /ai-support/ask` inclui `userId`, que o serviço usa diretamente. Com o guard adicionado (item 1), o `userId` deve vir exclusivamente do token JWT.

**Fix:** Remover `userId` do DTO `AskAiDto` e do body do request. Extrair somente de `req.user.userId`.

---

### 9. `[PERSONAL]` Sem validação de dono no delete do diário

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.service.ts`

**Problema:** `DELETE /daily-logs/:id` não verifica se o log pertence ao usuário autenticado (mesma falha do update — item 5).

**Fix:** Aplicar verificação de ownership antes de deletar (ver padrão do item 5).

---

## MEDIUM — Qualidade e consistência

### 10. `[MASCOT]` Entidade `Mascot` vazia — dead code

**Arquivo:** `apps/backend/src/mascot/entities/mascot.entity.ts`

**Problema:** Arquivo contém apenas `export class Mascot {}`, não é importado em lugar nenhum.

**Fix:** Deletar o arquivo e remover qualquer import referenciando-o.

---

### 11. `[PERSONAL]` `UpdateUserDto` aceita `profile_picture` como string livre

**Arquivo:** `apps/backend/src/user/dto/update-user.dto.ts`

**Problema:** Campo `profile_picture` aceita qualquer string, incluindo dados base64 enormes ou valores maliciosos.

**Fix:** Adicionar validação de URL:
```typescript
@IsUrl()
@IsOptional()
profile_picture?: string;
```
Se a estratégia for subir imagem como base64, adicionar `@MaxLength(500000)` para limitar tamanho.

---

### 12. `[MASCOT]` `AskAiDto` sem validação de tamanho em `userQuestion`

**Arquivo:** `apps/backend/src/mascot/dto/ask-ai.ts`

**Problema:** `userQuestion` não tem limite de tamanho. Uma pergunta de 50 KB gera uma chamada cara para a Groq API.

**Fix:**
```typescript
@IsString()
@IsNotEmpty()
@MaxLength(1000)
userQuestion: string;
```

---

### 13. `[PERSONAL]` Tratamento sem verificação de `status` DELETED antes de re-deletar

**Arquivo:** `apps/backend/src/personal/treatments/treatments.service.ts`

**Problema:** O soft-delete não verifica se o registro já está com status `"DELETED"`, gerando operações desnecessárias.

**Fix:**
```typescript
async remove(id: string) {
  const treatment = await this.repository.findOne(id);
  if (!treatment || treatment.status === 'DELETED') {
    throw new NotFoundException('Tratamento não encontrado');
  }
  return this.repository.softDelete(id);
}
```

---

### 14. `[AUTH]` `RegisterDto` — pronome não validado contra enum

**Arquivo:** `apps/backend/src/auth/dto/register.dto.ts`

**Problema:** O campo `pronoun` aceita qualquer string. O schema define `PronounEnum { SR, SRA, SRTA, CUSTOM, NOT_INFORMED }`.

**Fix:**
```typescript
import { PronounEnum } from '@shared/types/user';

@IsEnum(PronounEnum)
@IsOptional()
pronoun?: PronounEnum;
```

---

### 15. `[MASCOT]` Inconsistência de throttle entre mobile (5/dia) e backend (3/min)

**Arquivo:** `apps/backend/src/mascot/mascot.controller.ts`

**Problema:** O mobile limita 5 mensagens/dia em AsyncStorage. O backend limita 3 requests/60s globalmente, sem distinção por usuário. As duas políticas divergem sem intenção clara.

**Decisão necessária:** Definir onde fica a fonte da verdade. Opções:
- **A)** Backend gerencia o limite diário via `PatientSupportLog` (consultar contagem do dia atual)
- **B)** Manter no mobile, remover o throttle genérico do backend

Recomendação: **Opção A** + manter throttle de burst (3/min) como proteção extra.

---

## LOW — Melhorias desejáveis mas não bloqueantes

### 16. `[PERSONAL]` Hard delete no `DailyLog` sem possibilidade de recovery

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.repository.ts`

**Problema:** `DELETE` usa `tx.dailyLog.delete(...)`. Sem soft-delete, entradas apagadas são perdidas permanentemente.

**Fix sugerido:** Adicionar campo `deletedAt DateTime?` no schema e filtrar nas queries:
```prisma
deletedAt  DateTime?
```

---

### 17. `[PERSONAL]` Auditoria de `DailyLog` não registra campos alterados

**Arquivo:** `apps/backend/src/personal/daily-logs/daily-logs.service.ts`

**Problema:** O `DailyLogAudit` registra apenas `action` e `timestamp`, sem diff dos campos. Impossível saber o que mudou.

**Fix sugerido:** Gravar snapshot `before` e `after` como JSON no audit:
```typescript
await tx.dailyLogAudit.create({
  data: { logId, userId, action, before: JSON.stringify(existing), after: JSON.stringify(updated) }
});
```

---

### 18. `[AUTH]` Sem requisitos mínimos de complexidade de senha

**Arquivo:** `apps/backend/src/auth/dto/register.dto.ts` + `change-password.dto.ts`

**Problema:** Senha aceita a partir de 6 caracteres sem nenhum requisito de complexidade.

**Fix:** Adicionar validação com regex ou biblioteca `zxcvbn`:
```typescript
@Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
  message: 'Senha deve ter 8+ caracteres, 1 maiúscula e 1 número',
})
```

---

## Resumo por arquivo a editar

| Arquivo | Itens | Prioridade |
|---|---|---|
| `mascot/mascot.controller.ts` | 1, 15 | BLOCKER |
| `mascot/mascot.service.ts` | 1, 8 | BLOCKER |
| `mascot/dto/ask-ai.ts` | 8, 12 | HIGH |
| `mascot/entities/mascot.entity.ts` | 10 | DELETE |
| `personal/treatments/treatments.controller.ts` | 2 | BLOCKER |
| `personal/treatments/treatments.service.ts` | 13 | MEDIUM |
| `personal/daily-logs/daily-logs.controller.ts` | 3, 4 | BLOCKER |
| `personal/daily-logs/daily-logs.service.ts` | 5, 9, 17 | BLOCKER / LOW |
| `personal/daily-logs/daily-logs.repository.ts` | 16 | LOW |
| `user/dto/update-user.dto.ts` | 11 | MEDIUM |
| `auth/auth.service.ts` | 6 | HIGH |
| `auth/auth.controller.ts` | 7 | HIGH |
| `auth/dto/register.dto.ts` | 14, 18 | MEDIUM / LOW |

---

## Ordem de execução recomendada para amanhã

1. **Blockers primeiro** (itens 1–5): segurança e funcionalidade quebrada
2. **Segurança auth** (itens 6–9): tokens e spoofing
3. **Qualidade/consistência** (itens 10–15): limpeza e robustez
4. **Melhorias** (itens 16–18): opcionais, se houver tempo
