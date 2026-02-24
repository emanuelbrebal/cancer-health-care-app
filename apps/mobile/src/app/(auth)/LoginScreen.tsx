import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { LoginForm } from '@/src/components/auth/LoginForm';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { globalStyles } from '@/src/styles/global';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { authService } from '@/src/services/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<false | string>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const data = await authService.login(email, password);
      console.log("Token recebido:", data.access_token);
      router.replace('/(Home)');
    } catch (error) {
      Alert.alert("Erro", "E-mail ou senha incorretos");
    } finally {
      setIsLoading(false);
    }
  }

  const redirectRegister = () => {
    router.push('/(auth)/RegisterScreen');
  }

  return (
    <AuthLayout
      textPrimary="Bem-vindo(a)"
      textSecondary="Insira suas credenciais de acesso e faça login no sistema."
    >
      <LoginForm setEmail={setEmail} setPassword={setPassword} error={error} />

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