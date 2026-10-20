import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { color, palette } from '../constants/tokens';
import { globalStyles } from '../styles/global';
import { addToHistory } from '../services/notificationService';
import { toastConfig } from '../components/ds/Toast';
import { DebugStatePanel } from '../components/ds/DebugStatePanel';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat: Montserrat_400Regular,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(async (notification) => {
      await addToHistory({
        title: notification.request.content.title ?? 'OncoMente',
        body: notification.request.content.body ?? '',
        read: false,
        created_at: new Date().toISOString(),
        treatmentId: notification.request.content.data?.treatmentId as string | undefined,
      });
    });
    return () => sub.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={[color.bg.gradientBottom, palette.lilac400]}
      start={[0, 1]}
      end={[0, 0]}
      style={globalStyles.layoutContainer}
    >
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'simple_push',
      }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(Home)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="design-system" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <Toast config={toastConfig} />
      <DebugStatePanel />
    </LinearGradient>
  );
}
