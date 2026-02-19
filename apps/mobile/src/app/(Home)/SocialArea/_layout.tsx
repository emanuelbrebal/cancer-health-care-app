import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";
import { commonStackOptions } from "@/src/constants/CommonScreenOptions"

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Comunidade OncoMente" },
    { name: "Forum/index", title: "Comunidade OncoMente" },
    { name: "Forum/Chats/index", title: "Bate-papo" },
    { name: "Forum/Topics/index", title: "Tópicos" },
    { name: "Forum/Communities/index", title: "Comunidades" },
];

export default function SocialAreaStackLayout() {
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