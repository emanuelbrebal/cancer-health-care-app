import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
            <Tabs.Screen name="LegalArea"
                options={{
                    tabBarLabel: "Benefícios Legais",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "medkit" : "medkit-outline")} size={24} color={color} />
                }}
            />
            <Tabs.Screen name="Leisure"
                options={{
                    tabBarLabel: "Opções de Lazer",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "happy" : "happy-outline")} size={24} color={color} />
                }}

            />
            <Tabs.Screen name="Motivational"
                options={{
                    tabBarLabel: "Motivação Diária",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline")} size={24} color={color} />
                }} />

            <Tabs.Screen name="SelfCare"
                options={{
                    tabBarLabel: "Autocuidados",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "person-circle" : "person-circle-outline")} size={24} color={color} />
                }} />

            <Tabs.Screen name="SpiritualArea"
                options={{
                    tabBarLabel: "Espiritualidade",
                    tabBarIcon: ({ focused, color }) => <Ionicons name={(focused ? "person-circle" : "person-circle-outline")} size={24} color={color} />
                }} />
        </Tabs>
    )
}