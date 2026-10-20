import { Feather } from "@expo/vector-icons";
import { Href } from "expo-router";
import { ImageSourcePropType } from "react-native";
export interface CardItem {
  id: string | number;
  title: string,
  /** Ilustração (grade do Início). */
  icon?: ImageSourcePropType,
  /** Ícone vetorial distinto por tópico (listas de Oncologia/Saúde Mental). */
  featherIcon?: keyof typeof Feather.glyphMap;
  subtitle?: string;
  route: Href;
}
