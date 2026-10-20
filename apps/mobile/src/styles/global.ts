import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { ImageStyle } from 'react-native';
import { color, fontFamily, layout, radius, space, typography } from "../constants/tokens";

export const baseText: TextStyle = {
    fontFamily: fontFamily.regular,
}

const bigImageContainer: ImageStyle = {
    height: layout.mascotMd * 2 + space.xl + space.lg,
    width: '100%',
};

const rectangleHelper: ViewStyle = {
    height: layout.bannerHeight,
    width: '90%',
    borderRadius: radius.md,
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
        paddingHorizontal: space.xs,
        marginVertical: space.xs,
        gap: space.md,
    },
    titleContainer: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        paddingHorizontal: space.xs,
        paddingVertical: space.xs,
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
        // O header agora é opaco e fora do conteúdo; não precisa mais de folga para ele.
        paddingTop: space.xs,
        paddingHorizontal: space.sm,
    },

    // Generic container for buttons
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: space.xs,
        marginVertical: space.md,
    },

    // Text
    textPrimary: {
        ...typography.display,
        color: color.text.brand,
    },
    textSecondary: {
        ...typography.body,
        color: color.text.secondary,
    },
    descriptionText: {
        ...typography.small,
        color: color.text.secondary,
        marginBottom: space.md,
    },
    title: {
        ...typography.subtitle,
        color: color.text.primary,
        marginBottom: space.sm,
    },


    textHyperlink: {
        ...typography.bodyStrong,
        color: color.text.link,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },
    textError: {
        ...typography.small,
        color: color.text.danger,
    },

    // Images Containers
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleImageContainer: {
        ...rectangleHelper,
        marginTop: space.md,
        marginBottom: space.xs,
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
