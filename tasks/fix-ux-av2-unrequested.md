# Plano — Reverter mudanças não solicitadas da ux-av2 + layout de header/scroll

- **Slug**: `fix-ux-av2-unrequested`
- **Branch**: `ux-av2` (decisão do usuário: trabalhar direto, sem branch nova)
- **Base de comparação ("como era antes")**: `main`
- **Pré-setup**: WIP do usuário commitado em `78bf090` (calendar legacy) e `f2c5578` (gradiente)
- **Gate**: Livre para execução — **Executado** (ver Histórico)

---

## FASE 1 — Scope Analysis

**Objetivo**: desfazer no app mobile o que a ux-av2 introduziu sem pedido (layout da Home, cadeados, SOS global, cards com cara de botão, "continuar sem conta") e corrigir o layout base: header fixo e opaco, conteúdo que não vaza do container.

**Áreas afetadas** (só `apps/mobile`):
- Navegação: `(Home)/_layout.tsx`, `constants/CommonScreenOptions.ts`, `_layout.tsx` de cada área
- Layout: `components/layouts/CommonAreasLayout/*`
- Home: `(Home)/index.tsx`, `components/home/*`, `HomeNavigationGrid.tsx`
- Auth: `components/auth/AuthGate.tsx`, `RegisterForm.tsx` (+ telas de `(auth)/`)
- Saúde Mental: `MentalHealth/index.tsx`, `PanicButton`, `ds/SosButton.tsx`
- Listagens: `ds/Card.tsx` (`NavItemCard`), `NavigationGrid.tsx`, `Oncology/Leisure/index.tsx`, `RecomendationPager.tsx`, `PagerHeader.tsx`

**Escopo**
1. Home revertida para `main`: `(Home)/index.tsx`, `HomeNavigationGrid`, `HelloMessage`, `HeaderLogo`, `DailyMessage`. Exceções: DailyMessage pode ser aprimorado; botão "Sobre" com fundo opaco e contraste legível.
2. Remover cadeados (tab bar, `HomeNavigationGrid`, `NavItemCard`, badge "Área com login" do AuthGate) e a prop `locked` em `CardItem`.
3. AuthGate: remover "Continuar sem conta", aumentar a imagem do mascote em ~25% e trocar ScrollView por View.
4. Header central: opaco, não transparente, com o conteúdo começando abaixo dele. Remover os `paddingTop: headerHeight` que viram redundantes.
5. Container (`CommonAreasLayout`) recorta o conteúdo (`overflow: 'hidden'`), assim a ScrollView não passa do card arredondado.
6. ScrollView só onde o conteúdo excede a tela. Formulários de auth que cabem na tela (cadastro, login, reset) ficam sem ScrollView, com `KeyboardAvoidingView`.
7. SOS apenas em Saúde Mental, com o `PanicButton`/`OverlayButton` de `main` (roxo, círculo 60 px, `alert-circle-outline`). `SosButton` sai do `(Home)/_layout.tsx`.
8. Listagens não-botão com aparência de lista: sem sombra/elevação, sem borda de cartão, sem fundo de CTA, sem `scale` no press, com separador sutil.
9. Lazer: `Leisure/index.tsx`, `RecomendationPager`, `PagerHeader` voltam à estrutura e visibilidade de `main`.

**Não-Escopo**
- Backend, `packages/shared`, rotas novas
- `SoftLoginModal` (não citado; "Agora não" é o fechamento do modal, não um "entrar sem conta")
- `constants/tokens.ts` e `Colors.ts` (continuam como fonte de cor; ver premissa P3)
- Remover a pasta `components/ds/` ou a rota `design-system.tsx`
- Telas da Área Pessoal além dos ajustes de header/scroll

**Impacto técnico**
- Dados/API: nenhum
- UI: header de todas as stacks; container das áreas; Home; AuthGate; listagens
- Infra: nenhum

**Critérios de aceite**
1. `git diff main -- "apps/mobile/src/app/(Home)/index.tsx"` mostra apenas o estilo do botão Sobre (e DailyMessage nos arquivos dele).
2. `grep -rn "lock\b\|locked" apps/mobile/src --include=*.tsx` retorna 0 resultados de navegação/cards/AuthGate.
3. AuthGate sem "Continuar sem conta", sem ScrollView, com a imagem do mascote maior que `layout.mascotMd`.
4. Botão de pânico visível em `/MentalHealth` e ausente em Home, Oncologia, Mascote, Meu Perfil e `(auth)`.
5. Em Android, iOS e web: header opaco e sempre visível; nenhuma imagem/banner sob o header; scroll recortado nas bordas do card.
6. `RegisterScreen`, `LoginScreen` e AuthGate sem `<ScrollView>`; com teclado aberto, o campo focado continua visível.
7. `NavItemCard` sem `shadow`, sem `borderWidth` de cartão e sem `transform` no press. Botões (`ds/Button`) inalterados.
8. Lazer com o mesmo bloco de `main` (banner, título, descrição, 4 pagers).
9. `npx tsc --noEmit` (mobile), `npm run lint` e o smoke test web passando.
10. Commits atômicos conforme `.claude/rules/commits.md`.

**Perguntas bloqueadoras**: nenhuma (respondidas: Home = revert total + DailyMessage livre; listagens = todas as não-botão; branch = `ux-av2`).

**Premissas**
- P1: "telas da área de saúde mental" = toda a stack `MentalHealth/*` exceto `PanicButtonContacts`. Em `main` o botão só era renderizado em `MentalHealth/index.tsx:83`. **Confiança: MEDIUM**. Ver Decisão D3.
- P2: "visibilidade da listagem de Lazer" = estrutura e pagers de `main`. **Confiança: MEDIUM**. Se a intenção era só o tamanho/legibilidade dos cards do pager, o item 9 se restringe ao `RecomendationPager`.
- P3: `Colors.purplePrimary` hoje é `color.action.primary` (mais escuro que `#9B5DE0`). A Home revertida usa `Colors`, então o roxo vai sair levemente diferente de `main`. Aceito como está; não reverter `Colors.ts`.
- P4: header opaco usa a cor do card (`white`/`color.bg.surface`), porque a stack já vive dentro do card branco de `CommonAreasLayout`.

---

## FASE 2 — Evidence Gathering

| # | Evidência | Âncora |
|---|---|---|
| E1 | SOS global, escondido por lista de exclusão | `(Home)/_layout.tsx:10-20, 70, 171` |
| E2 | Cadeado na tab bar (Mascote, Meu Perfil) | `(Home)/_layout.tsx:39-62, 125-127, 151-153` |
| E3 | Header transparente para todas as stacks | `constants/CommonScreenOptions.ts:8` + `(Home)/_layout.tsx:80` |
| E4 | Card de área sem `overflow: hidden` (o scroll vaza dos cantos r=50) | `CommonAreasLayoutStyle.ts:4-15` |
| E5 | `NavItemCard` = `Pressable` + `shadow.sm` + borda + `scale` + cadeado | `components/ds/Card.tsx:17-32, 44-64, 67-82` |
| E6 | AuthGate: ScrollView + "Continuar sem conta" + badge de cadeado | `components/auth/AuthGate.tsx:24, 34-37, 54-60, 74-77` |
| E7 | Pânico em `main`: só em `MentalHealth/index.tsx:83`, `OverlayButton` roxo, absoluto em bottom 30 / right 20 | `main:.../PanicButton.tsx`, `main:.../OverlayButton.tsx` |

**Fluxo atual**: `RootLayout` (gradiente) → `(Home)` Tabs (header transparente) → área `_layout` → `CommonAreasLayout` (card branco, 93% de altura, ancorado embaixo) → Stack (header transparente dentro do card) → tela com `paddingTop: headerHeight` manual (66 ocorrências) → ScrollView sem recorte.

**Incertezas**
- As 66 ocorrências de `useHeaderHeight` não são homogêneas. Algumas servem para compensar o header e outras para posicionar elementos. É preciso revisar caso a caso no passo 4.
- `HomeNavigationGrid` em `main` pode depender de `CardItem.icon` (imagens). A interface `CardItem` foi alterada (`+featherIcon`, `+locked`, `+subtitle`); manter os campos novos usados por outras telas e remover só `locked`.

---

## FASE 3 — Architecture Planning

**D1 — Como garantir que o header fique visível e fora das imagens**

| Abordagem | Corretude | Blast radius | Manutenção | Alinhamento |
|---|---|---|---|---|
| A. `headerTransparent: false` + `headerStyle` opaco central; remover `paddingTop: headerHeight` | 5 | 3 (toca ~30 telas) | 5 | 5 (opção nativa do React Navigation) |
| B. Manter transparente + `headerBackground` opaco + manter os paddings | 3 (depende de cada tela acertar o padding) | 5 | 2 | 3 |
| C. `headerShown: false` + `ds/Header.tsx` em cada tela | 4 | 1 | 2 | 2 |

**Vencedora: A.** O layout passa a ser responsabilidade do navigator, sem hack por tela. B foi descartada porque é exatamente o modelo atual que quebra quando uma tela esquece o padding. C foi descartada por duplicar o header em todas as telas e trocar a navegação nativa.

**D2 — Overflow do scroll**: `overflow: 'hidden'` em `oncologyArea` + `contentContainerStyle` com `paddingBottom` real (sem `layout.tabBarHeight` extra, porque a tab bar não é absoluta). Descartado: `maxHeight` por tela (frágil).

**D3 — SOS**: renderizar o `PanicButton` de `main` (sem mudar o visual) no `MentalHealth/_layout.tsx`, escondido em `PanicButtonContacts` via `usePathname`. A alternativa "só em `index`, como era em `main`" está no plano como fallback. Ela não atende "telas da área de saúde mental" (plural), e por isso não foi escolhida. Ajuste mínimo permitido: `accessibilityLabel` em pt-BR. Remover o `SosButton` de `(Home)/_layout.tsx`; o componente continua só na vitrine `design-system.tsx`.

**D4 — Listagens**: alterar o estilo do `NavItemCard` (ponto único usado por Oncologia, Saúde Mental e Hub) para variante de lista. Isso resolve todas as listagens de uma vez sem trocar componentes nas telas. `AccordionCard` fica fora: é expansível e já tem papel de lista.

**Validações**
- Lógica de negócio na camada certa: não há regra de negócio; só UI/navegação.
- Acoplamento: a mudança central fica em `CommonScreenOptions` e `Card`, sem acoplamento novo.
- Reversível: cada item é um commit independente (`git revert`).
- Contratos de API: inalterados.

---

## FASE 4 — Execution Planning (ordem de dependência)

- [x] 1. **Cadeados**: remover `lockBadge`/`locked` de `(Home)/_layout.tsx`, `NavItemCard`, `NavigationGrid`, `HomeNavigationGrid` e `CardItem.locked`. Commit: `🗑️ remove(navigation): drop lock indicators`
- [x] 2. **SOS**: tirar o `SosButton` de `(Home)/_layout.tsx` e renderizar o `PanicButton` (de `main`) em `MentalHealth/_layout.tsx`, escondido em `PanicButtonContacts`. Commit: `🐛 fix(mental-health): restrict panic button to area`
- [x] 3. **Header central** (D1): `CommonScreenOptions` + `(Home)/_layout.tsx` com `headerTransparent: false`, `headerStyle` opaco (P4), `contentStyle` sem `flex-end`. Revisar as stacks que sobrescrevem `headerTransparent` (ex.: `About`). Commit: `🐛 fix(navigation): make headers opaque and fixed`
- [x] 4. **Remover compensações**: rodar `grep useHeaderHeight` e tirar só os `paddingTop: headerHeight`/`marginTop` que compensavam o header transparente. Validar tela a tela. Commit: `♻️ refactor(screens): drop manual header offsets`
- [x] 5. **Overflow** (D2): `overflow: 'hidden'` no `CommonAreasLayoutStyle` e revisar `paddingBottom: layout.tabBarHeight + …` redundantes. Commit: `🐛 fix(styles): clip scroll content to card`
- [x] 6. **Home**: `git checkout main --` em `(Home)/index.tsx`, `HomeNavigationGrid.tsx`, `HelloMessage.tsx`, `HeaderLogo.tsx`, `DailyMessage*`. Depois disso: botão Sobre com fundo opaco e borda visível; DailyMessage com ajuste visual leve. Garantir que o tsc compila com o `CardItem` atual. Commits: `⏪ revert(home): restore original home layout` e `👌 style(home): improve about button contrast` (+ `👌 style(home): refine daily message`)
- [x] 7. **AuthGate**: remover o botão "Continuar sem conta" e o badge de cadeado, trocar ScrollView por View com `justifyContent: 'center'` e imagem ~25% maior (novo token `layout.mascotLg` ou valor derivado). Commit: `🐛 fix(auth): simplify login gate screen`
- [x] 8. **Formulários de auth sem ScrollView**: `RegisterForm`, `LoginForm`, `ResetPasswordForm`, `SendResetForm` e as telas `(auth)/*` com `KeyboardAvoidingView` no lugar da ScrollView. Se algum não couber em 640 px de altura, manter a ScrollView e registrar o motivo. Commit: `♻️ refactor(auth): remove scroll from short forms`
- [x] 9. **Listagens** (D4 + Lazer): `NavItemCard` em variante de lista (sem shadow/borda/scale, com separador e chevron). `Leisure/index.tsx`, `RecomendationPager`, `PagerHeader` via `git checkout main --`, reaplicando só o fix de web P02 se ele for necessário para renderizar. Commits: `👌 style(components): list style for nav items` e `⏪ revert(oncology): restore leisure list layout`
- [x] 10. **Validação**: `npx tsc --noEmit`, `npm run lint`, smoke test web, mais prints de Home, Oncologia, Lazer, Saúde Mental, Mascote (deslogado), Meu Perfil (deslogado) e Cadastro em 390×844 e 360×640. Conferir critérios 1–9.

---

## FASE 5 — Verificação do Plano

- [x] Nenhuma regra de negócio na camada errada
- [x] Nenhum acoplamento desnecessário (mudanças centrais em options/layout/Card)
- [x] Critérios de aceite objetivos (grep/diff/tsc/prints)
- [x] Checklist ≤ 10 itens
- [x] 3 abordagens avaliadas em D1, 1 escolhida com justificativa
- [x] Evidências ≤ 7 arquivos
- [x] Perguntas bloqueadoras respondidas; premissas P1–P4 explícitas

**Gate = Livre para execução** (`/exec fix-ux-av2-unrequested`)

---

## Histórico de execução

Executado em 2026-10-19 na branch `ux-av2` (16 commits, de `e62bb2b` a `ab159ca`). Checklist 1–10 concluído.

### Stage de Execução — Entregáveis

| # | Entregável | Caminho | Commit | Status |
|---|---|---|---|---|
| 1 | Remover cadeados (tab bar, grids, NavItemCard, `CardItem.locked`) | `(Home)/_layout.tsx`, `ds/Card.tsx`, `NavigationGrid.tsx`, `HomeNavigationGrid.tsx`, `interfaces/CardItem.ts`, `design-system.tsx` | `e62bb2b` | ✅ |
| 2 | Pânico só em Saúde Mental (PanicButton de `main`, oculto em Contatos) + `accessibilityLabel` | `MentalHealth/_layout.tsx`, `(Home)/_layout.tsx`, `OverlayButton.tsx`, `PanicButton.tsx` | `a22582f` | ✅ |
| 3 | Header opaco e no fluxo (Stacks) | `constants/CommonScreenOptions.ts` | `7776fda` | ✅ |
| 4 | Remover `paddingTop: headerHeight` (19 arquivos) | telas das Stacks + `AuthGate`, `DiaryForm` | `c614115` | ✅ |
| 4b | Folga do header removida do `globalStyles.scrollContainer` (50 → 8 px) | `styles/global.ts` | `b1099f5` | ✅ (desvio D-a) |
| 5 | `overflow: hidden` no card + paddings de tab bar redundantes | `CommonAreasLayoutStyle.ts` + 7 telas | `96a875b` | ✅ |
| 6 | Home revertida para `main` | `(Home)/index.tsx`, `HomeNavigationGrid`, `HelloMessage`, `HeaderLogo`, `DailyMessage*` | `d55008a` | ✅ (desvio D-b) |
| 6b | Botão "Sobre" opaco com borda roxa | `(Home)/index.tsx` | `8823ee4` | ✅ |
| 6c | DailyMessage refinado (contraste, fonte, imagem 84 px) | `DailyMessage.style.ts` | `455a398` | ✅ |
| 7 | AuthGate sem "Continuar sem conta"/cadeado, mascote 120 → 150 px | `AuthGate.tsx`, `tokens.ts` (`mascotLg`) | `e10b918`, `0cf9629` | ✅ (desvio D-c) |
| 8 | Auth sem rolagem quando cabe (`FitScrollView`) + cadastro compactado | `layouts/FitScrollView.tsx` (novo), `AuthLayout*`, `RegisterForm.tsx`, `RegisterScreen.tsx` | `3099973` | ✅ (desvio D-c) |
| 9 | `NavItemCard` como linha de lista (sem caixa/sombra/scale, divisória) | `ds/Card.tsx`, `NavigationGrid.tsx`, `Hub/index.tsx` | `4571c43` | ✅ |
| 9b | Lazer revertido para `main` | `Leisure/index.tsx`, `RecomendationPager.tsx`, `PagerHeader.tsx` | `3b62e44` | ✅ |
| 10 | Smoke test atualizado (pânico em Saúde Mental; long-press do logo removido junto com a Home v2) | `scripts/smoke-flow.mjs` | `ab159ca` | ✅ |

**Desvios do plano**
- **D-a**: o item 4 não previa o `paddingTop: 50` do `globalStyles.scrollContainer` (vindo de `main`), que também compensava o header transparente. Com o header opaco, ele virou um vão vazio acima dos banners em 12 telas, então foi reduzido para `space.xs`.
- **D-b**: os arquivos de `main` não compilavam com os tipos atuais. Ajustes mínimos: `Avatar imagePath={{ uri }}` em `HeaderLogo` (bug de tipo já existente em `main`) e `keyExtractor` com `String(item.id)`. O atalho long-press do logo para `/design-system` (exclusivo da v2) saiu junto; a rota continua acessível por URL.
- **D-c**: "sem ScrollView" se tornou "sem rolagem quando cabe". Medição no Expo Web: o cadastro passava 117 px em 390×844, e o AuthGate com mascote maior não cabia em 360×640. Uma View pura cortaria conteúdo em telas pequenas ou com o teclado aberto. `FitScrollView` só ativa a rolagem quando há overflow. O cadastro foi compactado (gap 24 → 16, card 80% → 89%, link sem `marginTop: 40`) e cabe sem rolar em 390×844.

### Stage de Execução — Validação

| Critério | Resultado | Observação |
|---|---|---|
| 1. Diff da Home vs `main` só com exceções | ✅ | `index.tsx` só no estilo do Sobre; `DailyMessage.style.ts` refinado; `HeaderLogo`/`HomeNavigationGrid` com 1 linha cada de ajuste de tipo (D-b) |
| 2. Sem cadeado/`locked` na navegação | ✅ | Restam só ícones `lock` em campos de senha e na seção "Como se prevenir" (não são indicadores de login) |
| 3. AuthGate sem "sem conta", mascote maior | ✅ | 150 px (antes 120); rolagem só em overflow (D-c) |
| 4. Pânico só em Saúde Mental | ✅ | Smoke test: ausente em `/Oncology`, abre os contatos a partir de `/MentalHealth`; oculto em `PanicButtonContacts` |
| 5. Header opaco, nada por baixo | ✅ (web) | Prints 390×844: Oncologia, Lazer, Nutrição, Saúde Mental, Livros, Chat, Hub. **Android/iOS não testados nesta sessão** |
| 6. Cadastro/AuthGate sem rolagem em altura padrão | ✅ | 390×844: cadastro, login, reset e AuthGate sem overflow. 360×640: cadastro e AuthGate rolam (conteúdo maior que a tela) |
| 7. Listagens sem cara de botão | ✅ | `NavItemCard` sem shadow/borda/scale; `ds/Button` inalterado |
| 8. Lazer igual a `main` | ✅ | `git diff main` vazio nos 3 arquivos |
| 9. tsc / lint / smoke | ✅ | tsc: 6 erros, os mesmos do baseline anterior (nenhum novo). eslint nos arquivos alterados: 0 erros, 4 warnings já existentes (`import/no-duplicates`). Smoke web: 8/8 PASS, 0 pageerrors |
| 10. Commits atômicos | ✅ | 16 commits no padrão de `.claude/rules/commits.md` |

**Pendências/observações**
- Validar em dispositivo Android/iOS (header nativo, teclado no cadastro, posição do botão de pânico).
- No Expo Web o gradiente raiz aparece cinza claro e o logo branco "ONCOMENTE" da Home fica pouco visível. No app o topo é `lilac400` (igual a `main`, restaurado em `f2c5578`). Confirmar no aparelho.
- P1 (pânico em toda a stack de Saúde Mental, e não só no índice como em `main`) e P2 (Lazer revertido por inteiro) seguem como premissas: o usuário deve confirmar.
