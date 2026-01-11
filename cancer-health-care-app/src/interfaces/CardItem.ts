import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";
export interface CardItem {
  id: string | number;
  title: string,
  icon: ImageSourcePropType,
  route: Href;
}