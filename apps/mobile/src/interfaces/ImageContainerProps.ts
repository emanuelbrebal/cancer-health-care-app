import { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";

export interface imageContainerProps {
    imagePath?: ImageSourcePropType,
    reverted?: boolean
    style?: StyleProp<ViewStyle>;
}