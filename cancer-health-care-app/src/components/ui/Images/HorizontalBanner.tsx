import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { globalStyles } from "@/src/styles/global";
import {  View } from "react-native";
import { Image } from 'expo-image';

export function HorizontalBanner({ imagePath = require('@assets/images/Placeholders/ImagePlaceholder.png')}: imageContainerProps) {
    return (
        <View style={globalStyles.rectangleImageContainer}>
            {imagePath && <Image style={globalStyles.imageContainer} source={imagePath }  contentFit="cover"/>}
        </View>
    )
}