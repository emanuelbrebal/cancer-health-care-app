import AuthLayout from '@/src/components/auth/AuthLayout/AuthLayout';
import { LoginForm } from '@/src/components/auth/LoginForm';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { globalStyles } from '@/src/styles/global';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function LoginScreen() {

  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [error, setError] = useState<false | string>(false);

  const handleLogin = () => {
    if (email == 'teste' && senha == '123') {
      router.push('/(Home)');
    } else {
      setError('* Email ou senha incorretos!');
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
      <LoginForm setEmail={setEmail} setPassword={setSenha} error={error} />

      <View style={globalStyles.buttonContainer}>
        <ButtonOutline title='Cadastrar' action={redirectRegister} />

        <ButtonPrimary title='Entrar' action={handleLogin} />
      </View>

      <Link href="/(auth)/ResetPassword">
        <Text style={globalStyles.textHyperlink}>Esqueci minha senha</Text>
      </Link>

      <StatusBar style="auto" />

    </AuthLayout>
  );
}