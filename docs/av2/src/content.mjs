// Conteúdo do documento da AV2 (UX). Fonte única para docs/av2-oncomente.md e .docx.
// Blocos: h1, h2, h3, p, bullets, table {cols:[{h,w}], rows, size?}, images {cols, items:[{src, caption}]}, pagebreak, code.
import fs from 'node:fs';
import { HEURISTICAS, SEVERIDADE, problemas } from './problemas.mjs';

const read = (f) => JSON.parse(fs.readFileSync(new URL(f, import.meta.url), 'utf8'));
const contrastV1 = read('./contrast-v1.json');
const contrastV2 = read('./contrast-v2.json'); // tokens inalterados na v3: mesmos 25 pares

const V1 = '92e5d3c';
const V2 = 'a11b51d';
const V3 = '6cf7d36';
const hName = (codes) => codes.map((c) => `${c} ${HEURISTICAS[c]}`).join('; ');
const sevLabel = (s) => `${s} (${SEVERIDADE[s]})`;
const ratio = (r) => `${r.toFixed(2)}:1`;

// ─── Distribuição por heurística ──────────────────────────────────────────
const porHeuristica = Object.keys(HEURISTICAS).map((h) => {
  const itens = problemas.filter((p) => p.h.includes(h));
  return [h, HEURISTICAS[h], String(itens.length), itens.map((p) => p.id).join(', ') || '—'];
});
const porSeveridade = [4, 3, 2, 1].map((s) => [sevLabel(s), String(problemas.filter((p) => p.sev === s).length)]);

const fluxo = [
  ['1', 'Início + modal de login suave', '/', 'Modal com "Agora não" (lembrado na próxima visita); grade 2×2 com as quatro áreas; Mensagem do Dia', 'Default, pressed nos cards'],
  ['2', 'Login', '/LoginScreen', 'Labels visíveis; erro de validação ao tocar em Entrar vazio; loading no botão; toast de boas-vindas', 'Erro, carregando, sucesso'],
  ['3', 'Oncologia', '/Oncology', 'Lista com ícone, subtítulo e chevron por tema; seção "Seus direitos"', 'Pressed nas linhas'],
  ['4', 'Lazer', '/Oncology/Leisure', 'Skeleton → carrosséis de atividades, livros, filmes e séries; erro com "Tentar novamente"', 'Carregando, sucesso, erro, vazio'],
  ['5', 'Livros → detalhe do livro', '/Oncology/Leisure/Books', 'Busca com label; "nenhum resultado" com "Limpar busca"; detalhe com seta voltar visível', 'Todos + busca vazia'],
  ['6', 'Saúde Mental', '/MentalHealth', 'Motivação para pacientes e para cuidadores; práticas para ansiedade', 'Pressed'],
  ['7', 'Contatos de emergência', 'botão de pânico (Saúde Mental)', 'Botão flutuante em todas as telas de Saúde Mental; card expande e liga', 'Expandido, pressed'],
  ['8', 'Mascote (gate → chat)', '/Mascot/Chat', 'Sem login: gate com benefícios e "Entrar". Logado: faixa de escopo e limite; sugestões; "escrevendo…"; erro com "Tentar de novo"; limpar com confirmação', 'Vazio, carregando, sucesso, erro'],
  ['9', 'Meu Perfil (Hub)', '/PersonalArea/Hub', 'Agrupamento "Minha jornada" / "Apoio"; configurações', 'Pressed'],
  ['10', 'Diário → novo registro', '/PersonalArea/Diary', 'Vazio → criar registro → toast → lista; excluir com confirmação', 'Vazio, carregando, sucesso, erro'],
];

const paresTabela = (pares) => pares.map((p) => [p.uso, p.fg, p.bg, ratio(p.ratio), p.ok ? 'Aprovado' : 'Reprovado']);

const printsPares = [
  ['01-inicio-modal', 'Início com modal de login'],
  ['02-login', 'Login'],
  ['03-inicio', 'Início (logado)'],
  ['04-oncologia', 'Oncologia'],
  ['05-lazer', 'Lazer'],
  ['08-saude-mental', 'Saúde Mental'],
  ['09-contatos-emergencia', 'Contatos de emergência'],
  ['10-mascote-gate', 'Mascote sem login'],
  ['11-mascote-chat', 'Chat do mascote'],
  ['12-perfil-hub', 'Meu Perfil (Hub)'],
  ['13-diario', 'Diário'],
  ['06-livros', 'Livros'],
];

// Telas que mudaram na Iteração 2 (v2 → v3).
const printsIteracao2 = [
  ['03-inicio', 'Início'],
  ['04-oncologia', 'Oncologia'],
  ['05-lazer', 'Lazer'],
  ['08-saude-mental', 'Saúde Mental'],
  ['10-mascote-gate', 'Mascote sem login'],
  ['12-perfil-hub', 'Meu Perfil (Hub)'],
];

const iteracao2 = [
  ['I2-01', 'Cadeados removidos das abas, da grade do Início, dos cards e do gate', 'Na revisão, a equipe avaliou o cadeado como ruído visual que repetia o que o gate já explica e dava às áreas pessoais um tom de "proibido".', 'H8', 'e62bb2b'],
  ['I2-02', 'SOS global (vermelho, em todas as abas) trocado pelo botão de pânico original, só nas telas de Saúde Mental', 'O botão vermelho fixo competia com o conteúdo de oncologia e podia alarmar quem só lia sobre nutrição ou direitos. O recurso de crise fica na área de apoio emocional, em todas as subtelas (na v1 ficava só no índice). Custo: 2 toques a partir do Início.', 'H8, H7', 'a22582f'],
  ['I2-03', 'Header opaco e fixo, com o conteúdo sempre abaixo dele', 'Com o header transparente, cada tela precisava compensar a altura dele à mão, e títulos e banners ficavam por baixo do texto do header quando a compensação falhava. Agora o layout é responsabilidade do navegador de telas.', 'H8, H4', '7776fda, c614115, b1099f5, a9acf5a'],
  ['I2-04', 'Conteúdo rolável recortado nas bordas arredondadas do card', 'O scroll vazava pelos cantos do container.', 'H8', '96a875b'],
  ['I2-05', 'Início restaurado ao layout original, com o botão "Sobre" opaco e a Mensagem do Dia refinada', 'Decisão da equipe de preservar a identidade visual original da tela inicial (saudação, mascote, grade 2×2 ilustrada). Só o contraste do "Sobre" e a legibilidade da Mensagem do Dia foram melhorados.', 'H8', 'd55008a, 8823ee4, 455a398'],
  ['I2-06', 'Gate de login sem "Continuar sem conta", com mascote maior e rolagem só quando não cabe', 'O botão repetia a saída que a barra de abas já oferece e alongava a tela.', 'H8', 'e10b918, 0cf9629'],
  ['I2-07', 'Formulários de login e cadastro sem rolagem quando cabem na tela; teclado não cobre o campo em foco', 'Rolagem desnecessária em formulários curtos e campos escondidos pelo teclado (Tratamento, Onboarding, Senha, Chat).', 'H5, H8', '3099973, b9fd13d'],
  ['I2-08', 'Tópicos de Oncologia, Saúde Mental e Meu Perfil como linhas de lista (sem sombra, borda ou escala ao toque)', 'Cards com sombra e escala pareciam botões de ação. Linhas de lista com chevron indicam navegação.', 'H4', '4571c43'],
  ['I2-09', 'Lazer restaurado ao layout original (banner, título e quatro carrosséis)', 'Decisão da equipe de preservar a visibilidade das capas no carrossel original.', 'H8', '3b62e44'],
  ['I2-10', 'Texto "lorem ipsum" removido da tela de autenticação', 'Texto de preenchimento visível ao usuário.', 'H8', 'dcc3926'],
  ['I2-11', 'Regressões da restauração corrigidas sem mudar o layout: logo legível (P05), "Agora não" lembrado (P16), grade do Início no web (P02) e estados de erro e vazio no Lazer (P08)', 'Detectadas ao refazer prints e smoke test da v3: a restauração tinha trazido de volta 4 problemas da avaliação heurística.', 'H1, H3, H9', '70b61b6, d74772e, 6cf7d36, bc7e947'],
];

const pendencias = [
  ['PD-01', 'Título das capas nos carrosséis do Lazer em 10 px, abaixo do menor tamanho da escala (caption 13)', 'H8 / WCAG 1.4.4', '1', 'RecomendationPager.tsx'],
  ['PD-02', '49 valores literais (cor e tamanho) fora dos tokens nos componentes restaurados', 'H4', '1', 'Home e Lazer (6 componentes)'],
  ['PD-03', 'O botão de pânico é só um ícone "!", sem rótulo visível. Leitores de tela leem o nome acessível, mas quem enxerga depende de reconhecer o ícone', 'H6', '2', 'PanicButton.tsx'],
  ['PD-04', 'Header nativo, teclado e posição do botão de pânico ainda não validados em aparelho Android/iOS (prints e smoke test são do Expo Web)', '—', '—', 'Teste em dispositivo'],
];

const printsEstados = [
  ['17-estado-carregando-lazer', 'Carregando (Lazer)'],
  ['18-estado-erro-livros', 'Erro (Livros)'],
  ['19-estado-vazio-diario', 'Vazio (Diário)'],
  ['21-login-erro-validacao', 'Erro de validação'],
  ['20-estado-erro-chat', 'Erro (Chat)'],
  ['22-painel-estados', 'Painel de simulação'],
  ['15-design-system', 'Tela /design-system'],
  ['16-livro-detalhe', 'Detalhe do livro'],
  ['24-estado-erro-lazer', 'Erro (Lazer, v3)'],
  ['23-home-deslogado', 'Início sem login'],
];

export const doc = {
  title: 'OncoMente: 2ª Avaliação de UX',
  subtitle: 'Avaliação heurística, design system, arquitetura da informação e protocolo Think Aloud do app móvel',
  meta: `Branch ux-av2 · v1 = commit ${V1} (tag ux-av2-v1) · v2 = commit ${V2} (tag ux-av2-v2) · v3 (atual) = commit ${V3} (tag ux-av2-v3)`,
  blocks: [
    // ─── 1 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '1. Introdução e fluxo-roteiro' },
    { type: 'p', text: 'O OncoMente apoia pacientes oncológicos de todas as idades e seus cuidadores em saúde mental, adesão ao tratamento e combate ao estigma. O protótipo avaliado é o próprio app (React Native + Expo Router), rodando contra a API NestJS com dados semeados. Como o público costuma estar cansado, ansioso ou em sofrimento, as decisões priorizaram linguagem acolhedora, baixa densidade de informação e poucos toques até o que importa.' },
    { type: 'p', text: 'Método: (1) baseline da v1 com prints; (2) avaliação heurística das 10 heurísticas de Nielsen, tela a tela; (3) design system com tokens verificados por script; (4) correções e microinterações (v2); (5) revisão da v2 pela equipe e segunda iteração (v3), com smoke test e prints refeitos para detectar regressões; (6) protocolo Think Aloud para 2 ou 3 participantes, com os resultados incorporados à matriz de iteração depois das sessões.' },
    { type: 'h2', text: 'Fluxo-roteiro da gravação (10 telas)' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: '#', w: 3 }, { h: 'Tela', w: 17 }, { h: 'Rota', w: 17 }, { h: 'O que mostrar', w: 43 }, { h: 'Estados', w: 20 }],
      rows: fluxo,
    },
    { type: 'p', text: 'Como forçar estados na gravação: abra a rota /design-system (no web, localhost:8081/design-system; no app, o deep link cancerhealthcareapp://design-system) → "Simulação de estados" → ligue "Mostrar painel discreto". Um ponto no canto superior esquerdo abre o painel (Real, Carregando, Sucesso, Erro, Vazio), que vale para Lazer, Livros, detalhe do livro, Diário e Chat. "Desligar painel" volta ao comportamento real. Usuário de teste: demo.ux@oncomente.com.' },

    // ─── 2 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '2. Design system' },
    { type: 'p', text: 'Os tokens ficam em apps/mobile/src/constants/tokens.ts (arquivo sem dependência de React Native, lido também pelos scripts). Colors.ts e styles/global.ts passaram a derivar dos tokens, então as telas legadas herdam as correções de cor sem edição.' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: 'Categoria', w: 16 }, { h: 'Tokens', w: 54 }, { h: 'Decisão', w: 30 }],
      rows: [
        ['Cor (semântica)', 'text.primary #1A1A1A · text.secondary #575760 · text.brand #4E56C0 · action.primary #7A3FC4 · action.danger #B3261E · bg.surface/subtle/brandSubtle · border.*', '#9B5DE0 (identidade) fica como acento; ações usam #7A3FC4, da mesma matiz'],
        ['Tipografia', 'Montserrat 400/600/700: display 28/34 · title 22/28 · subtitle 18/24 · body 16/24 · small 14/20 · caption 13/18 · tabLabel 11/14', 'Sem serifa; corpo mínimo de 16 para leitura com fadiga'],
        ['Espaçamento', 'xxs 4 · xs 8 · sm 16 · md 24 · lg 32 · xl 48', 'Escala de 8 (4 só para ajuste fino)'],
        ['Raio / sombra', 'radius sm 8 · md 12 · lg 16 · xl 24 · pill · shadow sm/md', 'Superfícies suaves, coerentes com o tom acolhedor'],
        ['Toque', 'touch.min 44 · touch.comfortable 48 · focusRing 3', 'Alvos ≥ 44×44 (WCAG 2.5.5); botões com 48 de altura'],
      ],
    },
    { type: 'h2', text: 'Componentes e estados' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: 'Componente', w: 18 }, { h: 'Estados / variantes', w: 42 }, { h: 'Acessibilidade', w: 40 }],
      rows: [
        ['Button', 'primary, secondary, ghost, danger × default, pressed, focus, disabled, loading', 'role button, accessibilityState (disabled/busy), altura 48, spinner na cor do texto'],
        ['TextField', 'default, focus, preenchido, erro, disabled, senha, multilinha', 'Label sempre visível, erro com ícone e live region, botão olho com label'],
        ['Card / NavItemCard', 'Card: estático ou pressionável. NavItemCard: linha de lista com ícone, subtítulo, chevron e divisória (sem sombra nem escala), pressed', 'Nome acessível = título + subtítulo; alvo ≥ 64'],
        ['Header', 'tela / seção, com ação "Ver todos"', 'role header; ação com hitSlop'],
        ['Toast', 'sucesso, erro, info', 'role alert + live region; não bloqueante'],
        ['Skeleton / LoadingState', 'lista, grade, carrossel', 'role progressbar + anúncio "Carregando…"'],
        ['EmptyState / ErrorState', 'com/sem ação; "Tentar novamente"', 'ErrorState com role alert'],
        ['ConfirmDialog, PanicButton', 'destrutivo / padrão; botão de pânico flutuante default/pressed', 'ConfirmDialog funciona no web (Alert.alert não mostra botões); PanicButton com nome acessível'],
      ],
    },
    { type: 'p', text: 'Tudo isso pode ser visto na rota /design-system (fora da navegação; acessada por URL ou deep link), que exibe cores com a razão de contraste ao lado, tipografia, espaçamento, raios, sombras e todos os componentes em todos os estados.' },
    { type: 'h2', text: 'Tabela de contraste (WCAG 2.x, mínimo 4.5:1)' },
    { type: 'p', text: `Script: npx tsx apps/mobile/scripts/check-contrast.ts. Ele calcula (L1 + 0.05) / (L2 + 0.05) para todos os pares registrados em tokens.ts e falha se algum ficar abaixo de 4.5:1. Resultado na v1: ${contrastV1.filter((r) => !r.ok).length} de ${contrastV1.length} pares reprovados. Na v2: ${contrastV2.filter((r) => r.ok).length} de ${contrastV2.length} aprovados. A v3 não alterou tokens e repete o resultado (${contrastV2.length}/${contrastV2.length}, verificado no commit ${V3}).` },
    { type: 'h3', text: 'v1 (antes)' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Uso', w: 48 }, { h: 'Texto', w: 12 }, { h: 'Fundo', w: 12 }, { h: 'Razão', w: 12 }, { h: 'AA', w: 16 }],
      rows: paresTabela(contrastV1),
    },
    { type: 'h3', text: 'v2 e v3 (depois)' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Uso', w: 48 }, { h: 'Texto', w: 12 }, { h: 'Fundo', w: 12 }, { h: 'Razão', w: 12 }, { h: 'AA', w: 16 }],
      rows: paresTabela(contrastV2),
    },
    { type: 'p', text: 'Os componentes da Home e do Lazer restaurados na Iteração 2 usam cores do Colors.ts e alguns valores literais. As combinações de cor deles foram medidas à parte:' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Uso (componente restaurado)', w: 48 }, { h: 'Texto', w: 12 }, { h: 'Fundo', w: 12 }, { h: 'Razão', w: 12 }, { h: 'AA', w: 16 }],
      rows: [
        ['Logo ONCOMENTE (HeaderLogo)', '#4E56C0', '#FFFFFF', '6.15:1', 'Aprovado'],
        ['Rótulo dos cards da grade do Início', '#1A1A1A', '#FFFFFF', '17.40:1', 'Aprovado'],
        ['Título da Mensagem do Dia', '#4E56C0', '#E6FBF5', '5.70:1', 'Aprovado'],
        ['Botão "Sobre o OncoMente"', '#7A3FC4', '#FFFFFF', '6.30:1', 'Aprovado'],
        ['Título de seção do carrossel (PagerHeader)', '#4E56C0', '#FFFFFF', '6.15:1', 'Aprovado'],
        ['Título sobre capa (scrim 58% no pior caso)', '#FFFFFF', '#6B6B6B', '5.33:1', 'Aprovado'],
      ],
    },
    { type: 'p', text: 'Complemento: scripts/check-hardcoded.ts varre as telas do fluxo e os componentes do DS e falha se encontrar cor literal ou tamanho literal (fontSize, padding, margin, gap, raio, borda, size={n}) fora dos tokens. Resultado da v2: 0 ocorrências. Na v3 ele aponta 49 ocorrências, todas nos 6 componentes restaurados da versão original (HelloMessage, HeaderLogo, HomeNavigationGrid, DailyMessage, PagerHeader e RecomendationPager). Elas ficam registradas como pendência na seção 5.2, porque migrar esses arquivos para tokens mudaria o visual que a equipe decidiu manter.' },

    // ─── 3 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '3. Arquitetura da informação' },
    { type: 'h2', text: 'Sitemap atual (v3)' },
    {
      type: 'code',
      text: [
        'Início ─ saudação · grade 2×2 (Oncologia, Saúde Mental, Mascote Virtual, Meu Perfil) · Mensagem do Dia · Sobre',
        '├─ Oncologia (pública)',
        '│  ├─ Autocuidado e tratamento: Sono · Exercícios físicos · Nutrição · Espiritualidade · Lazer',
        '│  │                            Lazer → Atividades · Livros · Filmes · Séries → detalhe',
        '│  └─ Seus direitos: Direitos do paciente (Lei dos 60 dias, FGTS, auxílio-doença, IR)',
        '├─ Saúde Mental (pública)',
        '│  ├─ Motivação: Para pacientes · Para cuidadores',
        '│  ├─ Cuidar da mente: Respiração · Meditação guiada · Apoio psicológico',
        '│  └─ Botão de pânico (flutuante em todas as telas da área) → Contatos de emergência',
        '│     (CVV 188, SAMU 192, CAVIDA, Disque Saúde 136)',
        '├─ Mascote (pede login) → Chat (escopo, sugestões, limite diário)',
        '└─ Meu Perfil (pede login) → Minha jornada (Diário, Tratamentos, Calendário) · Apoio (Sofreu discriminação?, Sobre) · Configurações',
      ].join('\n'),
    },
    { type: 'h2', text: 'Mudanças de rótulo, agrupamento e profundidade' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: 'Antes (v1)', w: 28 }, { h: 'Depois (v3, atual)', w: 28 }, { h: 'Motivo', w: 44 }],
      rows: [
        ['Botão de pânico "!" só na home de Saúde Mental: some nas subtelas e não tem nome acessível', 'Botão de pânico em todas as telas de Saúde Mental (oculto só na própria lista), com nome acessível', 'A ajuda fica a 1 toque em toda a área onde a pessoa busca apoio emocional, sem um botão vermelho competindo com o conteúdo de oncologia (P01, I2-02)'],
        ['Seção "Benefícios Legais" com o card "Lei dos 60 dias" → tela com 4 direitos', 'Seção "Seus direitos" → "Direitos do paciente" + subtítulo com os direitos', 'O rótulo prometia uma única lei; nomes diferentes para a mesma coisa (P11)'],
        ['Motivacional: anônimo só via "Paciente"', '"Para pacientes" e "Para cuidadores" sempre visíveis, ordenados pelo papel', 'Cuidador é público-alvo e o conteúdo é público (P13)'],
        ['Gate "É necessário autenticação" com botões quebrando o texto', 'Gate que explica o que a área oferece, com "Entrar" e "Criar conta grátis" em largura total', 'A pessoa entende por que criar conta antes de ser cobrada, sem jargão (P14, I2-01, I2-06)'],
        ['Aba "Mascote Virtual" truncada', 'Aba "Mascote"; rótulos quebram em 2 linhas em vez de truncar', 'Legibilidade em 390 px (P15)'],
        ['Hub com 5 cards de cores livres, sem grupos', '"Minha jornada" (Diário, Tratamentos, Calendário) e "Apoio", em linhas de lista', 'Agrupamento por objetivo reduz a varredura'],
        ['Tópicos em cards com sombra, parecidos com botões', 'Tópicos como linhas de lista com ícone, subtítulo e chevron', 'Separa visualmente navegação (lista) de ação (botão) (I2-08)'],
        ['Ícones repetidos entre tópicos', 'Um ícone por tópico + subtítulo descritivo', 'Reconhecimento em vez de memorização (P12)'],
      ],
    },

    // ─── 4 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '4. Avaliação heurística (v1)' },
    { type: 'p', text: `Inspeção tela a tela da v1 (commit ${V1}) pelas 10 heurísticas de Nielsen, com evidência no código (arquivo:linha) e em prints do Expo Web a 390×844. Severidade na escala 0–4 de Nielsen. Foram ${problemas.length} problemas, ${problemas.filter((p) => p.ia).length} deles de arquitetura da informação (marcados com AI).` },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'ID', w: 5 }, { h: 'Tela', w: 13 }, { h: 'Problema', w: 40 }, { h: 'Heurística', w: 15 }, { h: 'Sev.', w: 5 }, { h: 'Evidência', w: 22 }],
      rows: problemas.map((p) => [p.id + (p.ia ? ' (AI)' : ''), p.tela, p.problema, hName(p.h), String(p.sev), p.evidencia]),
    },
    { type: 'h3', text: 'Cobertura' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Heur.', w: 8 }, { h: 'Nome', w: 50 }, { h: 'Qtd.', w: 8 }, { h: 'Problemas', w: 34 }],
      rows: porHeuristica,
    },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Severidade', w: 70 }, { h: 'Qtd.', w: 30 }],
      rows: porSeveridade,
    },

    // ─── 5 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '5. Matriz de iteração' },
    { type: 'p', text: `Cada problema da avaliação heurística recebeu uma correção na v2 (commit ${V2}, tag ux-av2-v2). A coluna "Correção aplicada" mostra o estado atual (v3, commit ${V3}, tag ux-av2-v3). "Corrigido (v3)" indica que a Iteração 2 mexeu na correção ou a reaplicou; "Revisado (v3)" indica que a solução mudou de forma, com o motivo na seção 5.1. As linhas TA-xx ficam reservadas para os achados do Think Aloud, a preencher depois das sessões.` },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'ID', w: 5 }, { h: 'Problema', w: 23 }, { h: 'Heurística', w: 11 }, { h: 'Sev.', w: 5 }, { h: 'Correção aplicada', w: 32 }, { h: 'Tela / componente', w: 15 }, { h: 'Status', w: 9 }],
      rows: [
        ...problemas.map((p) => [p.id, p.problema.split('. ')[0] + '.', p.h.join(', '), String(p.sev), p.v3 ?? p.correcao, p.ondeV3 ?? p.onde, p.status ?? 'Corrigido (v2)']),
        ['TA-01', '', '', '', '', '', 'A preencher'],
        ['TA-02', '', '', '', '', '', 'A preencher'],
        ['TA-03', '', '', '', '', '', 'A preencher'],
      ],
    },
    { type: 'h2', text: '5.1 Iteração 2 (v2 → v3)' },
    { type: 'p', text: 'A equipe revisou a v2 navegando pelo app e identificou mudanças que acrescentavam ruído ou se afastavam da identidade visual do produto. A revisão levou a uma segunda iteração. Depois dela, prints e smoke test foram refeitos, e as 4 regressões que apareceram foram corrigidas (I2-11).' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'ID', w: 6 }, { h: 'Mudança', w: 30 }, { h: 'Motivo', w: 40 }, { h: 'Heur.', w: 8 }, { h: 'Commits', w: 16 }],
      rows: iteracao2,
    },
    { type: 'h2', text: '5.2 Pendências conhecidas (v3)' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'ID', w: 7 }, { h: 'Pendência', w: 53 }, { h: 'Heurística', w: 14 }, { h: 'Sev.', w: 6 }, { h: 'Onde', w: 20 }],
      rows: pendencias,
    },

    // ─── 6 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '6. Protocolo Think Aloud' },
    { type: 'p', text: 'Aplicação: 2 ou 3 participantes, de preferência um paciente ou ex-paciente e um cuidador. Sessões individuais de 20 a 30 minutos, presenciais, com o app na versão atual (v3) em celular ou navegador (390×844) e o usuário de teste já criado. Gravar só a tela e o áudio, com autorização. O moderador não ajuda: se a pessoa travar por mais de 2 minutos, registra falha e segue para a próxima tarefa.' },
    { type: 'h2', text: 'Termo de consentimento' },
    { type: 'p', text: 'Eu, ______________________________________, concordo em participar voluntariamente do teste de usabilidade do aplicativo OncoMente, realizado por ______________________ na disciplina de UX do curso ____________________. Entendo que: (1) quem está sendo avaliado é o aplicativo, não eu; (2) vou pensar em voz alta enquanto realizo tarefas; (3) a tela e o áudio serão gravados apenas para análise acadêmica, sem divulgação do meu nome ou imagem; (4) posso interromper a qualquer momento, sem prejuízo; (5) não preciso compartilhar informações pessoais de saúde, pois as tarefas usam uma conta de teste.' },
    { type: 'p', text: 'Assinatura: ______________________________   Data: ___/___/______   Autorizo gravação de áudio: (  ) sim  (  ) não' },
    { type: 'h2', text: 'Roteiro de introdução (ler para o participante)' },
    {
      type: 'bullets', items: [
        '"Obrigado por ajudar. Este é o OncoMente, um app de apoio para quem enfrenta o câncer e para quem cuida."',
        '"Vou pedir algumas tarefas. Não existe resposta certa: se algo for difícil, a falha é do app, e é isso que queremos descobrir."',
        '"Pense em voz alta: diga o que está procurando, o que espera que aconteça e o que achou estranho."',
        '"Eu não vou poder ajudar durante as tarefas, mas você pode desistir de qualquer uma quando quiser."',
        'Treino (30 s): "Na tela inicial, diga em voz alta o que você acha que cada cartão faz."',
      ],
    },
    { type: 'h2', text: 'Tarefas e critérios de sucesso' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: 'Tarefa', w: 6 }, { h: 'Enunciado (ler)', w: 38 }, { h: 'Caminho esperado', w: 28 }, { h: 'Sucesso se…', w: 28 }],
      rows: [
        ['T1', '"Você está muito ansioso(a) e quer falar com alguém agora. Encontre um número para ligar."', 'Saúde Mental → botão de pânico (!) → Contatos de emergência → expandir CVV/SAMU', 'Chega aos contatos em até 45 s e identifica o número sem ajuda (observar se reconhece o "!")'],
        ['T2', '"Você quer ler algo leve. Encontre um livro recomendado e descubra onde encontrá-lo."', 'Oncologia → Lazer → "Livros recomendados" (seta) → livro', 'Abre o detalhe de um livro e lê "Onde encontrar" em até 2 min'],
        ['T3', '"Descubra se a lei garante um prazo para começar o tratamento."', 'Oncologia → Direitos do paciente', 'Encontra e cita o prazo de 60 dias em até 2 min'],
        ['T4', '"Entre na sua conta (dados no cartão) e registre no diário como foi o seu dia."', 'Meu Perfil → Entrar → Diário → Registrar meu dia → Salvar', 'Registro salvo (toast) e visível na lista em até 3 min'],
        ['T5', '"Pergunte ao mascote algo sobre enjoo durante o tratamento."', 'Mascote → digitar ou tocar na sugestão → enviar', 'Envia a pergunta e lê a resposta em até 2 min'],
      ],
    },
    { type: 'h2', text: 'Ficha de observação: participante ___' },
    { type: 'p', text: 'Perfil: (  ) paciente  (  ) ex-paciente  (  ) cuidador(a)  (  ) outro: ________   Faixa etária: ______   Uso de celular: (  ) pouco  (  ) médio  (  ) muito   Data: ___/___   Dispositivo: ____________' },
    {
      type: 'table', size: 'sm', rowHeight: 1100,
      cols: [{ h: 'Tarefa', w: 7 }, { h: 'Tempo', w: 9 }, { h: 'Resultado (S / P / F)', w: 12 }, { h: 'Falas relevantes (literais)', w: 34 }, { h: 'Pontos de travamento / erros', w: 26 }, { h: 'Heur.', w: 12 }],
      rows: ['T1', 'T2', 'T3', 'T4', 'T5'].map((t) => [t, '', '', '', '', '']),
    },
    { type: 'p', text: 'S = sucesso sem ajuda · P = sucesso parcial ou com desvio · F = falha ou desistência. Observações gerais: ________________________________________________________________________________' },
    { type: 'h2', text: 'Questionário SUS (System Usability Scale)' },
    { type: 'p', text: 'Marque de 1 (discordo totalmente) a 5 (concordo totalmente).' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: '#', w: 5 }, { h: 'Afirmação', w: 65 }, { h: '1', w: 6 }, { h: '2', w: 6 }, { h: '3', w: 6 }, { h: '4', w: 6 }, { h: '5', w: 6 }],
      rows: [
        'Eu acho que gostaria de usar este app com frequência.',
        'Achei o app desnecessariamente complexo.',
        'Achei o app fácil de usar.',
        'Acho que precisaria de ajuda de uma pessoa para conseguir usar o app.',
        'As funções do app estão bem integradas.',
        'Achei que o app tem muitas inconsistências.',
        'Imagino que a maioria das pessoas aprenderia a usar o app rapidamente.',
        'Achei o app muito trabalhoso de usar.',
        'Eu me senti confiante usando o app.',
        'Precisei aprender muitas coisas antes de conseguir usar o app.',
      ].map((t, i) => [String(i + 1), t, '', '', '', '', '']),
    },
    { type: 'p', text: 'Cálculo: itens ímpares = nota − 1; itens pares = 5 − nota; soma × 2,5 = SUS (0–100). Referência: 68 = média. Escore do participante: ______' },
    { type: 'h2', text: 'Consolidação (preencher depois das sessões)' },
    {
      type: 'table', size: 'sm',
      cols: [{ h: 'Participante', w: 16 }, { h: 'T1', w: 10 }, { h: 'T2', w: 10 }, { h: 'T3', w: 10 }, { h: 'T4', w: 10 }, { h: 'T5', w: 10 }, { h: 'SUS', w: 10 }, { h: 'Principal achado', w: 24 }],
      rows: [['P1', '', '', '', '', '', '', ''], ['P2', '', '', '', '', '', '', ''], ['P3', '', '', '', '', '', '', '']],
    },

    // ─── 7 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '7. Justificativas de UX (roteiro de fala)' },
    { type: 'h3', text: 'Telas e navegabilidade' },
    {
      type: 'bullets', items: [
        'Nenhuma tela sem saída: seta voltar visível em todas as telas internas (v1: branca no branco), header opaco que nunca cobre o conteúdo, e barra de abas sempre visível, inclusive nos gates de login.',
        'Quatro estados explícitos em toda tela com dados: o usuário nunca fica diante de uma tela vazia sem saber se é erro ou ausência de conteúdo.',
        'Feedback ao toque em todo interativo: botões mudam de cor no pressed e linhas de lista mudam de fundo. Toast confirma ações (login, salvar, excluir) sem bloquear.',
      ],
    },
    { type: 'h3', text: 'Design system e acessibilidade' },
    {
      type: 'bullets', items: [
        'O roxo de identidade #9B5DE0 reprovava (4.17:1). Mantivemos a matiz e escurecemos só onde há texto (#7A3FC4, 6.30:1): a identidade fica, a leitura melhora.',
        'Contraste verificado por script, não a olho: 13 de 15 pares reprovavam na v1; os 25 pares de tokens passam na v2 e na v3, e as 6 combinações dos componentes restaurados também.',
        'Montserrat de fato carregada (na v1 era declarada e nunca carregada); corpo de 16 px pensando em fadiga e efeitos visuais do tratamento.',
        'Alvos ≥ 44×44, labels visíveis, nomes acessíveis em botões de ícone e roles corretos para leitores de tela.',
      ],
    },
    { type: 'h3', text: 'Heurísticas e iteração' },
    {
      type: 'bullets', items: [
        `${problemas.length} problemas reais, todos com evidência em arquivo:linha ou print, cobrindo as 10 heurísticas; os de severidade 3–4 foram priorizados.`,
        'Prevenção de erros em ações irreversíveis (apagar conversa, excluir registro) com diálogo que nomeia o que será perdido.',
        'Erros dizem o que aconteceu e o que fazer ("Seus registros estão seguros. Verifique a conexão") em vez de culpar o usuário.',
        'Duas iterações: a v2 corrigiu os problemas da avaliação; a revisão da v2 gerou a v3, que tirou excessos (cadeados, SOS global, cards com cara de botão) e preservou a identidade visual. O smoke test e os prints refeitos pegaram 4 regressões antes da entrega.',
      ],
    },
    { type: 'h3', text: 'Arquitetura da informação' },
    {
      type: 'bullets', items: [
        'Botão de pânico em todas as telas de Saúde Mental: quem está em sofrimento emocional tende a estar nessa área, e a ajuda fica a 1 toque sem alarmar quem só lê sobre oncologia.',
        'Rótulos na linguagem do usuário ("Seus direitos", "Para cuidadores"), e gates que explicam o benefício antes de pedir login.',
        'Navegação (linhas de lista com chevron) visualmente separada de ação (botões).',
        'Agrupamento por objetivo no Meu Perfil ("Minha jornada" e "Apoio").',
      ],
    },
    { type: 'h3', text: 'Público vulnerável' },
    {
      type: 'bullets', items: [
        'Tom acolhedor nos textos de erro e de vazio; o aviso dos contatos de emergência deixou de dizer "Trote é crime" e passou a orientar ("Em risco de vida, ligue 192").',
        'O modal de login não insiste: "Agora não" é lembrado. O mascote declara que não substitui a equipe de saúde.',
        'Densidade baixa: um tema por card, subtítulo curto e ações primárias de largura total.',
      ],
    },

    // ─── 8 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '8. Checklist da rubrica' },
    {
      type: 'table', size: 'xs',
      cols: [{ h: 'Bloco (peso)', w: 16 }, { h: 'Requisito', w: 34 }, { h: 'Onde está comprovado', w: 50 }],
      rows: [
        ['Telas (30%)', '5 a 10 telas-chave com transições', 'Seção 1 (10 telas); prints da seção 9'],
        ['Telas (30%)', 'Estados de botão default / pressed / focus', 'Button.tsx; /design-system → Button (4 variantes × 5 estados)'],
        ['Telas (30%)', 'Carregando, sucesso, erro e vazio', 'useAsyncResource.ts; States.tsx; prints 17–22 e 24; painel de simulação'],
        ['Telas (30%)', 'Nenhum erro de fluxo / beco sem saída', 'scripts/smoke-flow.mjs na v3: 8/8 passos no Expo Web, sem erros de página; P02, P04, P14 e P21 corrigidos'],
        ['DS (20%)', 'Tokens com contraste ≥ 4.5:1', 'tokens.ts; check-contrast.ts (25/25 na v3) + 6 combinações dos componentes restaurados; seção 2'],
        ['DS (20%)', 'Tipografia sem serifa e espaçamento padronizado', 'Montserrat carregada; escala de 8; check-hardcoded.ts: 0 ocorrências na v2, 49 na v3 restritas aos componentes restaurados (PD-02)'],
        ['DS (20%)', 'Toque ≥ 44×44 e labels visíveis', 'touch.min/comfortable; TextField; labels em Login, Cadastro, Diário, busca'],
        ['Heurísticas (25%)', 'Avaliação pelas 10 heurísticas', `Seção 4 (${problemas.length} problemas, cobertura H1–H10)`],
        ['Heurísticas (25%)', 'Think Aloud com 2–3 usuários', 'Seção 6 (TCLE, roteiro, 5 tarefas, ficha, SUS); resultados a preencher'],
        ['Heurísticas (25%)', 'Matriz de iteração', 'Seção 5 (v1 → v2), 5.1 (Iteração 2, v2 → v3) e 5.2 (pendências); tags ux-av2-v1, v2 e v3'],
        ['AI (15%)', 'Menus claros, rótulos, organização lógica', 'Seção 3 (sitemap, rótulos, posição do botão de pânico)'],
        ['Apresentação (10%)', 'Justificativa embasada', 'Seção 7 (roteiro de fala)'],
      ],
    },
    // ─── 9 ────────────────────────────────────────────────────────────────
    { type: 'h1', text: '9. Prints antes / depois' },
    { type: 'p', text: 'Capturados automaticamente (apps/mobile/scripts/capture-screens.mjs, Expo Web + Playwright, 390×844). "Antes" é a v1 e "depois" é a versão atual (v3). No web, o fundo das telas sai cinza claro em vez do gradiente lilás do app nativo.' },
    {
      type: 'images', cols: 4, imgHeightCm: 7.6,
      items: printsPares.flatMap(([f, label]) => [
        { src: `prints/antes/${f}.png`, caption: `${label}: antes` },
        { src: `prints/depois/${f}.png`, caption: `${label}: depois` },
      ]),
    },
    { type: 'h2', text: 'Iteração 2: v2 → v3' },
    {
      type: 'images', cols: 4, imgHeightCm: 7.6,
      items: printsIteracao2.flatMap(([f, label]) => [
        { src: `prints/v2/${f}.png`, caption: `${label}: v2` },
        { src: `prints/depois/${f}.png`, caption: `${label}: v3` },
      ]),
    },
    { type: 'h2', text: 'Estados de interface e novas telas (v3) · evidências de falha da v1' },
    {
      type: 'images', cols: 5, imgHeightCm: 6.9, items: [
        ...printsEstados.map(([f, caption]) => ({ src: `prints/depois/${f}.png`, caption })),
        { src: 'prints/antes/evid-lazer-api-falhando.png', caption: 'v1 · Lazer: seções vazias sem aviso (P08)' },
        { src: 'prints/antes/evid-livros-api-falhando.png', caption: 'v1 · Livros: "nenhum livro" no erro (P09)' },
        { src: 'prints/antes/evid-diario-api-falhando.png', caption: 'v1 · Diário: erro + "nenhuma entrada" (P10)' },
      ],
    },
  ],
};
