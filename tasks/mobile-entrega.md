# Mobile — Checklist de Entrega

> **Contexto**: dados atualmente todos mockados. Backend existe mas não está integrado ao app (exceto autenticação). Prioridade: entregar o app mobile funcional.

---

## Progresso Geral

| | Concluído | Total | % |
|---|---|---|---|
| **Checklist (pendências)** | 85 | 122 | ~70% |
| **Projeto completo (estimado)** | 97 | 137 | **~71%** |

> O "projeto completo" considera telas já funcionais fora do checklist (auth, home, sleep, exercícios, meditação, hub, diary list) + todas as tarefas do checklist.

### Por bloco

| Bloco | Concluído | Total | % |
|---|---|---|---|
| 0 — Problemas Conhecidos | 2 | 2 | 100% ✅ |
| 1 — Identidade Visual | 3 | 5 | 60% |
| 2 — Telas Pendentes | 19 | 19 | 100% ✅ |
| 3 — Listagem + Detalhe | 10 | 10 | 100% ✅ |
| 4 — Correções e Polimento | 10 | 12 | 83% |
| 5 — Integração Backend | 10 | 14 | 71% |
| 6 — Validação Final | 0 | 7 | 0% |
| 7 — Correções de UX e Backend | 6 | 7 | 86% |
| 8 — Revisão Backend e Integrações | 24 | 28 | 86% |

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
- [x] **Tela de listagem — Livros** (`Leisure/Books/index.tsx`): grid 2 colunas, capa + título + autor. Integrada com `GET /books`.
- [x] **Tela de detalhe — Livro** (`Leisure/Books/[id].tsx`): capa grande, título, autor, gênero, páginas, link EduCapes.
- [x] **Tela de listagem — Filmes** (`Leisure/Movies/index.tsx`): cards verticais, poster + título + ano + diretor. Integrada com `GET /movies`.
- [x] **Tela de detalhe — Filme** (`Leisure/Movies/[id].tsx`): poster grande, título, ano, diretor, duração, link externo.
- [x] **Tela de listagem — Séries** (`Leisure/Series/index.tsx`): cards verticais, poster + título + showrunner + temporadas. Integrada com `GET /series`.
- [x] **Tela de detalhe — Série** (`Leisure/Series/[id].tsx`): poster grande, título, criador, temporadas, link streaming.
- [x] **Tela de listagem — Atividades** (`Leisure/Activities/index.tsx`): grid 2 colunas, imagem + nome + badge de tipo. Integrada com `GET /leisures`.
- [x] **Tela de detalhe — Atividade** (`Leisure/Activities/[id].tsx`): imagem, nome, tipo, frequência, aviso de saúde.

### Exercícios Físicos
- [x] **PhysicalExercises/index.tsx** confirmado completo — exibe Alongamentos/Aquecimento + Exercícios de Fortalecimento com AccordionCards e MediaList.
- [x] **Tela de detalhe — Exercício** — decisão de design: sem tela extra. Informações (vídeo, nome, instruções, séries/reps) exibidas ao expandir o AccordionCard na tela de listagem.

---

## BLOCO 4 — Correções e Polimento

- [x] **Home: `patient_name` dinâmico** — `HelloMessage` lê do `useAuthStore`. Prop hardcoded removida.
- [x] **Modal de login suave** — altura mínima de 70% da tela (`Dimensions`), botão "Cadastre-se" adicionado, `useEffect` verifica `isAuthenticated` e fecha o modal automaticamente se o usuário já estiver logado.
- [x] **PersonalArea/Hub: dados reais do usuário** — `user.name` e `user.email` lidos do `useAuthStore`. Fallback para "Usuário" se não autenticado.
- [x] **app.json: ícone** — corrigido no Bloco 1.
- [ ] **Splash screen** — aguardando identidade visual final.
- [x] **Verificar navegação auth-gate** — `Mascot/index.tsx` e `PersonalArea/index.tsx` adicionados com `useFocusEffect` que redireciona para Hub/Chat via `router.replace` se já autenticado; botão "Entrar" redirecionado para `/(auth)/LoginScreen`.
- [x] **LegalArea: cartilha dos 60 dias com card clicável** — hyperlink substituído por card visual com ícone, título, subtítulo e label "Abrir PDF oficial". Ao clicar, abre o link externo via `Linking.openURL`.
- [ ] **Padronização de estilos** — revisar todas as telas e substituir estilos inline por tokens dos arquivos globais (`global.ts`, `Colors.ts`). Prioridade: telas do Bloco 4 e 8.
- [x] **Política de 0 comentários de IA** — comentários gerados automaticamente removidos de: `Diary/create`, `Diary/update`, `Diary/index`, `Treatment/create`, `Notifications/index`. Mantidos apenas `// TODO:` e comentários de intenção.
- [x] **Reformular tela "Sofreu Discriminação?" (ReportsArea)** — reformulada com 4 seções em accordions: "O que é discriminação?" (conscientizar), "Tipos mais comuns" (informar), "Como se prevenir" (precavir), "Como denunciar" (canais: SUS 136, ANS, Defensoria, CREMAL, Procon-AL). Seção "Seus Direitos" removida (já existe em LegalArea). Banner emocional no topo.
- [x] **Área Motivacional — lógica de role sem autenticação** — `MentalHealth/index.tsx` corrigido: import `createAuthStore` (sem engine) substituído por `useAuthStore`; filtro `userSpecificNavigationItems` que era calculado mas não usado no JSX agora é o único item renderizado. Quando deslogado: exibe "Motivação Diária" → Patient. Quando PATIENT: "Pacientes". Quando CAREGIVER: "Cuidadores".
- [ ] **Calendário interativo — adicionar interação real** — ver Bloco 8 para detalhes.

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
- [x] **Criar `leisureService.ts`** — GET `/books`, `/movies`, `/series`, `/leisures` (aguarda telas do Bloco 3)
- [x] **Integrar Leisure/Books** — tela criada, integrada com `GET /books`
- [x] **Integrar Leisure/Movies** — tela criada, integrada com `GET /movies`
- [x] **Integrar Leisure/Series** — tela criada, integrada com `GET /series`
- [x] **Revisar mocks/seeders de recomendações de lazer** — auditoria concluída: seed já cobria 100% dos dados (8 livros, 13 filmes, 6 séries, 8 atividades) com `image_path` alinhados ao `mediaImageMap.ts`. Duas divergências de título corrigidas no seed ("Patch Adams" e "The Big C / …"). Bloco de `deleteMany` adicionado para migração segura de registros com título antigo. Arrays orphanados (`booksData`, `moviesData`, `seriesData`, `homeActivitiesData`) removidos do mock — arquivo mantém apenas `meditationData` e o tipo `RecomendationType`.
- [x] **Criar `diaryService.ts`** — GET/POST/PATCH/DELETE `/daily-logs`
- [x] **Integrar Diary** — listagem, criação, edição e exclusão integradas à API real
- [ ] **Criar `treatmentService.ts`** — ⚠️ endpoint `/treatments` não existe no backend; mantém mock com AsyncStorage
- [ ] **Integrar Treatment** — ⚠️ aguarda implementação do backend (ver Bloco 8)
- [x] **Verificar mascotService** — já integrado: POST `/ai-support/ask` em `Mascot/Chat`
- [x] **Integrar AccountConfigurations** — nome e email lidos do `useAuthStore` (dados reais do login)
- [x] **Daily Messages** — mantém mock (sem modelo dedicado no backend)
- [x] **Mapear `image_path`** — `mediaImageMap.ts` criado com lookup estático de todos os assets de Books/Movies/Series/Activities
- [x] **Integrar Hub** — nome e email já lidos do `useAuthStore` desde o Bloco 4

## BLOCO 6 — Validação Final

- [ ] Testar fluxo completo: cadastro → login → navegação → logout
- [ ] Testar Botão de Pânico (discagem automática)
- [ ] Testar visualização de vídeos (exercícios físicos, meditação, sono)
- [ ] Testar diário (criar, editar, excluir entrada)
- [ ] Testar responsividade em Android e iOS
- [ ] Verificar que telas auth-gated redirecionam corretamente
- [ ] Confirmar versão no `app.json` antes da entrega

---

## BLOCO 7 — Correções de UX e Backend

### Navegação e Auth
- [x] **Redirecionamento pós-login** — `LoginScreen` já redireciona para `/(Home)`. Corrigido: `Mascot/index.tsx` e `PersonalArea/index.tsx` agora usam `useFocusEffect` em vez de `useEffect`, eliminando redirecionamento indesejado em segundo plano.
- [x] **Auth-gate nas telas de entrada** — `Mascot/index.tsx` e `PersonalArea/index.tsx` migrados de `useEffect([isAuthenticated])` para `useFocusEffect(useCallback(...))`, garantindo redirect apenas quando a tela está em foco.

### Modal de Login (SoftLoginModal)
- [x] **Remover handle bar** — `<View style={styles.handle} />` e seu estilo removidos de `SoftLoginModal.tsx`.
- [x] **Ocultar modal se autenticado** — `(Home)/index.tsx` envolve `<SoftLoginModal>` em `{!isAuthenticated && ...}`, impedindo renderização quando usuário já está logado.

### Formulários
- [x] **Teclado cobre o campo de texto** — `Diary/create`, `Diary/update`, `Treatment/create`, `Treatment/update` já tinham `KeyboardAvoidingView`. Adicionado em `OnboardingForm/index.tsx`.

### Exercícios Físicos
- [x] **Correção na exibição dos exercícios** — `mockDataOncologyMedias.ts` atualizado: URLs com espaços substituídos por `require()` estático para `warmups/warmup-001.mp4` … `warmup-011.mp4` e `exercises/exercise-001.mp4` … `exercise-009.mp4`. `AccordionMedia.url` tipado como `string | number`.

### Backend — Mocks → Seeds
- [ ] **Transformar mocks em seeders** — revisar todos os dados mockados no mobile (motivacional, respiração, nutrição, espiritualidade, área jurídica, etc.) e avaliar quais devem virar registros no seed do banco (`apps/backend/prisma/seed.ts`), garantindo consistência entre o que o app exibe e o que o backend pode servir futuramente.

---

## BLOCO 8 — Revisão Backend e Integrações (NOVO)

> Ver relatório completo em `tasks/integration-report.md`.

### 8.1 — Auth e Conta (alta prioridade)

- [x] **Implementar logout** — `useAuthStore.getState().logout()` + `router.replace('/(auth)/LoginScreen')`. Wired em `AccountConfigurations > "Encerrar sessão"`.
- [x] **Implementar exclusão de conta** — `DELETE /users/:id` com `Alert` de confirmação + limpar store + redirecionar. Wired em `AccountConfigurations > "Desativar conta"`.
- [x] **Integrar formulário de Onboarding** — `PATCH /users/:id` ao submeter. Store Zustand atualizado após sucesso. `expo-image-picker` instalado: toque no avatar abre galeria, imagem salva como base64 em `profile_picture`.
- [x] **Mudar senha (usuário autenticado)** — endpoint `PATCH /auth/change-password` criado no backend (DTO + service + controller com JwtAuthGuard). Nova tela `AccountConfigurations/ChangePassword/index.tsx` com validação local. Rota registrada no `_layout.tsx`.
- [x] **Recuperar senha por e-mail** — escopo reduzido implementado: `RecoverPassword.tsx` reescrito para exibir card com mensagem "Entre em contato com o suporte em suporte@oncomente.com".

### 8.2 — Calendário Interativo (média prioridade)

- [x] **Marcar datas no calendário dinamicamente** — `treatmentStorage.ts` criado com CRUD no AsyncStorage. `Calendar/index.tsx` reescrito: lê tratamentos via `useFocusEffect`, gera datas com `getTreatmentDates()`, renderiza multi-dot por tratamento com cor distinta por índice.
- [x] **Interação com dias marcados** — `onDayPress` abre Modal estilo bottom-sheet com lista de tratamentos do dia selecionado (nome, horário, frequência, médico).
- [x] **Integração com calendário nativo** — `expo-calendar` instalado. `Treatment/create` solicita permissão e chama `createEventAsync()` com título, data de início (horaInicio) e data de fim (dataFim) + alarme -30min. `calendarEventId` salvo no AsyncStorage.
- [x] **Módulo de métricas** — abaixo do calendário: barra de progresso por tratamento (% calculado entre startDate e dataFim), dias restantes, mensagem motivacional dinâmica baseada no progresso médio.
- [x] **Campanhas de conscientização mensais** — mapa local com 12 campanhas (Janeiro Branco, Março Lilás, Outubro Rosa, etc.) com cores temáticas. Card dinâmico exibido no topo do calendário baseado em `new Date().getMonth() + 1`.

### 8.3 — Notificações Push (média prioridade)

- [x] **Instalar e configurar `expo-notifications`** — `expo-notifications` instalado. `notificationService.ts` criado: `requestPermissions`, `setNotificationHandler` (foreground), `setNotificationChannelAsync` (Android). Listener de `addNotificationReceivedListener` adicionado no root `_layout.tsx`.
- [x] **Agendar notificações ao criar tratamento** — `Treatment/create` chama `scheduleTreatmentNotifications()` (notificações DAILY por dose: 1/2/3x ao dia) + `scheduleEndOfTreatmentNotification()` (1 dia antes do dataFim às 9h). IDs salvos no AsyncStorage via `treatmentStorage.setNotificationIds()`.
- [x] **Cancelar notificações ao deletar tratamento** — `Treatment/index` chama `cancelTreatmentNotifications(item.notificationIds)` antes de remover do storage.
- [x] **Notificação de consulta/retorno** — `scheduleEndOfTreatmentNotification` agenda notificação única no dia anterior ao fim do ciclo: "O ciclo de X termina amanhã. Consulte seu médico!".
- [x] **Tela de histórico de notificações** — `Notifications/index.tsx` reescrita com `useFocusEffect`: carrega histórico do AsyncStorage (`getNotificationHistory`), lista notificações agendadas (`getAllScheduledNotificationsAsync`). Seções "Novas", "Anteriores", "Agendadas".
- [x] **Melhorar módulo de notificações** — Badge de contagem não-lidas no header. Toque em card marca como lido. Botão "Marcar todas como lidas". Cards de notificações agendadas com ícone de relógio e horário formatado. Empty state com instrução sobre tratamentos.

### 8.4 — Tratamentos e Medicamentos (média prioridade)

- [ ] **Persistência local com AsyncStorage** — enquanto backend não existe, salvar/ler tratamentos via `AsyncStorage` em `Treatment/index`, `create` e `update`. Remove estado perdido ao sair da tela.
- [ ] **Backend: criar módulo `treatments`** — `POST /treatments`, `GET /treatments` (por usuário), `PATCH /treatments/:id`, `DELETE /treatments/:id`. Schema Prisma: `Treatment { id, userId, name, frequency, startTime, endDate, doctorName, doctorContact, hospitalName, status }`. ⚠️ Verificar se já existe migration para essas entidades — se não houver, solicitar ao dev backend antes de integrar.
- [ ] **Integrar `treatmentService.ts`** — substituir AsyncStorage por chamadas à API quando endpoint estiver disponível.

### 8.5 — UX e Polimento Visual (média prioridade)

- [x] **Melhorar UI da área de Contatos de Emergência** (`PanicButtonContacts/index.tsx`) — banner de alerta amarelo no topo, accordions com borda colorida lateral por contato, badge do número visível sem expandir, botão de ligação com número explícito. Dados atualizados: CVV 188, SAMU 192, CAVIDA 82 3315-6704, Disque Saúde 136.
- [x] **Área Motivacional sem autenticação** — corrigido em `MentalHealth/index.tsx`: quando `user` é `null`, exibe apenas item Patient com label "Motivação Diária". Ver item correspondente no Bloco 4.
- [x] **Texto do botão motivacional para usuário deslogado** — implementado junto com o item acima.
- [x] **Melhorar exibição dos exercícios** — `MediaViewer.tsx`: `contentFit` alterado de `contain` para `cover`, altura padrão aumentada para 300px, `nativeControls` ativados. Mock atualizado com `description`, `series` e `reps` para todos os 20 exercícios. `AccordionMedia` exibe descrição e badges de séries/reps abaixo do vídeo.


### 8.6 — Search Bar nas Telas de Listagem (média prioridade)

- [x] **Adicionar componente SearchBar em Leisure/Books** — filtro local por título/autor. `ListHeaderComponent` com `SearchBar` acima da lista.
- [x] **Adicionar componente SearchBar em Leisure/Movies** — filtro local por título/diretor.
- [x] **Adicionar componente SearchBar em Leisure/Series** — filtro local por título/criador.
- [x] **Adicionar componente SearchBar em Leisure/Activities** — filtro local por nome/tipo (usando `TYPE_LABEL` para filtrar "Terapêutica", "Recreativa", etc.).
- [x] **Criar componente reutilizável `SearchBar`** — `src/components/ui/SearchBar/index.tsx`: ícone de lupa, campo `TextInput`, botão `x-circle` para limpar (visível apenas quando há texto). Props: `value`, `onChangeText`, `placeholder`.

### 8.7 — Reformulação da Tela de Denúncias (baixa prioridade)

- [ ] **Redesenhar ReportsArea** — separar completamente de LegalArea. Nova estrutura:
  - Cabeçalho emocional: "Você não merece passar por isso"
  - Seção "O que aconteceu?" — chips de categoria (Discriminação no trabalho, Negativa de plano, Mau atendimento, Outro)
  - Seção "Denuncie agora" — cards com botão direto (ligar, abrir link)
  - Remover a seção "Seus Direitos" (já existe em `LegalArea/index.tsx`)
  - Opcional: formulário de relato anônimo salvo em AsyncStorage para fins de registro pessoal

### 8.8 — Padronização de Estilos (baixa prioridade)

- [ ] **Auditoria de estilos inline** — varrer todas as telas do `PersonalArea/` e substituir `fontSize`, `fontWeight`, `color`, `fontFamily` inline por tokens de `globalStyles` e `Colors`.
- [ ] **Criar tokens faltantes em `global.ts`** — adicionar `sectionTitle`, `sectionSubtitle`, `cardTitle`, `cardSubText`, `metaLabel`, `metaValue` como estilos reutilizáveis.
- [ ] **Padronizar `fontFamily: 'Montserrat'`** — garantir que todas as `Text` usem a fonte via `globalStyles.baseText` ou estilo herdado, eliminando declarações dispersas.

---

## BLOCO 9 — Polimento de UX e Correções

### 9.1 — Área de Saúde Mental

- [x] **Botão de motivação 100% largura** — `NavigationGrid.tsx`: quando `singleElement && data.length === 1`, aplica `cardFullWidth` (`width: '100%'`) no card.
- [x] **Melhorar tela Meditação Guiada** — `Meditation/index.tsx` redesenhada: banner hero azul, chips de dicas, metadata de duração e tipo por exercício (5–15 min), `MediaList` integrada por card.
- [x] **Melhorar tela Exercícios de Respiração** — `BreathingExercises/index.tsx` reescrita: 3 técnicas selecionáveis (4-7-8, Quadrada, Calma Rápida), círculo pulsante com `Animated.timing`, countdown por fase, indicador de fase ativa, botão iniciar/parar.
- [x] **Melhorar tela Apoio Psicológico** — `PsychologicalSupport/index.tsx` redesenhada: banner hero, 5 cards com ícones Feather, badges por tipo (Presencial/Online/Comunidade/Urgência), links externos (CFP, CVV 188), nota sobre registro profissional.

### 9.2 — Componentes de Input Reutilizáveis

- [x] **Criar componente `DateInput`** — `src/components/ui/Inputs/DateInput.tsx`: máscara automática `DD/MM/AAAA`. Props: `value`, `onChangeText`, `label`, `placeholder`.
- [x] **Criar componente `PhoneInput`** — `src/components/ui/Inputs/PhoneInput.tsx`: máscara automática `(XX) XXXXX-XXXX`. Props: `value`, `onChangeText`, `label`.
- [x] **Aplicar `DateInput` em Treatment/create** — campo "Data Término" (`dataFim`).
- [x] **Aplicar `DateInput` em Treatment/update** — campo "Nova Data Término".
- [x] **Aplicar `DateInput` em OnboardingForm** — campo "Data de Nascimento" (`birthday`).
- [x] **Aplicar `PhoneInput` em OnboardingForm** — campo "Telefone" (`phone_number`).
- [x] **Aplicar `PhoneInput` em Treatment/create e update** — campo "Telefone/Contato" do médico (`contatoMedico`).

### 9.3 — Campos Opcionais e UX de Formulários

- [x] **Indicar campos opcionais em OnboardingForm** — label `(opcional)` adicionado ao lado de pronome, telefone e data de nascimento. Estilo `optional` em cinza 12px.
- [x] **Indicar campos opcionais em Treatment/create e update** — seção de Médico e Hospital já tem label `"(Opcional)"`. Confirmado visualmente claro.

### 9.4 — Calendário — Meses de Conscientização Oncológica

- [x] **Corrigir mapa de campanhas mensais** — `Calendar/index.tsx` atualizado: apenas 6 meses oncológicos mantidos (Fevereiro Laranja, Março Lilás, Junho Laranja, Setembro Dourado, Outubro Rosa, Novembro Azul). Demais meses removidos — card não exibido em meses sem campanha oncológica.

### 9.5 — Correção de Bug: Editar Perfil (Backend)

- [x] **Aumentar limite de payload no NestJS** — `apps/backend/src/main.ts`: `express.json({ limit: '5mb' })` e `express.urlencoded({ limit: '5mb' })` configurados antes do `app.listen`.

---

## BLOCO 10 — Feedback Visual de Ações (Toast)

> **Objetivo**: Substituir `Alert.alert` de sucesso por feedback não-bloqueante (toast/snackbar) em todas as ações que interagem com o backend, melhorando a UX.

### 10.1 — Infraestrutura

- [x] **Instalar biblioteca de toast** — avaliar `react-native-toast-message` (mais popular, customizável, suporta Expo). Instalar via `npx expo install react-native-toast-message`. Registrar `<Toast />` no root `_layout.tsx` acima do `Stack`. Atualizar `toastService.ts` para usar a lib.
- [x] **Criar wrapper `toastService`** — `src/services/toastService.ts` criado: `toastService.success(msg)`, `.error(msg)`, `.info(msg)`. Android usa `ToastAndroid`; iOS usa `Alert.alert` como fallback até instalação da lib.

### 10.2 — Aplicar Toast nas Telas

- [x] **OnboardingForm** — `Alert.alert('Sucesso'/'Erro')` substituídos por `toastService.success` / `toastService.error`.
- [x] **AccountConfigurations / ChangePassword** — substituir alerts de sucesso/erro de troca de senha por toast.
- [x] **AccountConfigurations / Excluir conta** — alert de confirmação mantido (destrutivo). Alert de erro substituído por toast.
- [x] **Diary/create** — toast de sucesso ao salvar entrada do diário.
- [x] **Diary/update** — toast de sucesso ao atualizar entrada.
- [x] **Treatment/create** — `Alert.alert('Erro')` substituído por `toastService.error`. Toast de sucesso adicionado antes do `router.back()`.
- [x] **Treatment/update** — toast de sucesso ao atualizar ciclo.
- [x] **Mascot/Chat** — toast de erro quando API falha ao responder.

---

## Resumo do Estado Atual

| Área | Telas | Status |
|------|-------|--------|
| Autenticação | 5 telas | ✅ Real (integrado com API + Zustand unificado) |
| Home | 1 tela | ✅ Funcional (modal de login suave adicionado) |
| Oncologia | 6/6 subrotas | ✅ Todas implementadas |
| Saúde Mental | 6/6 subrotas | ✅ Todas implementadas |
| Mascote | 2 telas | ⚠️ Integração do chat verificada |
| Área Pessoal | 9/9 subrotas | ✅ Logout/exclusão/onboarding/change-password implementados; Treatment com AsyncStorage |
| Identidade Visual | — | ❌ Splash/logos pendentes (aguarda arquivos) |
| Calendário | 1 tela | ✅ Interativo com multi-dot, modal por dia, métricas e campanhas oncológicas |
| Notificações | 1 tela | ✅ Push agendadas por tratamento, histórico, seções novas/anteriores/agendadas |
| Tratamentos | 3 telas | ✅ AsyncStorage (aguarda backend para migrar para API) |
| Integração Backend | — | 🟡 Auth + Diary + Leisure integrados; Treatments mockados |
| Feedback Visual | — | ✅ Toast implementado com react-native-toast-message (Bloco 10 concluído) |
