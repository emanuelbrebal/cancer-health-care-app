import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HelloMessage from './components/HelloMessage';
import NavigationGrid from './components/NavigationGrid';
import DailyMessage from './components/DailyMessage';

export default function HomeOncology() {
  return (
    <SafeAreaView style={styles.container}>
      <HelloMessage/>
      <NavigationGrid />
      <DailyMessage />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Montserrat'
  },
  helloMessageContainer: {
    flex: 0.5,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 16,
  },
  cardGrid: {
    gap: '1rem',
  },
  cardContainer: {
    flexDirection: 'row',
  },
  navigationCard: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }
});