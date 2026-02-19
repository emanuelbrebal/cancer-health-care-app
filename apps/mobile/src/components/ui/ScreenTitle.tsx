import { Colors } from "@/src/constants/Colors";
import { Text, StyleSheet } from "react-native";

interface ScreenTitleProps {
    title: string;
    color?: any
}

export function ScreenTitle({ title, color }: ScreenTitleProps) {
    return <Text style={[styles.screenTitle, {color: color? color : Colors.white}]}>{title}</Text>;
}

const styles = StyleSheet.create({
    screenTitle: {
        fontWeight: '600',
        fontSize: 16,
        paddingHorizontal: 15,
    }
});