import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/src/constants/Colors';
import ActionCardList, { BaseActionItem } from '@/src/components/ui/Pagers/ActionCardList';
import { globalStyles } from '@/src/styles/global';
import { UserProfileCenter } from '@/src/components/ui/UserProfile/ProfileCenter';

const dadosGeral: BaseActionItem[] = [
  { id: '1', title: 'Editar perfil' },
  { id: '2', title: 'Editar notificações' },
  { id: '3', title: 'Gerenciar preferências' },
  { id: '4', title: 'Gerenciamento do mascote interativo' },
];

const dadosSeguranca: BaseActionItem[] = [
  { id: '5', title: 'Permissões de Usuário' },
  { id: '6', title: 'Histórico de atividade' },
  { id: '7', title: 'LGPD e Termos de uso' },
  { id: '8', title: 'Mudar senha' },
  { id: '9', title: 'Desativar conta', textColor: '#FF4C4C' },
];

export default function AccountConfigurationIndex() {
  return (
    <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={globalStyles.scrollContainer}>

      <UserProfileCenter name='Barbara da Silva' email="B.daSilva@mail.com" />

      <Text style={styles.sectionHeader}>Geral</Text>
      <ActionCardList data={dadosGeral} containerStyle={styles.listContainer} />

      <Text style={styles.sectionHeader}>Segurança e privacidade</Text>
      <ActionCardList data={dadosSeguranca} containerStyle={styles.listContainer} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  purpleBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 150,
    backgroundColor: '#D1B3FF',
  },
  mainCard: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.lilacPrimary,
  },
  profileCenter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageLarge: {
    width: 90, height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 16,
  },
  listContainer: {
    paddingVertical: 8,
  }
});