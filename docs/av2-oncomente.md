# OncoMente: 2ª Avaliação de UX

_Avaliação heurística, design system, arquitetura da informação e protocolo Think Aloud do app móvel_

Branch ux-av2 · v1 = commit 92e5d3c (tag ux-av2-v1) · v2 = commit a11b51d (tag ux-av2-v2) · v3 (atual) = commit 6cf7d36 (tag ux-av2-v3)

## 1. Introdução e fluxo-roteiro

O OncoMente apoia pacientes oncológicos de todas as idades e seus cuidadores em saúde mental, adesão ao tratamento e combate ao estigma. O protótipo avaliado é o próprio app (React Native + Expo Router), rodando contra a API NestJS com dados semeados. Como o público costuma estar cansado, ansioso ou em sofrimento, as decisões priorizaram linguagem acolhedora, baixa densidade de informação e poucos toques até o que importa.

Método: (1) baseline da v1 com prints; (2) avaliação heurística das 10 heurísticas de Nielsen, tela a tela; (3) design system com tokens verificados por script; (4) correções e microinterações (v2); (5) revisão da v2 pela equipe e segunda iteração (v3), com smoke test e prints refeitos para detectar regressões; (6) protocolo Think Aloud para 2 ou 3 participantes, com os resultados incorporados à matriz de iteração depois das sessões.

### Fluxo-roteiro da gravação (10 telas)

| # | Tela | Rota | O que mostrar | Estados |
|---|---|---|---|---|
| 1 | Início + modal de login suave | / | Modal com "Agora não" (lembrado na próxima visita); grade 2×2 com as quatro áreas; Mensagem do Dia | Default, pressed nos cards |
| 2 | Login | /LoginScreen | Labels visíveis; erro de validação ao tocar em Entrar vazio; loading no botão; toast de boas-vindas | Erro, carregando, sucesso |
| 3 | Oncologia | /Oncology | Lista com ícone, subtítulo e chevron por tema; seção "Seus direitos" | Pressed nas linhas |
| 4 | Lazer | /Oncology/Leisure | Skeleton → carrosséis de atividades, livros, filmes e séries; erro com "Tentar novamente" | Carregando, sucesso, erro, vazio |
| 5 | Livros → detalhe do livro | /Oncology/Leisure/Books | Busca com label; "nenhum resultado" com "Limpar busca"; detalhe com seta voltar visível | Todos + busca vazia |
| 6 | Saúde Mental | /MentalHealth | Motivação para pacientes e para cuidadores; práticas para ansiedade | Pressed |
| 7 | Contatos de emergência | botão de pânico (Saúde Mental) | Botão flutuante em todas as telas de Saúde Mental; card expande e liga | Expandido, pressed |
| 8 | Mascote (gate → chat) | /Mascot/Chat | Sem login: gate com benefícios e "Entrar". Logado: faixa de escopo e limite; sugestões; "escrevendo…"; erro com "Tentar de novo"; limpar com confirmação | Vazio, carregando, sucesso, erro |
| 9 | Meu Perfil (Hub) | /PersonalArea/Hub | Agrupamento "Minha jornada" / "Apoio"; configurações | Pressed |
| 10 | Diário → novo registro | /PersonalArea/Diary | Vazio → criar registro → toast → lista; excluir com confirmação | Vazio, carregando, sucesso, erro |

Como forçar estados na gravação: abra a rota /design-system (no web, localhost:8081/design-system; no app, o deep link cancerhealthcareapp://design-system) → "Simulação de estados" → ligue "Mostrar painel discreto". Um ponto no canto superior esquerdo abre o painel (Real, Carregando, Sucesso, Erro, Vazio), que vale para Lazer, Livros, detalhe do livro, Diário e Chat. "Desligar painel" volta ao comportamento real. Usuário de teste: demo.ux@oncomente.com.

## 2. Design system

Os tokens ficam em apps/mobile/src/constants/tokens.ts (arquivo sem dependência de React Native, lido também pelos scripts). Colors.ts e styles/global.ts passaram a derivar dos tokens, então as telas legadas herdam as correções de cor sem edição.

| Categoria | Tokens | Decisão |
|---|---|---|
| Cor (semântica) | text.primary #1A1A1A · text.secondary #575760 · text.brand #4E56C0 · action.primary #7A3FC4 · action.danger #B3261E · bg.surface/subtle/brandSubtle · border.* | #9B5DE0 (identidade) fica como acento; ações usam #7A3FC4, da mesma matiz |
| Tipografia | Montserrat 400/600/700: display 28/34 · title 22/28 · subtitle 18/24 · body 16/24 · small 14/20 · caption 13/18 · tabLabel 11/14 | Sem serifa; corpo mínimo de 16 para leitura com fadiga |
| Espaçamento | xxs 4 · xs 8 · sm 16 · md 24 · lg 32 · xl 48 | Escala de 8 (4 só para ajuste fino) |
| Raio / sombra | radius sm 8 · md 12 · lg 16 · xl 24 · pill · shadow sm/md | Superfícies suaves, coerentes com o tom acolhedor |
| Toque | touch.min 44 · touch.comfortable 48 · focusRing 3 | Alvos ≥ 44×44 (WCAG 2.5.5); botões com 48 de altura |

### Componentes e estados

| Componente | Estados / variantes | Acessibilidade |
|---|---|---|
| Button | primary, secondary, ghost, danger × default, pressed, focus, disabled, loading | role button, accessibilityState (disabled/busy), altura 48, spinner na cor do texto |
| TextField | default, focus, preenchido, erro, disabled, senha, multilinha | Label sempre visível, erro com ícone e live region, botão olho com label |
| Card / NavItemCard | Card: estático ou pressionável. NavItemCard: linha de lista com ícone, subtítulo, chevron e divisória (sem sombra nem escala), pressed | Nome acessível = título + subtítulo; alvo ≥ 64 |
| Header | tela / seção, com ação "Ver todos" | role header; ação com hitSlop |
| Toast | sucesso, erro, info | role alert + live region; não bloqueante |
| Skeleton / LoadingState | lista, grade, carrossel | role progressbar + anúncio "Carregando…" |
| EmptyState / ErrorState | com/sem ação; "Tentar novamente" | ErrorState com role alert |
| ConfirmDialog, PanicButton | destrutivo / padrão; botão de pânico flutuante default/pressed | ConfirmDialog funciona no web (Alert.alert não mostra botões); PanicButton com nome acessível |

Tudo isso pode ser visto na rota /design-system (fora da navegação; acessada por URL ou deep link), que exibe cores com a razão de contraste ao lado, tipografia, espaçamento, raios, sombras e todos os componentes em todos os estados.

### Tabela de contraste (WCAG 2.x, mínimo 4.5:1)

Script: npx tsx apps/mobile/scripts/check-contrast.ts. Ele calcula (L1 + 0.05) / (L2 + 0.05) para todos os pares registrados em tokens.ts e falha se algum ficar abaixo de 4.5:1. Resultado na v1: 13 de 15 pares reprovados. Na v2: 25 de 25 aprovados. A v3 não alterou tokens e repete o resultado (25/25, verificado no commit 6cf7d36).

#### v1 (antes)

| Uso | Texto | Fundo | Razão | AA |
|---|---|---|---|---|
| Botão primário / FAB (v1) | #FFFFFF | #9B5DE0 | 4.17:1 | Reprovado |
| Links, "Sobre", "Cadastre-se" (v1) | #9B5DE0 | #FFFFFF | 4.17:1 | Reprovado |
| Seta voltar no cartão branco (v1) | #FFFFFF | #FFFFFF | 1.00:1 | Reprovado |
| Logo/título do Início no web (v1) | #FFFFFF | #F2F2F2 | 1.12:1 | Reprovado |
| "Continuar sem login" (v1) | #AAAAAA | #FFFFFF | 2.32:1 | Reprovado |
| "Limpar conversa" no chat (v1) | #888888 | #FFFFFF | 3.54:1 | Reprovado |
| Placeholder do SoftLoginModal (v1) | #999999 | #FFFFFF | 2.85:1 | Reprovado |
| Rótulo de aba inativa (v1) | #B15CCE | #FFFFFF | 3.97:1 | Reprovado |
| Título "Mensagem do Dia" (v1) | #0088FF | #E6FFF9 | 3.36:1 | Reprovado |
| Card "Tratamentos" no Hub (v1) | #2980B9 | #F0F6FC | 3.95:1 | Reprovado |
| Card "Calendário" no Hub (v1) | #1E9951 | #F0F7F2 | 3.37:1 | Reprovado |
| Card "Diário" no Hub (v1) | #8257E5 | #F5F0FA | 4.21:1 | Reprovado |
| "Configurações da Conta" no Hub (v1) | #777777 | #FAFAFA | 4.29:1 | Reprovado |
| Títulos em purpleSecondary (v1) | #4E56C0 | #FFFFFF | 6.15:1 | Aprovado |
| Texto principal (v1) | #1A1A1A | #FFFFFF | 17.40:1 | Aprovado |

#### v2 e v3 (depois)

| Uso | Texto | Fundo | Razão | AA |
|---|---|---|---|---|
| Texto principal | #1A1A1A | #FFFFFF | 17.40:1 | Aprovado |
| Texto secundário / descrições | #575760 | #FFFFFF | 7.15:1 | Aprovado |
| Texto secundário em superfície neutra | #575760 | #F4F4F6 | 6.51:1 | Aprovado |
| Títulos de header e seções | #4E56C0 | #FFFFFF | 6.15:1 | Aprovado |
| Header do Início sobre o gradiente | #4E56C0 | #EEE3FB | 4.98:1 | Aprovado |
| Saudação do Início sobre o gradiente | #1A1A1A | #EEE3FB | 14.10:1 | Aprovado |
| Links e botão secundário | #7A3FC4 | #FFFFFF | 6.30:1 | Aprovado |
| Link sobre superfície lilás | #7A3FC4 | #F7F1FE | 5.69:1 | Aprovado |
| Chips e cards lilás | #5B2E99 | #EEE3FB | 7.41:1 | Aprovado |
| Botão primário (default) | #FFFFFF | #7A3FC4 | 6.30:1 | Aprovado |
| Botão primário (pressed) | #FFFFFF | #5B2E99 | 9.15:1 | Aprovado |
| Botão SOS / perigo | #FFFFFF | #B3261E | 6.54:1 | Aprovado |
| Botão SOS (pressed) | #FFFFFF | #8C1D18 | 9.11:1 | Aprovado |
| Botão desabilitado | #575760 | #E6E6EA | 5.74:1 | Aprovado |
| Mensagem de erro de campo | #B3261E | #FFFFFF | 6.54:1 | Aprovado |
| ErrorState / toast de erro | #B3261E | #FDECEA | 5.72:1 | Aprovado |
| Toast de sucesso | #1E7A3C | #E8F5EC | 4.79:1 | Aprovado |
| Aviso (contatos de emergência) | #92400E | #FEF3C7 | 6.37:1 | Aprovado |
| Faixa informativa (chat) | #0B5FA0 | #E8F2FC | 5.87:1 | Aprovado |
| Mensagem do Dia | #1A1A1A | #E6FBF5 | 16.15:1 | Aprovado |
| Balão do mascote no chat | #1A1A1A | #F4F4F6 | 15.84:1 | Aprovado |
| Placeholder de campo | #575760 | #FFFFFF | 7.15:1 | Aprovado |
| Subtítulo em card lilás | #575760 | #F7F1FE | 6.46:1 | Aprovado |
| Balão do usuário no chat | #FFFFFF | #7A3FC4 | 6.30:1 | Aprovado |
| Título sobre capa (scrim 78% no pior caso) | #FFFFFF | #474747 | 9.29:1 | Aprovado |

Os componentes da Home e do Lazer restaurados na Iteração 2 usam cores do Colors.ts e alguns valores literais. As combinações de cor deles foram medidas à parte:

| Uso (componente restaurado) | Texto | Fundo | Razão | AA |
|---|---|---|---|---|
| Logo ONCOMENTE (HeaderLogo) | #4E56C0 | #FFFFFF | 6.15:1 | Aprovado |
| Rótulo dos cards da grade do Início | #1A1A1A | #FFFFFF | 17.40:1 | Aprovado |
| Título da Mensagem do Dia | #4E56C0 | #E6FBF5 | 5.70:1 | Aprovado |
| Botão "Sobre o OncoMente" | #7A3FC4 | #FFFFFF | 6.30:1 | Aprovado |
| Título de seção do carrossel (PagerHeader) | #4E56C0 | #FFFFFF | 6.15:1 | Aprovado |
| Título sobre capa (scrim 58% no pior caso) | #FFFFFF | #6B6B6B | 5.33:1 | Aprovado |

Complemento: scripts/check-hardcoded.ts varre as telas do fluxo e os componentes do DS e falha se encontrar cor literal ou tamanho literal (fontSize, padding, margin, gap, raio, borda, size={n}) fora dos tokens. Resultado da v2: 0 ocorrências. Na v3 ele aponta 49 ocorrências, todas nos 6 componentes restaurados da versão original (HelloMessage, HeaderLogo, HomeNavigationGrid, DailyMessage, PagerHeader e RecomendationPager). Elas ficam registradas como pendência na seção 5.2, porque migrar esses arquivos para tokens mudaria o visual que a equipe decidiu manter.

## 3. Arquitetura da informação

### Sitemap atual (v3)

```
Início ─ saudação · grade 2×2 (Oncologia, Saúde Mental, Mascote Virtual, Meu Perfil) · Mensagem do Dia · Sobre
├─ Oncologia (pública)
│  ├─ Autocuidado e tratamento: Sono · Exercícios físicos · Nutrição · Espiritualidade · Lazer
│  │                            Lazer → Atividades · Livros · Filmes · Séries → detalhe
│  └─ Seus direitos: Direitos do paciente (Lei dos 60 dias, FGTS, auxílio-doença, IR)
├─ Saúde Mental (pública)
│  ├─ Motivação: Para pacientes · Para cuidadores
│  ├─ Cuidar da mente: Respiração · Meditação guiada · Apoio psicológico
│  └─ Botão de pânico (flutuante em todas as telas da área) → Contatos de emergência
│     (CVV 188, SAMU 192, CAVIDA, Disque Saúde 136)
├─ Mascote (pede login) → Chat (escopo, sugestões, limite diário)
└─ Meu Perfil (pede login) → Minha jornada (Diário, Tratamentos, Calendário) · Apoio (Sofreu discriminação?, Sobre) · Configurações
```

### Mudanças de rótulo, agrupamento e profundidade

| Antes (v1) | Depois (v3, atual) | Motivo |
|---|---|---|
| Botão de pânico "!" só na home de Saúde Mental: some nas subtelas e não tem nome acessível | Botão de pânico em todas as telas de Saúde Mental (oculto só na própria lista), com nome acessível | A ajuda fica a 1 toque em toda a área onde a pessoa busca apoio emocional, sem um botão vermelho competindo com o conteúdo de oncologia (P01, I2-02) |
| Seção "Benefícios Legais" com o card "Lei dos 60 dias" → tela com 4 direitos | Seção "Seus direitos" → "Direitos do paciente" + subtítulo com os direitos | O rótulo prometia uma única lei; nomes diferentes para a mesma coisa (P11) |
| Motivacional: anônimo só via "Paciente" | "Para pacientes" e "Para cuidadores" sempre visíveis, ordenados pelo papel | Cuidador é público-alvo e o conteúdo é público (P13) |
| Gate "É necessário autenticação" com botões quebrando o texto | Gate que explica o que a área oferece, com "Entrar" e "Criar conta grátis" em largura total | A pessoa entende por que criar conta antes de ser cobrada, sem jargão (P14, I2-01, I2-06) |
| Aba "Mascote Virtual" truncada | Aba "Mascote"; rótulos quebram em 2 linhas em vez de truncar | Legibilidade em 390 px (P15) |
| Hub com 5 cards de cores livres, sem grupos | "Minha jornada" (Diário, Tratamentos, Calendário) e "Apoio", em linhas de lista | Agrupamento por objetivo reduz a varredura |
| Tópicos em cards com sombra, parecidos com botões | Tópicos como linhas de lista com ícone, subtítulo e chevron | Separa visualmente navegação (lista) de ação (botão) (I2-08) |
| Ícones repetidos entre tópicos | Um ícone por tópico + subtítulo descritivo | Reconhecimento em vez de memorização (P12) |

## 4. Avaliação heurística (v1)

Inspeção tela a tela da v1 (commit 92e5d3c) pelas 10 heurísticas de Nielsen, com evidência no código (arquivo:linha) e em prints do Expo Web a 390×844. Severidade na escala 0–4 de Nielsen. Foram 21 problemas, 5 deles de arquitetura da informação (marcados com AI).

| ID | Tela | Problema | Heurística | Sev. | Evidência |
|---|---|---|---|---|---|
| P01 (AI) | Saúde Mental → Contatos de emergência | O Botão de Pânico só existe na home de Saúde Mental: são 2 toques a partir do Início e ele some nas subtelas. É um ícone "!" sem rótulo textual. | H7 Flexibilidade e eficiência de uso; H6 Reconhecimento em vez de memorização | 4 | MentalHealth/index.tsx:83 (único uso); print 08-saude-mental |
| P02 | Início, Oncologia, Saúde Mental | Os cartões de navegação não aparecem no preview web: o FlatList dentro de um container flex:0 fica com altura 0. Telas sem saída visível. | H1 Visibilidade do status do sistema | 4 | HomeNavigationGrid.tsx:40, NavigationGrid.tsx:53; prints 03-inicio, 04-oncologia, 08-saude-mental |
| P03 | Global (botões, links, FAB) | Texto branco sobre #9B5DE0 tem contraste 4.17:1, e #9B5DE0 sobre branco também. Os dois ficam abaixo do mínimo WCAG AA de 4.5:1. | H4 Consistência e padrões | 3 | styles/Buttons.ts:46; scripts/check-contrast.ts (v1) |
| P04 | Todas as telas internas | A seta "voltar" do header é branca sobre o cartão branco (1:1), ou seja, invisível: o usuário só volta pela barra de abas ou pelo gesto do sistema. O título do header ainda se sobrepõe aos banners. | H3 Controle e liberdade do usuário; H8 Estética e design minimalista | 3 | CommonScreenOptions.ts:5 (headerTintColor white); prints 05-lazer, 06-livros (sem seta visível), 04-oncologia (título sobre o banner) |
| P05 | Início (header) | Logo "ONCOMENTE" e título "Início" brancos sobre fundo claro (#F2F2F2 no web; 1.1:1): praticamente invisíveis, e o usuário não sabe onde está. | H8 Estética e design minimalista; H1 Visibilidade do status do sistema | 2 | HeaderLogo.tsx; (Home)/_layout.tsx:39; print 03-inicio |
| P06 | Global | A fonte Montserrat é declarada em todo o app mas nunca é carregada. O texto cai no fallback do sistema (serifado no web), com tipografia inconsistente. | H4 Consistência e padrões | 2 | assets/fonts contém só SpaceMono; nenhum useFonts; prints 04 e 06 |
| P07 | Login, SoftLoginModal | Os campos só têm placeholder ("email@email.com", "senha"). Ao digitar, o rótulo some e o usuário precisa lembrar o que o campo pede. | H6 Reconhecimento em vez de memorização | 3 | LoginForm.tsx:24,34; SoftLoginModal.tsx; prints 01, 02 |
| P08 | Lazer | Quando a API falha, o hub de Lazer engole o erro e mostra seções vazias, sem dizer o que aconteceu nem como tentar de novo. | H1 Visibilidade do status do sistema; H9 Reconhecer, diagnosticar e recuperar-se de erros | 3 | Leisure/index.tsx:111 (allSettled sem tratar rejected); print evid-lazer-api-falhando |
| P09 | Livros | Na falha de rede aparece um Alert bloqueante e, depois, "Nenhum livro disponível no momento". A mensagem é contraditória e não oferece "Tentar novamente". | H9 Reconhecer, diagnosticar e recuperar-se de erros; H3 Controle e liberdade do usuário | 2 | Leisure/Books/index.tsx:24; print evid-livros-api-falhando |
| P10 | Diário | No erro, o toast "Não foi possível carregar" divide a tela com "Nenhuma entrada ainda. Comece registrando seu dia!". O usuário pode achar que perdeu os registros. | H1 Visibilidade do status do sistema; H9 Reconhecer, diagnosticar e recuperar-se de erros | 3 | PersonalArea/Diary/index.tsx:62; print evid-diario-api-falhando |
| P11 (AI) | Oncologia | Um mesmo assunto com três nomes: a seção "Benefícios Legais", o card "Lei dos 60 dias" e a rota LegalArea. O card promete uma única lei, mas a tela traz FGTS, auxílio-doença e isenção de IR. | H2 Correspondência entre o sistema e o mundo real | 2 | Oncology/index.tsx:20,43; print 07-beneficios-legais |
| P12 | Oncologia, Saúde Mental | Ícones incoerentes: Nutrição e Espiritualidade usam o ícone de Lazer, Lazer usa o de "cuidar do paciente" e os três tópicos de saúde mental compartilham o mesmo ícone. | H6 Reconhecimento em vez de memorização; H4 Consistência e padrões | 2 | Oncology/index.tsx:14-16; MentalHealth/index.tsx:15-27 |
| P13 (AI) | Saúde Mental | Quem não fez login só vê "Motivação Diária" (paciente): o conteúdo para cuidadores, que também é público, fica inacessível. Cuidador logado perde o conteúdo de paciente. | H7 Flexibilidade e eficiência de uso; H2 Correspondência entre o sistema e o mundo real | 2 | MentalHealth/index.tsx:30-54 |
| P14 (AI) | Abas Mascote / Meu Perfil | A fronteira entre público e autenticado não é sinalizada: as abas parecem iguais às públicas, e o gate usa o jargão "É necessário autenticação" com o botão "Criar Conta" quebrado em duas linhas. | H2 Correspondência entre o sistema e o mundo real; H1 Visibilidade do status do sistema | 2 | Mascot/index.tsx:43; print 10-mascote-gate |
| P15 (AI) | Abas | O rótulo da aba "Mascote Virtual" é truncado como "Mascote Virt…" em telas de 390 px. | H8 Estética e design minimalista; H4 Consistência e padrões | 1 | (Home)/_layout.tsx:77; todos os prints |
| P16 | Início (SoftLoginModal) | O modal de login reaparece em toda abertura do app para quem escolheu continuar sem conta. A saída "Continuar sem login" tem 2.3:1 de contraste e um alvo de toque pequeno. | H3 Controle e liberdade do usuário | 3 | (Home)/index.tsx:17; SoftLoginModal.tsx:116,226; print 01-inicio-modal |
| P17 | Login | O loading dos botões é quebrado: o ButtonPrimary usa a cor inválida "FFF" e o ButtonOutline põe spinner branco sobre fundo branco. Ao entrar, "Cadastrar" também fica em loading. | H1 Visibilidade do status do sistema | 2 | ButtonPrimary.tsx:12; ButtonOutline.tsx:12; LoginScreen.tsx:65 |
| P18 | Global | Nenhum accessibilityLabel/Role em todo o app. Botões só de ícone (FAB, olho da senha, enviar no chat, "+") ficam sem nome para leitores de tela. Vários alvos têm menos de 44×44. | H4 Consistência e padrões | 3 | grep accessibilityLabel = 0 ocorrências; OverlayButton.tsx; InputWithIcon.tsx |
| P19 | Mascote (Chat) | "Limpar conversa" apaga todo o histórico sem confirmação nem desfazer, num texto de 11 px em #888 (3.5:1). | H5 Prevenção de erros; H3 Controle e liberdade do usuário | 2 | Mascot/Chat/index.tsx:100-104,197 |
| P20 | Mascote (Chat) | O chat não informa o escopo (não substitui a equipe de saúde) nem o limite diário de mensagens. O usuário só descobre o limite quando faltam 2. | H10 Ajuda e documentação | 2 | Mascot/Chat/index.tsx:258 |
| P21 | Diário → Novo registro | O título do registro só tem placeholder ("Como foi seu dia?"). O botão de salvar fica desabilitado com texto branco sobre #E0E0E0 (1.3:1) e não explica o que falta. No web, "Remover do diário" usa Alert.alert, que não mostra botões, e a exclusão nunca é confirmada. | H5 Prevenção de erros; H6 Reconhecimento em vez de memorização | 3 | Diary/create/index.tsx:92-99,140-150 (v1); Diary/index.tsx:89 (Alert) |

#### Cobertura

| Heur. | Nome | Qtd. | Problemas |
|---|---|---|---|
| H1 | Visibilidade do status do sistema | 6 | P02, P05, P08, P10, P14, P17 |
| H2 | Correspondência entre o sistema e o mundo real | 3 | P11, P13, P14 |
| H3 | Controle e liberdade do usuário | 4 | P04, P09, P16, P19 |
| H4 | Consistência e padrões | 5 | P03, P06, P12, P15, P18 |
| H5 | Prevenção de erros | 2 | P19, P21 |
| H6 | Reconhecimento em vez de memorização | 4 | P01, P07, P12, P21 |
| H7 | Flexibilidade e eficiência de uso | 2 | P01, P13 |
| H8 | Estética e design minimalista | 3 | P04, P05, P15 |
| H9 | Reconhecer, diagnosticar e recuperar-se de erros | 3 | P08, P09, P10 |
| H10 | Ajuda e documentação | 1 | P20 |

| Severidade | Qtd. |
|---|---|
| 4 (Catastrófico) | 2 |
| 3 (Maior) | 8 |
| 2 (Menor) | 10 |
| 1 (Cosmético) | 1 |

## 5. Matriz de iteração

Cada problema da avaliação heurística recebeu uma correção na v2 (commit a11b51d, tag ux-av2-v2). A coluna "Correção aplicada" mostra o estado atual (v3, commit 6cf7d36, tag ux-av2-v3). "Corrigido (v3)" indica que a Iteração 2 mexeu na correção ou a reaplicou; "Revisado (v3)" indica que a solução mudou de forma, com o motivo na seção 5.1. As linhas TA-xx ficam reservadas para os achados do Think Aloud, a preencher depois das sessões.

| ID | Problema | Heurística | Sev. | Correção aplicada | Tela / componente | Status |
|---|---|---|---|---|---|---|
| P01 | O Botão de Pânico só existe na home de Saúde Mental: são 2 toques a partir do Início e ele some nas subtelas. | H7, H6 | 4 | Botão de pânico de volta ao visual original (círculo roxo com "!"), agora em todas as telas da área de Saúde Mental e oculto só na lista de contatos, com accessibilityLabel "Botão de pânico: contatos de emergência". O SOS global saiu (ver I2-02). | ui/Buttons/Overlay/PanicButton · MentalHealth/_layout.tsx | Revisado (v3) |
| P02 | Os cartões de navegação não aparecem no preview web: o FlatList dentro de um container flex:0 fica com altura 0. | H1 | 4 | Grades de Oncologia e Saúde Mental com map + flexWrap (v2). Na Home restaurada, a causa raiz (flex:0 vira "flex: 0 1 0%" no web) foi removida sem trocar o layout. | NavigationGrid.tsx · HomeNavigationGrid.tsx | Corrigido (v3) |
| P03 | Texto branco sobre #9B5DE0 tem contraste 4.17:1, e #9B5DE0 sobre branco também. | H4 | 3 | Token action.primary #7A3FC4 (mesma matiz roxa), com 6.30:1 contra branco. O #9B5DE0 fica como acento de marca, só em bordas, ícones grandes e decoração. | constants/tokens.ts · components/ds/Button.tsx | Corrigido (v2) |
| P04 | A seta "voltar" do header é branca sobre o cartão branco (1:1), ou seja, invisível: o usuário só volta pela barra de abas ou pelo gesto do sistema. | H3, H8 | 3 | Seta e título em text.brand com rótulo "Voltar" (v2). Na v3 o header ficou opaco e fixo, e o conteúdo começa sempre abaixo dele, sem compensação manual por tela. | constants/CommonScreenOptions.ts | Corrigido (v3) |
| P05 | Logo "ONCOMENTE" e título "Início" brancos sobre fundo claro (#F2F2F2 no web; 1.1:1): praticamente invisíveis, e o usuário não sabe onde está.. | H8, H1 | 2 | Logo em text.brand (6.15:1). O atalho de long-press para o Design System saiu com a Home restaurada; a tela continua na rota /design-system. | components/home/HeaderLogo.tsx | Corrigido (v3) |
| P06 | A fonte Montserrat é declarada em todo o app mas nunca é carregada. | H4 | 2 | Montserrat 400/600/700 carregada no RootLayout (@expo-google-fonts/montserrat). A escala tipográfica fica nos tokens. | app/_layout.tsx · constants/tokens.ts | Corrigido (v2) |
| P07 | Os campos só têm placeholder ("email@email.com", "senha"). | H6 | 3 | TextField com label visível acima do campo, mensagem de erro associada e accessibilityLabel. | components/ds/TextField.tsx · LoginForm · SoftLoginModal | Corrigido (v2) |
| P08 | Quando a API falha, o hub de Lazer engole o erro e mostra seções vazias, sem dizer o que aconteceu nem como tentar de novo.. | H1, H9 | 3 | Na Home de Lazer restaurada: carregando (skeleton), erro com "Tentar novamente" quando as quatro buscas falham e vazio quando não há recomendações. Falha parcial mostra o que carregou. | Oncology/Leisure/index.tsx · hooks/useAsyncResource.ts | Corrigido (v3) |
| P09 | Na falha de rede aparece um Alert bloqueante e, depois, "Nenhum livro disponível no momento". | H9, H3 | 2 | ErrorState não bloqueante com ação de retry. O EmptyState só aparece quando a lista realmente vem vazia ou quando a busca não encontra nada. | Leisure/Books/index.tsx | Corrigido (v2) |
| P10 | No erro, o toast "Não foi possível carregar" divide a tela com "Nenhuma entrada ainda. | H1, H9 | 3 | ErrorState ("Seus registros estão seguros") com retry, separado do EmptyState com chamada para criar a primeira entrada. | PersonalArea/Diary/index.tsx | Corrigido (v2) |
| P11 | Um mesmo assunto com três nomes: a seção "Benefícios Legais", o card "Lei dos 60 dias" e a rota LegalArea. | H2 | 2 | Seção "Seus direitos" com o card "Direitos do paciente" e o subtítulo "Lei dos 60 dias, FGTS, auxílio-doença, IR". O título da tela é o mesmo do card. | Oncology/index.tsx · Oncology/_layout.tsx | Corrigido (v2) |
| P12 | Ícones incoerentes: Nutrição e Espiritualidade usam o ícone de Lazer, Lazer usa o de "cuidar do paciente" e os três tópicos de saúde mental compartilham o mesmo ícone.. | H6, H4 | 2 | Um ícone vetorial distinto por tópico (lua, halter, maçã, folha, pipoca etc.), sempre acompanhado de rótulo e subtítulo. | components/ui/Navigation/NavigationGrid.tsx | Corrigido (v2) |
| P13 | Quem não fez login só vê "Motivação Diária" (paciente): o conteúdo para cuidadores, que também é público, fica inacessível. | H7, H2 | 2 | Os dois cards ficam sempre visíveis ("Para pacientes" e "Para cuidadores"), com o do papel do usuário primeiro. | MentalHealth/index.tsx | Corrigido (v2) |
| P14 | A fronteira entre público e autenticado não é sinalizada: as abas parecem iguais às públicas, e o gate usa o jargão "É necessário autenticação" com o botão "Criar Conta" quebrado em duas linhas.. | H2, H1 | 2 | Gate com mascote, benefícios e os botões "Entrar" e "Criar conta grátis" em largura total; texto "Entre na sua conta para conversar". Cadeados e "Continuar sem conta" saíram na Iteração 2 (I2-01, I2-06). | components/auth/AuthGate.tsx · Mascot/index.tsx | Revisado (v3) |
| P15 | O rótulo da aba "Mascote Virtual" é truncado como "Mascote Virt…" em telas de 390 px.. | H8, H4 | 1 | Rótulo curto "Mascote" na aba. O nome completo fica no título da tela. | (Home)/_layout.tsx | Corrigido (v2) |
| P16 | O modal de login reaparece em toda abertura do app para quem escolheu continuar sem conta. | H3 | 3 | "Agora não" lembrado (AsyncStorage), reaplicado na Home restaurada. Botão secundário de 48 px com contraste ≥ 4.5:1 e botão fechar rotulado. | (Home)/index.tsx · SoftLoginModal | Corrigido (v3) |
| P17 | O loading dos botões é quebrado: o ButtonPrimary usa a cor inválida "FFF" e o ButtonOutline põe spinner branco sobre fundo branco. | H1 | 2 | Button único com estados default, pressed, focus, disabled e loading. O spinner usa a cor do texto da variante e só o botão acionado mostra loading. | components/ds/Button.tsx | Corrigido (v2) |
| P18 | Nenhum accessibilityLabel/Role em todo o app. | H4 | 3 | Componentes do DS exigem label. accessibilityRole/State nos interativos e hitSlop/minHeight de 44 a 48 px. | components/ds/* · telas do fluxo | Corrigido (v2) |
| P19 | "Limpar conversa" apaga todo o histórico sem confirmação nem desfazer, num texto de 11 px em #888 (3.5:1).. | H5, H3 | 2 | Botão "Limpar" com rótulo e alvo de 44 px, mais uma confirmação explicando que a conversa será apagada. | Mascot/Chat/index.tsx | Corrigido (v2) |
| P20 | O chat não informa o escopo (não substitui a equipe de saúde) nem o limite diário de mensagens. | H10 | 2 | Faixa informativa fixa: "Respostas informativas, não substituem sua equipe de saúde · N mensagens restantes hoje", com botão de limpar rotulado. | Mascot/Chat/index.tsx | Corrigido (v2) |
| P21 | O título do registro só tem placeholder ("Como foi seu dia?"). | H5, H6 | 3 | DiaryForm compartilhado (criar/editar) com labels visíveis, contador de caracteres, emoções como radio acessível e botão sempre ativo que aponta o campo faltante. Exclusão via ConfirmDialog ("Manter" / "Excluir registro"). | components/diary/DiaryForm.tsx · components/ds/ConfirmDialog.tsx | Corrigido (v2) |
| TA-01 |   |   |   |   |   | A preencher |
| TA-02 |   |   |   |   |   | A preencher |
| TA-03 |   |   |   |   |   | A preencher |

### 5.1 Iteração 2 (v2 → v3)

A equipe revisou a v2 navegando pelo app e identificou mudanças que acrescentavam ruído ou se afastavam da identidade visual do produto. A revisão levou a uma segunda iteração. Depois dela, prints e smoke test foram refeitos, e as 4 regressões que apareceram foram corrigidas (I2-11).

| ID | Mudança | Motivo | Heur. | Commits |
|---|---|---|---|---|
| I2-01 | Cadeados removidos das abas, da grade do Início, dos cards e do gate | Na revisão, a equipe avaliou o cadeado como ruído visual que repetia o que o gate já explica e dava às áreas pessoais um tom de "proibido". | H8 | e62bb2b |
| I2-02 | SOS global (vermelho, em todas as abas) trocado pelo botão de pânico original, só nas telas de Saúde Mental | O botão vermelho fixo competia com o conteúdo de oncologia e podia alarmar quem só lia sobre nutrição ou direitos. O recurso de crise fica na área de apoio emocional, em todas as subtelas (na v1 ficava só no índice). Custo: 2 toques a partir do Início. | H8, H7 | a22582f |
| I2-03 | Header opaco e fixo, com o conteúdo sempre abaixo dele | Com o header transparente, cada tela precisava compensar a altura dele à mão, e títulos e banners ficavam por baixo do texto do header quando a compensação falhava. Agora o layout é responsabilidade do navegador de telas. | H8, H4 | 7776fda, c614115, b1099f5, a9acf5a |
| I2-04 | Conteúdo rolável recortado nas bordas arredondadas do card | O scroll vazava pelos cantos do container. | H8 | 96a875b |
| I2-05 | Início restaurado ao layout original, com o botão "Sobre" opaco e a Mensagem do Dia refinada | Decisão da equipe de preservar a identidade visual original da tela inicial (saudação, mascote, grade 2×2 ilustrada). Só o contraste do "Sobre" e a legibilidade da Mensagem do Dia foram melhorados. | H8 | d55008a, 8823ee4, 455a398 |
| I2-06 | Gate de login sem "Continuar sem conta", com mascote maior e rolagem só quando não cabe | O botão repetia a saída que a barra de abas já oferece e alongava a tela. | H8 | e10b918, 0cf9629 |
| I2-07 | Formulários de login e cadastro sem rolagem quando cabem na tela; teclado não cobre o campo em foco | Rolagem desnecessária em formulários curtos e campos escondidos pelo teclado (Tratamento, Onboarding, Senha, Chat). | H5, H8 | 3099973, b9fd13d |
| I2-08 | Tópicos de Oncologia, Saúde Mental e Meu Perfil como linhas de lista (sem sombra, borda ou escala ao toque) | Cards com sombra e escala pareciam botões de ação. Linhas de lista com chevron indicam navegação. | H4 | 4571c43 |
| I2-09 | Lazer restaurado ao layout original (banner, título e quatro carrosséis) | Decisão da equipe de preservar a visibilidade das capas no carrossel original. | H8 | 3b62e44 |
| I2-10 | Texto "lorem ipsum" removido da tela de autenticação | Texto de preenchimento visível ao usuário. | H8 | dcc3926 |
| I2-11 | Regressões da restauração corrigidas sem mudar o layout: logo legível (P05), "Agora não" lembrado (P16), grade do Início no web (P02) e estados de erro e vazio no Lazer (P08) | Detectadas ao refazer prints e smoke test da v3: a restauração tinha trazido de volta 4 problemas da avaliação heurística. | H1, H3, H9 | 70b61b6, d74772e, 6cf7d36, bc7e947 |

### 5.2 Pendências conhecidas (v3)

| ID | Pendência | Heurística | Sev. | Onde |
|---|---|---|---|---|
| PD-01 | Título das capas nos carrosséis do Lazer em 10 px, abaixo do menor tamanho da escala (caption 13) | H8 / WCAG 1.4.4 | 1 | RecomendationPager.tsx |
| PD-02 | 49 valores literais (cor e tamanho) fora dos tokens nos componentes restaurados | H4 | 1 | Home e Lazer (6 componentes) |
| PD-03 | O botão de pânico é só um ícone "!", sem rótulo visível. Leitores de tela leem o nome acessível, mas quem enxerga depende de reconhecer o ícone | H6 | 2 | PanicButton.tsx |
| PD-04 | Header nativo, teclado e posição do botão de pânico ainda não validados em aparelho Android/iOS (prints e smoke test são do Expo Web) | — | — | Teste em dispositivo |

## 6. Protocolo Think Aloud

Aplicação: 2 ou 3 participantes, de preferência um paciente ou ex-paciente e um cuidador. Sessões individuais de 20 a 30 minutos, presenciais, com o app na versão atual (v3) em celular ou navegador (390×844) e o usuário de teste já criado. Gravar só a tela e o áudio, com autorização. O moderador não ajuda: se a pessoa travar por mais de 2 minutos, registra falha e segue para a próxima tarefa.

### Termo de consentimento

Eu, ______________________________________, concordo em participar voluntariamente do teste de usabilidade do aplicativo OncoMente, realizado por ______________________ na disciplina de UX do curso ____________________. Entendo que: (1) quem está sendo avaliado é o aplicativo, não eu; (2) vou pensar em voz alta enquanto realizo tarefas; (3) a tela e o áudio serão gravados apenas para análise acadêmica, sem divulgação do meu nome ou imagem; (4) posso interromper a qualquer momento, sem prejuízo; (5) não preciso compartilhar informações pessoais de saúde, pois as tarefas usam uma conta de teste.

Assinatura: ______________________________   Data: ___/___/______   Autorizo gravação de áudio: (  ) sim  (  ) não

### Roteiro de introdução (ler para o participante)

- "Obrigado por ajudar. Este é o OncoMente, um app de apoio para quem enfrenta o câncer e para quem cuida."
- "Vou pedir algumas tarefas. Não existe resposta certa: se algo for difícil, a falha é do app, e é isso que queremos descobrir."
- "Pense em voz alta: diga o que está procurando, o que espera que aconteça e o que achou estranho."
- "Eu não vou poder ajudar durante as tarefas, mas você pode desistir de qualquer uma quando quiser."
- Treino (30 s): "Na tela inicial, diga em voz alta o que você acha que cada cartão faz."

### Tarefas e critérios de sucesso

| Tarefa | Enunciado (ler) | Caminho esperado | Sucesso se… |
|---|---|---|---|
| T1 | "Você está muito ansioso(a) e quer falar com alguém agora. Encontre um número para ligar." | Saúde Mental → botão de pânico (!) → Contatos de emergência → expandir CVV/SAMU | Chega aos contatos em até 45 s e identifica o número sem ajuda (observar se reconhece o "!") |
| T2 | "Você quer ler algo leve. Encontre um livro recomendado e descubra onde encontrá-lo." | Oncologia → Lazer → "Livros recomendados" (seta) → livro | Abre o detalhe de um livro e lê "Onde encontrar" em até 2 min |
| T3 | "Descubra se a lei garante um prazo para começar o tratamento." | Oncologia → Direitos do paciente | Encontra e cita o prazo de 60 dias em até 2 min |
| T4 | "Entre na sua conta (dados no cartão) e registre no diário como foi o seu dia." | Meu Perfil → Entrar → Diário → Registrar meu dia → Salvar | Registro salvo (toast) e visível na lista em até 3 min |
| T5 | "Pergunte ao mascote algo sobre enjoo durante o tratamento." | Mascote → digitar ou tocar na sugestão → enviar | Envia a pergunta e lê a resposta em até 2 min |

### Ficha de observação: participante ___

Perfil: (  ) paciente  (  ) ex-paciente  (  ) cuidador(a)  (  ) outro: ________   Faixa etária: ______   Uso de celular: (  ) pouco  (  ) médio  (  ) muito   Data: ___/___   Dispositivo: ____________

| Tarefa | Tempo | Resultado (S / P / F) | Falas relevantes (literais) | Pontos de travamento / erros | Heur. |
|---|---|---|---|---|---|
| T1 |   |   |   |   |   |
| T2 |   |   |   |   |   |
| T3 |   |   |   |   |   |
| T4 |   |   |   |   |   |
| T5 |   |   |   |   |   |

S = sucesso sem ajuda · P = sucesso parcial ou com desvio · F = falha ou desistência. Observações gerais: ________________________________________________________________________________

### Questionário SUS (System Usability Scale)

Marque de 1 (discordo totalmente) a 5 (concordo totalmente).

| # | Afirmação | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 1 | Eu acho que gostaria de usar este app com frequência. |   |   |   |   |   |
| 2 | Achei o app desnecessariamente complexo. |   |   |   |   |   |
| 3 | Achei o app fácil de usar. |   |   |   |   |   |
| 4 | Acho que precisaria de ajuda de uma pessoa para conseguir usar o app. |   |   |   |   |   |
| 5 | As funções do app estão bem integradas. |   |   |   |   |   |
| 6 | Achei que o app tem muitas inconsistências. |   |   |   |   |   |
| 7 | Imagino que a maioria das pessoas aprenderia a usar o app rapidamente. |   |   |   |   |   |
| 8 | Achei o app muito trabalhoso de usar. |   |   |   |   |   |
| 9 | Eu me senti confiante usando o app. |   |   |   |   |   |
| 10 | Precisei aprender muitas coisas antes de conseguir usar o app. |   |   |   |   |   |

Cálculo: itens ímpares = nota − 1; itens pares = 5 − nota; soma × 2,5 = SUS (0–100). Referência: 68 = média. Escore do participante: ______

### Consolidação (preencher depois das sessões)

| Participante | T1 | T2 | T3 | T4 | T5 | SUS | Principal achado |
|---|---|---|---|---|---|---|---|
| P1 |   |   |   |   |   |   |   |
| P2 |   |   |   |   |   |   |   |
| P3 |   |   |   |   |   |   |   |

## 7. Justificativas de UX (roteiro de fala)

#### Telas e navegabilidade

- Nenhuma tela sem saída: seta voltar visível em todas as telas internas (v1: branca no branco), header opaco que nunca cobre o conteúdo, e barra de abas sempre visível, inclusive nos gates de login.
- Quatro estados explícitos em toda tela com dados: o usuário nunca fica diante de uma tela vazia sem saber se é erro ou ausência de conteúdo.
- Feedback ao toque em todo interativo: botões mudam de cor no pressed e linhas de lista mudam de fundo. Toast confirma ações (login, salvar, excluir) sem bloquear.

#### Design system e acessibilidade

- O roxo de identidade #9B5DE0 reprovava (4.17:1). Mantivemos a matiz e escurecemos só onde há texto (#7A3FC4, 6.30:1): a identidade fica, a leitura melhora.
- Contraste verificado por script, não a olho: 13 de 15 pares reprovavam na v1; os 25 pares de tokens passam na v2 e na v3, e as 6 combinações dos componentes restaurados também.
- Montserrat de fato carregada (na v1 era declarada e nunca carregada); corpo de 16 px pensando em fadiga e efeitos visuais do tratamento.
- Alvos ≥ 44×44, labels visíveis, nomes acessíveis em botões de ícone e roles corretos para leitores de tela.

#### Heurísticas e iteração

- 21 problemas reais, todos com evidência em arquivo:linha ou print, cobrindo as 10 heurísticas; os de severidade 3–4 foram priorizados.
- Prevenção de erros em ações irreversíveis (apagar conversa, excluir registro) com diálogo que nomeia o que será perdido.
- Erros dizem o que aconteceu e o que fazer ("Seus registros estão seguros. Verifique a conexão") em vez de culpar o usuário.
- Duas iterações: a v2 corrigiu os problemas da avaliação; a revisão da v2 gerou a v3, que tirou excessos (cadeados, SOS global, cards com cara de botão) e preservou a identidade visual. O smoke test e os prints refeitos pegaram 4 regressões antes da entrega.

#### Arquitetura da informação

- Botão de pânico em todas as telas de Saúde Mental: quem está em sofrimento emocional tende a estar nessa área, e a ajuda fica a 1 toque sem alarmar quem só lê sobre oncologia.
- Rótulos na linguagem do usuário ("Seus direitos", "Para cuidadores"), e gates que explicam o benefício antes de pedir login.
- Navegação (linhas de lista com chevron) visualmente separada de ação (botões).
- Agrupamento por objetivo no Meu Perfil ("Minha jornada" e "Apoio").

#### Público vulnerável

- Tom acolhedor nos textos de erro e de vazio; o aviso dos contatos de emergência deixou de dizer "Trote é crime" e passou a orientar ("Em risco de vida, ligue 192").
- O modal de login não insiste: "Agora não" é lembrado. O mascote declara que não substitui a equipe de saúde.
- Densidade baixa: um tema por card, subtítulo curto e ações primárias de largura total.

## 8. Checklist da rubrica

| Bloco (peso) | Requisito | Onde está comprovado |
|---|---|---|
| Telas (30%) | 5 a 10 telas-chave com transições | Seção 1 (10 telas); prints da seção 9 |
| Telas (30%) | Estados de botão default / pressed / focus | Button.tsx; /design-system → Button (4 variantes × 5 estados) |
| Telas (30%) | Carregando, sucesso, erro e vazio | useAsyncResource.ts; States.tsx; prints 17–22 e 24; painel de simulação |
| Telas (30%) | Nenhum erro de fluxo / beco sem saída | scripts/smoke-flow.mjs na v3: 8/8 passos no Expo Web, sem erros de página; P02, P04, P14 e P21 corrigidos |
| DS (20%) | Tokens com contraste ≥ 4.5:1 | tokens.ts; check-contrast.ts (25/25 na v3) + 6 combinações dos componentes restaurados; seção 2 |
| DS (20%) | Tipografia sem serifa e espaçamento padronizado | Montserrat carregada; escala de 8; check-hardcoded.ts: 0 ocorrências na v2, 49 na v3 restritas aos componentes restaurados (PD-02) |
| DS (20%) | Toque ≥ 44×44 e labels visíveis | touch.min/comfortable; TextField; labels em Login, Cadastro, Diário, busca |
| Heurísticas (25%) | Avaliação pelas 10 heurísticas | Seção 4 (21 problemas, cobertura H1–H10) |
| Heurísticas (25%) | Think Aloud com 2–3 usuários | Seção 6 (TCLE, roteiro, 5 tarefas, ficha, SUS); resultados a preencher |
| Heurísticas (25%) | Matriz de iteração | Seção 5 (v1 → v2), 5.1 (Iteração 2, v2 → v3) e 5.2 (pendências); tags ux-av2-v1, v2 e v3 |
| AI (15%) | Menus claros, rótulos, organização lógica | Seção 3 (sitemap, rótulos, posição do botão de pânico) |
| Apresentação (10%) | Justificativa embasada | Seção 7 (roteiro de fala) |

## 9. Prints antes / depois

Capturados automaticamente (apps/mobile/scripts/capture-screens.mjs, Expo Web + Playwright, 390×844). "Antes" é a v1 e "depois" é a versão atual (v3). No web, o fundo das telas sai cinza claro em vez do gradiente lilás do app nativo.

| Início com modal de login: antes | Início com modal de login: depois | Login: antes | Login: depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/01-inicio-modal.png" width="160"> | <img src="av2/prints/depois/01-inicio-modal.png" width="160"> | <img src="av2/prints/antes/02-login.png" width="160"> | <img src="av2/prints/depois/02-login.png" width="160"> |

| Início (logado): antes | Início (logado): depois | Oncologia: antes | Oncologia: depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/03-inicio.png" width="160"> | <img src="av2/prints/depois/03-inicio.png" width="160"> | <img src="av2/prints/antes/04-oncologia.png" width="160"> | <img src="av2/prints/depois/04-oncologia.png" width="160"> |

| Lazer: antes | Lazer: depois | Saúde Mental: antes | Saúde Mental: depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/05-lazer.png" width="160"> | <img src="av2/prints/depois/05-lazer.png" width="160"> | <img src="av2/prints/antes/08-saude-mental.png" width="160"> | <img src="av2/prints/depois/08-saude-mental.png" width="160"> |

| Contatos de emergência: antes | Contatos de emergência: depois | Mascote sem login: antes | Mascote sem login: depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/09-contatos-emergencia.png" width="160"> | <img src="av2/prints/depois/09-contatos-emergencia.png" width="160"> | <img src="av2/prints/antes/10-mascote-gate.png" width="160"> | <img src="av2/prints/depois/10-mascote-gate.png" width="160"> |

| Chat do mascote: antes | Chat do mascote: depois | Meu Perfil (Hub): antes | Meu Perfil (Hub): depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/11-mascote-chat.png" width="160"> | <img src="av2/prints/depois/11-mascote-chat.png" width="160"> | <img src="av2/prints/antes/12-perfil-hub.png" width="160"> | <img src="av2/prints/depois/12-perfil-hub.png" width="160"> |

| Diário: antes | Diário: depois | Livros: antes | Livros: depois |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/antes/13-diario.png" width="160"> | <img src="av2/prints/depois/13-diario.png" width="160"> | <img src="av2/prints/antes/06-livros.png" width="160"> | <img src="av2/prints/depois/06-livros.png" width="160"> |

### Iteração 2: v2 → v3

| Início: v2 | Início: v3 | Oncologia: v2 | Oncologia: v3 |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/v2/03-inicio.png" width="160"> | <img src="av2/prints/depois/03-inicio.png" width="160"> | <img src="av2/prints/v2/04-oncologia.png" width="160"> | <img src="av2/prints/depois/04-oncologia.png" width="160"> |

| Lazer: v2 | Lazer: v3 | Saúde Mental: v2 | Saúde Mental: v3 |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/v2/05-lazer.png" width="160"> | <img src="av2/prints/depois/05-lazer.png" width="160"> | <img src="av2/prints/v2/08-saude-mental.png" width="160"> | <img src="av2/prints/depois/08-saude-mental.png" width="160"> |

| Mascote sem login: v2 | Mascote sem login: v3 | Meu Perfil (Hub): v2 | Meu Perfil (Hub): v3 |
|:---:|:---:|:---:|:---:|
| <img src="av2/prints/v2/10-mascote-gate.png" width="160"> | <img src="av2/prints/depois/10-mascote-gate.png" width="160"> | <img src="av2/prints/v2/12-perfil-hub.png" width="160"> | <img src="av2/prints/depois/12-perfil-hub.png" width="160"> |

### Estados de interface e novas telas (v3) · evidências de falha da v1

| Carregando (Lazer) | Erro (Livros) | Vazio (Diário) | Erro de validação | Erro (Chat) |
|:---:|:---:|:---:|:---:|:---:|
| <img src="av2/prints/depois/17-estado-carregando-lazer.png" width="160"> | <img src="av2/prints/depois/18-estado-erro-livros.png" width="160"> | <img src="av2/prints/depois/19-estado-vazio-diario.png" width="160"> | <img src="av2/prints/depois/21-login-erro-validacao.png" width="160"> | <img src="av2/prints/depois/20-estado-erro-chat.png" width="160"> |

| Painel de simulação | Tela /design-system | Detalhe do livro | Erro (Lazer, v3) | Início sem login |
|:---:|:---:|:---:|:---:|:---:|
| <img src="av2/prints/depois/22-painel-estados.png" width="160"> | <img src="av2/prints/depois/15-design-system.png" width="160"> | <img src="av2/prints/depois/16-livro-detalhe.png" width="160"> | <img src="av2/prints/depois/24-estado-erro-lazer.png" width="160"> | <img src="av2/prints/depois/23-home-deslogado.png" width="160"> |

| v1 · Lazer: seções vazias sem aviso (P08) | v1 · Livros: "nenhum livro" no erro (P09) | v1 · Diário: erro + "nenhuma entrada" (P10) |
|:---:|:---:|:---:|
| <img src="av2/prints/antes/evid-lazer-api-falhando.png" width="160"> | <img src="av2/prints/antes/evid-livros-api-falhando.png" width="160"> | <img src="av2/prints/antes/evid-diario-api-falhando.png" width="160"> |
