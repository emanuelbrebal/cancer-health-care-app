import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

const colors = {
  text: "#0088FF",

}
export const DailyMessageStyles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Montserrat',
    padding: 10,
    gap: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.cyanSecondary,
    backgroundColor: Colors.cyan
  },
  titleContainer: {
    width: '100%'
  },
  helloMessageContainer: {
    paddingLeft: 15,
    width: '75%',
  },
  imageContainer: {
    width: '25%',
    justifyContent: 'center',
  },
  image: {
    height: 75,
    width: 75,
    transform: [{ scaleX: -1 }],
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text
  },
  subtext: {
    fontSize: 13,
  }
});