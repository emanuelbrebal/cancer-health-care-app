import { AccordionCard } from '@/src/components/ui/Accordion/AccordionCard';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { strengthExercisesData, warmingUpMockData } from '@/src/constants/Mocks/mockDataOncologyMedias';
import { globalStyles } from '@/src/styles/global';
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

                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Movimente seu corpo no seu ritmo</Text>
                    <Text style={globalStyles.descriptionText}>
                        A atividade física leve pode ajudar a reduzir o cansaço, melhorar o humor e aumentar sua disposição durante o tratamento.
                    </Text>
                    <Text style={globalStyles.title}>Você conseguiu se movimentar hoje?</Text>
                    <Text style={globalStyles.descriptionText}>
                        Dica: Respeite os limites do seu corpo. Realize os movimentos de forma controlada. Se sentir dor, interrompa o exercício.
                    </Text>
                    <Text style={globalStyles.descriptionText}>
                        Abaixo: segue conteúdo visual de exercícios de alongamento e de atividades físicas:
                    </Text>

                    <View style={styles.accordionWrapper}>
                        <AccordionCard
                            title="Alongamentos e Aquecimento"
                            description="Prepare suas articulações e músculos para a atividade."
                            isExpanded={expandedSection === 'warmup'}
                            onToggle={() => setExpandedSection(expandedSection === 'warmup' ? null : 'warmup')}
                        >
                            <MediaList items={warmingUpMockData} />
                        </AccordionCard>
                    </View>

                    <View style={styles.accordionWrapper}>
                        <AccordionCard
                            title="Exercícios de Fortalecimento"
                            description="Movimentos focados em resistência muscular utilizando peso livre ou o próprio corpo."
                            isExpanded={expandedSection === 'strength'}
                            onToggle={() => setExpandedSection(expandedSection === 'strength' ? null : 'strength')}
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
        backgroundColor: 'transparent',
    },
    accordionWrapper: {
        marginBottom: 16,
        width: '100%',
    },
});