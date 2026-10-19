import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { UserProfileRow } from '@/src/components/ui/UserProfile/ProfileRow';
import { NavItemCard } from '@/src/components/ds/Card';
import { Header } from '@/src/components/ds/Header';
import { Button } from '@/src/components/ds/Button';
import { useAuthStore } from '@/src/store/useAuthStore';
import { color, space } from '@/src/constants/tokens';

// v1: cada card com uma cor livre (azul, verde, vermelho) — 3 de 5 abaixo de 4.5:1.
// Agora todos usam o NavItemCard do DS; a diferenciação fica no ícone e no subtítulo.
const JOURNEY: { title: string; subtitle: string; icon: keyof typeof Feather.glyphMap; route: string }[] = [
  { title: 'Diário', subtitle: 'Registre como você está se sentindo', icon: 'edit-3', route: '/PersonalArea/Diary' },
  { title: 'Tratamentos', subtitle: 'Medicamentos e lembretes', icon: 'plus-circle', route: '/PersonalArea/Treatment' },
  { title: 'Calendário', subtitle: 'Consultas e lembretes do mês', icon: 'calendar', route: '/PersonalArea/Calendar' },
];

const SUPPORT: { title: string; subtitle: string; icon: keyof typeof Feather.glyphMap; route: string }[] = [
  { title: 'Sofreu discriminação?', subtitle: 'Seus direitos e canais de denúncia', icon: 'shield', route: '/PersonalArea/ReportsArea' },
  { title: 'Sobre o OncoMente', subtitle: 'Equipe, versão e créditos', icon: 'info', route: '/About' },
];

export default function HubPersonalAreaScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <UserProfileRow name={user?.name ?? 'Usuário'} email={user?.email ?? ''} />

      <Button
        title="Configurações da conta"
        icon="settings"
        variant="secondary"
        onPress={() => router.push('/PersonalArea/AccountConfigurations')}
        fullWidth
      />

      <View style={styles.section}>
        <Header title="Minha jornada" />
        {JOURNEY.map((item) => (
          <NavItemCard key={item.route} {...item} onPress={() => router.push(item.route as any)} />
        ))}
      </View>

      <View style={styles.section}>
        <Header title="Apoio" />
        {SUPPORT.map((item) => (
          <NavItemCard key={item.route} {...item} onPress={() => router.push(item.route as any)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.sm,
    paddingBottom: space.xl,
    gap: space.md,
    backgroundColor: color.bg.surface,
  },
  section: {
    gap: space.xs,
  },
});
