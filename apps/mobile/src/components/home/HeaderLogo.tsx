import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "../ui/Images/Avatar";
import { useAuthStore } from "@/src/store/useAuthStore";
import { color } from "@/src/constants/tokens";

export function HeaderLogo() {
   
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <View style={styles.headerLeftContainer}>
            {isAuthenticated && user?.profile_picture && (
                <Avatar 
                    style={{ height: 44, width: 44 }} 
                    imagePath={{ uri: user.profile_picture }} 
                />
            )}
            <Text style={styles.appName}>ONCOMENTE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 10,
    },
    appName: {
        // Branco sobre o topo claro do gradiente ficava ~1.1:1 (P05).
        color: color.text.brand,
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});