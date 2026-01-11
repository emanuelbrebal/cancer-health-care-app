import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { ScreenConfig } from "@/src/types/ScreenConfig";

const screensConfig: ScreenConfig[] = [
    { name: "index", title: "Comunidade OncoMente" },
    { name: "Chats/index", title: "Bate-papo" },
    { name: "Topics/index", title: "Tópicos" },
    { name: "Communities/index", title: "Comunidades" },
];

export default function PersonalAreaStackLayout() {
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