import { StyleSheet } from "react-native";

export const authLayoutStyles = StyleSheet.create({
  authLayout: {
    flex: 1,
    maxHeight: '75%',
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
});