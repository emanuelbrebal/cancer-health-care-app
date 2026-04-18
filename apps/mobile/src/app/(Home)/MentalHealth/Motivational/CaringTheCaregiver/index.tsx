import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { caregiverMessagesData } from '@/src/constants/Mocks/mockCaregiverMotivationalMessages';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CaringTheCaregiver() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={{ paddingBottom: 10 }}>
                    <HorizontalBanner imagePath={require('@assets/images/Banners/motivationalAreaBanner.png')} />
                </View>

                <Text style={globalStyles.title}>Cuidar também é um ato de amor!</Text>
                <Text style={globalStyles.descriptionText}>Ser cuidador pode ser desafiador. Lembre-se de que você também precisa de cuidado e atenção.</Text>
                <Text style={globalStyles.descriptionText}>Você não precisa ser forte o tempo todo. Permita-se descansar e pedir ajuda.</Text>

                <View style={{ paddingVertical: 10 }}>
                    <DailyMessage title='Cuidar de quem cuida:' message={caregiverMessagesData} />
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