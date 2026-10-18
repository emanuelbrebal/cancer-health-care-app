import { HeaderLogo } from '@/src/components/home/HeaderLogo';
import { SosButton } from '@/src/components/ds/SosButton';
import { ScreenTitle } from '@/src/components/ui/ScreenTitle';
import { color, iconSize, layout, radius, space, typography } from '@/src/constants/tokens';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from "expo-router";
import { ColorValue, StyleSheet, Text, View } from 'react-native';

// Telas onde o SOS flutuante atrapalharia (a própria lista de contatos, chat e formulários).
const SOS_HIDDEN_PREFIXES = [
    '/MentalHealth/PanicButtonContacts',
    '/Mascot/Chat',
    '/PersonalArea/Diary/create',
    '/PersonalArea/Diary/update',
    '/PersonalArea/Treatment/create',
    '/PersonalArea/Treatment/update',
    '/PersonalArea/AccountConfigurations',
    '/PersonalArea/OnboardingForm',
];

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
    lockBadge: {
        position: 'absolute',
        right: -space.xs,
        bottom: -space.xxs,
        backgroundColor: color.bg.surface,
        borderRadius: radius.pill,
    },
});

// Rótulo próprio: quebra em 2 linhas em vez de truncar ("Saúde Me…" em 390 px com Montserrat).
const renderTabLabel = (label: string) => function TabLabel({ color: tint }: { color: ColorValue }) {
    return <Text style={[typography.tabLabel, styles.tabLabel, { color: tint }]} numberOfLines={2}>{label}</Text>;
};

const renderTabBarIcon = (focused: boolean, tint: ColorValue, activeIcon: any, inactiveIcon: any, locked = false) => (
    <View style={focused ? styles.activeBorderContainer : styles.iconWrapper}>
        <View>
            <Ionicons name={focused ? activeIcon : inactiveIcon} size={iconSize.lg} color={tint} />
            {locked ? (
                <View style={styles.lockBadge}>
                    <Feather name="lock" size={iconSize.xs} color={color.text.secondary} />
                </View>
            ) : null}
        </View>
    </View>
);

export default function HomeLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();
    const pathname = usePathname();
    const showSos = !SOS_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

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
                        tabBarAccessibilityLabel: isAuthenticated ? "Mascote virtual" : "Mascote virtual. Requer login",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "chatbubbles", "chatbubbles-outline", !isAuthenticated
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
                        tabBarAccessibilityLabel: isAuthenticated ? "Meu Perfil" : "Meu Perfil. Requer login",
                        tabBarIcon: ({ focused, color: tint }) => renderTabBarIcon(
                            focused, tint, "person-circle", "person-circle-outline", !isAuthenticated
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
            {showSos ? <SosButton /> : null}
        </View>
    )
}
