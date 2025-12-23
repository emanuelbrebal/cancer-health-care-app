import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeMentalHealth() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela inicial Saúde Mental</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
