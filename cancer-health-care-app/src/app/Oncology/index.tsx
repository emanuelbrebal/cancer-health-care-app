import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeOncology() {
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
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
