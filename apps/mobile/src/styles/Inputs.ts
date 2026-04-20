import { StyleSheet } from "react-native"
import { Colors } from "../constants/Colors"

export const InputStyles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.purpleSecondary,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: Colors.white,
        width: '100%',
    },
    inputContainerError: {
        borderColor: Colors.status.error,
        borderWidth: 1.5,
    },
    iconLeft: {
        marginRight: 10,
    },
    inputField: {
        flex: 1,
        height: '100%',
        color: Colors.text.primary,
        fontFamily: 'Montserrat',
        fontSize: 16,
        borderWidth: 0,
    },
    errorText: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        color: Colors.status.error,
        marginTop: 4,
        marginLeft: 4,
    },
})