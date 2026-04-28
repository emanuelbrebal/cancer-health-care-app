import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { Colors } from '@/src/constants/Colors';
import { sleepMusicMock } from '@/src/constants/Mocks/mockDataOncologyMedias';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const SLEEP_TIPS = [
    { icon: 'moon', label: 'Evite telas', text: 'Desligue celular e TV pelo menos 30 min antes de dormir.' },
    { icon: 'clock', label: 'Horário regular', text: 'Tente acordar e dormir sempre no mesmo horário.' },
    { icon: 'wind', label: 'Ambiente calmo', text: 'Quarto escuro, silencioso e fresco favorece o sono profundo.' },
];

export default function Sleep() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/sleepBanner.png')} />

                <View style={styles.section}>
                    <Text style={globalStyles.title}>Como está seu sono hoje?</Text>
                    <Text style={globalStyles.descriptionText}>
                        O sono é essencial para a recuperação do seu corpo e para o equilíbrio emocional. Durante o tratamento, é comum ter alterações no sono — e tudo bem, estamos aqui para te ajudar.
                    </Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="moon" size={18} color={Colors.purplePrimary} />
                        <Text style={styles.sectionHeaderText}>Dicas para Dormir Melhor</Text>
                    </View>
                    {SLEEP_TIPS.map((tip) => (
                        <View key={tip.icon} style={styles.tipCard}>
                            <View style={styles.tipIconWrapper}>
                                <Feather name={tip.icon as any} size={20} color={Colors.purplePrimary} />
                            </View>
                            <View style={styles.tipTextWrapper}>
                                <Text style={styles.tipLabel}>{tip.label}</Text>
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="music" size={18} color={Colors.purplePrimary} />
                        <Text style={styles.sectionHeaderText}>Playlists para Relaxar</Text>
                    </View>
                    <MediaList items={sleepMusicMock} key={'id'} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        backgroundColor: 'transparent',
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
        fontFamily: 'Montserrat',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E9DEFA',
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    tipIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F5F0FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipTextWrapper: {
        flex: 1,
        gap: 2,
    },
    tipLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A2E',
        fontFamily: 'Montserrat',
    },
    tipText: {
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
