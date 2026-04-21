import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles, baseText } from '@/src/styles/global';
import { InputWithIcon } from '@/src/components/ui/Inputs/InputWithIcon';
import { router } from 'expo-router';
import api from '@/src/services/api';
import { toastService } from '@/src/services/toastService';

interface ChangePasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ChangePasswordErrors>({});
  const [saving, setSaving] = useState(false);

  const clearError = (field: keyof ChangePasswordErrors) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  const validate = (): boolean => {
    const next: ChangePasswordErrors = {};
    if (!currentPassword) next.currentPassword = 'Informe a senha atual.';
    if (!newPassword) next.newPassword = 'Informe a nova senha.';
    else if (newPassword.length < 6) next.newPassword = 'A senha deve ter no mínimo 6 caracteres.';
    if (!confirmPassword) next.confirmPassword = 'Confirme a nova senha.';
    else if (newPassword !== confirmPassword) next.confirmPassword = 'As senhas não coincidem.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      toastService.success('Senha alterada com sucesso!');
      router.back();
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? 'Não foi possível alterar a senha.';
      if (error?.response?.status === 401) {
        setErrors({ currentPassword: 'Senha atual incorreta.' });
      } else {
        toastService.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={globalStyles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          <Text style={styles.description}>
            Para alterar sua senha, informe a senha atual e depois a nova senha desejada.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha atual:</Text>
            <InputWithIcon
              iconLeftName="lock"
              placeholder="Digite sua senha atual"
              secureTextEntry
              value={currentPassword}
              onChangeText={(v) => { setCurrentPassword(v); clearError('currentPassword'); }}
              error={errors.currentPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nova senha:</Text>
            <InputWithIcon
              iconLeftName="lock"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={newPassword}
              onChangeText={(v) => { setNewPassword(v); clearError('newPassword'); }}
              error={errors.newPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar nova senha:</Text>
            <InputWithIcon
              iconLeftName="check"
              placeholder="Repita a nova senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
              error={errors.confirmPassword}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
            <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Alterar Senha'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 60,
    gap: 8,
  },
  description: {
    ...baseText,
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    ...baseText,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#9B51E0',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    ...baseText,
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
