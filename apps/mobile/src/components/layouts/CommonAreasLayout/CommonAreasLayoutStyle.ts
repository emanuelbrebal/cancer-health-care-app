import { StyleSheet } from "react-native";

export const commonAreaLayoutStyles = StyleSheet.create({
  oncologyArea: {
    flex: 1,
    maxHeight: '93%',
    backgroundColor: 'white',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    width: '100%',
    // Recorta o conteúdo rolável nos cantos arredondados do cartão.
    overflow: 'hidden',
    justifyContent: 'flex-start',
    elevation: 0, 
    shadowColor: 'transparent',
    shadowOpacity: 0,
  },
});