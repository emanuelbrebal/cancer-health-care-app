import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";
import { baseText } from "./global";

const baseButton: ViewStyle = {
    height: 45,
    width: '45%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
};
const baseButtonText: TextStyle = {
    ...baseText,
    fontSize: 16,
    fontWeight: '600'
}
export const ButtonStyles = StyleSheet.create({
    // Buttons 
    buttonPrimary: {
        ...baseButton,
        backgroundColor: Colors.purplePrimary,
    },
    buttonTextPrimary: {
        ...baseButtonText,
        color: Colors.text.white,
    },
    buttonOutline: {
        ...baseButton,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.purpleSecondary,
    },
    buttonTextOutline: {
        ...baseButtonText,
        color: Colors.purpleSecondary,
    },
});