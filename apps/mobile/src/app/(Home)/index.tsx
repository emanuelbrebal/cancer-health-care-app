import SoftLoginModal from '@/src/components/home/SoftLoginModal/SoftLoginModal';
import DailyMessage from '@/src/components/home/DailyMessage/DailyMessage';
import HelloMessage from '@/src/components/home/HelloMessage';
import HomeNavigationGrid from '@/src/components/ui/Navigation/HomeNavigationGrid';
import { CardItem } from '@/src/interfaces/CardItem';
import { useAuthStore } from '@/src/store/useAuthStore';
import { globalStyles } from '@/src/styles/global';
import { Colors } from '@/src/constants/Colors';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lembra que a pessoa escolheu "Agora não" para não reabrir o modal a cada visita (P16).
const SOFT_LOGIN_DISMISSED_KEY = 'oncomente:soft-login-dismissed';

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

      <View style={styles.bottomArea}>
        <TouchableOpacity onPress={() => router.push('/About')} style={styles.aboutBtn} activeOpacity={0.7}>
          <Feather name="info" size={14} color={Colors.purplePrimary} />
          <Text style={styles.aboutText}>Sobre o OncoMente</Text>
        </TouchableOpacity>
      </View>

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
  bottomArea: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  aboutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    // Fundo opaco + borda roxa: o lilás claro anterior sumia sobre o gradiente.
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.purplePrimary,
  },
  aboutText: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purplePrimary,
  },
});
