import { Colors } from "@/src/constants/Colors";
import { fontFamily } from "@/src/constants/tokens";
import { StyleSheet } from "react-native";

export const DailyMessageStyles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 12,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.cyanSecondary,
    backgroundColor: Colors.cyan
  },
  titleContainer: {
    width: '100%'
  },
  helloMessageContainer: {
    paddingLeft: 8,
    width: '72%',
    gap: 4,
  },
  imageContainer: {
    width: '28%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 84,
    width: 84,
    transform: [{ scaleX: -1 }],
  },
  text: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 24,
    // Azul #0088FF sobre o menta tinha contraste baixo; roxo da marca fica legível.
    color: Colors.purpleSecondary
  },
  subtext: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.primary,
  }
});
