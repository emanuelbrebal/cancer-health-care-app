import React, { useState } from 'react';
import { Text, StyleSheet, Modal, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/src/constants/Colors';
import ActionCardList, { BaseActionItem } from '@/src/components/ui/Pagers/ActionCardList';
import { globalStyles } from '@/src/styles/global';
import { UserProfileCenter } from '@/src/components/ui/UserProfile/ProfileCenter';
import { useAuthStore } from '@/src/store/useAuthStore';
import { router } from 'expo-router';
import api from '@/src/services/api';
import { toastService } from '@/src/services/toastService';
import { Ionicons } from '@expo/vector-icons';

type AccountAction = 'suspend' | 'delete';

const ACCOUNT_ACTION_COPY: Record<AccountAction, {
  title: string; warning: string; body: string; confirm: string; done: string; failed: string;
}> = {
  suspend: {
    title: 'Suspender acesso',
    warning: 'Seus dados ficam guardados',
    body: 'Sua conta fica bloqueada e você sai de todos os aparelhos. Nada é apagado: para voltar, basta entrar de novo com seu e-mail e senha e confirmar a reativação.',
    confirm: 'Sim, suspender meu acesso',
    done: 'Acesso suspenso. Seus dados continuam guardados.',
    failed: 'Não foi possível suspender o acesso. Tente novamente.',
  },
  delete: {
    title: 'Excluir conta e dados',
    warning: '⚠️ Ação irreversível',
    body: 'Sua conta, seu diário, seus tratamentos, suas conversas com o mascote e seus consentimentos serão apagados de forma permanente e não poderão ser recuperados.',
    confirm: 'Sim, excluir minha conta e meus dados',
    done: 'Conta e dados excluídos.',
    failed: 'Não foi possível excluir a conta. Tente novamente.',
  },
};

export default function AccountConfigurationIndex() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // Suspender preserva os dados e pode ser desfeito no login; excluir apaga tudo.
  const [accountAction, setAccountAction] = useState<AccountAction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const showDeactivateModal = accountAction !== null;
  const setShowDeactivateModal = (open: boolean) => { if (!open) setAccountAction(null); };
  const copy = ACCOUNT_ACTION_COPY[accountAction ?? 'delete'];

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/LoginScreen');
  };

  const confirmDeactivate = async () => {
    if (!user?.id || !accountAction) return;
    setDeleting(true);
    try {
      if (accountAction === 'suspend') await api.post('/users/me/suspend');
      else await api.delete(`/users/${user.id}`);
      logout();
      router.replace('/(auth)/LoginScreen');
      toastService.success(copy.done);
    } catch {
      setDeleting(false);
      setShowDeactivateModal(false);
      toastService.error(copy.failed);
    }
  };

  const generalData: BaseActionItem[] = [
    { id: '1', title: 'Editar perfil', route: '/PersonalArea/OnboardingForm' },
    { id: '2', title: 'Editar notificações', route: '/PersonalArea/Notifications' },
  ];

  const securityData: BaseActionItem[] = [
    { id: '0', title: 'Privacidade e consentimentos', route: '/PersonalArea/AccountConfigurations/Privacy' },
    { id: '1', title: 'Mudar senha', route: '/PersonalArea/AccountConfigurations/ChangePassword' },
    { id: '2', title: 'Encerrar sessão', action: handleLogout },
    { id: '3', title: 'Suspender acesso', action: () => setAccountAction('suspend') },
    { id: '4', title: 'Excluir conta e dados', textColor: '#FF4C4C', action: () => setAccountAction('delete') },
  ];

  return (
    <View style={globalStyles.scrollContainer}>

      <UserProfileCenter name={user?.name ?? 'Usuário'} email={user?.email ?? ''} />

      <Text style={styles.sectionHeader}>Geral</Text>
      <ActionCardList data={generalData} containerStyle={styles.listContainer} />

      <Text style={styles.sectionHeader}>Segurança e privacidade</Text>
      <ActionCardList data={securityData} containerStyle={styles.listContainer} />

      <Modal visible={showDeactivateModal} transparent animationType="fade" onRequestClose={() => setShowDeactivateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconRow}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="warning-outline" size={32} color="#FF4C4C" />
              </View>
            </View>
            <Text style={styles.modalTitle}>{copy.title}</Text>
            <Text style={styles.modalWarning}>{copy.warning}</Text>
            <Text style={styles.modalBody}>{copy.body}</Text>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalBtnDestructive, deleting && { opacity: 0.6 }]}
              onPress={confirmDeactivate}
              disabled={deleting}
              activeOpacity={0.8}
            >
              {deleting
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.modalBtnTextDestructive}>{copy.confirm}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => setShowDeactivateModal(false)}
              disabled={deleting}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    marginTop: 16,
  },
  listContainer: {
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  modalIconRow: {
    marginBottom: 16,
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFCCCC',
  },
  modalTitle: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  modalWarning: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: '700',
    color: '#FF4C4C',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  modalBody: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F5F5',
  },
  modalBtnDestructive: {
    backgroundColor: '#FF4C4C',
  },
  modalBtnTextDestructive: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
  modalBtnTextCancel: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
});
