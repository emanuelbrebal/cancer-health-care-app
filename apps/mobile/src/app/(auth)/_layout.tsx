import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Stack } from "expo-router";
import { color } from "@/src/constants/tokens";

export default function Layout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: "",
            headerTintColor: color.text.brand,
            headerTransparent: true,
            contentStyle: { 
                backgroundColor: 'transparent',
             },
            headerTitleStyle: {
                color: color.text.brand,
            },
            headerBackButtonDisplayMode: 'minimal',
            animation: 'default',
        }}>
            <Stack.Screen name="index"
                options={{
                    headerShown: false,
                    headerRight: () => <ScreenTitle title="" color={color.text.onGradient} />,
                }}
            />
            <Stack.Screen name="LoginScreen"
                options={{
                    headerRight: () => <ScreenTitle title="Login" color={color.text.onGradient} />,
                }}
            />
            <Stack.Screen name="RegisterScreen"
                options={{
                    headerRight: () => <ScreenTitle title="Cadastrar" color={color.text.onGradient} />,
                }}
            />
            <Stack.Screen name="RecoverPassword"
                options={{
                    headerRight: () => <ScreenTitle title="Recuperar Senha" color={color.text.onGradient} />,
                }}
            />
            <Stack.Screen name="ResetPassword"
                options={{
                    headerRight: () => <ScreenTitle title="Redefinir Senha" color={color.text.onGradient} />,
                }}
            />
        </Stack>
    )

}