import { HeaderLogo } from '@/src/components/home/HeaderLogo';
import { ScreenTitle } from '@/src/components/ui/ScreenTitle';
import { color, iconSize, layout, space, typography } from '@/src/constants/tokens';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from "expo-router";
import { ColorValue, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    activeBorderContainer: {
        borderTopWidth: layout.tabIndicator,
        borderTopColor: color.action.primary,
        paddingTop: space.xxs,
        alignItems: 'center',
        width: '100%',
    },
    iconWrapper: {
        alignItems: 'center',
    },
    tabLabel: {
        textAlign: 'center',
    },
});

// Rótulo próprio: quebra em 2 linhas em vez de truncar ("Saúde Me…" em 390 px com Montserrat).
const renderTabLabel = (label: string) => function TabLabel({ color: tint }: { color: ColorValue }) {
    return <Text style={[typography.tabLabel, styles.tabLabel, { color: tint }]} numberOfLines={2}>{label}</Text>;
};

const renderTabBarIcon = (focused: boolean, tint: ColorValue, activeIcon: any, inactiveIcon: any) => (
    <View style={focused ? styles.activeBorderContainer : styles.iconWrapper}>
        <Ionicons name={focused ? activeIcon : inactiveIcon} size={iconSize.lg} color={tint} />
    </View>
);

export default function HomeLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    return (
        <View style={styles.root}>
            <Tabs screenOptions={{
                sceneStyle: {
                    backgroundColor: 'transparent'
                },
                headerTransparent: true,
                headerTitle: "",
                tabBarActiveTintColor: color.action.primary,
                tabBarInactiveTintColor: color.text.secondary,
                tabBarItemStyle: { paddingHorizontal: 0 },
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: color.bg.surface,
                    height: layout.tabBarHeight,
                    paddingTop: space.xxs,
                    borderTopColor: color.border.default,
                },

            }}>

                <Tabs.Screen name="index"
                    options={{
                        tabBarLabel: renderTabLabel("Início"),
                        tabBarAccessibilityLabel: "Início",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "home", "home-outline"
                        ),
                        headerLeft: () => <HeaderLogo />,
                        headerRight: () => <ScreenTitle title='Início' />,
                    }}
                />

                <Tabs.Screen name="Oncology"
                    options={{
                        tabBarLabel: renderTabLabel("Oncologia"),
                        tabBarAccessibilityLabel: "Oncologia: autocuidado, lazer e direitos",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "medkit", "medkit-outline"
                        ),
                    }}
                />

                <Tabs.Screen name="MentalHealth"
                    options={{
                        tabBarLabel: renderTabLabel("Saúde Mental"),
                        tabBarAccessibilityLabel: "Saúde Mental",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "happy", "happy-outline"
                        ),
                    }}
                />

                <Tabs.Screen name="Mascot"
                    options={{
                        // "Mascote Virtual" era truncado em 390 px (P15); nome completo fica no título da tela.
                        tabBarLabel: renderTabLabel("Mascote"),
                        tabBarAccessibilityLabel: "Mascote virtual",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "chatbubbles", "chatbubbles-outline"
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

                <Tabs.Screen name="About"
                    options={{
                        href: null,
                        headerTitle: '',
                        headerTransparent: true,
                    }}
                />

                <Tabs.Screen name="PersonalArea"
                    options={{
                        tabBarLabel: renderTabLabel("Meu Perfil"),
                        tabBarAccessibilityLabel: "Meu Perfil",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "person-circle", "person-circle-outline"
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
        </View>
    )
}
