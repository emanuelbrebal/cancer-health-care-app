import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";
import { PanicButton } from "@/src/components/ui/Buttons/Overlay/PanicButton/PanicButton";
import { commonStackOptions } from "@/src/constants/CommonScreenOptions";


const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área de Saúde Mental" },
    { name: "Motivational/Patient/index", title: "Motivação diária" },
    { name: "Motivational/CaringTheCaregiver/index", title: "Cuidar de quem cuida" },
    { name: "Meditation/index", title: "Meditação guiada" },
    { name: "PanicButtonContacts/index", title: "Contatos de emergência" },
    { name: "BreathingExercises/index", title: "Exercícios de respiração" },
    { name: "PsychologicalSupport/index", title: "Apoio Psicológico" },
];

export default function MentalHealthStackLayout() {
    const color = Colors.purpleSecondary;



    return (
        <CommonAreasLayout>
            <Stack screenOptions={commonStackOptions}>
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