import { Text, StyleSheet } from "react-native";

interface ScreenTitleProps {
    title: string;
}

export function ScreenTitle({ title }: ScreenTitleProps) {
    return <Text style={styles.screenTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
    screenTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        paddingHorizontal: 15,
    }
});