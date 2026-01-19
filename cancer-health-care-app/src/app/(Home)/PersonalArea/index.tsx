import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomePersonalArea() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela Inicial Área Pessoal</Text>
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
