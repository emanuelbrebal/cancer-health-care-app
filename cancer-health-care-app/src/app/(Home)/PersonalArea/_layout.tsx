import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";
import { commonStackOptions } from "@/src/constants/CommonScreenOptions";

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Área Pessoal" },
    { name: "Calendar/index", title: "Calendário Interativo" },
    { name: "Diary/index", title: "Diário" },
    { name: "Mascot/index", title: "Motivação Diária" },
    { name: "Notifications/index", title: "Autocuidados" },
    { name: "ReportsArea/index", title: "Espaço de denúncias" },
    { name: "Treatment/index", title: "Gerenciar tratamentos" },
    { name: "AccountConfigurations/index", title: "Configurações" },
];

export default function SocialStackLayout() {
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