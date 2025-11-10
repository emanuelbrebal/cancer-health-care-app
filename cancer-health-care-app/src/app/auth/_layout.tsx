import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'purple',
            tabBarInactiveTintColor: 'grey',
            tabBarStyle: {
                position: 'absolute',
                bottom: 10,
                marginHorizontal: 20,
                borderRadius: 20
            }
        }}>
            <Tabs.Screen name="Oncology"
                options={{
                    tabBarLabel: "Oncologia",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "medkit" : "medkit-outline")} size={24} color={color} />
                }}
            />
            <Tabs.Screen name="MentalHealth"
                options={{
                    tabBarLabel: "Saúde Mental",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "happy" : "happy-outline")} size={24} color={color} />
                }}

            />
            <Tabs.Screen name="SocialArea"
                options={{
                    tabBarLabel: "Área Social",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline")} size={24} color={color} />
                }} />

            <Tabs.Screen name="PersonalArea"
                options={{
                    tabBarLabel: "Meu Perfil",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "person-circle" : "person-circle-outline")} size={24} color={color} />
                }} />

            <Tabs.Screen
                name="auth"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    )

}