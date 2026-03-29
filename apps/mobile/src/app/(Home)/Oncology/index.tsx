import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeOncology() {
 
  const oncologyNavigationItems: CardItem[] = [
    
    { id: '1', title: 'Sono', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Sleep.png'), route: '/Oncology/Sleep' },
    { id: '2', title: 'Exercício físico', icon: require('@assets/images/Icons/OncologyIcons/Navigation/PhysicalExercises.png'), route: '/Oncology/PhysicalExercises' },
    { id: '3', title: 'Nutrição', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Leisure.png'), route: '/Oncology/Nutrition' },
    { id: '4', title: 'Espiritualidade', icon: require('@assets/images/Icons/OncologyIcons/Navigation/Leisure.png'), route: '/Oncology/SpiritualArea' },
    { id: '5', title: 'Lazer', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/Leisure' },
  ];

  const legalBenefitsNavigationItems: CardItem[] = [
    { id: '1', title: 'Ver todos os benefícios legais', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/LegalArea' },
  ];

  return (

    <SafeAreaView style={globalStyles.startContainer}>
      <HorizontalBanner
        imagePath={require('@assets/images/Banners/oncologyBanner.png')}
      />

      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Autocuidado e tratamento
        </Text>

        <NavigationGrid
          data={oncologyNavigationItems}
          singleElement={true}
        />
      </View>

      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Benefícios Legais
        </Text>

        <NavigationGrid
          data={legalBenefitsNavigationItems}
          singleElement={true}
        />
      </View>
    </SafeAreaView>
  );
}