import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { booksData, homeActivitiesData, moviesData, seriesData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Leisure() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                    <SearchBar />
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