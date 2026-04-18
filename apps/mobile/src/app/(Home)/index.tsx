import SoftLoginModal from '@/src/components/home/SoftLoginModal/SoftLoginModal';
import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import HomeNavigationGrid from '@/src/components/ui/Navigation/HomeNavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { globalStyles } from '@/src/styles/global';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [modalVisible, setModalVisible] = useState(!isAuthenticated);

  const homeNavigationItems: CardItem[] = [
    { id: '1', title: 'Oncologia',       icon: require('@assets/images/Home/oncologyAreaIcon.png'),  route: '/Oncology' },
    { id: '2', title: 'Saúde Mental',    icon: require('@assets/images/Home/mentalHealthIcon.png'),  route: '/MentalHealth' },
    { id: '3', title: 'Mascote Virtual', icon: require('@assets/images/Home/communityIcon.png'),     route: '/Mascot' },
    { id: '4', title: 'Meu Perfil',      icon: require('@assets/images/Home/personalAreaIcon.png'), route: '/PersonalArea' },
  ];

  return (
    <SafeAreaView style={globalStyles.layoutContainer}>
      <HelloMessage />
      <HomeNavigationGrid data={homeNavigationItems} />
      <DailyMessage />

      <SoftLoginModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
