import { globalStyles } from "@/src/styles/global";
import { Image, ImageSourcePropType, View } from "react-native";

interface imageContainerProps {
    imagePath?: ImageSourcePropType,
}
export function HorizontalBanner({ imagePath }: imageContainerProps) {
    return (
        <View style={globalStyles.rectangleImageContainer}>
            {imagePath && <Image style={globalStyles.imageContainer} source={imagePath ? imagePath : require('@assets/images/Placeholders/ImagePlaceholder.png')} resizeMode="cover" />}
        </View>
    )
}
