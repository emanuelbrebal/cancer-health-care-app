import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";

// criar o botão do pânico como layout para todas as páginas dessa área

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área de Saúde Mental" },
    { name: "CaringTheCaretaker/index", title: "Cuidar de quem cuida" },
    { name: "Meditation/index", title: "Meditação guiada" },
    { name: "MourningPhases/index", title: "Superar fases do luto" },
    { name: "Nutrition/index", title: "Autocuidados" },
    { name: "SpiritualArea/index", title: "Espiritualidade" },
];

export default function MentalHealthStackLayout() {
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