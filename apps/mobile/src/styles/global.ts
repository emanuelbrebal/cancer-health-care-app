import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";
import { ImageStyle } from 'react-native';

export const baseText: TextStyle = {
    fontFamily: 'Montserrat',
}

const bigImageContainer: ImageStyle = {
    height: 320,
    width: '100%',
};

const rectangleHelper: ViewStyle = {
    height: 110,
    width: '90%',
    borderRadius: 12,
    alignSelf: 'center',
    overflow: 'hidden',
};

const container: ViewStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    elevation: 0,
}

export const globalStyles = StyleSheet.create({
    // Containers
    layoutContainer: {
        ...container,
        justifyContent: 'center',
    },
    startContainer: {
        ...container,
        justifyContent: 'flex-start',
    },
    authLayoutContainer: {
        ...container,
        justifyContent: 'flex-end',
    },
    centeredContainer: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    betweenContainer: {
        ...container,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 10,
    },
    dynamicContent: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 15
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
        color: Colors.text.secondary,
        fontSize: 17,
    },
    title: {
        ...baseText,
        color: Colors.text.primary,
        fontWeight: '600',
        marginBottom: 15,
    },
    textHyperlink: {
        ...baseText,
        color: Colors.purpleSecondary,
        textDecorationLine: 'underline',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    textError: {
        ...baseText,
        color: Colors.status.error,
        fontSize: 14,
    },

    // Images Containers
    imageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    rectangleImageContainer: {
        ...rectangleHelper,
        marginTop: 20,
        marginBottom: 10,
    },

    // Images Styles
    bigImage: {
        ...bigImageContainer,
    },
    bigImageReverted: {
        ...bigImageContainer,
        transform: [{ scaleX: -1 }],
    }
})