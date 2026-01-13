import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeMentalHealth() {
  const motivationalNavigationItems: CardItem[] = [
    { id: '1', title: 'Pacientes', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/Oncology/Motivational' },
    { id: '2', title: 'Cuidadores', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringTheCaretaker.png'), route: '/Oncology/Motivational/CaringTheCaretaker' },
  ];
  const mentalHealthAreaNavigationItems: CardItem[] = [
    { id: '1', title: 'Meditação guiada', icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'), route: '/MentalHealth/Meditation' },
  ];

  const mourningPhasesNavigationItems: CardItem[] = [
    { id: '1', title: 'Conheça e supere cada uma delas!', icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'), route: '/MentalHealth/MourningPhases/Presentation' },
  ];

  return (

    <SafeAreaView style={globalStyles.layoutContainer}> 
      <HorizontalBanner
        imagePath={require('@assets/images/Banners/mentalHealthAreaBanner.png')}
      />
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
          Fases do Luto
        </Text>

        <NavigationGrid
          data={mourningPhasesNavigationItems}
          singleElement={true}
        />
      </View>
      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Tópicos em saúde mental
        </Text>

        <NavigationGrid
          data={mentalHealthAreaNavigationItems}
          singleElement={true}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={globalStyles.title}>-Conversar mais sobre os conteúdos exibidos na área de saúde mental-</Text>
      </View>
    </SafeAreaView>
  );
}