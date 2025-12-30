import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";

export default function OncologyStackLayout() {
    return (
        <CommonAreasLayout>
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
                        headerRight: () => <ScreenTitle title="Área Oncológica" />,

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
            <StatusBar style="auto" />
        </CommonAreasLayout>
    );
}