import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarInactiveTintColor: 'grey',
            tabBarStyle: {
                position: 'absolute',
                bottom: 10,
                marginHorizontal: 20,
                borderRadius: 20
            }
        }}>
            <Tabs.Screen name="OncologyArea"
                options={{
                    tabBarLabel: "Área Oncológica",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "medkit" : "medkit-outline")} size={24} color={color} />
                }}
            />
            <Tabs.Screen name="MentalHealthArea"
                options={{
                    tabBarLabel: "Área Saúde Mental",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "happy" : "happy-outline")} size={24} color={color} />
                }}

            />
            <Tabs.Screen name="SocialArea"
                options={{
                    tabBarLabel: "Area Social",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline")} size={24} color={color} />
                }} />

            <Tabs.Screen name="PersonalArea"
                options={{
                    tabBarLabel: "Área Pessoal",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "person-circle" : "person-circle-outline")} size={24} color={color} />
                }} />

        </Tabs>
    )

}