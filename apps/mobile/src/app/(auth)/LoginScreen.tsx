import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { LoginForm, LoginFormErrors } from '@/src/components/auth/LoginForm';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const next: LoginFormErrors = {};
    if (!email.trim()) next.email = 'O e-mail é obrigatório.';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Formato de e-mail inválido.';
    if (!password) next.password = 'A senha é obrigatória.';
    else if (password.length < 6) next.password = 'A senha deve ter no mínimo 6 caracteres.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      useAuthStore.getState().login(data.access_token, data.user);
      router.replace('/(Home)');
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401) setErrors({ password: 'E-mail ou senha incorretos.' });
      else if (status === 404) setErrors({ email: 'Usuário não encontrado.' });
      else if (!err.response) setErrors({ email: 'Sem conexão. Tente novamente.' });
      else setErrors({ email: 'Erro ao fazer login. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const redirectRegister = () => {
    router.push('/(auth)/RegisterScreen');
  };

  return (
    <AuthLayout
      textPrimary="Bem-vindo(a)"
      textSecondary="Insira suas credenciais de acesso e faça login no sistema."
    >
      <LoginForm
        setEmail={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
        setPassword={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
        errors={errors}
      />

      <View style={globalStyles.buttonContainer}>
        <ButtonOutline title='Cadastrar' action={redirectRegister} loading={isLoading} />
        <ButtonPrimary title='Entrar' action={handleLogin} loading={isLoading} />
      </View>

      <Link href="/(auth)/ResetPassword">
        <Text style={[globalStyles.textHyperlink, { marginTop: 40 }]}>Esqueci minha senha</Text>
      </Link>

      <StatusBar style="auto" />
    </AuthLayout>
  );
}
