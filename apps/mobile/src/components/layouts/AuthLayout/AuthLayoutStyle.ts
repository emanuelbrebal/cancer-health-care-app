import { StyleSheet } from "react-native";
import { color, radius, space } from "@/src/constants/tokens";

export const authLayoutStyles = StyleSheet.create({
  authLayout: {
    flex: 1,
    // Espaço suficiente para o cadastro caber sem rolagem em telas padrão (~844 px).
    maxHeight: '89%',
    backgroundColor: color.bg.surface,
    padding: space.md,
    borderTopRightRadius: radius.xl * 2,
    borderTopLeftRadius: radius.xl * 2,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: space.xs,
  },
});
