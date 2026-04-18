import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/src/constants/Colors';

const CONSENT_KEY = 'oncomente:notifications:consent';

type AppNotification = {
    id: string;
    title: string;
    body: string;
    read: boolean;
    created_at: string;
};

// TODO: substituir por chamada à API — GET /notifications
const MOCK_NOTIFICATIONS: AppNotification[] = [
    {
        id: '1',
        title: 'Lembrete de tratamento',
        body: 'Não esqueça de registrar seu tratamento de hoje no calendário.',
        read: false,
        created_at: '2026-04-18T09:00:00Z',
    },
    {
        id: '2',
        title: 'Mensagem do dia',
        body: 'Você está mais forte do que imagina. Cada dia é uma vitória!',
        read: false,
        created_at: '2026-04-17T08:00:00Z',
    },
    {
        id: '3',
        title: 'Dica de bem-estar',
        body: 'Experimente o exercício de respiração 4-7-8 para reduzir a ansiedade.',
        read: true,
        created_at: '2026-04-16T10:30:00Z',
    },
];

function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function NotificationCard({ item }: { item: AppNotification }) {
    return (
        <View style={[styles.card, item.read && styles.cardRead]}>
            <View style={styles.cardHeader}>
                <View style={styles.dotRow}>
                    {!item.read && <View style={styles.unreadDot} />}
                    <Text style={[styles.cardTitle, item.read && styles.cardTitleRead]}>
                        {item.title}
                    </Text>
                </View>
                <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
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
                    Você pode revogar este consentimento a qualquer momento nas configurações do aplicativo ou do seu dispositivo. Nenhum dado pessoal é compartilhado com terceiros para fins publicitários.
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

    useEffect(() => {
        AsyncStorage.getItem(CONSENT_KEY).then((value) => {
            setConsentGiven(value === 'true');
            setLoading(false);
        });
    }, []);

    async function handleAccept() {
        await AsyncStorage.setItem(CONSENT_KEY, 'true');
        setConsentGiven(true);
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

    const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read);
    const read = MOCK_NOTIFICATIONS.filter((n) => n.read);

    return (
        <ScrollView contentContainerStyle={styles.listScroll}>
            {unread.length > 0 && (
                <>
                    <Text style={styles.groupLabel}>Novas</Text>
                    {unread.map((n) => (
                        <NotificationCard key={n.id} item={n} />
                    ))}
                </>
            )}
            {read.length > 0 && (
                <>
                    <Text style={styles.groupLabel}>Anteriores</Text>
                    {read.map((n) => (
                        <NotificationCard key={n.id} item={n} />
                    ))}
                </>
            )}
            {MOCK_NOTIFICATIONS.length === 0 && (
                <View style={styles.emptyState}>
                    <Feather name="bell-off" size={40} color="#CCC" />
                    <Text style={styles.emptyText}>Nenhuma notificação por enquanto.</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Consent
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

    // Notification list
    listScroll: {
        flexGrow: 1,
        padding: 16,
        paddingTop: 20,
        backgroundColor: '#F8F4FF',
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

    // Empty state
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
    },
});
