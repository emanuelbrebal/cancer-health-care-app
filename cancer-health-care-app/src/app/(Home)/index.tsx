import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import NavigationGrid from '@/src/components/home/NavigationGrid';
import { globalStyles } from '@/src/styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeOncology() {
  return (
    <SafeAreaView style={globalStyles.centeredContainer}>
      <HelloMessage patient_name=''/>
      <NavigationGrid />
      <DailyMessage message=''/>
    </SafeAreaView>
  );
}
