import { StyleSheet } from "react-native";

const colors = {
  background: "#AFFFEC99",
  text: "#0088FF",

}
export const DailyMessageStyles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Montserrat',
    padding: 10,
    gap: 15,
    borderRadius: 20,
    backgroundColor: colors.background
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