import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { globalStyles } from "@/src/styles/global";
import { Image, View } from "react-native";

export function HorizontalBanner({ imagePath }: imageContainerProps) {
    return (
        <View style={globalStyles.rectangleImageContainer}>
            {imagePath && <Image style={globalStyles.imageContainer} source={imagePath ? imagePath : require('@assets/images/Placeholders/ImagePlaceholder.png')} resizeMode="cover" />}
        </View>
    )
}