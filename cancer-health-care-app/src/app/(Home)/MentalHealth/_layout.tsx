import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";
import { PanicButton } from "@/src/components/ui/Buttons/PanicButton.tsx/PanicButton";


const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área de Saúde Mental" },
    { name: "CaringTheCaretaker/index", title: "Cuidar de quem cuida" },
    { name: "Meditation/index", title: "Meditação guiada" },
    { name: "MourningPhases/Presentation/index", title: "O que são as fases do luto" },
    { name: "MourningPhases/Overcoming/index", title: "Como Superar fases do luto" },
    { name: "MourningPhases/Phases/index", title: "Quais são as fases do luto" },
    { name: "PanicButtonContacts/index", title: "Contatos de emergência" },
];

export default function MentalHealthStackLayout() {
    const color = Colors.purpleSecondary;
    
    const pathname = usePathname();
    const isContactsPage = pathname.includes('PanicButtonContacts');

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
            {!isContactsPage && <PanicButton />}
            <StatusBar style="auto" />
        </CommonAreasLayout>
    );
}