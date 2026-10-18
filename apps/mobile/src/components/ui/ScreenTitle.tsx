import { color, space, typography } from "@/src/constants/tokens";
import { Text, StyleSheet } from "react-native";

interface ScreenTitleProps {
    title: string;
    color?: string;
}

export function ScreenTitle({ title, color: titleColor }: ScreenTitleProps) {
    return (
        <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[styles.screenTitle, { color: titleColor ?? color.text.brand }]}
        >
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    screenTitle: {
        ...typography.bodyStrong,
        paddingHorizontal: space.sm,
    }
});
