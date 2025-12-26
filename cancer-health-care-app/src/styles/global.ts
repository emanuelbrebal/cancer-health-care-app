import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";

export const baseText: TextStyle = {
    fontFamily: 'Montserrat',
}

const bigImageStyle = {
    height: 230,
    width: 160,
};

const container: ViewStyle = {
    flex: 1,
    backgroundColor: 'transparent',
}
export const globalStyles = StyleSheet.create({
    // Containers
    layoutContainer: {
        ...container,
        justifyContent: 'center',
    },

    authLayoutContainer: {
        ...container,
        justifyContent: 'flex-end',
    },

    formContainer: {
        width: '100%',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        marginVertical: 10,
        gap: 20,
    },

    titleContainer: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10
    },

    dynamicContent: {
        flex: 1,
        width: '100%',
        marginVertical: 20,
    },

    // Generic container for buttons
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20,
    },

    // Text
    textPrimary: {
        ...baseText,
        color: Colors.purpleSecondary,
        fontWeight: '700',
        fontSize: 28,
    },
    textSecondary: {
        ...baseText,
        color: Colors.text.primary,
        fontSize: 17,
    },
    textHyperlink: {
        ...baseText,
        color: Colors.purpleSecondary,
        textDecorationLine: 'underline',
        textAlign: 'center',
        marginTop: 40,
        fontWeight: 'bold'
    },
    textError: {
        ...baseText,
        color: Colors.status.error,
        fontSize: 14,
    },

    // Images
    imageContainer: {
        alignItems: 'center'
    },
    bigImage: {
        ...bigImageStyle
    },
    bigImageReverted: {
        ...bigImageStyle,
        transform: [{ scaleX: -1 }],
    }

})