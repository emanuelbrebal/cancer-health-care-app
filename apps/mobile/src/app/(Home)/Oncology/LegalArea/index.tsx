import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CARTILHA_URL = 'https://educapes.capes.gov.br/bitstream/capes/921209/2/LEI%20dos%2060%20dias.pdf';

const BENEFITS = [
    {
        icon: 'heart' as const,
        title: 'Auxílio-Doença',
        text: 'Afastamento remunerado pelo INSS durante o tratamento oncológico.',
        color: '#C62828',
        bg: '#FFEBEE',
        border: '#FFCDD2',
    },
    {
        icon: 'dollar-sign' as const,
        title: 'Saque do FGTS',
        text: 'Você pode sacar o FGTS em casos de doença grave como o câncer.',
        color: '#1565C0',
        bg: '#E3F2FD',
        border: '#BBDEFB',
    },
    {
        icon: 'file-minus' as const,
        title: 'Isenção de Impostos',
        text: 'Isenção de IR para aposentados com doenças graves previstas em lei.',
        color: '#2E7D32',
        bg: '#E8F5E9',
        border: '#C8E6C9',
    },
];

export default function LegalArea() {
    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}
        >
            <View style={styles.container}>
                <Text style={globalStyles.title}>Pacientes com câncer possuem direitos garantidos por lei.</Text>

                <Text style={styles.text}>
                    A <Text style={styles.lawHighlight}>Lei nº 12.732/2012</Text> garante início do tratamento em até 60 dias. Você também tem direito a auxílio-doença, saque do FGTS, isenção de impostos e mais.
                </Text>

                <TouchableOpacity
                    style={styles.cartilhaCard}
                    onPress={() => Linking.openURL(CARTILHA_URL)}
                    activeOpacity={0.75}
                >
                    <View style={styles.cartilhaIconWrapper}>
                        <Feather name="file-text" size={32} color={Colors.purplePrimary} />
                    </View>
                    <View style={styles.cartilhaTextWrapper}>
                        <Text style={styles.cartilhaTitle}>Cartilha de Direitos</Text>
                        <Text style={styles.cartilhaSubtitle}>Lei dos 60 dias — Lei nº 12.732/2012</Text>
                        <View style={styles.cartilhaLink}>
                            <Feather name="external-link" size={12} color={Colors.purpleSecondary} />
                            <Text style={styles.cartilhaLinkText}>Abrir PDF oficial</Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color="#CCC" />
                </TouchableOpacity>

                <View style={styles.benefitsList}>
                    {BENEFITS.map((b) => (
                        <View key={b.title} style={[styles.benefitCard, { borderColor: b.border, backgroundColor: b.bg }]}>
                            <View style={[styles.benefitIconWrapper, { backgroundColor: b.border }]}>
                                <Feather name={b.icon} size={18} color={b.color} />
                            </View>
                            <View style={styles.benefitTextWrapper}>
                                <Text style={[styles.benefitTitle, { color: b.color }]}>{b.title}</Text>
                                <Text style={styles.benefitText}>{b.text}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 30,
        gap: 14,
    },
    text: {
        ...globalStyles.title,
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 26,
        color: '#4B5563',
        textAlign: 'justify',
    },
    lawHighlight: {
        fontWeight: '700',
        color: Colors.purpleSecondary,
        fontFamily: 'Montserrat',
    },
    cartilhaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E9DEFA',
        gap: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    cartilhaIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: '#F5F0FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartilhaTextWrapper: {
        flex: 1,
        gap: 2,
    },
    cartilhaTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
        fontFamily: 'Montserrat',
    },
    cartilhaSubtitle: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat',
    },
    cartilhaLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    cartilhaLinkText: {
        fontSize: 12,
        color: Colors.purpleSecondary,
        fontWeight: '600',
        fontFamily: 'Montserrat',
    },
    benefitsList: {
        gap: 10,
    },
    benefitCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        gap: 12,
    },
    benefitIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitTextWrapper: {
        flex: 1,
        gap: 3,
    },
    benefitTitle: {
        fontSize: 13,
        fontWeight: '700',
        fontFamily: 'Montserrat',
    },
    benefitText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 18,
        fontFamily: 'Montserrat',
    },
});
