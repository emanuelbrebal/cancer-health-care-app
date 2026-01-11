import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { globalStyles } from "@/src/styles/global";
import { Image, View } from "react-native";

export function ImageContainer({ imagePath, reverted = false }: imageContainerProps) {
    return (
        <View style={globalStyles.imageContainer}>
            {imagePath && <Image source={imagePath ? imagePath : require('@assets/images/Home/blueMascotPlaceholder.png')} style={reverted? globalStyles.bigImage : globalStyles.bigImageReverted} resizeMode="cover"/>}
        </View>
    )
}