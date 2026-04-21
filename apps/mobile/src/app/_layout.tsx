import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../styles/global';
import { addToHistory } from '../services/notificationService';

export default function RootLayout() {
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
      <Toast />
    </LinearGradient>
  );
}
