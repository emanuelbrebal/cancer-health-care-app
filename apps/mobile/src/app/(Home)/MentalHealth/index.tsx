import { HorizontalBanner } from '@/src/components/ui/Images/HorizontalBanner';
import NavigationGrid from '@/src/components/ui/Navigation/NavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createAuthStore } from '../../../../../../packages/shared/store/useAuthStore';

export enum UserRole {
  PATIENT = 'PATIENT',
  CAREGIVER = 'CAREGIVER'
}

type MotivationalCardItem = CardItem & {
  allowedRole: UserRole;
};

export default function HomeMentalHealth() {
  const motivationalNavigationItems: MotivationalCardItem[] = [
    {
      id: '1',
      title: 'Pacientes',
      icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringForPatient.png'),
      route: '/MentalHealth/Motivational/Patient',
      allowedRole: UserRole.PATIENT
    },
    {
      id: '2',
      title: 'Cuidadores',
      icon: require('@assets/images/Icons/OncologyIcons/Navigation/CaringTheCaregiver.png'),
      route: '/MentalHealth/Motivational/CaringTheCaregiver',
      allowedRole: UserRole.CAREGIVER
    },
  ];
  const mentalHealthAreaNavigationItems: CardItem[] = [
    { id: '1', title: 'Meditação guiada', icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'), route: '/MentalHealth/Meditation' },
    {
      id: '2',
      title: 'Exercícios de respiração',
      icon: require('@assets/images/Icons/OncologyIcons/Navigation/GuidedMeditation.png'),
      route: '/MentalHealth/Meditation'
    },
  ];

  const { user } = createAuthStore();

  const userSpecificNavigationItems = motivationalNavigationItems.filter(
    item => item.allowedRole === user?.role
  );

  <NavigationGrid
    data={userSpecificNavigationItems}
  />

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
    </SafeAreaView>
  );
}

