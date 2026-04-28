# Plano de Ação — Módulo Mascote Interativo
> Gerado em: 2026-04-24

---

## 1. Diagnóstico Atual

### Provedor de IA
O sistema **já usa Groq** (não OpenAI diretamente). O `mascot.service.ts` inicializa o cliente `openai` apontando para `https://api.groq.com/openai/v1` com `GROQ_API_KEY` e modelo `llama-3.1-8b-instant`.

**Conclusão: nenhuma troca de provedor é necessária.** Groq é gratuito, open-source (Llama 3.1 8B) e o risco de fatura surpresa é **inexistente no tier gratuito** para o volume esperado de um protótipo.

### Tier gratuito do Groq (llama-3.1-8b-instant)
| Métrica | Limite Gratuito |
|---------|----------------|
| Requisições/minuto | 30 RPM |
| Requisições/dia | 14.400 RPD |
| Tokens/minuto | 500.000 TPM |
| Custo | $0 |

Com 5 mensagens/dia por usuário e `max_tokens: 150`, o protótipo suportaria ~2.880 usuários ativos/dia antes de qualquer custo.

---

## 2. Problemas Identificados (do mais crítico ao menor)

### 🔴 CRÍTICO — Cron Job noturno é uma bomba de cota

**Arquivo:** `apps/backend/src/mascot/ai-scheduler.service.ts`

O `AiSchedulerService` executa **toda meia-noite** e chama a IA para **cada usuário cadastrado**, gerando uma análise emocional baseada nos logs do diário. Com N usuários, são N chamadas simultâneas. Com 200 usuários = 200 chamadas em segundos → ultrapassa o limite de 30 RPM do Groq instantaneamente, causando erros 429 em cascata. Além disso, o resultado da análise **não é exibido ao usuário** nem salvo de forma acessível — apenas atualiza um timestamp `lastAiAnalysis`.

**Ação:** Remover o cron job completamente para o protótipo. Se a funcionalidade for reativada no futuro, deve ser feita sob demanda (usuário solicita explicitamente) ou via queue com backoff.

### 🔴 CRÍTICO — userId hardcoded no Chat mobile

**Arquivo:** `apps/mobile/src/app/(Home)/Mascot/Chat/index.tsx`, linha ~80

```typescript
userId: "usuario-teste-001", // ← BUG
```

Todos os logs de interação são salvos com o mesmo usuário fictício. O contexto de tratamento e agenda enviados ao mascote ficam vazios (`{}`), tornando a personalização ineficaz.

**Ação:** Injetar o usuário real via `useAuthStore` e buscar os dados reais de tratamento/emoções.

### 🟡 MÉDIO — Histórico do chat é perdido ao fechar o app

**Situação atual:**
- As mensagens ficam apenas em `useState` → perdidas ao fechar o app.
- O `PatientSupportLog` no PostgreSQL guarda os logs mas **a tela de chat não os carrega** — é um log de analytics, não de UX.

**Decisão arquitetural — onde persistir o histórico:**

| Opção | Pros | Contras |
|-------|------|---------|
| **AsyncStorage (recomendado)** | Offline, sem round-trip de rede, rápido, sem custo de BD | Limitado ao dispositivo, perdido ao reinstalar |
| PostgreSQL | Histórico em qualquer dispositivo | Round-trip extra na abertura, custo de BD cresce, implementação maior |

**Recomendação:** Persistir os últimos **20 messages** em AsyncStorage com a chave `oncomente:chat-history`. O `PatientSupportLog` permanece como log de analytics no backend — são responsabilidades separadas.

### 🟡 MÉDIO — Limite diário de mensagens: AsyncStorage vs PostgreSQL

**Situação atual:** O limite de 5 mensagens/dia já está implementado em AsyncStorage (`oncomente:chat-daily-limit`). É bypassável ao limpar dados do app, mas isso é **aceitável para um protótipo** — o ThrottlerGuard do backend (3 req/60s) já protege contra abuso real.

**Recomendação:** Manter o limite em AsyncStorage. Não vale o custo de implementação de um endpoint dedicado para checar/incrementar o counter server-side no estágio atual.

Se no futuro o limite precisar ser confiável (ex.: versão premium com N mensagens/mês), implementar um campo `dailyMascotCount` + `dailyMascotDate` no model `User` do Prisma.

### 🟡 MÉDIO — Master Prompt genérico e sem identidade do mascote

**Situação atual:** `AI_MASTER_PROMPT` tem padrão `'Assistente de Suporte'` — vago e sem personalidade. A tela mobile apresenta o mascote como um companheiro carinhoso, mas o prompt não reflete isso. Nome do mascote ainda não definido.

**Ação:** Definir um prompt adequado na variável de ambiente `AI_MASTER_PROMPT` no `.env` do backend quando o nome for definido.

### 🟢 MENOR — Mismatch de resposta entre backend e frontend

**Situação atual:** O backend retorna a string de resposta diretamente (`return response`), mas o frontend tenta acessar `response.data?.response` antes de fallback para `typeof response.data === 'string'`. O fallback funciona, mas é frágil.

**Ação:** Padronizar o retorno do backend para `{ response: string }`.

---

## 3. Plano de Ação Priorizado

### Fase 1 — Correções críticas (antes do lançamento)

#### 1.1 Remover o cron job noturno
- Deletar `apps/backend/src/mascot/ai-scheduler.service.ts`
- Remover `AiSchedulerService` do `mascot.module.ts`
- Remover `ScheduleModule.forRoot()` do módulo (verificar se não é usado em outro lugar)
- Remover campo `lastAiAnalysis` do model `User` no Prisma (ou deixar sem popular)

#### 1.2 Corrigir userId no chat mobile
```typescript
// Chat/index.tsx
import { useAuthStore } from '@/src/store/useAuthStore';

const user = useAuthStore((s) => s.user);
// ...
userId: user?.id ?? '',
```

### Fase 2 — UX e qualidade (antes do lançamento público)

#### 2.1 Persistir histórico em AsyncStorage
```typescript
const CHAT_HISTORY_KEY = 'oncomente:chat-history';
const MAX_HISTORY = 20;

// Carregar ao montar a tela
useEffect(() => {
  AsyncStorage.getItem(CHAT_HISTORY_KEY).then(raw => {
    if (raw) setMessages(JSON.parse(raw));
  });
}, []);

// Salvar ao adicionar mensagem
useEffect(() => {
  const slice = messages.slice(0, MAX_HISTORY);
  AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(slice));
}, [messages]);
```

#### 2.2 Definir master prompt com personalidade do mascote
```env
# apps/backend/.env
AI_MASTER_PROMPT="Você é o mascote virtual do aplicativo OncoMente. Seu tom é carinhoso, acolhedor e esperançoso — como um abraço em forma de palavras. Você apoia pacientes oncológicos e seus cuidadores com informações sobre saúde mental, oncologia e bem-estar. Seja breve, empático e jamais substitua orientação médica profissional. Responda sempre em português brasileiro."
```

#### 2.3 Padronizar resposta do backend
No `mascot.service.ts`, retornar objeto estruturado:
```typescript
return { response };
```
No `Chat/index.tsx`, simplificar leitura:
```typescript
const botText = response.data?.response ?? 'Sinto muito, recebi uma resposta vazia. Pode repetir? 💜';
```

### Fase 3 — Contextualização por paciente (personalização real)

Esta fase conecta o mascote aos dados reais do usuário: **tratamentos ativos** e **relatório de emoções do diário** (sem acesso ao conteúdo textual dos registros, apenas emotes e datas). Os campos `treatmentData` e `calendarData` do `AskAiDto` já existem — falta apenas populá-los com dados reais.

#### 3.1 Novo endpoint de contexto no backend

Criar `GET /ai-support/context` (protegido por `JwtAuthGuard`) que agrega, em uma única chamada, os dados necessários para o mascote conversar de forma personalizada.

**Por que endpoint separado e não buscar a cada mensagem?**
O contexto muda pouco ao longo do dia (tratamentos são semanais/mensais, diário é uma entrada por dia). Buscar uma vez por sessão é suficiente — elimina latência extra e carga desnecessária no BD a cada envio de mensagem.

**Dados retornados:**
```typescript
// GET /ai-support/context → resposta
{
  treatments: [
    { name: "Quimioterapia", frequency: "Semanal", startTime: "08:00", endDate: "2024-12-01" }
  ],
  emotionSummary: [
    { date: "2026-04-24", emotes: ["ansioso", "esperançoso"] },
    { date: "2026-04-23", emotes: ["triste"] }
    // últimos 7 dias
  ]
}
```

**Adição em `mascot.controller.ts`:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('context')
async getContext(@Request() req) {
  return this.aiService.getUserContext(req.user.sub);
}
```

**Novo método em `mascot.service.ts`:**
```typescript
async getUserContext(userId: string) {
  const [treatments, logs] = await Promise.all([
    this.prisma.treatment.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { name: true, frequency: true, startTime: true, endDate: true }
    }),
    this.prisma.dailyLog.findMany({
      where: {
        userId,
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      select: { date: true, emotes: true }, // ← SEM content, SEM title
      orderBy: { date: 'desc' }
    })
  ]);

  return {
    treatments,
    emotionSummary: logs.map(l => ({
      date: l.date.toISOString().slice(0, 10),
      emotes: l.emotes
    }))
  };
}
```

O `MascotModule` não precisa importar outros módulos — o `PrismaService` já está disponível e acessa as tabelas diretamente.

#### 3.2 Serviço de contexto no mobile

Novo arquivo `apps/mobile/src/services/mascotService.ts`:
```typescript
import api from './api';

export interface MascotContext {
  treatments: {
    name: string;
    frequency: string;
    startTime: string;
    endDate: string;
  }[];
  emotionSummary: {
    date: string;
    emotes: string[];
  }[];
}

const mascotService = {
  getContext: (): Promise<MascotContext> =>
    api.get('/ai-support/context').then(r => r.data),
};

export default mascotService;
```

#### 3.3 Integrar contexto no Chat mobile

Em `Chat/index.tsx`, buscar contexto na montagem e incluir no payload de cada mensagem:

```typescript
const user = useAuthStore((s) => s.user);
const [userContext, setUserContext] = useState<MascotContext | null>(null);

// Buscar uma vez por sessão de chat
useEffect(() => {
  mascotService.getContext()
    .then(setUserContext)
    .catch(() => {}); // silencioso — o chat funciona sem contexto
}, []);

// Na chamada de envio:
await api.post('/ai-support/ask', {
  userQuestion: userMessageText,
  userId: user?.id ?? '',
  treatmentData: userContext?.treatments ?? [],
  calendarData: userContext?.emotionSummary ?? [],
});
```

#### 3.4 Como o prompt ficará com dados reais

O `buildPrompt` em `mascot.service.ts` já formata esses campos. Com dados reais, o prompt enviado ao modelo será:

```
### INSTRUÇÕES DE SISTEMA ###
[personalidade do mascote]

### CONTEXTO REAL DO PACIENTE (FONTE ÚNICA DE VERDADE) ###
Tratamento: [{"name":"Quimioterapia","frequency":"Semanal","startTime":"08:00","endDate":"01/12/2024"}]
Agenda: [{"date":"2026-04-24","emotes":["ansioso","esperançoso"]},{"date":"2026-04-23","emotes":["triste"]}]

### PERGUNTA DO USUÁRIO ###
Como posso me preparar para minha sessão de amanhã?

RESPOSTA DO MASCOTE (CURTA E SEM SUPOSIÇÕES):
```

O mascote saberá que o usuário faz quimioterapia semanal às 8h e que nos últimos dias registrou ansiedade — podendo responder de forma empática e contextualizada.

#### 3.5 Privacidade: o que o mascote nunca acessa

| Campo | Acessa? | Motivo |
|-------|---------|--------|
| `DailyLog.emotes` | ✅ Sim | Apenas categorias de humor (ex.: "ansioso") |
| `DailyLog.date` | ✅ Sim | Contexto temporal |
| `DailyLog.content` | ❌ Não | Texto íntimo do diário — excluído do `select` do Prisma |
| `DailyLog.title` | ❌ Não | Idem |
| `Treatment.name` | ✅ Sim | Para personalizar o suporte |
| `Treatment.frequency` | ✅ Sim | Idem |
| `Treatment.doctorContact` | ❌ Não | Dado sensível — fora do `select` |
| `User.password` | ❌ Não | Nunca |

---

### Fase 4 — Futuro (pós-protótipo)

- [ ] Substituir limite AsyncStorage por counter server-side se precisar de controle confiável (campo `dailyMascotCount` + `dailyMascotDate` no model `User`)
- [ ] Migrar `PatientSupportLog` para ter TTL (limpar logs > 90 dias) para não crescer indefinidamente
- [ ] Avaliar Groq paid tier se base de usuários justificar (limites mais altos, SLA)
- [ ] Incluir dados de calendário de eventos no contexto se o módulo `Calendar` for implementado

---

## 4. Resumo das Decisões

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Trocar provedor de IA? | **Não** | Já usa Groq (gratuito, Llama open-source) |
| Modelo | **Manter llama-3.1-8b-instant** | Leve, rápido, gratuito, suficiente para suporte emocional |
| Limite diário de mensagens | **AsyncStorage** | Simples, offline, aceitável para protótipo |
| Histórico do chat | **AsyncStorage (últimas 20)** | Sem round-trip, sem custo de BD, persiste entre sessões |
| PatientSupportLog | **Manter como analytics** | Não remover — útil para moderação/admin |
| Cron job noturno | **Remover** | Quota killer, resultado não exibido ao usuário |
| Contexto do paciente | **Buscar no backend, cachear na sessão** | Uma chamada por sessão em vez de por mensagem |
| Privacidade do diário | **Apenas emotes + data** | Conteúdo e título excluídos do `select` do Prisma |

---

## 5. Arquivos a Modificar / Criar

| Arquivo | Ação |
|---------|------|
| `apps/backend/src/mascot/ai-scheduler.service.ts` | **Deletar** |
| `apps/backend/src/mascot/mascot.module.ts` | Remover `AiSchedulerService` e `ScheduleModule` |
| `apps/backend/src/mascot/mascot.service.ts` | Retornar `{ response }`; adicionar `getUserContext()`; melhorar master prompt padrão |
| `apps/backend/src/mascot/mascot.controller.ts` | Adicionar `GET /ai-support/context` com `JwtAuthGuard` |
| `apps/backend/.env` | Definir `AI_MASTER_PROMPT` com personalidade do mascote (nome a definir) |
| `apps/mobile/src/services/mascotService.ts` | **Criar** — encapsula `getContext()` |
| `apps/mobile/src/app/(Home)/Mascot/Chat/index.tsx` | Corrigir userId; buscar contexto na sessão; persistir histórico em AsyncStorage |
