import { StyleSheet } from "react-native";
import { color, radius, space } from "@/src/constants/tokens";

export const authLayoutStyles = StyleSheet.create({
  authLayout: {
    flex: 1,
    maxHeight: '80%',
    backgroundColor: color.bg.surface,
    padding: space.md,
    borderTopRightRadius: radius.xl * 2,
    borderTopLeftRadius: radius.xl * 2,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: space.md,
  },
});
