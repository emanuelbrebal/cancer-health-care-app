# Mobile — Checklist de Entrega

> **Contexto**: dados atualmente todos mockados. Backend existe mas não está integrado ao app (exceto autenticação). Prioridade: entregar o app mobile funcional.

---

## Progresso Geral

| | Concluído | Total | % |
|---|---|---|---|
| **Checklist (pendências)** | 28 | 66 | ~42% |
| **Projeto completo (estimado)** | 50 | 85 | **~59%** |

> O "projeto completo" considera telas já funcionais fora do checklist (auth, home, sleep, exercícios, meditação, hub, diary list) + todas as tarefas do checklist.

### Por bloco

| Bloco | Concluído | Total | % |
|---|---|---|---|
| 0 — Problemas Conhecidos | 2 | 2 | 100% ✅ |
| 1 — Identidade Visual | 3 | 5 | 60% |
| 2 — Telas Pendentes | 19 | 19 | 100% ✅ |
| 3 — Listagem + Detalhe | 1 | 10 | 10% |
| 4 — Correções e Polimento | 2 | 9 | 22% |
| 5 — Integração Backend | 1 | 14 | 7% |
| 6 — Validação Final | 0 | 7 | 0% |

> Atualize manualmente ao marcar cada `[ ]` como `[x]`.

---

## BLOCO 0 — Problemas Conhecidos (bugs ativos)

- [x] **Vídeos de exercícios** — arquivos em `assets/videos/` já nomeados sem espaços (exercise-001.mp4, warmup-001.mp4, etc.). Resolvido.
- [x] **`DailyMessage` passado como componente** — corrigido em `(Home)/index.tsx` para `<DailyMessage />` sem props.

---

## BLOCO 1 — Identidade Visual e App Store

- [x] **Substituir ícone do app** — `app.json` corrigido: `icon.png` → `icon.jpg` (iOS + raiz). Splash apontada para `splash-icon.png` existente.
- [ ] **Atualizar splash screen** com a logo oficial do sistema (substituir `splash-icon.png` pela identidade visual final).
- [ ] **Adicionar logomarca CESMAC** nos assets — pasta `assets/images/logos/` criada. Aguardando arquivo `cesmac-logo.png` e `oncomente-logo.png`.
- [x] **Criar tela "Sobre o Projeto"** — `PersonalArea/About/index.tsx` implementada com: logo do sistema, placeholder CESMAC, descrição, versão, equipe/créditos.
- [x] **Adicionar rota `/About`** — rota registrada no `PersonalArea/_layout.tsx`; botão "Sobre o Projeto" adicionado no Hub.

---

## BLOCO 2 — Telas Pendentes

### Oncology
- [x] **Leisure/index.tsx** — implementada com pagers de recomendações.
- [x] **Nutrition/index.tsx** — implementada com conteúdo educativo real.
- [x] **SpiritualArea/index.tsx** — implementada com versículos e dicas espirituais.
- [x] **LegalArea/index.tsx** — implementada com direitos e links para cartilhas.

### MentalHealth
- [x] **BreathingExercises/index.tsx** — implementada com exercícios de respiração.
- [x] **PsychologicalSupport/index.tsx** — implementada com orientações sobre apoio psicológico.
- [x] **Motivational/Patient/index.tsx** — implementada com `mockPatientMotivationalMessages`.
- [x] **Motivational/CaringTheCaregiver/index.tsx** — implementada com conteúdo para cuidadores.
- [x] **PanicButtonContacts/index.tsx** — implementada com contatos de emergência (CVV, SAMU, CAVIDA).

### PersonalArea (requer auth)
- [x] **OnboardingForm/index.tsx** — formulário completo (avatar, pronome, nome, telefone, data nascimento).
- [x] **AccountConfigurations/index.tsx** — implementada com opções gerais e segurança.
- [x] **Treatment/index.tsx** — listagem de tratamentos com expandable cards.
- [x] **Treatment/create/index.tsx** — formulário de criação implementado.
- [x] **Treatment/update/index.tsx** — formulário de edição implementado.
- [x] **Calendar/index.tsx** — calendário interativo com progresso de dias.
- [x] **Notifications/index.tsx** — módulo de notificações implementado: tela de consentimento LGPD (AsyncStorage) + lista de mensagens agrupadas em "Novas" e "Anteriores". Mock pronto para integração com `GET /notifications`.
- [x] **ReportsArea/index.tsx** — implementada com canais de denúncia e acordeon de leis.
- [x] **Diary/create/index.tsx** — formulário completo (título, emoção, conteúdo).
- [x] **Diary/update/index.tsx** — formulário de edição implementado.

---

## BLOCO 3 — Telas de Listagem e Visualização Individual

> Seguindo o esquema de cards para listagem e tela dedicada para item individual.

### Recomendações de Lazer (Leisure)
- [ ] **Tela de listagem — Livros** (`Leisure/Books/index.tsx`): grid de cards com capa + título + autor.
- [ ] **Tela de detalhe — Livro** (`Leisure/Books/[id].tsx`): capa grande, título, autor, sinopse, link externo.
- [ ] **Tela de listagem — Filmes** (`Leisure/Movies/index.tsx`): cards com poster + título + ano.
- [ ] **Tela de detalhe — Filme** (`Leisure/Movies/[id].tsx`): poster grande, título, sinopse, link externo.
- [ ] **Tela de listagem — Séries** (`Leisure/Series/index.tsx`): cards com poster + título.
- [ ] **Tela de detalhe — Série** (`Leisure/Series/[id].tsx`): poster grande, título, sinopse, link externo.
- [ ] **Tela de listagem — Atividades** (`Leisure/Activities/index.tsx`): cards com imagem + nome.
- [ ] **Tela de detalhe — Atividade** (`Leisure/Activities/[id].tsx`): imagem, descrição, instruções.

### Exercícios Físicos
- [x] **PhysicalExercises/index.tsx** confirmado completo — exibe Alongamentos/Aquecimento + Exercícios de Fortalecimento com AccordionCards e MediaList.
- [ ] **Tela de detalhe — Exercício** — vídeo individual, nome, instruções, séries/repetições (se necessário além do accordion atual).

---

## BLOCO 4 — Correções e Polimento

- [x] **Home: `patient_name` dinâmico** — `HelloMessage` lê do `useAuthStore`. Prop hardcoded removida.
- [ ] **Modal de login suave** — `SoftLoginModal` criado. Abre na Home quando não autenticado, é pulável. Ao logar, `HelloMessage` atualiza com nome do usuário. Incluir botão para redirecionamento para o cadastro caso o usuário não possua conta. Aumentar a área de visibilidade do componente para uns 70% da altura da tela para que os componentes sejam exibidos corretamente. verificar se o usuário já está autenticado antes de exibir o modal.
- [ ] **PersonalArea/Hub: dados reais do usuário** — "Barbara da Silva" ainda hardcoded. Substituir por `user.name` e `user.profile_picture` do Zustand store.
- [ ] **app.json: ícone** — corrigir path de `icon.png` para `icon.jpg` (ou converter o arquivo para `.png`).
- [ ] **Splash screen** — corrigir path e atualizar para identidade visual final.
- [ ] **Verificar navegação auth-gate** — Mascot e PersonalArea devem redirecionar para login quando não autenticado.
- [ ] **LegalArea: cartilha dos 60 dias com card clicável** — substituir o hyperlink de texto simples por um card visual usando `RecomendationPager`. O card deve exibir título + imagem de capa da cartilha. Ao clicar, abre link externo (PDF ou site oficial). Adicionar a imagem da cartilha em `assets/images/Icons/` ou pasta dedicada.
- [ ] **Padronização de estilos** — identificar `StyleSheet` duplicados entre telas e extrair para `src/styles/`. Regra: se um conjunto de estilos (container, título, subtítulo, etc.) aparece em mais de uma tela com a mesma estrutura, ele vai para `global.ts` ou um arquivo temático (ex.: `src/styles/cards.ts`). Estilos locais só se existem apenas naquela tela.
- [ ] **Política de 0 comentários de IA** — varrer todos os arquivos `.tsx`/`.ts` e remover comentários gerados automaticamente (blocos de JSDoc, comentários explicativos do tipo "// This component renders..."). Manter apenas comentários de intenção do dev: `// TODO: popular com dados do backend`, `// FIXME:`, `// continuar aqui`.

---

---

## BLOCO 5 — Integração com Backend

> Todos os dados abaixo estão **mockados** e precisam ser substituídos por chamadas à API real.

### Seed do banco (concluído)
- [x] **Seed completa** em `apps/backend/prisma/seed.ts`:
  - 8 livros, 13 filmes, 6 séries com `image_path` mapeado
  - 8 atividades de lazer
  - 3 usuários de teste:
    - `paciente@oncomente.com` / `onco123` → PATIENT
    - `cuidador@oncomente.com` / `onco123` → CAREGIVER
    - `admin@oncomente.com`    / `onco123` → ADMIN

### Serviços e integrações pendentes
- [ ] **Criar `leisureService.ts`** — GET `/leisures`, GET `/media?type=BOOK|MOVIE|SERIES`
- [ ] **Integrar Leisure/Books** — substituir `booksData` do mock por API
- [ ] **Integrar Leisure/Movies** — substituir `moviesData` do mock por API
- [ ] **Integrar Leisure/Series** — substituir `seriesData` do mock por API
- [ ] **Criar `diaryService.ts`** — GET/POST/PUT/DELETE `/personal/diary`
- [ ] **Integrar Diary** — substituir mock de 3 entradas por dados reais
- [ ] **Criar `treatmentService.ts`** — GET/POST/PUT/DELETE `/personal/treatment`
- [ ] **Integrar Treatment** — substituir mock por dados reais
- [ ] **Verificar mascotService** — POST `/mascot/chat` em `Mascot/Chat`
- [ ] **Integrar AccountConfigurations** — GET + PATCH `/user/me`
- [ ] **Daily Messages** — avaliar se mantém mock ou integra `DailyMessage` model do backend
- [ ] **Mapear `image_path`** — ao integrar API, mobile deve mapear `image_path` para asset local ou URL CDN
- [ ] **Integrar Hub** — GET `/user/me` para exibir nome e foto reais

---

## BLOCO 6 — Validação Final

- [ ] Testar fluxo completo: cadastro → login → navegação → logout
- [ ] Testar Botão de Pânico (discagem automática)
- [ ] Testar visualização de vídeos (exercícios físicos, meditação, sono)
- [ ] Testar diário (criar, editar, excluir entrada)
- [ ] Testar responsividade em Android e iOS
- [ ] Verificar que telas auth-gated redirecionam corretamente
- [ ] Confirmar versão no `app.json` antes da entrega

---

## Resumo do Estado Atual

| Área | Telas | Status |
|------|-------|--------|
| Autenticação | 5 telas | ✅ Real (integrado com API) |
| Home | 1 tela | ✅ Funcional (modal de login suave adicionado) |
| Oncologia | 6/6 subrotas | ✅ Todas implementadas |
| Saúde Mental | 6/6 subrotas | ✅ Todas implementadas |
| Mascote | 2 telas | ⚠️ Precisa verificar integração do chat |
| Área Pessoal | 9/9 subrotas | ⚠️ Hub com dados mockados; Notifications integrada (LGPD) |
| Identidade Visual | — | ❌ Ícone/splash/sobre pendentes |
| Listagem + Detalhe | 1/10 | ❌ Books/Movies/Series/Activities a implementar |
| Integração Backend | — | ❌ Somente auth + seed integrados |
