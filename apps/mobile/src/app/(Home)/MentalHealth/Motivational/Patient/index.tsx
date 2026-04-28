import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { patientMessagesData } from '@/src/constants/Mocks/mockPatientMotivationalMessages';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const INSIGHT_CARDS = [
    {
        icon: 'heart' as const,
        text: 'Sabemos que o tratamento pode ser difícil, mas você não está sozinho. Cada dia enfrentado é uma vitória.',
    },
    {
        icon: 'star' as const,
        text: 'Respeite seu tempo, acolha seus sentimentos e celebre cada pequeno avanço — por menor que pareça.',
    },
];

export default function PatientMotivational() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={{ paddingBottom: 10 }}>
                    <HorizontalBanner imagePath={require('@assets/images/Banners/motivationalAreaBanner.png')} />
                </View>

                <View style={styles.titleRow}>
                    <Feather name="sun" size={20} color={Colors.purplePrimary} />
                    <Text style={[globalStyles.title, styles.titleText]}>Você é mais forte do que pensa!</Text>
                </View>

                <View style={styles.insightCards}>
                    {INSIGHT_CARDS.map((card, i) => (
                        <View key={i} style={styles.insightCard}>
                            <View style={styles.insightIconWrapper}>
                                <Feather name={card.icon} size={18} color={Colors.purplePrimary} />
                            </View>
                            <Text style={styles.insightText}>{card.text}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <DailyMessage title='Motivação do dia!' message={patientMessagesData} />
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
        backgroundColor: '#FBF8FF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E9DEFA',
        gap: 12,
        shadowColor: '#9B5DE0',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    insightIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#F0E8FC',
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
        backgroundColor: '#F0EAF8',
        marginHorizontal: 4,
    },
});
