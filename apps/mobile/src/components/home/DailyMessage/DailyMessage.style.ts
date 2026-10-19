import { color, layout, radius, space, typography } from "@/src/constants/tokens";
import { StyleSheet } from "react-native";

export const DailyMessageStyles = StyleSheet.create({
  container: {
    marginHorizontal: space.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.sm,
    gap: space.sm,
    borderRadius: radius.xl,
    borderWidth: layout.borderStrong,
    borderColor: color.border.default,
    backgroundColor: color.bg.highlight,
  },
  titleContainer: {
    width: '100%'
  },
  helloMessageContainer: {
    flex: 1,
    gap: space.xxs,
  },
  helloMessageNoImage: {
    paddingHorizontal: space.xs,
  },
  imageContainer: {
    justifyContent: 'center',
  },
  image: {
    height: layout.mascotSm,
    width: layout.mascotSm,
    transform: [{ scaleX: -1 }],
  },
  text: {
    ...typography.subtitle,
    // v1: #0088FF sobre menta (3.3:1). Agora texto de marca (≥ 4.5:1).
    color: color.text.brand,
  },
  subtext: {
    ...typography.body,
    color: color.text.primary,
  },
});
