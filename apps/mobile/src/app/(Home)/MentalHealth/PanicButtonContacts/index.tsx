import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import EmergencyContacts from '@/src/components/ui/Buttons/Overlay/PanicButton/EmergencyContacts';
import { EmergencyContactsData } from '@/src/constants/Mocks/mockEmergencyContacts';
import { globalStyles } from '@/src/styles/global';

export default function PanicButtonContacts() {
  return (
    <ScrollView contentContainerStyle={globalStyles.scrollContainer} showsVerticalScrollIndicator={false}>

      <Text style={styles.sectionTitle}>Canais de atendimento</Text>
      <Text style={styles.sectionSubtitle}>
        Toque em um contato para ver mais informações e ligar diretamente.
      </Text>

      <View style={styles.alertBanner}>
        <Feather name="alert-triangle" size={22} color="#B45309" />
        <Text style={styles.alertText}>
          Utilize estes canais apenas em situações de verdadeira urgência. Trote é crime.
        </Text>
      </View>
      <EmergencyContacts data={EmergencyContactsData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 60,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: 16,
    marginBottom: 28,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
});
