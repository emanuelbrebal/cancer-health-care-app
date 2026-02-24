import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../styles/global';

export default function RootLayout() {
  
  return (
    <LinearGradient
      colors={[Colors.bgGradient.start, Colors.lilacPrimary]}
      start={[0, 1]}
      end={[0, 0]}
      style={globalStyles.layoutContainer}
    >
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'simple_push',
      }}>
        <Stack.Screen name="(Home)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </LinearGradient>
  )
}