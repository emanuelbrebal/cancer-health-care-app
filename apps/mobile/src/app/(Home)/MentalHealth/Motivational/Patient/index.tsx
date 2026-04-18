import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import { Colors } from '@/src/constants/Colors';
import { patientMessagesData } from '@/src/constants/Mocks/mockPatientMotivationalMessages';
import { globalStyles } from '@/src/styles/global';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PatientMotivational() {
    return (
        <ScrollView contentContainerStyle={globalStyles.scrollContainer}
            showsVerticalScrollIndicator={true}>
            <View style={styles.container}>
                <View style={{ paddingBottom: 10 }}>
                    <HorizontalBanner imagePath={require('@assets/images/Banners/motivationalAreaBanner.png')} />
                </View>

                <Text style={[globalStyles.title, { fontSize: 18 }]}>Você é mais forte do que pensa!</Text>
                <Text style={globalStyles.descriptionText}>Sabemos que o tratamento pode ser difícil, mas você não está sozinho. Cada dia enfrentado é uma vitória.</Text>
                <Text style={globalStyles.descriptionText}>Respeite seu tempo, acolha seus sentimentos e celebre cada pequeno avanço.</Text>

                <View style={{ paddingVertical: 10 }}>
                    <DailyMessage title='Motivação do dia!' message={patientMessagesData} />
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
        fontSize: 14
    },
    hyperlink: {
        ...globalStyles.textHyperlink,
        color: Colors.purplePrimary,
        textAlign: 'left'
    }
});