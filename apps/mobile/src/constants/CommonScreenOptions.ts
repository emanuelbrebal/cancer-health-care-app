import { NativeStackNavigationOptions } from 'expo-router';
import { color } from './tokens';

// Header opaco e fora do fluxo de scroll: o conteúdo começa abaixo dele e
// nunca passa por baixo (antes era transparente e cobria banners/imagens).
export const commonStackOptions: NativeStackNavigationOptions = {
    headerShown: true,
    // v1 usava 'white' sobre o cartão branco: seta "voltar" invisível (P04).
    headerTintColor: color.text.brand,
    headerBackButtonDisplayMode: 'minimal',
    headerTransparent: false,
    headerStyle: {
        backgroundColor: color.bg.surface,
    },
    headerTitle: "",
    headerShadowVisible: false,
    contentStyle: {
        backgroundColor: color.bg.surface,
    },
};
