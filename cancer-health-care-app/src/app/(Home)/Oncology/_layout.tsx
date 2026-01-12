import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área Oncológica" },
    { name: "Motivational/index", title: "Motivação Diária" },
    { name: "Motivational/CaringTheCaretaker/index", title: "Cuidar de quem Cuida" },
    { name: "Nutrition/index", title: "Nutrição" },
    { name: "Sleep/index", title: "Cuidados com o Sono" },
    { name: "PhysicalExercises/index", title: "Exercícios Físicos" },
    { name: "LegalArea/index", title: "Benefícios Legais" },
    { name: "Leisure/index", title: "Recomendações de Lazer" },
    { name: "SpiritualArea/index", title: "Espiritualidade" },
];

export default function OncologyStackLayout() {
    const color = Colors.purpleSecondary;
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
                {screensConfig.map((screen) => (
                    <Stack.Screen
                        key={screen.name}
                        name={screen.name}
                        options={{
                            headerRight: () => <ScreenTitle color={color} title={screen.title} />,
                        }}
                    />
                ))}
            </Stack>
            <StatusBar style="auto" />
        </CommonAreasLayout>
    );
}