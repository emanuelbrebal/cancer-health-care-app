import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import HomeNavigationGrid from '@/src/components/ui/Navigation/HomeNavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { globalStyles } from '@/src/styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  const homeNavigationItems: CardItem[] = [
    { id: '1', title: 'Oncologia', icon: require('@assets/images/Home/oncologyAreaIcon.png'), route: '/Oncology' },
    { id: '2', title: 'Saúde Mental', icon: require('@assets/images/Home/mentalHealthIcon.png'), route: '/MentalHealth' },
    { id: '3', title: 'Mascote Virtual', icon: require('@assets/images/Home/communityIcon.png'), route: '/Mascot' },
    { id: '4', title: 'Meu Perfil', icon: require('@assets/images/Home/personalAreaIcon.png'), route: '/PersonalArea' },
  ];

  return (
    <SafeAreaView style={globalStyles.layoutContainer}>
      <HelloMessage patient_name=''/>
      <HomeNavigationGrid data={homeNavigationItems}/>
      <DailyMessage message=''/>
    </SafeAreaView>
  );
}
