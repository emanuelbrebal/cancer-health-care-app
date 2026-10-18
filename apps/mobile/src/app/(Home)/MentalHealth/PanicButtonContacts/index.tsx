import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHeaderHeight } from 'expo-router/react-navigation';
import EmergencyContacts from '@/src/components/ui/Buttons/Overlay/PanicButton/EmergencyContacts';
import { EmergencyContactsData } from '@/src/constants/Mocks/mockEmergencyContacts';
import { Header } from '@/src/components/ds/Header';
import { color, iconSize, layout, radius, space, typography } from '@/src/constants/tokens';

export default function PanicButtonContacts() {
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView
      contentContainerStyle={[styles.content, { paddingTop: headerHeight }]}
      showsVerticalScrollIndicator={false}
    >
      <Header
        level="screen"
        title="Você não está sozinho(a)"
        subtitle="Toque em um serviço para ver o que ele faz e ligar na hora. Todos são gratuitos."
      />

      <View style={styles.alertBanner} accessibilityRole="alert">
        <Feather name="alert-triangle" size={iconSize.md} color={color.text.warning} />
        <Text style={styles.alertText}>
          Em risco de vida, ligue 192 (SAMU). Use estes canais em situações de urgência.
        </Text>
      </View>

      <EmergencyContacts data={EmergencyContactsData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    paddingBottom: layout.tabBarHeight + space.md,
    gap: space.sm,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
    backgroundColor: color.bg.warning,
    borderRadius: radius.md,
    borderWidth: layout.borderHairline,
    borderColor: color.text.warning,
    padding: space.sm,
  },
  alertText: {
    flex: 1,
    ...typography.smallStrong,
    color: color.text.warning,
  },
});
