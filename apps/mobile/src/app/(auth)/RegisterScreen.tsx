import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { RegisterForm, RegisterFormErrors } from '@/src/components/auth/RegisterForm';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { globalStyles } from '@/src/styles/global';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { authService } from '@/src/services/auth';
import { useAuthStore } from '@/src/store/useAuthStore';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const next: RegisterFormErrors = {};
    if (!userRole) next.role = 'Selecione o tipo de conta.';
    if (!name.trim()) next.name = 'O nome é obrigatório.';
    else if (name.trim().length < 2) next.name = 'Informe um nome válido.';
    if (!email.trim()) next.email = 'O e-mail é obrigatório.';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Formato de e-mail inválido.';
    if (!password) next.password = 'A senha é obrigatória.';
    else if (password.length < 6) next.password = 'A senha deve ter no mínimo 6 caracteres.';
    if (!confirmPassword) next.confirmPassword = 'Confirme sua senha.';
    else if (password !== confirmPassword) next.confirmPassword = 'As senhas não coincidem.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.register({ name: name.trim(), email, password, role: userRole });
      const data = await authService.login(email, password);
      useAuthStore.getState().login(data.access_token, data.user);
      router.replace({ pathname: '/PersonalArea/OnboardingForm', params: { firstTime: '1' } });
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 409) setErrors({ email: 'Este e-mail já está em uso.' });
      else if (status === 400) setErrors({ email: err.response?.data?.message ?? 'Dados inválidos.' });
      else if (!err.response) setErrors({ email: 'Sem conexão. Tente novamente.' });
      else setErrors({ email: 'Erro ao cadastrar. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectLogin = () => {
    router.push('/(auth)/LoginScreen');
  };

  const clearError = (field: keyof RegisterFormErrors) =>
    setErrors((e) => ({ ...e, [field]: undefined }));

  return (
    <AuthLayout
      textPrimary="Bem-vindo(a)"
      textSecondary="Faça seu cadastro para acessar o sistema!"
    >
      <RegisterForm
        userRole={userRole}
        setUserRole={(v) => { setUserRole(v); clearError('role'); }}
        setName={(v) => { setName(v); clearError('name'); }}
        setEmail={(v) => { setEmail(v); clearError('email'); }}
        setPassword={(v) => { setPassword(v); clearError('password'); }}
        setConfirmPassword={(v) => { setConfirmPassword(v); clearError('confirmPassword'); }}
        errors={errors}
      />

      <View style={globalStyles.buttonContainer}>
        <ButtonOutline title='Fazer Login' action={redirectLogin} loading={isLoading} />
        <ButtonPrimary title='Cadastrar' action={handleRegister} loading={isLoading} />
      </View>

      <Link href="/(auth)/ResetPassword">
        <Text style={[globalStyles.textHyperlink, { marginTop: 40 }]}>Esqueci minha senha</Text>
      </Link>

      <StatusBar style="auto" />
    </AuthLayout>
  );
}
