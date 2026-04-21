# Plano de Ação — Varredura Manual do Sistema

> Data: 2026-04-20
> Origem: teste manual feito pelo usuário
> Última atualização: 2026-04-20

---

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Implementado |
| ⏳ | Aguarda briefing / conteúdo externo |
| 🔍 | Requer revisão visual manual |
| ❌ | Pendente |

---

## Checklist por Prioridade

### P1 — Crítico

- [x] **#9** Diário: `useFocusEffect` para atualização instantânea da lista ✅
- [x] **#10a** Diário: ocultar botão `+` quando já existe entrada hoje + banner de aviso ✅
- [x] **#10b** Diário: streak badge 📓 com contagem de dias consecutivos ✅
- [x] **#6a** Tratamentos: componente `TimeInput` com máscara HH:MM ✅
- [x] **#6b** Tratamentos: modal com link direto para o Calendário após salvar ✅
- [x] **#15** Notificações: `removeHistoryByTreatmentId` ao deletar tratamento ✅
- [x] **#16** Calendário: horários de lembrete calculados no modal do dia ✅

### P2 — UX Importante

- [x] **#1** Vídeos de exercícios: `aspectRatio: 9/16` — exibição portrait sem barras laterais ✅
- [x] **#3** Lazer: extensões de imagem verificadas — seed e `mediaImageMap.ts` alinhados ✅
- [x] **#7** Diário: chips de emote maiores (emoji nativo + label + borda roxa ao selecionar) ✅
- [x] **#8** Diário: placeholder da textarea substituído por convite humanizado ✅
- [x] **#12** Sobre: logo CESMAC exibida + "Sistemas de Informação — CESMAC" por membro da equipe ✅
- [x] **#13** Componente `NavCard` reutilizável criado; Hub migrado para usá-lo ✅
- [x] **#14a** Foto de perfil: `ProfileRow` e `ProfileCenter` leem `profile_picture` do store ✅
- [x] **#14b** Foto de perfil: placeholder substituído por ícone `user` (sem imagem feminina) ✅

### P3 — Polimento

- [x] **#11** Home: botão "Sobre o OncoMente" com ícone, visível, ancorado ao fundo da tela ✅
- [ ] **#2** Sincronizar nomes/vídeos/descrições dos exercícios 🔍 *(requer revisão visual dos vídeos)*
- [ ] **#4** Atualizar conteúdo de Nutrição ⏳ *(aguarda briefing da equipe)*
- [ ] **#5** Atualizar conteúdo de Motivação Diária ⏳ *(aguarda briefing da equipe)*

---

## Adicionais (pós-varredura)

- [x] **#A1** Tela "Sobre" desvinculada da Área Pessoal ✅
  - Movida para rota independente `(Home)/About/index.tsx`
  - Registrada como tab oculta no `(Home)/_layout.tsx`
  - Removida do stack da PersonalArea (sem mais vulnerabilidade de acesso sem conta)
  - Links atualizados: Hub → `/About`, Home → `/About`

---

## Itens Pendentes de Conteúdo (aguardam briefing)

| # | Tela | O que mudar | Status |
|---|---|---|---|
| 4 | Nutrição | Textos, imagens, links conforme orientação da professora | ⏳ aguarda equipe |
| 5 | Motivação Diária | Revisão dos cards motivacionais | ⏳ aguarda equipe |
| 2 | Exercícios Físicos | Sincronizar título/descrição com o conteúdo visual de cada vídeo | 🔍 revisão manual |

---

## Progresso Geral

| Prioridade | Concluído | Total | % |
|---|---|---|---|
| P1 | 7 | 7 | **100% ✅** |
| P2 | 8 | 8 | **100% ✅** |
| P3 | 1 | 4 | **25%** |
| Adicional | 1 | 1 | **100% ✅** |
| **Total** | **17** | **20** | **85%** |

---

## Pendências que bloqueiam 100%

```
1. Briefing de conteúdo: Nutrição e Motivação Diária  → aguarda equipe
2. Revisão visual dos vídeos de exercício             → revisão manual necessária
```
