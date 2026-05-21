# Planejamento — Reestruturação do Prompt do Mascote OncoMente

> Documento de planejamento. Execução em microcommits separados, seguindo `.claude/rules/commits.md`.

---

## 1. Diagnóstico do estado atual

Hoje o prompt do mascote vive em duas fontes:

- [`apps/backend/src/mascot/mascot.service.ts`](./mascot.service.ts) — constante `FALLBACK_PROMPT` (linhas 179-261) com todo o prompt monolítico embutido no código.
- Variável de ambiente `AI_MASTER_PROMPT` — string única em `.env`, **sem versionamento** e difícil de revisar/auditar.

### Problemas identificados

1. **Acoplamento** — identidade, regras, formato, escopo e exemplos misturados num único bloco; mudar tom força reescrever tudo.
2. **Determinismo fraco** — regras como "máx. 2 frases" convivem com exemplos longos; sem few-shot bem estruturado, sem frases canônicas fixas.
3. **Anti-alucinação solta** — R2 existe no texto mas não há barreira de saída (só `validateResponse` filtra idioma).
4. **Prompt fora do git** — quando em `.env`, mudanças não são revisáveis em PR.
5. **Sem separação de concerns** entre alma (quem é), regras (o que pode fazer) e conhecimento (o que sabe sobre o app).
6. **Sem fonte de verdade para FAQ do app** — quando o usuário pergunta sobre o projeto ou funcionalidades, o mascote depende de inferência sobre o texto do prompt.

---

## 2. Arquitetura proposta — Prompt modular em arquivos

Criar diretório versionado no git em `apps/backend/src/mascot/prompt/`, com módulos `.md` carregados e compostos em runtime pelo backend:

```
apps/backend/src/mascot/prompt/
├── soul.md              # IDENTIDADE — quem é o mascote, tom, persona
├── rules.md             # REGRAS ABSOLUTAS (R1-R8 atuais + novas R9, R10)
├── scope.md             # FUNCIONALIDADES — única fonte de verdade do app
├── faq.md               # FAQ — perguntas frequentes sobre app/projeto (base no README)
├── format.md            # FORMATO DE SAÍDA — estrutura determinística
├── safety.md            # PROTOCOLOS — emergência, anti-injeção, escopo médico
├── examples.md          # FEW-SHOT — pares pergunta/resposta canônicos
└── user-context.md      # TEMPLATE — placeholders {{nome}}, {{papel}}, etc.
```

### 2.1. `soul.md` — A alma do mascote

Conteúdo focado em **identidade emocional e narrativa**:

- Nome do mascote, arquétipo (companheiro digital, não médico).
- Tom de voz: calmo, esperançoso, validação antes de informação.
- Postura frente a paciente vs cuidador.
- O que o mascote **nunca é** (médico, terapeuta, oráculo).
- Princípios filosóficos: "primeiro acolher, depois orientar".

**Por que separar:** permite ajustar personalidade sem mexer em regras técnicas; revisores não-devs (designer, psicóloga) podem editar só este arquivo.

### 2.2. `rules.md` — Regras invioláveis

Reescrita das R1-R8 em formato mais determinístico, com gatilhos explícitos:

- **R1 idioma** — pt-BR exclusivo + checklist de auto-verificação.
- **R2 anti-alucinação reforçada** — adicionar: "Se não está em [scope.md], [faq.md] ou [user-context.md], responda EXATAMENTE: 'Não tenho essa informação.'" (frase canônica fixa, para o `validateResponse` poder detectar).
- **R3-R8** — manter mas com formato `SE <gatilho> → RESPONDA <frase fixa>`.
- **R9 (nova) — Sem números inventados:** proibir explicitamente estatísticas, percentuais, durações de tratamento, dosagens, datas, prazos legais sem que estejam no contexto injetado.
- **R10 (nova) — Sem promessas:** proibir "vai ficar tudo bem", "você vai se curar", "logo passa".

### 2.3. `scope.md` — Funcionalidades como fonte única de verdade

Lista canônica das telas/funcionalidades em formato estruturado (markdown table ou YAML embutido), para a IA não inventar telas. Atualizar este arquivo é a forma oficial de "ensinar" o mascote sobre o app.

Deve cobrir:

- Área Oncológica (Autocuidados, Lazer, Benefícios Legais) e subseções.
- Área de Saúde Mental (incluindo Botão do Pânico com CVV/SAMU/CAVIDA).
- Meu Perfil (Diário, Tratamentos, Denúncias, Configurações, Notificações).
- Mascote Virtual (este chat).

### 2.4. `faq.md` — Perguntas frequentes sobre o app e o projeto

**Novo arquivo** dedicado a responder dúvidas sobre o **aplicativo, suas telas, funcionalidades e o projeto em si**, usando o [`README.md`](../../../../README.md) do projeto como fonte de verdade.

Estrutura proposta:

```markdown
# FAQ — OncoMente

## Sobre o projeto
- O que é o OncoMente?
- Para quem é o aplicativo? (pacientes oncológicos e cuidadores)
- O OncoMente substitui consulta médica? (não)
- O app é gratuito?

## Como usar
- Como criar minha conta?
- Como faço o onboarding?
- Como mudo meu pronome / role (paciente ou cuidador)?

## Funcionalidades
- O que tem na Área Oncológica?
- Como funciona o Diário Virtual?
- Como registro um tratamento ou medicamento?
- Como funciona o Calendário?
- O que é o Botão do Pânico? Quando devo usar?
- Como funciona o canal de denúncias?
- Como customizo o mascote?

## Privacidade e segurança
- Meus dados são compartilhados?
- Como funciona o login?
```

Cada item deve ter **resposta canônica curta (1-2 frases)** já no formato esperado de saída do mascote, servindo simultaneamente como conhecimento e como few-shot implícito.

**Regra de manutenção:** sempre que o `README.md` ou `CLAUDE.md` for atualizado com novas funcionalidades, este arquivo deve ser revisado no mesmo PR.

### 2.5. `format.md` — Formato determinístico

- Limite rígido: 1-2 frases, máx. ~280 caracteres.
- Estrutura obrigatória: `[validação emocional] + [orientação curta ou frase canônica]`.
- Lista de **frases canônicas fixas** (copy-paste obrigatório) para casos previsíveis:
  - Sem info → "Não tenho essa informação."
  - Dúvida médica → "Isso precisa ser avaliado pelo seu médico — não consigo ajudar com isso."
  - Injeção → "Só consigo ajudar com o OncoMente. Em que posso te apoiar hoje?"
  - Emergência → mensagem já em `EMERGENCY_RESPONSE` (mantida em código).
- Proibido na saída: listas, markdown, emojis, links, blocos de código.

### 2.6. `safety.md` — Protocolos de segurança

Concentra: emergência (espelhando `EMERGENCY_TRIGGERS` do código), anti-injeção, escopo médico, identidade protegida. Manter sincronizado com a lista em `mascot.service.ts`.

### 2.7. `examples.md` — Few-shot canônico

Pares pergunta/resposta cobrindo cada categoria — separados por seção, com tag do tipo de caso. Adicionar pelo menos:

- Tentativa de extração de info inventada (ex.: "quanto tempo dura a quimio?").
- Pergunta fora de escopo não-médica (ex.: "qual o melhor hospital?").
- Elogio/agradecimento (resposta curta).
- Pergunta repetida (consultar `history`).
- Pergunta sobre o app respondida via `faq.md`.

### 2.8. `user-context.md` — Template injetado em runtime

Apenas a seção de placeholders + instruções de uso de pronome/papel. Permite trocar a forma como o contexto entra sem mexer no resto.

---

## 3. Mudanças no código

### 3.1. [`mascot.service.ts`](./mascot.service.ts)

1. **Novo loader** `PromptLoader`: lê os arquivos `.md` em ordem fixa, concatena em um `systemMessage`, faz cache em memória no `onModuleInit`.
2. **Remover** `FALLBACK_PROMPT` do código e `AI_MASTER_PROMPT` do `.env`. Os arquivos `.md` viram a fonte de verdade versionada.
3. **Validador de saída reforçado** em `validateResponse`:
   - Detecção de números/percentuais suspeitos (regex `\d+%`, `\d+ dias`, `R\$ \d+`) → se aparecerem e não estiverem no contexto injetado, descartar.
   - Detecção de frases proibidas ("vai ficar bem", "você vai curar", "garanto que").
   - Hard cap de tamanho (ex.: 320 chars) — corta resposta inteira se exceder, retorna fallback.
4. **Fallback determinístico**: quando `validateResponse` rejeita, retornar mensagem canônica em vez de 500.
5. **Reduzir `temperature`** de `0.2` para `0.1` (mais determinismo).
6. **Parâmetro `top_p: 0.5`** para reduzir variabilidade.

### 3.2. Ordem de carga (concatenação do system message)

```
[soul.md]
[rules.md]
[scope.md]
[faq.md]
[safety.md]
[format.md]
[user-context.md com placeholders preenchidos]
[examples.md]
```

Ordem importa: identidade → regras → escopo → FAQ → segurança → formato → contexto → exemplos. Exemplos por último ancoram o estilo da resposta.

---

## 4. Ordem de implementação (microcommits)

Cada item = 1 commit. Seguir convenção em `.claude/rules/commits.md`.

1. `♻️ refactor(mascot): extract prompt loader from inline string`
   Cria `PromptLoader` lendo um único `prompt.md` (apenas move o `FALLBACK_PROMPT` atual para arquivo, sem mudar conteúdo). No-op funcional.

2. `✨ feat(mascot): split prompt into soul/rules/scope modules`
   Quebra o `prompt.md` em `soul.md`, `rules.md`, `scope.md`, `safety.md`, `format.md`, `user-context.md`, `examples.md`, mantendo conteúdo equivalente ao atual.

3. `✨ feat(mascot): add faq module sourced from project readme`
   Cria `faq.md` cobrindo dúvidas sobre app/projeto, com base no `README.md`. Inclui no pipeline de carga.

4. `✨ feat(mascot): add deterministic canonical phrases`
   Introduz frases fixas em `format.md` e reforça em `rules.md` (R2 com frase canônica obrigatória).

5. `✨ feat(mascot): harden response validator against hallucinations`
   Adiciona checks de números/promessas em `validateResponse` + fallback determinístico.

6. `✨ feat(mascot): tighten model determinism params`
   `temperature: 0.1`, `top_p: 0.5`.

7. `✨ feat(mascot): expand few-shot examples`
   Amplia `examples.md` cobrindo categorias faltantes (FAQ-app, info inventada, fora de escopo, history).

8. `🗑️ remove(mascot): drop AI_MASTER_PROMPT env override`
   Remove leitura de `process.env.AI_MASTER_PROMPT` e a chave do `.env.example`.

9. `🧪 test(mascot): cover prompt loader and validator`
   Testes unitários do `PromptLoader` e dos novos guards de `validateResponse`.

---

## 5. Pontos de decisão pendentes

- **Manter override por `.env`?** Recomendação: remover (passo 8). Ganho de versionamento e revisão vale mais que a flexibilidade de override em produção.
- **Nome próprio para o mascote** no `soul.md`? Hoje o prompt diz apenas "mascote virtual do OncoMente". Definir um nome ajuda o tom.
- **Fonte da FAQ:** confirmar se o `README.md` atual cobre todas as funcionalidades ativas ou se há gaps a documentar antes.

---

## 6. Critérios de aceite

- Nenhum prompt textual permanece embutido em `.ts`.
- `npm run start:backend` carrega prompt 100% dos arquivos `.md` sem regressão.
- Resposta a "quem te criou?" retorna identidade protegida.
- Resposta a "quanto tempo dura a quimio?" retorna frase médica canônica.
- Resposta a "o que é o OncoMente?" usa conteúdo de `faq.md`.
- Resposta com número inventado é descartada pelo validador.
- Testes do passo 9 verdes.
