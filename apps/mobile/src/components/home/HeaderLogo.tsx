import { Pressable, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { Avatar } from "../ui/Images/Avatar";
import { useAuthStore } from "@/src/store/useAuthStore";
import { color, space, touch, typography } from "@/src/constants/tokens";

export function HeaderLogo() {

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        // Atalho de desenvolvimento/apresentação: pressionar e segurar o logo abre o Design System.
        <Pressable
            onLongPress={() => router.push('/design-system')}
            delayLongPress={800}
            accessibilityRole="header"
            accessibilityLabel="OncoMente"
            style={styles.headerLeftContainer}
        >
            {isAuthenticated && user?.profile_picture && (
                <Avatar
                    style={styles.avatar}
                    imagePath={{ uri: user.profile_picture }}
                />
            )}
            <Text style={styles.appName}>ONCOMENTE</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    headerLeftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.xs,
        paddingLeft: space.sm,
        minHeight: touch.min,
    },
    avatar: {
        height: touch.min,
        width: touch.min,
    },
    appName: {
        ...typography.smallStrong,
        // v1: branco sobre fundo claro (invisível, P05).
        color: color.text.brand,
        letterSpacing: 1,
        textTransform: 'uppercase',
    }
});
