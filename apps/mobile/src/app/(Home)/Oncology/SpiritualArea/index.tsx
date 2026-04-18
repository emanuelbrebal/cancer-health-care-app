import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { BibleVersicles } from '@/src/constants/Mocks/mockBibleVersicles';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SpiritualArea() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/spiritualityBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>A espiritualidade pode ser uma fonte de força, esperança e conforto durante o tratamento.</Text>
                    <Text style={globalStyles.descriptionText}>Em momentos difíceis, encontrar um significado e se conectar com aquilo que te traz paz pode ajudar a aliviar a ansiedade e fortalecer o emocional.</Text>
                    <Text style={globalStyles.title}>Reflexão</Text>
                    <Text style={globalStyles.descriptionText}>Permita-se desacelerar. Mesmo em meio às dificuldades, existem pequenos momentos de luz, cuidado e esperança ao seu redor.</Text>

                    <View style={styles.container}>
                        <DailyMessage title='Versículo do dia:' message={BibleVersicles} key='id' noImg />

                        <DailyMessage title='Dica:' message='Você não precisa ter todas as respostas hoje. Apenas siga com fé e coragem.' />
                    </View>
                </View>
            </View>
        </ScrollView >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        backgroundColor: 'transparent',
    },
});