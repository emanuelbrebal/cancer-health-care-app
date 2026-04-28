import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const HISTORY_KEY = 'oncomente:notification-history';

export interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  treatmentId?: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('oncomente', {
      name: 'OncoMente',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#9B5DE0',
    });
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function intervalOffsets(frequencia: string): number[] {
  if (frequencia.includes('8 em 8')) return [0, 8, 16];
  if (frequencia.includes('12 em 12')) return [0, 12];
  return [0];
}

export async function scheduleTreatmentNotifications(
  treatmentId: string,
  nome: string,
  horaInicio: string,
  frequencia: string,
): Promise<string[]> {
  const granted = await requestPermissions();
  if (!granted) return [];

  const parts = horaInicio.split(':').map(Number);
  const h = parts[0];
  const m = parts[1] ?? 0;
  if (isNaN(h)) return [];

  const mascotMessages = [
    `Oi! Eu sou o Onco e vim lembrar você de tomar ${nome}! 💜`,
    `Psiu! Tá na hora do ${nome}. Você consegue! 🌟`,
    `Olá! Seu mascote aqui — não esquece do ${nome} agora! 💊`,
    `Você é incrível! E por isso toma o ${nome} certinho. Vai lá! 💪`,
  ];

  const ids: string[] = [];
  for (const offset of intervalOffsets(frequencia)) {
    const hour = (h + offset) % 24;
    const msgIdx = offset % mascotMessages.length;
    const body =
      offset === 0
        ? mascotMessages[msgIdx]
        : `Onco aqui! Dose de ${nome} às ${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}. Cuide-se! 💜`;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `💊 OncoMente — ${nome}`,
        body,
        data: { treatmentId },
        sound: true,
        ...(Platform.OS === 'android' && {
          android: {
            channelId: 'oncomente',
            smallIcon: 'ic_launcher',
          },
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: m,
      },
    });
    ids.push(id);
  }
  return ids;
}

export async function scheduleEndOfTreatmentNotification(
  nome: string,
  dataFim: string,
): Promise<string | undefined> {
  try {
    const [day, month, year] = dataFim.split('/').map(Number);
    const endDate = new Date(year, month - 1, day);
    endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(9, 0, 0, 0);
    if (endDate <= new Date()) return undefined;

    const granted = await requestPermissions();
    if (!granted) return undefined;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: '🗓️ OncoMente — Quase lá!',
        body: `Oi! Seu ciclo de ${nome} termina amanhã. Lembre de conversar com seu médico! Estou torcendo por você 💜`,
        sound: true,
        ...(Platform.OS === 'android' && {
          android: {
            channelId: 'oncomente',
            smallIcon: 'ic_launcher',
          },
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: endDate,
      },
    });
  } catch {
    return undefined;
  }
}

export async function cancelTreatmentNotifications(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => {})),
  );
}

export async function getNotificationHistory(): Promise<NotificationRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addToHistory(record: Omit<NotificationRecord, 'id'>): Promise<void> {
  const history = await getNotificationHistory();
  const newRecord: NotificationRecord = { ...record, id: Date.now().toString() };
  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([newRecord, ...history].slice(0, 50)),
  );
}

export async function markAsRead(id: string): Promise<void> {
  const history = await getNotificationHistory();
  const updated = history.map((n) => (n.id === id ? { ...n, read: true } : n));
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function markAllAsRead(): Promise<void> {
  const history = await getNotificationHistory();
  const updated = history.map((n) => ({ ...n, read: true }));
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function removeHistoryByTreatmentId(treatmentId: string): Promise<void> {
  const history = await getNotificationHistory();
  const filtered = history.filter((n) => n.treatmentId !== treatmentId);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}
