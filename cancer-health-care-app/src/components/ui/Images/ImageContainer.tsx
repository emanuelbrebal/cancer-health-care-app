import { globalStyles } from "@/src/styles/global";
import { Image, StyleProp, View, ViewStyle } from "react-native";

interface imageContainerProps {
    imagePath: string,
    reverted?: boolean
}
export function ImageContainer({ imagePath, reverted=false }: imageContainerProps) {
    return (
        <View style={globalStyles.imageContainer}>
            {imagePath && <Image source={imagePath ? imagePath : require('@assets/images/Home/blueMascotPlaceholder.png')} style={reverted? globalStyles.bigImage : globalStyles.bigImageReverted} />}
        </View>
    )
}