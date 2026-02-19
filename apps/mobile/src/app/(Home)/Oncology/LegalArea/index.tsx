import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { booksData, homeActivitiesData, moviesData, seriesData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function LegalArea() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner />
                <SearchBar />
                
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