import { color, palette } from './tokens';

// API legada de cores, agora derivada dos tokens (src/constants/tokens.ts).
// purplePrimary passou a ser o roxo de ação acessível (6.3:1 com branco);
// o roxo de identidade #9B5DE0 continua disponível como brandAccent.
export const Colors = {
    purplePrimary: color.action.primary,
    purpleSecondary: color.text.brand,
    lilacPrimary: palette.lilac400,
    brandAccent: palette.brand500,

    redPrimary: color.action.danger,

    cyan: palette.mint50,
    cyanSecondary: palette.teal200,
    white: palette.neutral0,
    black: palette.neutral900,

    tabBar: {
        ActiveTintColor: color.action.primary,
        InactiveTintColor: color.text.secondary,
        backgroundColor: color.bg.surface,
        borderColor: color.border.default,
    },

    text: {
        primary: color.text.primary,
        secondary: color.text.secondary,
        white: color.text.onAction,
    },

    status: {
        success: color.text.success,
        error: color.text.danger,
    },

    bgGradient: {
        start: color.bg.gradientBottom,
        end: color.bg.gradientTop,
    },

}
