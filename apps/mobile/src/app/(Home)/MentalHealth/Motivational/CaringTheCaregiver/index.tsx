import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { caregiverMessagesData } from '@/src/constants/Mocks/mockCaregiverMotivationalMessages';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const INSIGHT_CARDS = [
    {
        icon: 'users' as const,
        text: 'Ser cuidador pode ser desafiador. Lembre-se de que você também precisa de cuidado e atenção.',
    },
    {
        icon: 'coffee' as const,
        text: 'Você não precisa ser forte o tempo todo. Permita-se descansar e pedir ajuda — isso é coragem, não fraqueza.',
    },
];

export default function CaringTheCaregiver() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={{ paddingBottom: 10 }}>
                    <HorizontalBanner imagePath={require('@assets/images/Banners/motivationalAreaBanner.png')} />
                </View>

                <View style={styles.titleRow}>
                    <Feather name="heart" size={20} color={Colors.cyanSecondary} />
                    <Text style={[globalStyles.title, styles.titleText]}>Cuidar também é um ato de amor!</Text>
                </View>

                <View style={styles.insightCards}>
                    {INSIGHT_CARDS.map((card, i) => (
                        <View key={i} style={styles.insightCard}>
                            <View style={styles.insightIconWrapper}>
                                <Feather name={card.icon} size={18} color={Colors.cyanSecondary} />
                            </View>
                            <Text style={styles.insightText}>{card.text}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <DailyMessage title='Cuidar de quem cuida:' message={caregiverMessagesData} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: 'transparent',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    titleText: {
        flex: 1,
        fontSize: 18,
    },
    insightCards: {
        gap: 10,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F0FDFA',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#B2EBF2',
        gap: 12,
        shadowColor: '#A6D6D6',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    insightIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#CCFBF1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    insightText: {
        flex: 1,
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
        fontFamily: 'Montserrat',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0F7F4',
        marginHorizontal: 4,
    },
});
