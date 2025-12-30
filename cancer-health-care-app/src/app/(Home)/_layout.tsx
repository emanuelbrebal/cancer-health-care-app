import { HeaderLogo } from '@/src/components/home/HeaderLogo';
import { ScreenTitle } from '@/src/components/ui/ScreenTitle';
import { Colors } from '@/src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
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

    return (
        <Tabs screenOptions={{
            sceneStyle: {
                backgroundColor: 'transparent'
            },
            headerShown: true,
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
                    headerRight: () => <ScreenTitle title="Oncologia" />,
                }}
            />

            <Tabs.Screen name="MentalHealth"
                options={{
                    tabBarLabel: "Saúde Mental",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "happy", "happy-outline"
                    ),
                    headerRight: () => <ScreenTitle title="Saúde Mental" />,
                }}
            />

            <Tabs.Screen name="SocialArea"
                options={{
                    tabBarLabel: "Área Social",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "chatbubble-ellipses", "chatbubble-ellipses-outline"
                    ),
                    headerRight: () => <ScreenTitle title="Área Social" />,
                }}
            />

            <Tabs.Screen name="PersonalArea"
                options={{
                    tabBarLabel: "Meu Perfil",
                    tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                        focused, color, "person-circle", "person-circle-outline"
                    ),
                    headerRight: () => <ScreenTitle title="Meu Perfil" />,

                }}
            />
        </Tabs>
    )
}