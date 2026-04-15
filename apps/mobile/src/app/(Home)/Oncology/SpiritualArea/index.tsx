import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { SearchBar } from '@/src/components/ui/Inputs/SearchBar';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SpiritualArea() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <HorizontalBanner imagePath={require('@assets/images/Banners/spiritualityBanner.png')} />
                <View style={globalStyles.startContainer}>
                    <Text style={globalStyles.title}>Espiritualidade: </Text>
                    <Text style={[globalStyles.title, { fontSize: 12 }]}>Incluir "versículo do dia" e área de oração (cadastro leve)
                    </Text>


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