// Design tokens do OncoMente (fonte única de cor, tipografia, espaçamento, raio e sombra).
// Arquivo sem imports de React Native para ser lido também por scripts/check-contrast.ts.

/** Paleta base. Use os tokens semânticos (`color`) nas telas, não a paleta diretamente. */
export const palette = {
  brand50: '#F7F1FE',
  brand100: '#EEE3FB',
  brand200: '#DCC8F5',
  brand500: '#9B5DE0', // identidade (acento): ícones grandes, bordas, foco. Não usar como fundo de texto.
  brand700: '#7A3FC4', // ação primária: fundo de botão, links
  brand750: '#6A35AF', // hover da ação primária (web)
  brand800: '#5B2E99',
  brand900: '#3F1F73', // texto sobre o topo lilás do degradê
  indigo600: '#4E56C0',
  lilac400: '#D78FEE',

  neutral0: '#FFFFFF',
  neutral50: '#FAFAFB',
  neutral100: '#F4F4F6',
  neutral200: '#E6E6EA',
  neutral400: '#9E9EA8',
  neutral600: '#575760',
  neutral700: '#3F3F46',
  neutral900: '#1A1A1A',

  danger50: '#FDECEA',
  danger700: '#B3261E',
  danger750: '#A0221B',
  danger800: '#8C1D18',
  success50: '#E8F5EC',
  success700: '#1E7A3C',
  warning50: '#FEF3C7',
  warning800: '#92400E',
  info50: '#E8F2FC',
  info700: '#0B5FA0',
  mint50: '#E6FBF5',
  teal200: '#A6D6D6',
} as const;

/** Tokens semânticos. */
export const color = {
  text: {
    primary: palette.neutral900,
    secondary: palette.neutral600,
    brand: palette.indigo600,
    brandStrong: palette.brand800,
    /** Texto sobre o topo do degradê (lilac400): logo e títulos de header do Início e da autenticação. */
    onGradient: palette.brand900,
    link: palette.brand700,
    onAction: palette.neutral0,
    danger: palette.danger700,
    success: palette.success700,
    warning: palette.warning800,
    info: palette.info700,
    disabled: palette.neutral600,
  },
  bg: {
    screen: palette.neutral0,
    surface: palette.neutral0,
    subtle: palette.neutral100,
    brandSubtle: palette.brand50,
    brandMuted: palette.brand100,
    danger: palette.danger50,
    success: palette.success50,
    warning: palette.warning50,
    info: palette.info50,
    highlight: palette.mint50,
    overlay: 'rgba(26, 26, 26, 0.5)',
    /** Faixa sobre capas/fotos (texto branco). Pior caso composto sobre branco: #474747. */
    scrim: 'rgba(26, 26, 26, 0.78)',
    gradientTop: palette.lilac400,
    gradientBottom: palette.neutral0,
  },
  action: {
    primary: palette.brand700,
    primaryHover: palette.brand750,
    primaryPressed: palette.brand800,
    danger: palette.danger700,
    dangerHover: palette.danger750,
    dangerPressed: palette.danger800,
    disabledBg: palette.neutral200,
  },
  border: {
    default: palette.neutral200,
    strong: palette.neutral400,
    brand: palette.brand500,
    focus: palette.brand500,
    danger: palette.danger700,
  },
  icon: {
    brand: palette.brand500,
    muted: palette.neutral600,
  },
} as const;

export const fontFamily = {
  regular: 'Montserrat_400Regular',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
} as const;

/** Escala tipográfica sem serifa (Montserrat). Corpo mínimo de 16; 13 apenas em legendas. */
export const typography = {
  display: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 34 },
  title: { fontFamily: fontFamily.bold, fontSize: 22, lineHeight: 28 },
  subtitle: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  smallStrong: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  /** Rótulo da barra de abas (padrão de plataforma iOS/Android: 10–12 px). */
  tabLabel: { fontFamily: fontFamily.semibold, fontSize: 11, lineHeight: 14, letterSpacing: -0.2 },
} as const;

/** Espaçamento em escala de 8 (4 apenas para ajustes finos). */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const shadow = {
  sm: {
    shadowColor: palette.neutral900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: palette.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

/** Alvos de toque (WCAG 2.5.5 / Material: 44–48). */
export const touch = {
  min: 44,
  comfortable: 48,
} as const;

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Medidas estruturais compartilhadas (barra de abas, mascote, banners). */
export const layout = {
  tabBarHeight: 72,
  screenPadding: space.sm,
  maxContentWidth: 560,
  mascotSm: 72,
  mascotMd: 120,
  mascotLg: 150,
  bannerHeight: 112,
  borderHairline: 1,
  borderStrong: 2,
  tabIndicator: 3,
  focusRing: 3,
} as const;

export const motion = {
  pulse: 700,
} as const;

/**
 * Pares texto/fundo usados no app. scripts/check-contrast.ts falha se algum ficar < 4.5:1.
 * Ao criar uma combinação nova nos componentes, registre-a aqui.
 */
export const contrastPairs: { fg: string; bg: string; uso: string }[] = [
  { fg: color.text.primary, bg: color.bg.surface, uso: 'Texto principal' },
  { fg: color.text.secondary, bg: color.bg.surface, uso: 'Texto secundário / descrições' },
  { fg: color.text.secondary, bg: color.bg.subtle, uso: 'Texto secundário em superfície neutra' },
  { fg: color.text.brand, bg: color.bg.surface, uso: 'Títulos de header e seções' },
  { fg: color.text.onGradient, bg: color.bg.gradientTop, uso: 'Logo e título de header sobre o degradê' },
  { fg: color.text.primary, bg: color.bg.gradientTop, uso: 'Saudação do Início sobre o gradiente' },
  { fg: color.text.link, bg: color.bg.surface, uso: 'Links e botão secundário' },
  { fg: color.text.link, bg: color.bg.brandSubtle, uso: 'Link sobre superfície lilás' },
  { fg: color.text.brandStrong, bg: color.bg.brandMuted, uso: 'Chips e cards lilás' },
  { fg: color.text.onAction, bg: color.action.primary, uso: 'Botão primário (default)' },
  { fg: color.text.onAction, bg: color.action.primaryHover, uso: 'Botão primário (hover, web)' },
  { fg: color.text.onAction, bg: color.action.primaryPressed, uso: 'Botão primário (pressed)' },
  { fg: color.text.onAction, bg: color.action.danger, uso: 'Botão SOS / perigo' },
  { fg: color.text.onAction, bg: color.action.dangerHover, uso: 'Botão perigo (hover, web)' },
  { fg: color.text.onAction, bg: color.action.dangerPressed, uso: 'Botão SOS (pressed)' },
  { fg: color.text.link, bg: color.bg.subtle, uso: 'Botão secundário/ghost (hover, web)' },
  { fg: color.text.disabled, bg: color.action.disabledBg, uso: 'Botão desabilitado' },
  { fg: color.text.danger, bg: color.bg.surface, uso: 'Mensagem de erro de campo' },
  { fg: color.text.danger, bg: color.bg.danger, uso: 'ErrorState / toast de erro' },
  { fg: color.text.success, bg: color.bg.success, uso: 'Toast de sucesso' },
  { fg: color.text.warning, bg: color.bg.warning, uso: 'Aviso (contatos de emergência)' },
  { fg: color.text.info, bg: color.bg.info, uso: 'Faixa informativa (chat)' },
  { fg: color.text.primary, bg: color.bg.highlight, uso: 'Mensagem do Dia' },
  { fg: color.text.primary, bg: color.bg.subtle, uso: 'Balão do mascote no chat' },
  { fg: color.text.secondary, bg: color.bg.surface, uso: 'Placeholder de campo' },
  { fg: color.text.secondary, bg: color.bg.brandSubtle, uso: 'Subtítulo em card lilás' },
  { fg: color.text.onAction, bg: color.action.primary, uso: 'Balão do usuário no chat' },
  { fg: color.text.onAction, bg: '#474747', uso: 'Título sobre capa (scrim 78% no pior caso)' },
];

export const tokens = { palette, color, fontFamily, typography, space, radius, shadow, touch, iconSize, layout, motion, contrastPairs };
export default tokens;
