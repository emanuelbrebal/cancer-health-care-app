import { View, Text, StyleSheet } from 'react-native';

export default function Tela3Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#afe619',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
