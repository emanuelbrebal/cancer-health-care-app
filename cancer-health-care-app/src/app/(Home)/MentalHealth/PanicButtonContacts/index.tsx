import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import EmergencyContacts from '@/src/components/ui/Buttons/Overlay/PanicButton/EmergencyContacts';
import { EmergencyContactsData } from '@/src/constants/mockEmergencyContacts';
import { globalStyles } from '@/src/styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PanicButtonContacts() {
  const message = "Ao ocupar uma linha de emergência sem necessidade, você pode impedir o salvamento de uma vida real. Utilize estes canais apenas em situações de verdadeira urgência."
  return (
    <SafeAreaView style={[globalStyles.scrollContainer, { paddingTop: 20 }]}>

      <EmergencyContacts data={EmergencyContactsData} />

      <DailyMessage title={"Lembre-se, Trote é crime!"} message={message} />
    </SafeAreaView>
  );
}