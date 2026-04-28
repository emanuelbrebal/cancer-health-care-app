import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { BibleVersicles } from '@/src/constants/Mocks/mockBibleVersicles';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SpiritualArea() {
    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/spiritualityBanner.png')} />

                <View style={styles.introCard}>
                    <Text style={styles.introEmoji}>🕊️</Text>
                    <View style={styles.introTextBlock}>
                        <Text style={styles.introTitle}>
                            A espiritualidade pode ser uma fonte de força, esperança e conforto durante o tratamento.
                        </Text>
                        <Text style={styles.introText}>
                            Em momentos difíceis, encontrar um significado e se conectar com aquilo que te traz paz pode ajudar a aliviar a ansiedade e fortalecer o emocional.
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.sectionLabel}>✨ Reflexão</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.reflectionCard}>
                    <View style={styles.quoteAccent} />
                    <Text style={styles.reflectionText}>
                        Permita-se desacelerar. Mesmo em meio às dificuldades, existem pequenos momentos de luz, cuidado e esperança ao seu redor.
                    </Text>
                </View>

                <View style={styles.messagesWrapper}>
                    <DailyMessage title='Versículo do dia:' message={BibleVersicles} key='id' noImg />
                    <DailyMessage title='Dica:' message='Você não precisa ter todas as respostas hoje. Apenas siga com fé e coragem.' />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        gap: 16,
    },
    introCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF9FE',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: '#EDD9FA',
        gap: 14,
    },
    introEmoji: {
        fontSize: 34,
        marginTop: 2,
    },
    introTextBlock: {
        flex: 1,
        gap: 8,
    },
    introTitle: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '700',
        color: Colors.purplePrimary,
        lineHeight: 21,
    },
    introText: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
    sectionDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0D0F0',
    },
    sectionLabel: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        fontWeight: '600',
        color: Colors.purplePrimary,
    },
    reflectionCard: {
        flexDirection: 'row',
        backgroundColor: '#F3E5F5',
        borderRadius: 14,
        padding: 18,
        gap: 14,
        alignItems: 'flex-start',
    },
    quoteAccent: {
        width: 4,
        borderRadius: 2,
        backgroundColor: Colors.purplePrimary,
        alignSelf: 'stretch',
        flexShrink: 0,
    },
    reflectionText: {
        flex: 1,
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontStyle: 'italic',
        color: '#4A148C',
        lineHeight: 22,
    },
    messagesWrapper: {
        gap: 15,
        width: '100%',
    },
});
