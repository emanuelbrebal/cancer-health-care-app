import { Header } from '@/src/components/ds/Header';
import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { space } from '@/src/constants/tokens';
import { CardItem } from '@/src/interfaces/CardItem';
import { ScrollView, StyleSheet } from 'react-native';

// Ícones vetoriais distintos por tópico e subtítulos que antecipam o conteúdo (P12).
const selfCareItems: CardItem[] = [
  { id: 'sleep', title: 'Sono', subtitle: 'Rotina e higiene do sono', featherIcon: 'moon', route: '/Oncology/Sleep' },
  { id: 'exercise', title: 'Exercícios físicos', subtitle: 'Movimento seguro durante o tratamento', featherIcon: 'activity', route: '/Oncology/PhysicalExercises' },
  { id: 'nutrition', title: 'Nutrição', subtitle: 'Alimentação e efeitos colaterais', featherIcon: 'coffee', route: '/Oncology/Nutrition' },
  { id: 'spiritual', title: 'Espiritualidade', subtitle: 'Fé, esperança e sentido', featherIcon: 'sun', route: '/Oncology/SpiritualArea' },
  { id: 'leisure', title: 'Lazer', subtitle: 'Livros, filmes, séries e atividades', featherIcon: 'film', route: '/Oncology/Leisure' },
];

// v1: seção "Benefícios Legais" com card "Lei dos 60 dias" levando a uma tela com vários direitos (P11).
const rightsItems: CardItem[] = [
  { id: 'rights', title: 'Direitos do paciente', subtitle: 'Lei dos 60 dias, FGTS, auxílio-doença e IR', featherIcon: 'shield', route: '/Oncology/LegalArea' },
];

export default function HomeOncology() {

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <HorizontalBanner imagePath={require('@assets/images/Banners/oncologyBanner.png')} />

      <Header title="Autocuidado e tratamento" subtitle="Escolha um tema para ler dicas práticas." />
      <NavigationGrid data={selfCareItems} />

      <Header title="Seus direitos" subtitle="O que a lei garante a quem tem câncer." />
      <NavigationGrid data={rightsItems} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    paddingBottom: space.xl,
    gap: space.sm,
  },
});
