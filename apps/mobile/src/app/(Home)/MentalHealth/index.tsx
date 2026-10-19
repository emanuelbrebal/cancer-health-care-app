import { Header } from '@/src/components/ds/Header';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { layout, space } from '@/src/constants/tokens';
import { CardItem } from '@/src/interfaces/CardItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { ScrollView, StyleSheet } from 'react-native';
import { UserRole } from '../../../../../../packages/shared/types/user';

const topicItems: CardItem[] = [
  { id: 'breathing', title: 'Exercícios de respiração', subtitle: 'Acalme a ansiedade em poucos minutos', featherIcon: 'wind', route: '/MentalHealth/BreathingExercises' },
  { id: 'meditation', title: 'Meditação guiada', subtitle: 'Vídeos curtos para relaxar', featherIcon: 'headphones', route: '/MentalHealth/Meditation' },
  { id: 'support', title: 'Apoio psicológico', subtitle: 'Onde buscar atendimento gratuito', featherIcon: 'users', route: '/MentalHealth/PsychologicalSupport' },
];

const patientItem: CardItem = {
  id: 'patient', title: 'Para pacientes', subtitle: 'Mensagens de força para o seu dia', featherIcon: 'heart', route: '/MentalHealth/Motivational/Patient',
};
const caregiverItem: CardItem = {
  id: 'caregiver', title: 'Para cuidadores', subtitle: 'Cuidar de quem cuida', featherIcon: 'user-check', route: '/MentalHealth/Motivational/CaringTheCaregiver',
};

export default function HomeMentalHealth() {
  const user = useAuthStore((s) => s.user);

  // v1 escondia o conteúdo de cuidadores de quem não tinha login (P13).
  // Agora os dois ficam visíveis; o do papel do usuário aparece primeiro.
  const motivationalItems = user?.role === UserRole.CAREGIVER
    ? [caregiverItem, patientItem]
    : [patientItem, caregiverItem];

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HorizontalBanner imagePath={require('@assets/images/Banners/mentalHealthAreaBanner.png')} />

      <Header title="Motivação" subtitle="Palavras de apoio para pacientes e cuidadores." />
      <NavigationGrid data={motivationalItems} />

      <Header title="Cuidar da mente" subtitle="Práticas para momentos de ansiedade." />
      <NavigationGrid data={topicItems} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    // Folga para o botão de pânico flutuante não cobrir o último item.
    paddingBottom: layout.tabBarHeight + space.xl * 2,
    gap: space.sm,
  },
});
