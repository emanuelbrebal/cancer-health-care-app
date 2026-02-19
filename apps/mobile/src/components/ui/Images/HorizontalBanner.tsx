import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { globalStyles } from "@/src/styles/global";
import {  StyleSheet, View } from "react-native";
import { Image } from 'expo-image';

export function HorizontalBanner({ style, imagePath = require('@assets/images/Placeholders/ImagePlaceholder.png')}: imageContainerProps) {
    return (
        <View style={[styles.defaultBannerContainer, globalStyles.rectangleImageContainer, style]}>
            {imagePath && <Image style={styles.image} source={imagePath }  contentFit="cover"/>}
        </View>
    )
}

const styles = StyleSheet.create({
    defaultBannerContainer: {
        width: '100%',
        height: 180,      
        borderRadius: 12,   
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});