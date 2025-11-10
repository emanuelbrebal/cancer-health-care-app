import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Tela1Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela inicial Área Social</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcd691ff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
