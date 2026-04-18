import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";
import { globalStyles } from "@/src/styles/global";
import { Image, View } from "react-native";

export function ImageContainer({ imagePath, reverted = false }: imageContainerProps) {
  return (
    <View style={globalStyles.imageContainer}>
      <Image
        source={imagePath || require('@assets/images/Home/blueMascotPlaceholder.png')}
        style={[
          globalStyles.bigImage,
          reverted && { transform: [{ scaleX: -1 }] } 
        ]}
        resizeMode="contain"
      />
    </View>
  );
}