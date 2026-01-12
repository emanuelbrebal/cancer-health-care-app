import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeOncology() {
  const motivationalNavigationItems: CardItem[] = [
    { id: '1', title: 'Pacientes', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/Motivational' },
    { id: '2', title: 'Cuidadores', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringTheCaretaker.png'), route: '/Oncology/Motivational/CaringTheCaretaker' },
  ];
  const oncologyNavigationItems: CardItem[] = [
    { id: '1', title: 'Meditação guiada', icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'), route: '/MentalHealth' },
    { id: '2', title: 'Sono', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Sleep.png'), route: '/Oncology/Sleep' },
    { id: '3', title: 'Exercício físico', icon: require('@assets/images/Icons/OncologyIcons/Navigation/PhysicalExercises.png'), route: '/Oncology/PhysicalExercises' },
    { id: '4', title: 'Nutrição', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Leisure.png'), route: '/Oncology/Nutrition' },
    { id: '5', title: 'Espiritualidade', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Leisure.png'), route: '/Oncology/SpiritualArea' },
    { id: '6', title: 'Lazer', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/Leisure' },
  ];

  const legalBenefitsNavigationItems: CardItem[] = [
    { id: '1', title: 'Ver todos os benefícios legais', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/LegalArea' },
  ];

  return (

    <SafeAreaView style={globalStyles.layoutContainer}>
      <HorizontalBanner
        imagePath={require('@assets/images/Banners/oncologyBanner.png')}
      />

      {/* com as consultas do backend, dá p deixar isso ainda mais limpo */}
      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Área Motivacional
        </Text>

        <NavigationGrid
          data={motivationalNavigationItems}
        />
      </View>

      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Autocuidado e tratamento
        </Text>

        <NavigationGrid
          data={oncologyNavigationItems}
        />
      </View>

      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Benefícios Legais
        </Text>

        <NavigationGrid
          data={legalBenefitsNavigationItems}
        />
      </View>
    </SafeAreaView>
  );
}