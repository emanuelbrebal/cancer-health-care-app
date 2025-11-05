import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {

    return (
        <Tabs  screenOptions={{
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
            <Tabs.Screen name="tela1"
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ focused, color}) => <Ionicons name={(focused ? "home" : "home-outline")} size={24} color={color} />
                }}
            />
            <Tabs.Screen name="tela2" 
                options={{
                    tabBarLabel: "Perfil",
                    tabBarIcon: ({ focused, color}) => <Ionicons name={(focused ? "person" : "person-outline")} size={24} color={color} />
                }}
            
            />
            <Tabs.Screen name="tela3"
            options={{
                    tabBarLabel: "Configurações",
                    tabBarIcon: ({ focused, color}) => <Ionicons name={(focused ? "settings" : "settings-outline")} size={24} color={color} />
                }} />

        </Tabs>
    )

}