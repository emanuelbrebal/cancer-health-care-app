import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const styles = StyleSheet.create({
    activeBorderContainer: {
        borderTopWidth: 3,
        borderTopColor: '#9B5DE0',
        paddingTop: 5,
        alignItems: 'center',
        width: '100%',
        minHeight: 40
    },
    tabsContainer: {
        flex: 1,
    }
});

const renderTabBarIcon = (focused: boolean, color: any, activeIcon: any, inactiveIcon: string) => (
    <View style={focused ? styles.activeBorderContainer : {}}>
        <Ionicons name={(focused ? activeIcon : inactiveIcon)} size={24} color={color} />
    </View>
);

export default function Layout() {

    return (
        <LinearGradient colors={['#FFFFFF', '#D78FEE']} start={[0, 1]} end={[0, 0]} style={{ flex: 1 }} >

            <Tabs screenOptions={{
                sceneStyle: {
                    backgroundColor: 'transparent'
                },
                headerShown: false,
                tabBarActiveTintColor: '#8c4ad8ff',
                tabBarInactiveTintColor: '#b15cceff',
                tabBarStyle: {
                    backgroundColor: '#ffffff56',
                    height: 80,
                    borderColor: '#9B5DE0',
                },

            }}>

                <Tabs.Screen name="(Home)"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                            focused, color, "home", "home-outline"
                        ),

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

                <Tabs.Screen name="SocialArea"
                    options={{
                        tabBarLabel: "Área Social",
                        tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                            focused, color, "chatbubble-ellipses", "chatbubble-ellipses-outline"
                        ),
                    }}
                />

                <Tabs.Screen name="PersonalArea"
                    options={{
                        tabBarLabel: "Meu Perfil",
                        tabBarIcon: ({ focused, color }) => renderTabBarIcon(
                            focused, color, "person-circle", "person-circle-outline"
                        ),
                    }}
                />

                <Tabs.Screen
                    name="auth"
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
        </LinearGradient >

    )
}