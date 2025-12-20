import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Layout() {

    return (
        <Stack screenOptions={{
            headerShown: true,
            headerTintColor: 'white',
            headerTransparent: true,
            headerTitle: "",
            contentStyle: { 
                backgroundColor: 'transparent',
                justifyContent: 'flex-end',
            },
            headerTitleStyle: {
                color: 'white',
            },
            
        }}>
            <Stack.Screen name="index"
                options={{
                    headerLeft: () => (
                        <View style={styles.headerLeftContainer}>
                            <View style={styles.logoCircle} /> 
                            <Text style={styles.appName}>ONCOMENTE</Text>
                        </View>
                    ),
                    headerRight: () => (
                        <Text style={styles.screenTitle}>Início</Text>
                    ),
                }}
            />

            <Stack.Screen name="LegalArea"
                options={{
                    title: "Benefícios Legais",
                }}
            />
            <Stack.Screen name="Leisure"
                options={{
                    title: "Opções de Lazer",
                }}
            />
            <Stack.Screen name="Motivational"
                options={{
                    title: "Motivação Diária",
                }}
            />

            <Stack.Screen name="SelfCare"
                options={{
                    title: "Autocuidados",
                }}
            />

            <Stack.Screen name="SpiritualArea"
                options={{
                    title: "Espiritualidade",
                }}
            />
        </Stack>
    )
}

const styles = StyleSheet.create({
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8, 
    },
    logoCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#5CC6FF', 
    },
    appName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1, 
        textTransform: 'uppercase',
    },
    screenTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        paddingRight: 10, 
    }
});