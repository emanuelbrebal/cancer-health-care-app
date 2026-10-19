import SoftLoginModal from '@/src/components/home/SoftLoginModal/SoftLoginModal';
import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import HomeNavigationGrid from '@/src/components/ui/Navigation/HomeNavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { globalStyles } from '@/src/styles/global';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lembra que a pessoa escolheu "Agora não" para não reabrir o modal a cada visita (P16).
export const SOFT_LOGIN_DISMISSED_KEY = 'oncomente:soft-login-dismissed';

export default function HomePage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;
    AsyncStorage.getItem(SOFT_LOGIN_DISMISSED_KEY)
      .then((dismissed) => setModalVisible(!dismissed))
      .catch(() => setModalVisible(true));
  }, [isAuthenticated]);

  function dismissModal() {
    setModalVisible(false);
    AsyncStorage.setItem(SOFT_LOGIN_DISMISSED_KEY, new Date().toISOString()).catch(() => {});
  }

  const homeNavigationItems: CardItem[] = [
    { id: '1', title: 'Oncologia',    icon: require('@assets/images/Home/oncologyAreaIcon.png'),  route: '/Oncology' },
    { id: '2', title: 'Saúde Mental', icon: require('@assets/images/Home/mentalHealthIcon.png'),  route: '/MentalHealth' },
    { id: '3', title: 'Mascote',      icon: require('@assets/images/Home/communityIcon.png'),     route: '/Mascot' },
    { id: '4', title: 'Meu Perfil',   icon: require('@assets/images/Home/personalAreaIcon.png'), route: '/PersonalArea' },
  ];

  return (
    <SafeAreaView style={globalStyles.layoutContainer} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HelloMessage />
        <HomeNavigationGrid data={homeNavigationItems} />
        <DailyMessage />

        <Pressable
          onPress={() => router.push('/About')}
          accessibilityRole="link"
          accessibilityLabel="Sobre o OncoMente"
          style={({ pressed }) => [styles.aboutBtn, pressed && styles.aboutBtnPressed]}
        >
          <Feather name="info" size={iconSize.sm} color={color.text.link} />
          <Text style={styles.aboutText}>Sobre o OncoMente</Text>
        </Pressable>
      </ScrollView>

      {!isAuthenticated && (
        <SoftLoginModal
          visible={modalVisible}
          onDismiss={dismissModal}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.sm,
    paddingBottom: layout.tabBarHeight + space.xl,
  },
  aboutBtn: {
    alignSelf: 'center',
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: color.bg.brandSubtle,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    borderWidth: layout.borderHairline,
    borderColor: color.border.default,
  },
  aboutBtnPressed: {
    backgroundColor: color.bg.brandMuted,
  },
  aboutText: {
    ...typography.smallStrong,
    color: color.text.link,
  },
});
