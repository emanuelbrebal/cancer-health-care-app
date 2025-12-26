import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import NavigationGrid from '@/src/components/home/NavigationGrid';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeOncology() {
  return (
    <SafeAreaView style={styles.container}>
      <HelloMessage patient_name=''/>
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