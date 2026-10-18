import { NativeStackNavigationOptions } from 'expo-router';
import { color } from './tokens';

export const commonStackOptions: NativeStackNavigationOptions = {
    headerShown: true,
    // v1 usava 'white' sobre o cartão branco: seta "voltar" invisível (P04).
    headerTintColor: color.text.brand,
    headerBackButtonDisplayMode: 'minimal',
    headerTransparent: true,
    headerTitle: "",
    headerShadowVisible: false,
    contentStyle: {
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
};
