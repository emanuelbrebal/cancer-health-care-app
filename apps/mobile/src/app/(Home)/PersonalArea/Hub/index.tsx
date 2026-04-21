import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { globalStyles } from '@/src/styles/global';
import { UserProfileRow } from '@/src/components/ui/UserProfile/ProfileRow';
import { NavCard } from '@/src/components/ui/Cards/NavCard';
import { useAuthStore } from '@/src/store/useAuthStore';

const NAV_BUTTONS = [
  {
    id: '1',
    title: 'Diário',
    subtitle: 'Diga como foi seu dia',
    icon: 'edit-3',
    lib: 'Feather',
    route: '/PersonalArea/Diary',
    bgColor: '#F5F0FA',
    iconBg: '#E9DEFA',
    borderColor: '#d2aef0',
    color: '#8257E5'
  },
  {
    id: '2',
    title: 'Tratamentos',
    subtitle: 'Gerencie lembretes',
    icon: 'plus-circle',
    lib: 'Feather',
    route: '/PersonalArea/Treatment',
    bgColor: '#F0F6FC',
    iconBg: '#E1EDF9',
    borderColor: '#a4c9f1',
    color: '#2980B9'
  },
  {
    id: '3',
    title: 'Calendário Interativo',
    subtitle: 'Acompanhe seus lembretes',
    icon: 'calendar',
    lib: 'Feather',
    route: '/PersonalArea/Calendar',
   bgColor: '#F0F7F2',
    iconBg: '#E0F0E4',
    borderColor: '#93e0ad',
    color: '#1e9951'
  },
  {
    id: '4',
    title: 'Sofreu discriminação?',
    subtitle: 'Veja canais de denúncia',
    icon: 'shield',
    lib: 'Feather',
    route: '/PersonalArea/ReportsArea',
    bgColor: '#FEF2F2',
    iconBg: '#FDEAEA',
    borderColor: '#F8B4B4',
    color: '#D32F2F'
  },
  {
    id: '5',
    title: 'Sobre o Projeto',
    subtitle: 'Equipe, versão e créditos',
    icon: 'info',
    lib: 'Feather',
    route: '/About',
    bgColor: '#F5F0FA',
    iconBg: '#E9DEFA',
    borderColor: '#d2aef0',
    color: '#7C3AED'
  }
];

export default function HubPersonalAreaScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <View style={globalStyles.startContainer}>
      <View style={styles.mainCard}>
        <View style={styles.staticContent}>

          <UserProfileRow
            name={user?.name ?? 'Usuário'}
            email={user?.email ?? ''}
          />

          <TouchableOpacity
            style={styles.settingsFullButton}
            onPress={() => router.push('/PersonalArea/AccountConfigurations')}
            activeOpacity={0.6}
          >
            <View style={styles.settingsInner}>
              <Feather name="settings" size={18} color="#888" />
              <Text style={styles.settingsButtonText}>Configurações da Conta</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.listContainer}>
            {NAV_BUTTONS.map((button) => (
              <NavCard
                key={button.id}
                title={button.title}
                subtitle={button.subtitle}
                icon={button.icon}
                iconLib={button.lib === 'Material' ? 'MaterialCommunityIcons' : 'Feather'}
                color={button.color}
                bgColor={button.bgColor}
                iconBg={button.iconBg}
                borderColor={button.borderColor}
                onPress={() => router.push(button.route as any)}
              />
            ))}
          </View>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainCard: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  staticContent: {
    flex: 1,
    padding: 24,
    paddingBottom: 30,
  },
  settingsFullButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  settingsInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  listContainer: {
    flex: 1,
    gap: 12,
    justifyContent: 'flex-start',
  },
});