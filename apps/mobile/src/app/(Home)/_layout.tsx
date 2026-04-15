import { HeaderLogo } from '@/src/components/home/HeaderLogo';
import { ScreenTitle } from '@/src/components/ui/ScreenTitle';
import { Colors } from '@/src/constants/Colors';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    activeBorderContainer: {
        borderTopWidth: 3,
        borderTopColor: Colors.purplePrimary,
        paddingTop: 5,
        alignItems: 'center',
        width: '100%',
        minHeight: 40
    },
});

const renderTabBarIcon = (focused: boolean, color: any, activeIcon: any, inactiveIcon: string) => (
    <View style={focused ? styles.activeBorderContainer : {}}>
        <Ionicons name={(focused ? activeIcon : inactiveIcon)} size={24} color={color} />
    </View>
);

export default function HomeLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();
    return (
        <Tabs screenOptions={{
            sceneStyle: {
                backgroundColor: 'transparent'
            },
            headerTransparent: true,
            headerTitle: "",
            tabBarActiveTintColor: Colors.tabBar.ActiveTintColor,
            tabBarInactiveTintColor: Colors.tabBar.InactiveTintColor,
            tabBarStyle: {
                backgroundColor: Colors.tabBar.backgroundColor,
                height: 80,
                borderColor: Colors.tabBar.borderColor,
            },

        }}>

            <Tabs.Screen name="index"
                options={{
                    tabBarLabel: "Início",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "home", "home-outline"
                    ),
                    headerLeft: () => <HeaderLogo />,
                    headerRight: () => <ScreenTitle title='Início' />,
                }}
            />

            <Tabs.Screen name="Oncology"
                options={{
                    tabBarLabel: "Oncologia",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "medkit", "medkit-outline"
                    ),
                }}
            />

            <Tabs.Screen name="MentalHealth"
                options={{
                    tabBarLabel: "Saúde Mental",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "happy", "happy-outline"
                    ),
                }}
            />

            <Tabs.Screen name="Mascot"
                options={{
                    tabBarLabel: "Mascote Virtual",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "chatbubbles", "chatbubbles-outline"
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();

                            router.push('/Mascot');
                        }
                    },
                }}
            />

            <Tabs.Screen name="PersonalArea"
                options={{
                    tabBarLabel: "Meu Perfil",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "person-circle", "person-circle-outline"
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        if (!isAuthenticated) {
                            e.preventDefault();

                            router.push('/PersonalArea');
                        }
                    },
                }}
            />
        </Tabs>
    )
}