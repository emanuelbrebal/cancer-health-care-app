import { AccordionCard } from '@/src/components/ui/Accordion/AccordionCard';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { Colors } from '@/src/constants/Colors';
import { strengthExercisesData, warmingUpMockData } from '@/src/constants/Mocks/mockDataOncologyMedias';
import { globalStyles } from '@/src/styles/global';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PhysicalExercises() {
    const [expandedSection, setExpandedSection] = useState<'warmup' | 'strength' | null>(null);

    return (
        <ScrollView
            contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}
        >
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/physicalExercisesBanner.png')} />

                <View style={styles.section}>
                    <Text style={globalStyles.title}>Movimente seu corpo no seu ritmo</Text>
                    <Text style={globalStyles.descriptionText}>
                        A atividade física leve pode ajudar a reduzir o cansaço, melhorar o humor e aumentar sua disposição durante o tratamento.
                    </Text>
                </View>

                <View style={styles.safetyCard}>
                    <Feather name="alert-circle" size={20} color="#D32F2F" style={{ marginTop: 1 }} />
                    <View style={{ flex: 1, gap: 2 }}>
                        <Text style={styles.safetyTitle}>Atenção à segurança</Text>
                        <Text style={styles.safetyText}>
                            Respeite os limites do seu corpo. Realize os movimentos de forma controlada. Se sentir dor, interrompa o exercício imediatamente.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Feather name="activity" size={18} color={Colors.purplePrimary} />
                        <Text style={styles.sectionHeaderText}>Exercícios Disponíveis</Text>
                    </View>

                    <View style={styles.accordionWrapper}>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: '#F5F0FA' }]}>
                                <Text style={[styles.badgeText, { color: Colors.purplePrimary }]}>Nível Leve</Text>
                            </View>
                        </View>
                        <AccordionCard
                            title="Alongamentos e Aquecimento"
                            description="Prepare suas articulações e músculos para a atividade."
                            isExpanded={expandedSection === 'warmup'}
                            onToggle={() => setExpandedSection(expandedSection === 'warmup' ? null : 'warmup')}
                            chevronColor={Colors.lilacPrimary}
                            expandedBorderColor={Colors.lilacPrimary}
                        >
                            <MediaList items={warmingUpMockData} />
                        </AccordionCard>
                    </View>

                    <View style={styles.accordionWrapper}>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badge, { backgroundColor: '#EEF0FA' }]}>
                                <Text style={[styles.badgeText, { color: Colors.purpleSecondary }]}>Nível Moderado</Text>
                            </View>
                        </View>
                        <AccordionCard
                            title="Exercícios de Fortalecimento"
                            description="Movimentos focados em resistência muscular utilizando peso livre ou o próprio corpo."
                            isExpanded={expandedSection === 'strength'}
                            onToggle={() => setExpandedSection(expandedSection === 'strength' ? null : 'strength')}
                            chevronColor={Colors.purpleSecondary}
                            expandedBorderColor={Colors.purpleSecondary}
                        >
                            <MediaList items={strengthExercisesData} />
                        </AccordionCard>
                    </View>
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
    safetyCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF3F3',
        borderRadius: 14,
        padding: 14,
        gap: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
        borderLeftWidth: 4,
        borderLeftColor: '#D32F2F',
    },
    safetyTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#B91C1C',
        fontFamily: 'Montserrat',
    },
    safetyText: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 20,
        fontFamily: 'Montserrat',
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
    accordionWrapper: {
        width: '100%',
        gap: 6,
    },
    badgeRow: {
        flexDirection: 'row',
        paddingLeft: 4,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        fontFamily: 'Montserrat',
    },
});
