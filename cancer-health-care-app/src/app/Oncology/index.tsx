import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeOncology() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Tela inicial Área Oncológica</Text>

      <Link href="/Oncology/Leisure">
        <Text>Lazer</Text>
      </Link>
    </SafeAreaView>
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