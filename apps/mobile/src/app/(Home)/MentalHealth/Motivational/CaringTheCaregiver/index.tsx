import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CaringTheCaregiver() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
                    showsVerticalScrollIndicator={true}>
                    <View style={styles.container}>
                        <HorizontalBanner imagePath={require('@assets/images/Banners/motivationalAreaBanner.png')} />
                        <Text style={globalStyles.title}>Mensagem de motivação diária: </Text>
                        <Text style={styles.text}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ipsam nemo velit totam nostrum iure quod nihil rem vitae in ratione perferendis, hic doloremque praesentium magnam reprehenderit amet veniam ex! </Text>
                        <Text style={styles.text}>Ver a viabilidade do mascote gerar essa motivação via cron job uma vez por dia.</Text>
        
                    </View>
                </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    text: {
        ...globalStyles.title,
        fontSize: 12
    },
    hyperlink: {
        ...globalStyles.textHyperlink,
        color: Colors.purplePrimary,
        textAlign: 'left'
    }
});