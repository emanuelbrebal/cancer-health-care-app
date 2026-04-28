import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Nutrition() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/nutritionBanner.png')} />
                <Text style={globalStyles.title}>Alimente seu corpo com carinho</Text>
                <View style={styles.tipCard}>
                    <Text style={styles.tipEmoji}>🥗</Text>
                    <Text style={styles.tipText}>Prefira alimentos naturais, hidrate-se e respeite seu apetite.</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: 'transparent',
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F8E9',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#C8E6C9',
        paddingVertical: 16,
        paddingHorizontal: 18,
        gap: 14,
    },
    tipEmoji: {
        fontSize: 32,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#374151',
        lineHeight: 22,
        fontFamily: 'Montserrat',
        fontWeight: '500',
    },
});
