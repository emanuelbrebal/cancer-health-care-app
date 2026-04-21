# Relatório de Implementação — Varredura do Sistema

> Data: 2026-04-20
> Branch: `feat/mobile-tasks-pt2`
> Origem: plano de ação gerado a partir de teste manual do sistema

---

## Resumo Executivo

| Categoria | Itens | Concluídos |
|---|---|---|
| P1 — Crítico | 7 | 7 ✅ |
| P2 — UX Importante | 8 | 8 ✅ |
| P3 — Polimento | 4 | 1 ✅ / 3 ⏳ |
| Correções pontuais | 5 | 5 ✅ |
| Segurança / Roteamento | 2 | 2 ✅ |
| **Total** | **26** | **23 ✅** |

---

## P1 — Crítico

### Diário Virtual

- [x] **Atualização instantânea da lista** — substituído `useEffect` por `useFocusEffect(useCallback(...))` em `Diary/index.tsx`; a lista recarrega sempre que a tela entra em foco (ao voltar de criar/editar)
- [x] **Ocultar botão `+` quando já existe entrada hoje** — após carregar as entradas, verifica se já existe registro com `date` igual a hoje; se sim, o botão `+` é ocultado
- [x] **Banner "já fez hoje"** — quando `todayEntry` existe, exibe faixa verde: *"🎉 Você já fez seu diário hoje! Amanhã um novo espaço estará disponível."*
- [x] **Streak de dias consecutivos** — função `calcStreak` calcula dias seguidos a partir das entradas ordenadas por data; exibe badge 📓 N dias no header
- [x] **Remoção reativa** — ao deletar uma entrada, o estado `entries`, `todayEntry` e `streak` são recalculados imediatamente, sem precisar recarregar a tela; botão `+` reaparece se a entrada deletada era a de hoje

### Tratamentos

- [x] **Componente `TimeInput`** — criado em `components/ui/Inputs/TimeInput.tsx` com máscara automática HH:MM, validação de range (00–23 horas, 00–59 minutos) e ícone de relógio roxo; aplicado em `Treatment/create` e `Treatment/update`
- [x] **Modal de link para o Calendário** — após salvar tratamento com sucesso, exibe modal informativo com botão "Ver Calendário" (`router.replace('/PersonalArea/Calendar')`) e botão "Fechar" para voltar normalmente

### Calendário

- [x] **Horários de lembrete no modal do dia** — função `getDayNotificationTimes` calcula os horários diários de notificação com base em `horaInicio` e `frequencia` (8h/12h/24h); exibido no modal como *"Lembretes: 08:00 · 16:00 · 00:00"*

### Notificações

- [x] **Limpar histórico ao deletar tratamento** — adicionada função `removeHistoryByTreatmentId(treatmentId)` em `notificationService.ts`; chamada junto com `cancelTreatmentNotifications` no fluxo de deleção em `Treatment/index.tsx`

---

## P2 — UX Importante

### Vídeos de Exercícios Físicos

- [x] **Exibição portrait sem barras laterais** — vídeos locais (`typeof url === 'number'`) agora usam container com `aspectRatio: 9/16` + `StyleSheet.absoluteFill` + `contentFit: 'cover'` em `MediaViewer.tsx`; elimina as barras pretas laterais

### Atividades de Lazer

- [x] **Extensões de imagem verificadas** — confirmado alinhamento entre `mediaImageMap.ts` e `seed.ts`; todas as chaves usam `.jpg`; arquivos existem em `assets/images/Placeholders/Mocks/`

### Diário — Seletor de Emotes

- [x] **Chips maiores com emoji nativo** — substituídos os círculos pequenos com ícone `MaterialCommunityIcons` por chips (`flexBasis: 18%`) com emoji nativo (🤩😊😐😢😖) + label; chip selecionado recebe fundo colorido + borda roxa + elevação
- [x] **Placeholder como convite** — substituído *"Comece a escrever seus pensamentos aqui..."* por *"O que ficou guardado no seu coração hoje?"*

### Tela "Sobre o Projeto"

- [x] **Logo CESMAC** — adicionada `Image` com `require('@assets/images/logos/cesmac-logo.png')` na seção de Instituição
- [x] **Texto de equipe** — adicionado subtítulo *"Sistemas de Informação — CESMAC"* sob o nome de cada estudante

### Componentes Reutilizáveis

- [x] **`NavCard` criado** — novo componente em `components/ui/Cards/NavCard.tsx` com props: `title`, `subtitle`, `icon`, `iconLib`, `color`, `bgColor`, `iconBg`, `borderColor`, `onPress`; suporta `Feather`, `MaterialCommunityIcons` e `Ionicons`
- [x] **Hub migrado para `NavCard`** — removidos ~30 linhas de estilos inline duplicados de `Hub/index.tsx`; substituídos pelos `NavCard` reutilizáveis

### Foto de Perfil

- [x] **Exibição reativa após edição** — `ProfileRow` e `ProfileCenter` agora leem `user?.profile_picture` diretamente do `useAuthStore` via hook; a foto atualiza imediatamente após salvar no `OnboardingForm` sem necessidade de prop
- [x] **Placeholder sem imagem feminina** — removida imagem `https://i.pravatar.cc/150?img=47`; quando sem foto, exibe círculo cinza com ícone `Feather user`

---

## P3 — Polimento

- [x] **Home: botão "Sobre o OncoMente" visível** — substituído link de texto discreto por botão com ícone `info` roxo, fundo `#F3E8FF`, borda `#DDD0F5`, posicionado com `position: 'absolute', bottom: 14` próximo às tabs de navegação
- [ ] **Sincronizar nomes/vídeos/descrições dos exercícios** 🔍 *— requer revisão visual dos arquivos de vídeo; pendente*
- [ ] **Atualizar conteúdo de Nutrição** ⏳ *— aguarda briefing da equipe*
- [ ] **Atualizar conteúdo de Motivação Diária** ⏳ *— aguarda briefing da equipe*

---

## Correções Pontuais (solicitadas durante testes)

- [x] **Emoji de streak alterado** — 🔥 substituído por 📓 com cor roxa (`#5C4B9B`) e texto *"N dia(s)"*; badge com fundo lilás `#EDE7F6`
- [x] **Espiritualidade — redesign visual** — mantidos todos os textos; adicionados: card de intro com emoji 🕊️ e título roxo; separador com label "✨ Reflexão"; card de reflexão com barra vertical roxa (estilo citação); seção de `DailyMessage` reorganizada com gap
- [x] **`ProfileRow` e `ProfileCenter`** — corrigidos para ler `profile_picture` do store (eram dependentes de prop estática `imageUrl` que ninguém passava)

---

## Segurança e Roteamento

- [x] **Tela "Sobre" desvinculada da Área Pessoal**
  - Arquivo movido de `(Home)/PersonalArea/About/index.tsx` → `(Home)/About/index.tsx`
  - Criado `(Home)/About/_layout.tsx` com `CommonAreasLayout` + `Stack` — mesmo padrão visual das demais telas
  - Registrada como tab oculta com `href: null` em `(Home)/_layout.tsx` — navegável via `router.push('/About')`, sem aparecer na barra de tabs
  - Removida do `screensConfig` de `PersonalArea/_layout.tsx`
  - Links atualizados: Hub (`/PersonalArea/About` → `/About`) e Home (`/PersonalArea/About` → `/About`)
  - **Vulnerabilidade corrigida**: antes, um usuário podia acessar a área pessoal via `/PersonalArea/About` sem estar autenticado

- [x] **Botão de voltar no header da tela "Sobre"**
  - Adicionado `headerLeft` com `Ionicons arrow-back` na cor `Colors.purpleSecondary`
  - Usa `router.back()` — retorna para a tela anterior do histórico (Home ou Hub, dependendo da origem)

---

## Arquivos Criados

| Arquivo | Descrição |
|---|---|
| `components/ui/Inputs/TimeInput.tsx` | Input com máscara HH:MM |
| `components/ui/Cards/NavCard.tsx` | Card de navegação reutilizável |
| `app/(Home)/About/index.tsx` | Tela "Sobre" independente (movida) |
| `app/(Home)/About/_layout.tsx` | Layout da tela "Sobre" |

## Arquivos Removidos

| Arquivo | Motivo |
|---|---|
| `app/(Home)/PersonalArea/About/index.tsx` | Movida para rota independente |
| `app/(Home)/PersonalArea/About/` (pasta) | Idem |

---

## Pendências Remanescentes

| # | Item | Bloqueador |
|---|---|---|
| P3.2 | Sincronizar exercícios com os vídeos | Revisão visual manual dos arquivos de vídeo |
| P3.4 | Atualizar conteúdo de Nutrição | Briefing da equipe/professora |
| P3.5 | Atualizar conteúdo de Motivação Diária | Briefing da equipe/professora |
| — | Integrar Treatment com API `/treatments` | Backend pronto; mobile ainda usa AsyncStorage |
| — | Executar `npx prisma db seed` | Necessário para popular livros/filmes/séries/atividades |
| — | Bloco 6 — validação manual (7 testes) | Testes manuais pré-entrega |
