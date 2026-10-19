import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { layout, radius } from "@/src/constants/tokens";
import { StyleSheet, View } from "react-native";
import { Image } from 'expo-image';

// Banner ilustrativo: decorativo para leitores de tela (o título da seção vem logo abaixo).
export function HorizontalBanner({ style, imagePath = require('@assets/images/Placeholders/ImagePlaceholder.png')}: imageContainerProps) {
    return (
        <View style={[styles.defaultBannerContainer, style]} accessible={false} importantForAccessibility="no-hide-descendants">
            {imagePath && <Image style={styles.image} source={imagePath} contentFit="cover" />}
        </View>
    )
}

const styles = StyleSheet.create({
    defaultBannerContainer: {
        width: '100%',
        height: layout.bannerHeight,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});
