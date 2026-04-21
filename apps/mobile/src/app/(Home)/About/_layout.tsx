import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { Stack, router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { ScreenTitle } from "@/src/components/ui/ScreenTitle";
import { Colors } from "@/src/constants/Colors";
import { commonStackOptions } from "@/src/constants/CommonScreenOptions";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AboutStackLayout() {
    const color = Colors.purpleSecondary;
    return (
        <CommonAreasLayout>
            <Stack screenOptions={commonStackOptions}>
                <Stack.Screen
                    name="index"
                    options={{
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 8 }}>
                                <Ionicons name="arrow-back" size={24} color={color} />
                            </TouchableOpacity>
                        ),
                        headerRight: () => <ScreenTitle color={color} title="Sobre o Projeto" />,
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </CommonAreasLayout>
    );
}
