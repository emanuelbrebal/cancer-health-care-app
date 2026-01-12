import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import RecomendationPager from '@/src/components/ui/Pagers/RecomendationPager';
import { booksData, homeActivitiesData, moviesData, seriesData } from '@/src/constants/mockData';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PhysicalExercises() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/physicalExercisesBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Cuidados com o corpo: </Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                </View>
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Cuidados com o corpo: </Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                </View>
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Cuidados com o corpo: </Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                </View>
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Cuidados com o corpo: </Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                </View>

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