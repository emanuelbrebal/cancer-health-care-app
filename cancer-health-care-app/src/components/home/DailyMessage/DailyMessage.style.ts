import { Colors } from "@/src/constants/Colors";
import { StyleSheet } from "react-native";

const colors = {
  text: "#0088FF",

}
export const DailyMessageStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
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
  helloMessageContainer: {
    paddingLeft: 20,
    width: '68%',
  },
  imageContainer: {
    width: '30%',
    justifyContent: 'center',
    paddingRight: 20,
  },
  image: {
    height: 80,
    width: 80,
    transform: [{ scaleX: -1 }],
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text
  },
  subtext: {
    fontSize: 14,
  }

});