import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function PanicButtonContacts() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Página de Contatos do Botão do Pânico - Saúde Mental</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fabeffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
