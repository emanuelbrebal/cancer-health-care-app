import { StyleSheet, ViewStyle } from "react-native";

// Cores, tipografia, altura e estados vêm do Button do Design System (components/ds/Button.tsx).
// Aqui fica só a largura usada pelos pares de botões lado a lado.
const baseButton: ViewStyle = {
    flex: 1,
    maxWidth: '48%',
};

export const ButtonStyles = StyleSheet.create({
    buttonPrimary: {
        ...baseButton,
    },
    buttonOutline: {
        ...baseButton,
    },
});
