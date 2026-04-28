import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const GENERAL_TIPS = [
    { icon: 'clock', label: 'Refeições fracionadas', text: 'Faça refeições pequenas ao longo do dia.' },
    { icon: 'leaf', label: 'Alimentos naturais', text: 'Prefira alimentos naturais e minimamente processados.' },
    { icon: 'droplet', label: 'Hidratação constante', text: 'Beba água com frequência ao longo do dia.' },
    { icon: 'alert-circle', label: 'Evite o jejum', text: 'Evite longos períodos sem comer.' },
];

const NAUSEA_TIPS = [
    { icon: 'thermometer', label: 'Alimentos frios', text: 'Prefira alimentos frios, pois têm menos cheiro e são mais fáceis de tolerar.' },
    { icon: 'wind', label: 'Evite cheiros fortes', text: 'Mantenha o ambiente arejado e evite odores intensos ao comer.' },
    { icon: 'minus-circle', label: 'Porções menores', text: 'Coma pequenas quantidades de cada vez.' },
];

const APPETITE_TIPS = [
    { icon: 'layers', label: 'Porções pequenas', text: 'Coma pequenas porções mesmo sem fome — o que for possível.' },
    { icon: 'heart', label: 'Alimentos preferidos', text: 'Prefira alimentos que você gosta para tornar a refeição mais agradável.' },
];

const ENERGY_TIPS = [
    { icon: 'trending-up', label: 'Proteínas', text: 'Inclua proteínas nas refeições: carnes magras, ovos, leguminosas.' },
    { icon: 'sun', label: 'Frutas e legumes', text: 'Consuma frutas e legumes variados para vitaminas e energia.' },
];

const HYDRATION_TIPS = [
    { icon: 'droplet', label: 'Opções de hidratação', text: 'Água, água de coco e sucos naturais são ótimas escolhas.' },
];

type TipItem = { icon: string; label: string; text: string };

function TipCard({ icon, label, text }: TipItem) {
    return (
        <View style={styles.tipCard}>
            <View style={styles.tipIconWrapper}>
                <Feather name={icon as any} size={20} color={Colors.purplePrimary} />
            </View>
            <View style={styles.tipTextWrapper}>
                <Text style={styles.tipLabel}>{label}</Text>
                <Text style={styles.tipText}>{text}</Text>
            </View>
        </View>
    );
}

type SectionProps = { icon: string; title: string; tips: TipItem[] };

function TipSection({ icon, title, tips }: SectionProps) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Feather name={icon as any} size={18} color={Colors.purplePrimary} />
                <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
            {tips.map((tip) => (
                <TipCard key={tip.icon + tip.label} {...tip} />
            ))}
        </View>
    );
}

export default function Nutrition() {
    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}
        >
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/nutritionBanner.png')} />

                <View style={styles.section}>
                    <Text style={globalStyles.title}>Alimente seu corpo com carinho</Text>
                    <Text style={globalStyles.descriptionText}>
                        Durante o tratamento, a alimentação pode variar bastante — em alguns dias será mais fácil, em outros nem tanto. O mais importante é respeitar seu corpo, manter-se nutrido e buscar pequenas estratégias que ajudem no seu bem-estar.
                    </Text>
                </View>

                <TipSection icon="list" title="Dicas Gerais" tips={GENERAL_TIPS} />

                <View style={styles.divider} />

                <TipSection icon="thermometer" title="Se estiver com náusea" tips={NAUSEA_TIPS} />

                <View style={styles.divider} />

                <TipSection icon="frown" title="Se estiver sem apetite" tips={APPETITE_TIPS} />

                <View style={styles.divider} />

                <TipSection icon="zap" title="Para manter energia" tips={ENERGY_TIPS} />

                <View style={styles.divider} />

                <TipSection icon="droplet" title="Hidratação" tips={HYDRATION_TIPS} />

                <View style={styles.alertCard}>
                    <Feather name="alert-circle" size={20} color="#D97706" />
                    <Text style={styles.alertText}>
                        <Text style={styles.alertBold}>Atenção: </Text>
                        Sempre que possível, siga a orientação de um nutricionista especializado.
                    </Text>
                </View>

                <View style={styles.motivationCard}>
                    <Text style={styles.motivationText}>
                        "Alimentar-se é uma forma de cuidado e fortalecimento."
                    </Text>
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
        paddingBottom: 24,
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
    alertCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFBEB',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FDE68A',
        padding: 16,
        gap: 12,
    },
    alertText: {
        flex: 1,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 20,
        fontFamily: 'Montserrat',
    },
    alertBold: {
        fontWeight: '700',
    },
    motivationCard: {
        backgroundColor: '#F5F0FA',
        borderRadius: 14,
        borderLeftWidth: 4,
        borderLeftColor: Colors.purplePrimary,
        padding: 16,
    },
    motivationText: {
        fontSize: 14,
        fontStyle: 'italic',
        color: Colors.purplePrimary,
        lineHeight: 22,
        fontFamily: 'Montserrat',
        fontWeight: '600',
        textAlign: 'center',
    },
});
