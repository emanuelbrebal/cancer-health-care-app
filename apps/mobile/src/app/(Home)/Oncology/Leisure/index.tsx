import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { booksData, homeActivitiesData, moviesData, seriesData } from '@/src/constants/Mocks/mockDataOncologyRecomendations';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Leisure() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/leisureBanner.png')} />
                <Text style={globalStyles.title}>Momentos de lazer ajudam no bem-estar emocional.</Text>
                <Text style={globalStyles.descriptionText}>Confira recomendações de atividades em casa, filmes, séries e livros rolando a tela para baixo!</Text>
                
                <RecomendationPager headerTitle='Atividades em casa recomendadas' recomendationPagerData={homeActivitiesData} />
                <RecomendationPager headerTitle='Livros recomendados' recomendationPagerData={booksData} />
                <RecomendationPager headerTitle='Filmes recomendados' recomendationPagerData={moviesData} />
                <RecomendationPager headerTitle='Séries recomendadas' recomendationPagerData={seriesData} />
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});