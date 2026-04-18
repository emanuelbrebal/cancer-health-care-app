import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { MediaList } from '@/src/components/ui/Media/MediaList';
import { Colors } from '@/src/constants/Colors';
import { sleepMusicMock } from '@/src/constants/Mocks/mockDataOncologyMedias';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Sleep() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/sleepBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Como está seu sono hoje? </Text>
                    <Text style={globalStyles.descriptionText}>O sono é essencial para a recuperação do seu corpo e para o equilíbrio emocional. Durante o tratamento, é comum ter alterações no sono — e tudo bem, estamos aqui para te ajudar.</Text>
                    <Text style={globalStyles.title}>Você dormiu bem esta noite? </Text>
                    <Text style={globalStyles.descriptionText}>Dica: Evite telas antes de dormir e tente manter um horário regular de sono. </Text>
                    <Text style={globalStyles.descriptionText}>Selecionamos uma playlist especial para te auxiliar a dormir melhor: </Text>
                    <MediaList items={sleepMusicMock} key={'id'} />
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 20,
        backgroundColor: 'transparent',
    },
    hyperlink: {
        ...globalStyles.textHyperlink,
        color: Colors.purplePrimary,
        textAlign: 'left'
    }
});