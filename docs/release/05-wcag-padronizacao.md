# 05 — Padronização visual das "caixas" e revisão WCAG (mobile)

> Gerado em 2026-11-16 · Persona: especialista sênior em acessibilidade e design systems RN · Escopo: `apps/mobile/src` · **Somente leitura — nenhum arquivo de código/estilo foi alterado; tudo abaixo é proposta.**
> Método: leitura estática de `constants/tokens.ts`, `styles/*`, `components/ds/*`, `components/ui/*`, `components/layouts/*`, `components/home/*` e 30 telas de `app/(Home)/**` e `app/(auth)/**`. Contraste calculado por script Node (luminância relativa WCAG 2.x + APCA-W3 0.0.98G); os valores batem com `docs/av2/src/contrast-v2.json` nos pares em comum. Cores com `opacity`/alfa foram compostas sobre o fundo real antes do cálculo.
> Normas: WCAG 2.2 (Recomendação W3C) é a referência. **WCAG 3 é Working Draft, sem status normativo**; o APCA apareceu em rascunhos como candidato e não há algoritmo de contraste normativo definido — o Lc aqui é **apenas indicativo** (referência informal do APCA: |Lc| ≥ 75 texto corrido, ≥ 60 texto ≥ 16 px, ≥ 45 títulos grandes, ≥ 30 elementos não textuais).
> Não verificado em dispositivo: ordem de foco, leitura real do TalkBack/VoiceOver, fonte ampliada. Onde isso pesa, está marcado **Confiança: LOW — verificar em dispositivo**.

## 1. Resumo

| Gravidade | Qtde | Significado |
|---|---|---|
| Bloqueia AA | 16 | Falha objetiva de critério A/AA da WCAG 2.2, com evidência no código |
| Alta | 7 | Risco real para o público (idoso/fragilizado) ou falha provável a confirmar em dispositivo |
| Média | 7 | Degrada a experiência; sem falha AA objetiva |
| Baixa | 6 | AAA, higiene ou consistência |

- O Design System (`tokens.ts` + `components/ds/*`) está correto: **todos os 28 pares de `contrastPairs` passam AA** (mínimo 4,79:1). A única falha do DS é não textual: borda do `TextField` (2,65:1).
- O problema está nas telas e componentes **legados**: 43 arquivos com cor literal, 100 `borderRadius` literais (23 valores distintos) contra 36 por token, 206 `fontSize` literais, 138 `TouchableOpacity` em 31 arquivos quase todos sem `accessibilityRole`.
- **Emergência:** o `ds/SosButton` (vermelho, texto "SOS", 56 px, rótulo e dica) **não está montado em nenhuma tela** — só em `app/design-system.tsx:169`. Produção usa o `PanicButton` legado (FAB roxo, só ícone), apenas dentro de Saúde Mental (`MentalHealth/_layout.tsx:42`).
- `allowFontScaling`/`maxFontSizeMultiplier`: 0 ocorrências (escala do sistema não é bloqueada — bom para 1.4.4). Detecção de "reduzir movimento": 0 ocorrências.

## 2. Tabela de contraste

Limiar: texto normal 4,5:1; texto grande (≥ 24 px, ou ≥ 18,66 px bold) 3:1 (1.4.3). Linhas "NT" são não textuais: vale só 3:1 (1.4.11), mostrado na coluna "AA grande". Lc positivo = texto escuro em fundo claro.

### 2.1 Pares que reprovam

| Par (texto/fundo) | Onde | Razão WCAG 2 | AA normal | AA grande | Lc APCA | Correção sugerida (cor que passa) |
|---|---|---|---|---|---|---|
| `#999999` / `#FFFFFF` | Treatment `index.tsx:186,248`; Calendar `:271,314,368`; Notifications `:370`; About `:84,159`; Onboarding `:223`; DateInput `:184`; placeholder RecoverPassword `:72` | 2,85 | reprova | reprova | 54,6 | `color.text.secondary` `#575760` → 7,15 (Lc 84,8) |
| `#BBBBBB` / `#FFFFFF` | Treatment `:191`; Notifications `:429,447`; About `:166` | 1,92 | reprova | reprova | 36,7 | `#575760` → 7,15 |
| `#CCCCCC` / `#FFFFFF` | Notifications `:453`; (NT) chevron de expandir Treatment `:108`, LegalArea `:64`, ícones de vazio | 1,61 | reprova | reprova | 27,3 | texto `#575760`; ícone `color.icon.muted` `#575760` → 7,15 |
| `#AAAAAA` / `#FFFFFF` | Notifications rodapé LGPD `:328` (11 px) | 2,32 | reprova | reprova | 45,8 | `#575760` → 7,15 |
| `#888888` / `#FFFFFF` | Psy `:185,227`; Meditation `:124`; Breathing `:225`; Onboarding `:208` | 3,54 | reprova | passa | 63,1 | `#575760` → 7,15 |
| `#777777` / `#FFFFFF` | ProfileCenter e-mail `:68` | 4,48 | reprova | passa | 71,1 | `#575760` → 7,15 |
| `#A0A0A0` / `#FFFFFF` | placeholder PhoneInput `:35`, DateInput `:151`, Treatment create `:142,179,191` | 2,61 | reprova | reprova | 51,0 | `#575760` → 7,15 (igual ao placeholder do DS) |
| `#A6A6A6` / `#FFFFFF` (`#888` com opacity .75) | Notificação lida, título — Notifications `:396-428` | 2,43 | reprova | reprova | 47,9 | remover `opacity`; usar `#575760` |
| `#808080` / `#FFFFFF` (`#555` com opacity .75) | Notificação lida, corpo | 3,95 | reprova | passa | 66,9 | idem |
| `#FF4C4C` / `#FFFFFF` | erro DateInput `:152`, TimeInput, Treatment create `:250`; "Ação irreversível" AccountConfigurations `:152` | 3,29 | reprova | passa | 58,9 | `color.text.danger` `#B3261E` → 6,54 (Lc 80,8) |
| `#FF4C4C` / `#F7F7F7` | "Desativar conta" — AccountConfigurations `:48` em ActionCardList | 3,07 | reprova | passa | 54,1 | `#B3261E` → 6,10 |
| `#FFFFFF` / `#FF4C4C` | botão "Sim, desativar minha conta" `:176-184` | 3,29 | reprova | passa | −64,3 | fundo `color.action.danger` `#B3261E` → 6,54 |
| `#1AD5AD` / `#FFFFFF` e tons `#E0F9F4`/`#ECFCF8` | Psy tipo "comunidade" (selo `:86`, link `:96`); Breathing fase "Expire" `:151-158` | 1,88 / 1,70 / 1,78 | reprova | reprova | 35,1 / 28,3 / 31,1 | `#0B6B58` → 6,45 em branco; 5,27 e 5,72 nos tons |
| `#E040FB` / `#FBE6FE` | Breathing fase "Segure" (quadrada) `:25` | 2,84 | reprova | reprova | 48,4 | `#A21CAF` → 5,08 |
| `#9B5DE0` / `#FFFFFF`, `#F7F2FC`, `#F2E9FB` | Psy "online" (link, selo); Breathing "Inspire" | 4,17 / 3,79 / 3,54 | reprova | passa | 68,3 / 61,6 / 57,2 | `color.action.primary` `#7A3FC4` → 6,30 / 5,57 / 5,14 |
| `#E53935` / `#FFFFFF`, `#FDEFEE` | Psy "urgência" (link, selo) `:51` | 4,23 / 3,78 | reprova | passa | 67,7 / 59,9 | `#B3261E` → 6,54 / 5,71 |
| `#B6C1CD` / `#FFFFFF` | Calendar: cabeçalho dos dias da semana `:135` | 1,83 | reprova | reprova | 34,2 | `#5E6B7A` → 5,44 (ou `#575760`) |
| `#EA580C` / `#FFF7ED` | Calendar: subtítulo campanha laranja `:30,32` | 3,35 | reprova | passa | 58,0 | `#C2410C` → 4,88 (ou `#9A3412` → 6,88) |
| `#D81B60` / `#FCE4EC` | Calendar: subtítulo Março Lilás `:31` | 4,11 | reprova | passa | 59,7 | `#AD1457` → 5,79 |
| `#0284C7` / `#FFFFFF` | ReportsArea título de seção `:68` (18 px bold, abaixo de 18,66) | 4,10 | reprova | passa | 67,5 | `#0369A1` → 5,93 |
| `#059669` / `#FFFFFF` | ReportsArea título de seção `:82` | 3,77 | reprova | passa | 64,6 | `#047857` → 5,48 |
| `#9B5DE0` / `#F5F0FA`; subtítulo com opacity .8 (`#AD7AE5`) | `ui/Cards/NavCard.tsx:22,48` (**sem uso hoje**) | 3,72 / 2,80 | reprova | passa / reprova | 60,4 / 50,4 | `#7A3FC4` → 5,61, sem opacity |
| NT `#9E9EA8` / `#FFFFFF` (e `/#F4F4F6`) | borda do `ds/TextField.tsx:107`; input do chat `Mascot/Chat:476` | 2,65 (2,42) | n/a | reprova | 51,7 | `#8A8A94` → 3,42 em branco; `#85858F` → 3,33 em `#F4F4F6` |
| NT `#E8E8E8` / `#FFFFFF` | borda PhoneInput `:59`, Treatment create `:235` | 1,23 | n/a | reprova | 11,1 | `#8A8A94` → 3,42 |
| NT `#DDDDDD` / `#FFFFFF` | borda do campo de código RecoverPassword `:104` | 1,36 | n/a | reprova | 17,6 | `#8A8A94` → 3,42 |
| NT `#D78FEE` / `#FFFFFF` | ícone do botão mostrar/ocultar senha e ícones de `InputWithIcon.tsx:22,50`; chevron ActionCardList `:102` (2,17 em `#F7F7F7`) | 2,32 | n/a | reprova | 45,5 | `color.icon.brand` `#9B5DE0` → 4,17 (ou `#7A3FC4` → 6,30) |
| NT `#FFFFFF` / `#1AD5AD` (e selo / branco) | botão de câmera — Onboarding `:121,197` | 1,88 | n/a | reprova | −39,3 | fundo `#0B6B58` → 6,45 |
| NT `#4E56C0` / `#D78FEE` (topo) – `#DB9AF0` (90 %) | seta "voltar" do header de `(auth)/_layout.tsx:9` sobre o degradê | 2,65 – 2,90 | n/a | reprova | 32,7 – 36,8 | `color.text.onGradient` `#3F1F73` → 5,47 – 5,98 (já usado no título ao lado). Base do degradê (branco): 6,15, passa |
| NT `#00BCD4`, `#FF9800`, `#4CAF50` / `#FFFFFF` | Calendar: pontos de tratamento `:38` | 2,30 / 2,16 / 2,78 | n/a | reprova | 44,6 / 41,8 / 53,3 | usar só tons ≥ 3:1 (`#7A3FC4`, `#4E56C0`, `#0B6B58`, `#B3261E`, `#A21CAF`, `#0369A1`) |
| NT `#9B5DE0` / `#7A3FC4` (e `/#B3261E`) | anel de foco do `ds/Button.tsx:121` contra o próprio botão primary/danger | 1,51 (1,57) | n/a | reprova | −11,3 | anel externo de 2 tons: 2 px branco + 2 px `#3F1F73` (12,69 contra branco) |

### 2.2 Pares que passam (referência)

| Par | Onde | Razão | AA normal | AA grande | Lc |
|---|---|---|---|---|---|
| `#1A1A1A` / `#FFFFFF` | texto principal | 17,40 | passa | passa | 104,3 |
| `#575760` / `#FFFFFF` · `#F4F4F6` · `#F7F1FE` · `#E6E6EA` | secundário, placeholder DS, botão desabilitado | 7,15 · 6,51 · 6,46 · 5,74 | passa | passa | 84,8 · 78,4 · 77,8 · 70,2 |
| `#4E56C0` / `#FFFFFF` · `#E6FBF5` · `#F9F5FF` | títulos, Mensagem do Dia, MediaAccordion | 6,15 · 5,70 · 5,72 | passa | passa | 80,3 · 75,1 · 75,3 |
| `#7A3FC4` / `#FFFFFF` · `#F7F1FE` · `#F3E5F5` | links, botão secundário, chips | 6,30 · 5,69 · 5,20 | passa | passa | 80,7 · 73,7 · 67,8 |
| `#FFFFFF` / `#7A3FC4` · `#6A35AF` · `#5B2E99` | botão primário (default, hover, pressed) | 6,30 · 7,66 · 9,15 | passa | passa | −85,8 · −90,8 · −94,9 |
| `#FFFFFF` / `#B3261E` · `#8C1D18` | SOS, "Ligar para…", perigo | 6,54 · 9,11 | passa | passa | −86,0 · −94,1 |
| `#3F1F73` / `#D78FEE` (topo) · `#FFFFFF` (base) | logo e título do header sobre o degradê | 5,47 · 12,69 | passa | passa | 50,5 · 98,1 |
| `#000000` / `#D78FEE` (topo) · `#FFFFFF` (base) | saudação do Início (`HelloMessage`, cor padrão) | 9,05 · 21,00 | passa | passa | 58,4 · 106,0 |
| `#B3261E`/`#FDECEA` · `#1E7A3C`/`#E8F5EC` · `#92400E`/`#FEF3C7` · `#0B5FA0`/`#E8F2FC` | toasts, ErrorState, aviso, faixa do chat | 5,72 · 4,79 · 6,37 · 5,87 | passa | passa | 71,7 · 68,5 · 76,6 · 73,8 |
| `#FFFFFF` / `#9B51E0` | botões de Onboarding `:234` e ChangePassword `:136` | 4,52 | passa (margem 0,02) | passa | −76,3 |
| `#FFFFFF` / `#6B6B6B` (overlay 58 % sobre capa branca, pior caso) | título do `RecomendationPager.tsx:82` | 5,33 | passa | passa | −81,9 |
| `#C62828`/`#FFEBEE` · `#1565C0`/`#E3F2FD` · `#2E7D32`/`#E8F5E9` | títulos de benefício — LegalArea | 4,92 · 5,03 · 4,56 | passa | passa | 67,3 · 69,1 · 67,0 |

Indicativo APCA (não normativo): o par `#3F1F73`/`#D78FEE` passa WCAG 2 (5,47) mas tem Lc 50,5 — baixo para o logo de 14 px. O verde de sucesso (4,79) e o `#9B51E0` (4,52) passam por margem pequena.

## 3. Parte A — Padronização

### 3.1 Inventário de caixas (cards/containers)

| # | Variante | Arquivo | Raio | Padding | Borda | Sombra/elev. | Fundo | Título / corpo |
|---|---|---|---|---|---|---|---|---|
| 1 | `ds/Card` | `ds/Card.tsx:71` | 16 (`lg`) | 16 | 1 `#E6E6EA` | `shadow.sm` (2) | branco | livre |
| 2 | `ds/NavItemCard` (linha) | `ds/Card.tsx:87` | — (ícone 12) | 8/4 | divisor 1 | — | transparente | 16 semibold / 14 |
| 3 | `AccordionCard` | `ui/Accordion/AccordionCard.tsx:79` | 16 | 16 | 1 `#E6E6EA` | `shadow.sm` | branco | 18 semibold / 16 |
| 4 | Diário (acordeão próprio) | `PersonalArea/Diary/index.tsx:282` | 16 | 16 | 1 `#E6E6EA` | `shadow.sm` | branco | tokens |
| 5 | Livros (grade) | `Leisure/Books/index.tsx:131` | 16 | 8 | 1 `#E6E6EA` | `shadow.sm` | branco | tokens |
| 6 | `NavCard` (sem uso) | `ui/Cards/NavCard.tsx:57` | 18 | 14 | 1 `#D2AEF0` | — | `#F5F0FA` | 16/700 / 13 |
| 7 | `ActionCardList` item | `ui/Pagers/ActionCardList.tsx:79` | 12 | 14/16 | — | — | `#F7F7F7` | 16/500 fonte do sistema / 13 |
| 8 | `AccordionMedia` | `ui/Media/MediaAccordion.tsx:68` | 12 | 16 | 1 `#7A3FC4` | — | `#F9F5FF` | 15/600 / 13 |
| 9 | Grade do Início | `ui/Navigation/HomeNavigationGrid.tsx:58` | 24 | 8 | — | elev. 4 | branco | 14/600 fonte do sistema |
| 10 | `RecomendationPager` | `ui/Pagers/RecomendationPager.tsx:61` | 12 | — | — | elev. 3 | imagem | 10/600 |
| 11 | Mensagem do Dia | `home/DailyMessage/DailyMessage.style.ts:6` | 20 | 14/12 | 1,5 `#A6D6D6` | — | `#E6FBF5` | 18 bold / 14 |
| 12 | Tratamento | `Treatment/index.tsx:208` | 16 | 18 | 1 `#F0F0F0` | elev. 2 | branco | 18 / 16 |
| 13 | Notificação (+ LGPD) | `Notifications/index.tsx:380,286` | 14 (16) | 16 (18) | esquerda 4 | elev. 1 | branco / `#FAFAFF` | 14/700 / 13 |
| 14 | Calendário ×3 | `Calendar/index.tsx:239,256,319` | 12 / 10 / 15 | 12 / — / 18 | 1 · — · esquerda 5 | — / elev. 5 / — | variável | 16 bold / 13–14 |
| 15 | Direitos ×2 | `Oncology/LegalArea/index.tsx:105,157` | 16 / 12 | 16 / 12 | 1 | elev. 3 / — | branco / tom | 15/700 / 12 |
| 16 | Dica (Nutrição, Sono) | `Nutrition/index.tsx:143`, `Sleep/index.tsx:85` | 14 | 14–16 | 1 `#E9DEFA` | elev. 3 | branco | 14 / 13 |
| 17 | Motivação, Espiritual | `Motivational/*/index.tsx:74`, `SpiritualArea/index.tsx:60` | 14–16 | 14–18 | 1 | elev. 2 / — | `#FBF8FF`, `#FFF9FE` | 13–14 |
| 18 | Apoio psicológico, Meditação | `PsychologicalSupport/index.tsx:128,156`, `Meditation/index.tsx:76,103` | 20 (hero) / 14 / 12 | 22 / 16 | esquerda | elev. 2 | roxo / branco | 14/700 / 12–13 |
| 19 | Respiração (dica) | `BreathingExercises/index.tsx:315` | 16 | 16 | esquerda 4 | — | branco | 14/700 / 13 |
| 20 | Filmes, Séries, Atividades | `Leisure/Movies/index.tsx:92`, `Activities/index.tsx:101` | 14 | 10–12 | — | elev. 3 | branco | 13–14 / 11–12 |
| 21 | Sobre, Denúncias (hero) | `About/index.tsx:89`, `ReportsArea/index.tsx:139` | 18 / 20 | 20 / 24 | — / 1 `#DDD6FE` | elev. 2 / — | branco / `#F5F3FF` | 15–22 |

- **≈ 26 definições de card**; só 5 (linhas 1–5) usam tokens. Raios de caixa em uso: 10, 12, 14, 15, 16, 18, 20, 24. `elevation`: 0, 1, 2, 3, 4, 5, 8.
- **Modais/diálogos (6 implementações):** `ds/ConfirmDialog.tsx:53` (raio 24, pad 24, `shadow.md`); AccountConfigurations `:120` (20, 24, elev. 8); Treatment create `:252` (20, 28); folha do Calendário `:339` (24 no topo); folha iOS de `DateInput`/`TimeInput`/`BirthdayDateInput` `:163` (20 no topo); `SoftLoginModal.tsx:125` (24 no topo, tokens).
- **Botões (1 no DS + 13 fora):** `ds/Button` (pill, mín. 48, 16 semibold). Fora: Breathing `:298` (raio 28), Treatment create `:245` (26) e modal `:257-259` (12), Onboarding `:233` e ChangePassword `:136` (25, **`#9B51E0`**, cor fora da paleta — a marca é `#9B5DE0`), Notifications `:313` (50), Calendar `:390` (20), Movies/Series `[id].tsx:134` (14), AccountConfigurations `:168` (14), Início "Sobre" `:73` (20), Psy link `:206` (20), Treatment "+" `:196` (quadrado 14), `OverlayButton.tsx:52` (FAB 60), `CancelButton.tsx:13` (texto).
- **Campos (1 no DS + 6 fora):** `ds/TextField` (raio 12, mín. 48, rótulo acima, erro 14 com ícone). Fora: `styles/Inputs.ts` + `InputWithIcon`/`SelectWithIcon` (altura fixa 50, borda `#4E56C0`, erro 12); `DateInput`/`TimeInput`/`BirthdayDateInput` (borda `#7A3FC4`, elev. 1, erro `#FF4C4C`); `PhoneInput` (borda `#E8E8E8`); inputs inline de Treatment create/update `:233`; código de RecoverPassword `:102` (raio 10, sem rótulo); input do chat `:465` (raio 24).

### 3.2 Duplicação `ds/` × `ui/`

| Função | `ds/` | Duplicata | Observação |
|---|---|---|---|
| Card de navegação | `NavItemCard` | `ui/Cards/NavCard`, `ActionCardList`, cartão de `LegalArea:48` | `NavCard` sem nenhum import |
| Acordeão | (`AccordionCard` já tokenizado) | `MediaAccordion`, Treatment `:88-160`, Diary `:175-221` | 3 reimplementações do mesmo padrão |
| Botão | `Button` | `ButtonPrimary`/`ButtonOutline` (wrappers) + 13 botões locais | wrappers só limitam largura a 48 % |
| Campo de texto | `TextField` | `InputWithIcon`, `PhoneInput`, inputs inline | ícone do "olho" com sentido oposto entre os dois |
| Busca | `ui/SearchBar/index.tsx` (usa `TextField`) | `ui/Inputs/SearchBar.tsx` | legado sem uso |
| Diálogo | `ConfirmDialog` | modal de AccountConfigurations, modal de Treatment create, `Alert.alert` em 7 telas | |
| Emergência | `SosButton` | `OverlayButton` + `PanicButton` | o do DS não está em produção |
| Estados | `EmptyState`/`ErrorState`/`LoadingState` | vazios locais em Treatment, Calendar, Notifications; `ActivityIndicator` solto | |
| Perfil | `ui/UserProfile/ProfileRow` (tokens) | `ProfileCenter` (literais) | |

Sem uso (candidatos ao relatório 03/04): `NavCard`, `BackButton`, `NewPublicationButton` (importa rota `SocialArea` removida), `ui/Inputs/SearchBar`, `styles/Form.ts`.

### 3.3 Valores fora dos tokens

- Cores: 43 arquivos com hex/rgba literal; maiores: Calendar (29), Notifications (22), Treatment create (21), Breathing (21), LegalArea (18). Já existe `scripts/check-hardcoded.ts` para automatizar.
- Tipografia: `fontFamily: 'Montserrat'` + `fontWeight` em 30+ estilos legados. O alias `Montserrat` carrega só o peso 400 (`app/_layout.tsx:23`), então 600/700 saem como negrito sintético ou fonte do sistema. Vários textos não definem família (ActionCardList, ProfileCenter, HomeNavigationGrid, HelloMessage, ReportsArea). Confiança: LOW — verificar em dispositivo.
- Tamanhos abaixo da escala (mínimo do DS = 13): 10 px (2 ocorrências), 11 px (13), 12 px (22).
- Espaçamentos fora da escala de 8: 6, 7, 10, 12, 14, 15, 18, 20, 22, 28, 30.

### 3.4 Proposta (não aplicada)

Tokens — o conjunto atual basta; acrescentar apenas:

| Token novo | Valor | Motivo |
|---|---|---|
| `color.border.input` | `#8A8A94` | borda de campo com 3,42:1 (1.4.11) |
| `color.tone.{brand,info,success,warning,danger,highlight}` = `{bg, fg, border}` | pares já existentes em `color.bg.*`/`color.text.*` | substitui os ~40 tons pastel literais |
| `surface.card` = `{radius.lg, space.sm, borda 1 border.default, shadow.sm}` | 16 / 16 | uma única definição de caixa |
| `surface.dialog` = `{radius.xl, space.md, shadow.md}`; `surface.sheet` = `{radius.xl no topo, space.md}` | 24 / 24 | modais |
| `cardText.title` = `typography.bodyStrong`; `cardText.body` = `typography.small` (secundário) | 16 / 14 | elimina 13–15 px e os 10–12 px |

Variantes canônicas (3):
1. **`Card` superfície** — o `ds/Card` atual, com `accessible` opcional para agrupar.
2. **`Card` tonal** — `tone` + `accent` opcional (faixa esquerda de 4 px), sem sombra. Cobre dicas, avisos, campanhas, benefícios, Mensagem do Dia.
3. **Linha/Acordeão** — `NavItemCard` para navegação e `AccordionCard` (com slot de mídia) para conteúdo expansível.

Mapa de raios: 10/12 → `md`; 14/15/16/18 → `lg`; 20/24 em superfícies → `xl`; 20–50 em botões e chips → `pill`.

| Onde | Hoje | Proposta |
|---|---|---|
| `ActionCardList.tsx:79` | raio 12, fundo `#F7F7F7`, chevron de texto "›" lilás | `NavItemCard` |
| `Treatment/index.tsx:88-160` | card 16/18, borda `#F0F0F0`, acordeão manual | `AccordionCard` + `Button` (editar/excluir) + `ConfirmDialog` |
| `MediaAccordion.tsx:68` | raio 12, borda roxa, fundo `#F9F5FF` | `AccordionCard` com slot de mídia |
| `Notifications/index.tsx:380` | raio 14, faixa esquerda, opacity .75 no lido | `Card` tonal `brand` com `accent`; lido sem opacity |
| `Calendar/index.tsx:239,319` | raios 12/15, cores por campanha | `Card` tonal; cores de campanha como `tone` |
| `LegalArea/index.tsx:105,157`, Nutrition `:143`, Sleep `:85`, Motivational `:74`, Spiritual `:60`, Breathing `:315` | raios 12–16, pads 12–18, elev. 0–3 | `Card` superfície (clicável) ou tonal (informativo) |
| `PsychologicalSupport/index.tsx:156` | raio 14, faixa colorida, selo 11 px | `Card` tonal com `accent`; selo em `typography.caption` |
| `Leisure/Movies`, `Series`, `Activities` | raio 14, elev. 3 | mesmo card de `Books/index.tsx:131` |
| `HomeNavigationGrid.tsx:58` | raio 24, elev. 4, altura fixa 130 | `Card` superfície com `minHeight` |
| `DailyMessage.style.ts:6` | raio 20, borda 1,5 | `Card` tonal `highlight` |
| AccountConfigurations `:62-96`, Treatment create `:206-220`, `Alert.alert` (7 telas) | modais próprios | `ConfirmDialog` |
| `InputWithIcon`, `PhoneInput`, inputs inline, código de RecoverPassword | 6 estilos de campo | `TextField` (com `mask`/`icon`) |
| `DateInput`/`TimeInput`/`BirthdayDateInput` | gatilho próprio + folha iOS | gatilho com aparência de `TextField` + `surface.sheet` |
| 13 botões locais (lista em 3.1) | raios 12–50, alturas variadas | `Button` (`primary`/`secondary`/`ghost`/`danger`) |
| `OverlayButton` + `PanicButton` | FAB roxo só ícone | `SosButton` |

## 4. Parte B — Acessibilidade por componente

| # | Grav. | Componente | Arquivo:linha | Critério | Problema | Correção sugerida | Muda o visual? |
|---|---|---|---|---|---|---|---|
| 1 | Bloqueia AA | Textos cinza-claros (vazios, legendas, datas, rodapés) | ver 2.1 (`#999`/`#BBB`/`#CCC`/`#AAA`/`#888`/`#777`) | 1.4.3 | 1,61–4,48:1 | `color.text.secondary` | sim |
| 2 | Bloqueia AA | Vermelho `#FF4C4C` (erros, "Desativar conta", botão destrutivo) | `AccountConfigurations/index.tsx:48,152,176`; `DateInput.tsx:152`; `Treatment/create/index.tsx:250` | 1.4.3 | 3,07–3,29:1, inclusive texto branco sobre o botão | `#B3261E` | sim |
| 3 | Bloqueia AA | Paleta por tipo/fase | `PsychologicalSupport/index.tsx:48-51,86,96`; `BreathingExercises/index.tsx:12-34,151` | 1.4.3 | 1,70–4,23:1; a contagem de 40 px falha até em 3:1 no verde e no magenta | cores da coluna "Correção" em 2.1 | sim |
| 4 | Bloqueia AA | Notificação lida | `Notifications/index.tsx:396-399,425` | 1.4.3 | `opacity: .75` derruba título para 2,43 e data para 1,61 | sem opacity; diferenciar por peso e grupo "Anteriores" (já existe) | sim |
| 5 | Bloqueia AA | Placeholders | `PhoneInput.tsx:35`; `DateInput.tsx:151`; `Treatment/create/index.tsx:142`; `RecoverPassword.tsx:72` | 1.4.3 | 2,61–2,85:1 | `#575760` | sim |
| 6 | Bloqueia AA | Calendário | `Calendar/index.tsx:135,30-31` | 1.4.3 | dias da semana 1,83; subtítulos de campanha 3,35 e 4,11 | ver 2.1 | sim |
| 7 | Bloqueia AA | Títulos de seção de Denúncias | `ReportsArea/index.tsx:68,82` | 1.4.3 | 4,10 e 3,77 (18 px bold não é "texto grande") | `#0369A1`, `#047857` | sim |
| 8 | Bloqueia AA | Borda de campo | `ds/TextField.tsx:107`; `PhoneInput.tsx:59`; `Treatment/create/index.tsx:235`; `RecoverPassword.tsx:104`; `Mascot/Chat/index.tsx:476` | 1.4.11 | 1,23–2,65:1; a borda é o único limite do campo | `color.border.input` `#8A8A94` | sim (leve) |
| 9 | Bloqueia AA | Ícones e indicadores | `InputWithIcon.tsx:50` (olho 2,32); `OnboardingForm/index.tsx:121,197` (câmera 1,88); `Treatment/index.tsx:108` (chevron 1,61); `Calendar/index.tsx:38` (pontos 2,16–2,78); `(auth)/_layout.tsx:9` (voltar 2,65 no degradê) | 1.4.11 | abaixo de 3:1 | ver 2.1 | sim |
| 10 | Bloqueia AA | Botões só com ícone, sem nome | `Treatment/index.tsx:64` ("+"); `OnboardingForm/index.tsx:121` (câmera) | 4.1.2 | leitor de tela anuncia nada ou "botão" sem nome | `accessibilityLabel="Adicionar tratamento"` / `"Alterar foto de perfil"` + `accessibilityRole="button"` | não |
| 11 | Bloqueia AA | Campos sem rótulo programático | `RecoverPassword.tsx:69-77` (só placeholder, sem rótulo visível); `PhoneInput.tsx:30`; `Treatment/create/index.tsx:136-143` (rótulo visível não associado) | 3.3.2, 4.1.2, 1.3.1 | o nome some ao digitar ou não é anunciado | `accessibilityLabel` com o texto do rótulo; rótulo visível no código de recuperação | não (rótulo novo em RecoverPassword: sim) |
| 12 | Bloqueia AA | `TouchableOpacity` sem papel | 138 ocorrências em 31 arquivos; ex.: `ActionCardList.tsx:46`, `HomeNavigationGrid.tsx:17`, `RecomendationPager.tsx:40`, `PagerHeader.tsx:13`, `LegalArea/index.tsx:48`, `Movies/index.tsx:72`, `Notifications/index.tsx:46,105,195`, `CancelButton.tsx:13`, `(Home)/index.tsx:49` | 4.1.2 | sem `accessibilityRole` (`button`/`link`); `PagerHeader` fica tocável mesmo sem rota | adicionar role e, nos links externos, `accessibilityHint="Abre o navegador"` | não |
| 13 | Bloqueia AA | Estado não exposto | `MediaAccordion.tsx:20`, `Treatment/index.tsx:89` (expandido); `BreathingExercises/index.tsx:128`, `Treatment/create/index.tsx:161` (selecionado); `Treatment/create/index.tsx:199`, `OnboardingForm/index.tsx:164`, `ChangePassword/index.tsx:102` (desabilitado/ocupado) | 4.1.2 | muda só a aparência | `accessibilityState={{ expanded }}` / `{{ selected }}` / `{{ disabled, busy }}` | não |
| 14 | Bloqueia AA | Modal de eventos do dia | `Calendar/index.tsx:205-232` | 4.1.2, 1.3.1 | toda a folha é filha de um `TouchableOpacity` (overlay): vira um único nó; conteúdo e "Fechar" ficam inalcançáveis no leitor de tela. Confiança: LOW — verificar em dispositivo | overlay como irmão (`Pressable` absoluto) + folha com `accessibilityViewIsModal` | não |
| 15 | Bloqueia AA | Títulos sem semântica de cabeçalho | `Treatment/index.tsx:61`; `Calendar/index.tsx:113`; `BreathingExercises/index.tsx:114`; `AccountConfigurations/index.tsx:56,59`; `AuthLayout.tsx:23`; `ReportsArea/index.tsx:124`; `PagerHeader.tsx:18` | 1.3.1, 2.4.6 | navegação por cabeçalhos não funciona (o `ds/Header` já faz certo) | `accessibilityRole="header"` | não |
| 16 | Bloqueia AA | Toasts e erros não anunciados | `services/toastService.ts:3-7`, `ds/Toast.tsx:17-21`; `InputWithIcon.tsx:55`, `SelectWithIcon.tsx:56`, `DateInput.tsx:74` | 4.1.3, 3.3.1 | `accessibilityLiveRegion` é só Android; no iOS o toast não é lido; erros legados sem região viva nem vínculo com o campo. Confiança: LOW no Android — verificar em dispositivo | `AccessibilityInfo.announceForAccessibility(msg)` no `toastService`; `accessibilityLiveRegion="polite"` no erro e `accessibilityHint={error}` no campo | não |
| 17 | Alta | **SOS** — componente do DS fora de produção | `ds/SosButton.tsx`; único uso em `app/design-system.tsx:169`; produção: `MentalHealth/_layout.tsx:42` | boa prática (sem critério AA) | Início, Oncologia, Mascote e Perfil não têm atalho de emergência; do Início são 2 toques até a lista e 4 até a ligação | montar `SosButton` nos layouts das áreas públicas (decisão de produto) | sim |
| 18 | Alta | **SOS** — `PanicButton`/`OverlayButton` | `OverlayButton.tsx:36-74`; `PanicButton.tsx:5-13` | 2.5.5 ok (60 px); 4.1.2 ok (tem rótulo); 3.2.4 | só ícone, roxo igual ao de ações comuns (mesmo componente do "+"); ícone de 60 px ocupa o botão inteiro; sem `accessibilityHint`; háptico disparado 2× e sem `.catch` (rejeita no Web) | curto prazo: `accessibilityHint` e remover o háptico duplicado (não visual); definitivo: trocar por `SosButton` | não / sim |
| 19 | Alta | **SOS** — lista de contatos | `EmergencyContacts.tsx:39-48`; `PanicButtonContacts/index.tsx:21-26` | 3.3.2; boa prática | ligar exige expandir o acordeão (2 toques por contato); "192" no aviso não é tocável | botão "Ligar" visível sem expandir; 192/SAMU em primeiro | sim |
| 20 | Alta | Foco visível (Expo Web) | `ds/Button.tsx:121-124`; `ds/Card.tsx:22`, `AccordionCard.tsx:42`, chips do chat `:271` (sem estilo de foco) | 2.4.7 | no botão primário/perigo o foco é +1 px de borda em roxo 1,51:1 contra o fundo e ainda desloca o layout. Confiança: LOW — verificar em dispositivo (outline padrão do navegador pode aparecer) | anel externo de 2 tons (2.1) via `outline` no Web | sim (só no foco) |
| 21 | Alta | Alvos de toque pequenos | `CancelButton.tsx:13` (~20 px de altura); `Notifications/index.tsx:195` (~16); `DateInput.tsx:91,95` (~18); `OnboardingForm/index.tsx:198` (28×28); chips de `BreathingExercises:205` e "Sobre" `(Home)/index.tsx:73` (~33); `PagerHeader.tsx:33` (40) | 2.5.8 (mín. 24; os 3 primeiros dependem da exceção de espaçamento — Confiança: LOW); 2.5.5 (AAA, 44) | abaixo do recomendado 44–48 para público idoso | `hitSlop` até completar 44 | não |
| 22 | Alta | Fonte ampliada × alturas fixas | `styles/Inputs.ts:12` e `SelectWithIcon.tsx:70` (altura 50); `HomeNavigationGrid.tsx:62` (130); `RecomendationPager.tsx:8-9`; `PagerHeader.tsx:33`; `ds/Button.tsx:91` e `ScreenTitle.tsx` (`numberOfLines={1}`); barra de abas 72 px com rótulo de 2 linhas `(Home)/_layout.tsx:30,57` | 1.4.4 | risco de corte/truncamento a 200 %. Confiança: LOW — verificar em dispositivo | `minHeight` no lugar de `height`; permitir 2 linhas no botão | só com fonte ampliada |
| 23 | Alta | Modais próprios | `AccountConfigurations/index.tsx:62-96`; `Treatment/create/index.tsx:206` (sem `onRequestClose`: o "voltar" do Android não fecha); `DateInput.tsx:87-88` (backdrop tocável sem rótulo) | 4.1.2, 2.1.2 | sem `accessibilityViewIsModal`, botões sem role. Confiança: LOW — verificar em dispositivo | props de modal + roles; ou `ConfirmDialog` | não |
| 24 | Média | Fontes de 10–12 px | 37 ocorrências; ex.: `RecomendationPager.tsx:89` (10), `Activities/index.tsx:128` (10), `styles/Inputs.ts:33` (erro 12), `LegalArea/index.tsx:182` (12) | sem mínimo na WCAG 2.2; APCA indicativo | ilegível para o público-alvo mesmo com contraste ok | mínimo 13 (`caption`), corpo 16 | sim |
| 25 | Média | Informação só por cor | `Calendar/index.tsx:38,75` (pontos por tratamento) | 1.4.1 | no calendário, só a cor distingue os tratamentos (o nome aparece ao tocar no dia) | legenda com nome ao lado da cor (já existe em "Progresso") + `accessibilityLabel` no dia | sim (leve) |
| 26 | Média | Ícone de senha inconsistente | `InputWithIcon.tsx:48` × `ds/TextField.tsx:72` | 3.2.4 | "olho" e "olho cortado" têm sentidos opostos nos dois componentes | padronizar pelo `TextField` | sim (ícone) |
| 27 | Média | `Alert.alert` | `Treatment/index.tsx:30`; `ReportsArea/index.tsx:40`; `Movies/index.tsx:22`; mais 4 telas | uso (Web) | sem botões no Expo Web (registrado em `ds/ConfirmDialog.tsx:19`): excluir tratamento não confirma no Web | `ConfirmDialog` / toast | sim |
| 28 | Média | Placeholder com cor de conteúdo | `InputWithIcon.tsx:33`; `SelectWithIcon.tsx:39-40` | 3.3.2 | placeholder `#4E56C0`, igual à cor do valor selecionado no select: não dá para saber se está preenchido | placeholder `#575760` | sim |
| 29 | Média | Mídia sem alternativa textual | `MediaViewer.tsx:50,58` (GIF/vídeo de exercício); capas em `Movies/index.tsx`, `RecomendationPager.tsx:45` | 1.1.1 | conteúdo não decorativo sem `accessibilityLabel` (o título vizinho atenua) | `accessibilityLabel` com o título do item | não |
| 30 | Média | Agrupamento de card | `ds/Card.tsx:19`; `DailyMessage.tsx:64`; cards de `LegalArea:69`, `Nutrition`, `PsychologicalSupport:77` | 1.3.1 | título, selo e corpo são lidos como itens soltos | prop `accessible` + `accessibilityLabel` composto em cards informativos (não nos que têm botão interno) | não |
| 31 | Baixa | Reduzir movimento | `ds/States.tsx:19-28` (pulso infinito); `DiaryForm.tsx` (escala); transições de modal; `BreathingExercises:59` (essencial, tem "Parar") | 2.3.3 (AAA) | `AccessibilityInfo.isReduceMotionEnabled` nunca é consultado | hook `useReducedMotion` → sem pulso/escala | só com a preferência ativa |
| 32 | Baixa | Texto justificado | `LegalArea/index.tsx:98`; `DailyMessage.tsx:74,82` | 1.4.8 (AAA) | "rios" de espaço dificultam a leitura | `textAlign: 'left'` | sim |
| 33 | Baixa | Família tipográfica | ver 3.3 | consistência | pesos sintéticos e fonte do sistema misturados com Montserrat | `typography.*` dos tokens | sim |
| 34 | Baixa | Papéis imprecisos | `PanicButtonContacts/index.tsx:21` (`alert` em aviso estático); `ds/States.tsx:85` (`summary`); `ds/ConfirmDialog.tsx:27` (`alert` no contêiner) | 4.1.2 | anúncio redundante. Confiança: LOW — verificar em dispositivo | `text`/sem role; no diálogo, foco inicial no título | não |
| 35 | Baixa | Indicador de carregamento sem nome | `Notifications/index.tsx:172`; `AccountConfigurations/index.tsx:82` | 4.1.3 | `ActivityIndicator` mudo | `LoadingState` ou `accessibilityLabel="Carregando"` | não |
| 36 | Baixa | Código morto com falhas | `NavCard.tsx`, `BackButton.tsx`, `NewPublication.tsx`, `ui/Inputs/SearchBar.tsx` | — | se reutilizados, trazem as falhas 1, 9 e 12 | remover no item 8 do plano (após aprovação do relatório 03) | não |

O que já está correto e deve ser o padrão: `ds/Button` (role, rótulo, `disabled`/`busy`, mín. 48), `ds/TextField` (rótulo visível associado, erro com ícone + texto + região viva, olho 44×44), `ds/NavItemCard` (link, rótulo composto, ≥ 64), `AccordionCard` (`expanded` + dica), `DiaryForm` (`radiogroup`/`radio`/`checked`), aba ativa com 3 sinais (cor, traço, ícone cheio), chat do mascote (rótulos, região viva, 44–48).

## 5. Ganhos sem mudança visual (só props — aplicáveis depois sem alterar aparência)

1. `accessibilityLabel` + `accessibilityRole="button"` nos 2 botões só-ícone (#10).
2. `accessibilityRole` nos `TouchableOpacity` de componentes compartilhados primeiro (`ActionCardList`, `HomeNavigationGrid`, `RecomendationPager`, `PagerHeader`, `MediaAccordion`, `CancelButton`), depois telas (#12).
3. `accessibilityState` — `expanded`, `selected`, `disabled`/`busy` (#13).
4. `accessibilityRole="header"` nos títulos de tela e seção legados (#15).
5. `accessibilityLabel` nos `TextInput` legados e `accessibilityHint={error}` + região viva nos erros (#11, #16).
6. `AccessibilityInfo.announceForAccessibility` dentro de `toastService` (#16).
7. `hitSlop` nos alvos pequenos (#21).
8. Reestruturar o modal do Calendário (overlay como irmão) e adicionar `accessibilityViewIsModal`/`onRequestClose` nos modais próprios (#14, #23).
9. SOS: `accessibilityHint` no `PanicButton`, um único háptico com `.catch` (#18).
10. `accessible` + rótulo composto nos cards informativos; rótulo em mídia e em `ActivityIndicator` (#29, #30, #35).
11. Hook de "reduzir movimento" para Skeleton e escala (#31) — só altera quem ativou a preferência.

Com 1–8 aplicados, saem 6 dos 16 bloqueios (#10, #12, #13, #14, #15, #16) e o #11 sai em parte (o campo de código de RecoverPassword continua sem rótulo visível). Os demais são contraste.

## 6. Mudanças visuais a decidir

| Decisão | Itens | Impacto visual |
|---|---|---|
| Trocar cinzas claros por `#575760` | #1, #4, #5 | textos auxiliares ficam mais escuros |
| Trocar `#FF4C4C` por `#B3261E` | #2 | vermelho mais fechado (o mesmo já usado no DS) |
| Rever paleta de tipos/fases e campanhas | #3, #6, #7, #9, #25 | verde-água, magenta e laranja escurecem |
| Escurecer borda de campo (`#8A8A94`) e ícones lilás | #8, #9 | bordas e ícones mais visíveis |
| Seta "voltar" da autenticação em `#3F1F73` | #9 | seta mais escura sobre o degradê |
| **SOS: `SosButton` em todas as áreas públicas e "Ligar" sem expandir** | #17, #18, #19 | botão vermelho "SOS" fixo; lista de contatos com botão direto |
| Anel de foco de 2 tons | #20 | só Web/teclado |
| Tamanho mínimo de fonte 13/16 e `minHeight` | #22, #24 | cards e legendas crescem |
| Migrar para as 3 variantes de caixa, `ConfirmDialog`, `TextField` e `Button` | Parte A, #23, #26, #27, #28, #32, #33 | uniformiza raios, sombras, campos e botões |

Critério de aceite 3 do plano ("nenhuma alteração visual em telas existentes") impede aplicar a seção 6 neste corte; a seção 5 é compatível com ele.
