import { Stack } from "expo-router";

export default function Layout() {

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTintColor: 'white',
            headerTransparent: true,
            contentStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: {
                color: 'white',
            },
            
        }}>
            <Stack.Screen name="index"
                options={{
                    title: "Início"
                }}
            />

            <Stack.Screen name="LegalArea"
                options={{
                    title: "Benefícios Legais",
                }}
            />
            <Stack.Screen name="Leisure"
                options={{
                    title: "Opções de Lazer",
                }}
            />
            <Stack.Screen name="Motivational"
                options={{
                    title: "Motivação Diária",
                }}
            />

            <Stack.Screen name="SelfCare"
                options={{
                    title: "Autocuidados",
                }}
            />

            <Stack.Screen name="SpiritualArea"
                options={{
                    title: "Espiritualidade",
                }}
            />
        </Stack>
    )
}