import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';
import {
  requestPermissions,
  getNotificationHistory,
  markAsRead,
  markAllAsRead,
  type NotificationRecord,
} from '@/src/services/notificationService';
import { toastService } from '@/src/services/toastService';

const CONSENT_KEY = 'oncomente:notifications:consent';

interface ScheduledItem {
  id: string;
  title: string;
  body: string;
  nextTrigger: string;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationRecord;
  onPress: (id: string) => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, item.read && styles.cardRead]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.75}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dotRow}>
          {!item.read && <View style={styles.unreadDot} />}
          <Text style={[styles.cardTitle, item.read && styles.cardTitleRead]} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
      </View>
      <Text style={styles.cardBody}>{item.body}</Text>
    </TouchableOpacity>
  );
}

function ScheduledCard({ item }: { item: ScheduledItem }) {
  return (
    <View style={[styles.card, styles.scheduledCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.dotRow}>
          <Feather name="clock" size={12} color={Colors.purpleSecondary} />
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        </View>
        <Text style={styles.cardDate}>{item.nextTrigger}</Text>
      </View>
      <Text style={styles.cardBody}>{item.body}</Text>
    </View>
  );
}

function ConsentScreen({ onAccept }: { onAccept: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.consentScroll}>
      <View style={styles.consentIconWrapper}>
        <Feather name="bell" size={48} color={Colors.purplePrimary} />
      </View>

      <Text style={styles.consentTitle}>Notificações do OncoMente</Text>
      <Text style={styles.consentSubtitle}>
        Receba lembretes de tratamento, mensagens motivacionais e dicas de bem-estar diretamente no seu dispositivo.
      </Text>

      <View style={styles.lgpdCard}>
        <Text style={styles.lgpdTitle}>
          <Feather name="shield" size={13} color={Colors.purpleSecondary} /> Aviso de Privacidade (LGPD)
        </Text>
        <Text style={styles.lgpdBody}>
          As notificações são enviadas pelo sistema OncoMente com base no seu perfil e histórico de uso. Seus dados são tratados de acordo com a{' '}
          <Text style={styles.lgpdHighlight}>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</Text>.
        </Text>
        <Text style={styles.lgpdBody}>
          Você pode revogar este consentimento a qualquer momento nas configurações do seu dispositivo. Nenhum dado pessoal é compartilhado com terceiros para fins publicitários.
        </Text>
      </View>

      <TouchableOpacity style={styles.acceptButton} onPress={onAccept} activeOpacity={0.8}>
        <Feather name="check" size={18} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.acceptButtonText}>Permitir notificações</Text>
      </TouchableOpacity>

      <Text style={styles.consentFootnote}>
        Ao permitir, você concorda com o recebimento de comunicações do OncoMente conforme a LGPD.
      </Text>
    </ScrollView>
  );
}

export default function NotificationsScreen() {
  const [loading, setLoading] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);
  const [history, setHistory] = useState<NotificationRecord[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledItem[]>([]);

  const loadData = useCallback(async () => {
    const [hist, sched] = await Promise.all([
      getNotificationHistory(),
      Notifications.getAllScheduledNotificationsAsync(),
    ]);
    setHistory(hist);

    const scheduledItems: ScheduledItem[] = sched.map((n) => ({
      id: n.identifier,
      title: (n.content.title as string) ?? 'OncoMente',
      body: (n.content.body as string) ?? '',
      nextTrigger: formatTrigger(n.trigger),
    }));
    setScheduled(scheduledItems);
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(CONSENT_KEY).then(async (value) => {
        const given = value === 'true';
        setConsentGiven(given);
        if (given) await loadData();
        setLoading(false);
      });
    }, [loadData]),
  );

  async function handleAccept() {
    await requestPermissions();
    await AsyncStorage.setItem(CONSENT_KEY, 'true');
    setConsentGiven(true);
    await loadData();
    toastService.success('Notificações ativadas com sucesso!');
  }

  async function handleCardPress(id: string) {
    await markAsRead(id);
    setHistory((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setHistory((prev) => prev.map((n) => ({ ...n, read: true })));
    toastService.info('Todas as notificações marcadas como lidas.');
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.purplePrimary} />
      </View>
    );
  }

  if (!consentGiven) {
    return <ConsentScreen onAccept={handleAccept} />;
  }

  const unread = history.filter((n) => !n.read);
  const read = history.filter((n) => n.read);
  const unreadCount = unread.length;

  return (
    <ScrollView contentContainerStyle={styles.listScroll}>
      {unreadCount > 0 && (
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <Text style={styles.groupLabel}>Novas</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Marcar todas como lidas</Text>
          </TouchableOpacity>
        </View>
      )}
      {unread.map((n) => (
        <NotificationCard key={n.id} item={n} onPress={handleCardPress} />
      ))}

      {read.length > 0 && (
        <>
          <Text style={[styles.groupLabel, { marginTop: 12 }]}>Anteriores</Text>
          {read.map((n) => (
            <NotificationCard key={n.id} item={n} onPress={handleCardPress} />
          ))}
        </>
      )}

      {scheduled.length > 0 && (
        <>
          <Text style={[styles.groupLabel, { marginTop: 12 }]}>Agendadas</Text>
          {scheduled.map((s) => (
            <ScheduledCard key={s.id} item={s} />
          ))}
        </>
      )}

      {history.length === 0 && scheduled.length === 0 && (
        <View style={styles.emptyState}>
          <Feather name="bell-off" size={40} color="#CCC" />
          <Text style={styles.emptyText}>Nenhuma notificação por enquanto.</Text>
          <Text style={styles.emptySubText}>
            Cadastre um tratamento para receber lembretes automáticos.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function formatTrigger(trigger: Notifications.NotificationTrigger | null): string {
  if (!trigger) return '—';
  const t = trigger as Record<string, unknown>;
  if (typeof t['hour'] === 'number' && typeof t['minute'] === 'number') {
    return `Diário ${String(t['hour']).padStart(2, '0')}:${String(t['minute']).padStart(2, '0')}`;
  }
  if (t['dateComponents'] && typeof t['dateComponents'] === 'object') {
    const dc = t['dateComponents'] as Record<string, number>;
    if (dc['hour'] !== undefined)
      return `Diário ${String(dc['hour']).padStart(2, '0')}:${String(dc['minute'] ?? 0).padStart(2, '0')}`;
  }
  return 'Agendada';
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consentScroll: {
    flexGrow: 1,
    padding: 28,
    alignItems: 'center',
  },
  consentIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#EDE0FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  consentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    marginBottom: 10,
  },
  consentSubtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Montserrat',
    marginBottom: 24,
  },
  lgpdCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purpleSecondary,
  },
  lgpdTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.purpleSecondary,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  lgpdBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  lgpdHighlight: {
    fontWeight: '700',
    color: '#333',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purplePrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginBottom: 16,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  consentFootnote: {
    fontSize: 11,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
    fontFamily: 'Montserrat',
  },
  listScroll: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.purplePrimary,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Montserrat',
  },
  markAllText: {
    fontSize: 12,
    color: Colors.purplePrimary,
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
    fontFamily: 'Montserrat',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.purplePrimary,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  scheduledCard: {
    borderLeftColor: Colors.purpleSecondary,
    backgroundColor: '#FAFAFF',
  },
  cardRead: {
    borderLeftColor: '#DDD',
    opacity: 0.75,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purplePrimary,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    fontFamily: 'Montserrat',
    flex: 1,
  },
  cardTitleRead: {
    color: '#888',
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 11,
    color: '#BBB',
    fontFamily: 'Montserrat',
  },
  cardBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#BBB',
    fontFamily: 'Montserrat',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 13,
    color: '#CCC',
    fontFamily: 'Montserrat',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
