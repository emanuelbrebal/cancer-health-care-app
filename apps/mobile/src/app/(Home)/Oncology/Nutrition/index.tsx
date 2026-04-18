import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Nutrition() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/nutritionBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}> Alimente seu corpo com carinho</Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Prefira alimentos naturais, hidrate-se e respeite seu apetite.</Text>
                   
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
});