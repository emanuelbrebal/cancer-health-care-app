import { ScreenTitle } from "@/src/components/ScreenTitle";
import { Stack } from "expo-router";

export default function OncologyStackLayout() {

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTintColor: 'white',
            headerTransparent: true,
            headerTitle: "",
            contentStyle: {
                backgroundColor: 'transparent',
                justifyContent: 'flex-end',
            },
        }}>

            <Stack.Screen name="index"
                options={{
                }}
            />


            <Stack.Screen name="LegalArea/index"
                options={{
                    headerRight: () => <ScreenTitle title="Benefícios Legais" />,
                }}
            />

            <Stack.Screen name="Leisure/index"
                options={{
                    headerRight: () => <ScreenTitle title="Opções de Lazer" />,
                }}
            />

            <Stack.Screen name="Motivational/index"
                options={{
                    headerRight: () => <ScreenTitle title="Motivação Diária" />,
                }}
            />

            <Stack.Screen name="SelfCare/index"
                options={{
                    headerRight: () => <ScreenTitle title="Autocuidados" />,
                }}
            />

            <Stack.Screen name="SpiritualArea/index"
                options={{
                    headerRight: () => <ScreenTitle title="Espiritualidade" />,
                }}
            />
        </Stack>
    )
}
