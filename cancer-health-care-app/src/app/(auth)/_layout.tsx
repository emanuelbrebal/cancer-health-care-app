import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTitle: "",
            headerTintColor: 'white',
            headerTransparent: true,
            contentStyle: { 
                backgroundColor: 'transparent',
             },
            headerTitleStyle: {
                color: 'white',
            },
            headerBackButtonDisplayMode: 'minimal',
            animation: 'default',
        }}>
            <Stack.Screen name="index"
                options={{
                    headerRight: () => <ScreenTitle title="" />,
                }}
            />
            <Stack.Screen name="LoginScreen"
                options={{
                    headerRight: () => <ScreenTitle title="Login" />,
                }}
            />
            <Stack.Screen name="RegisterScreen"
                options={{
                    headerRight: () => <ScreenTitle title="Cadastrar" />,
                }}
            />
            <Stack.Screen name="RecoverPassword"
                options={{
                    headerRight: () => <ScreenTitle title="Recuperar Senha" />,
                }}
            />
            <Stack.Screen name="ResetPassword"
                options={{
                    headerRight: () => <ScreenTitle title="Redefinir Senha" />,
                }}
            />
        </Stack>
    )

}