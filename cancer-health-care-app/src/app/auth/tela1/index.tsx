import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function Tela1Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela 1</Text>
      <Link href="/auth/tela1/subrota">
        <Text>Acessando subrota</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
