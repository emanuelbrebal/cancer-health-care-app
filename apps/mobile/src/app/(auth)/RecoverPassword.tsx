import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { ResetPasswordForm } from '@/src/components/auth/ResetPasswordForm';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { CancelButton } from '@/src/components/ui/Buttons/CancelButton';
import { globalStyles } from '@/src/styles/global';
import { authService } from '@/src/services/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/Colors';

export default function RecoverPassword() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | false>(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token.trim()) {
      setError('Informe o código recebido por e-mail.');
      return;
    }
    if (!password) {
      setError('Informe a nova senha.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setError(false);
    setLoading(true);
    try {
      await authService.resetPassword(token.trim(), password);
      router.replace('/(auth)/LoginScreen');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 400) {
        setError('Código inválido ou expirado. Solicite um novo.');
      } else if (!err.response) {
        setError('Sem conexão. Verifique sua internet.');
      } else {
        setError('Não foi possível redefinir a senha. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      textPrimary="Redefinir senha"
      textSecondary={
        email
          ? `Insira o código enviado para ${email} e escolha uma nova senha.`
          : 'Insira o código recebido por e-mail e escolha uma nova senha.'
      }
    >
      <View style={styles.tokenWrapper}>
        <TextInput
          style={styles.tokenInput}
          placeholder="Código recebido por e-mail"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          value={token}
          onChangeText={(v) => { setToken(v); setError(false); }}
        />
      </View>

      <ResetPasswordForm
        setPassword={(v) => { setPassword(v); setError(false); }}
        setConfirmPassword={(v) => { setConfirmPassword(v); setError(false); }}
        error={error}
      />

      <View style={globalStyles.buttonContainer}>
        <CancelButton />
        <ButtonPrimary title="Redefinir" action={handleReset} loading={loading} />
      </View>

      <StatusBar style="auto" />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  tokenWrapper: {
    width: '100%',
    marginBottom: 4,
  },
  tokenInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FFF',
  },
});
