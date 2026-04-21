import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/useAuthStore';
import { UserRole } from '../../../../../../packages/shared/types/user';
import { PanicButton } from '@/src/components/ui/Buttons/Overlay/PanicButton/PanicButton';

export default function HomeMentalHealth() {
  const { user } = useAuthStore();

  const mentalHealthAreaNavigationItems: CardItem[] = [
    { id: '1', title: 'Meditação guiada', icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'), route: '/MentalHealth/Meditation' },
    {
      id: '2',
      title: 'Exercícios de respiração',
      icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'),
      route: '/MentalHealth/BreathingExercises'
    },
    {
      id: '3',
      title: 'Apoio psicológico',
      icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'),
      route: '/MentalHealth/PsychologicalSupport'
    },
  ];

  const motivationalNavigationItems: CardItem[] = user === null
    ? [
        {
          id: '1',
          title: 'Motivação Diária',
          icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'),
          route: '/MentalHealth/Motivational/Patient',
        },
      ]
    : user.role === UserRole.CAREGIVER
    ? [
        {
          id: '2',
          title: 'Cuidadores',
          icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringTheCaregiver.png'),
          route: '/MentalHealth/Motivational/CaringTheCaregiver',
        },
      ]
    : [
        {
          id: '1',
          title: 'Motivação Diária',
          icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'),
          route: '/MentalHealth/Motivational/Patient',
        },
      ];

  return (
    <SafeAreaView style={globalStyles.startContainer}>
      <HorizontalBanner
        imagePath={require('@assets/images/Banners/mentalHealthAreaBanner.png')}
      />
      <View style={globalStyles.titleContainer}>
        <Text style={globalStyles.title}>
          Área Motivacional
        </Text>

        <NavigationGrid
          data={motivationalNavigationItems}
          singleElement
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
      <PanicButton />
    </SafeAreaView>
  );
}

