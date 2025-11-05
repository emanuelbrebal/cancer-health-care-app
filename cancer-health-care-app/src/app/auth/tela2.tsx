import { View, Text, StyleSheet } from 'react-native';

export default function Tela2Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e20f0f',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
