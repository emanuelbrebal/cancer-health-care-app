import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { RegisterForm } from '@/src/components/auth/RegisterForm';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { globalStyles } from '@/src/styles/global';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function RegisterScreen() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<false | string>(false);

  const handleLogin = () => {
    if (email == 'teste' && password == '123') {
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
      textSecondary="Faça seu cadastro para acessar o sistema!"
    >
      <RegisterForm setEmail={setEmail} setPassword={setPassword} error={error} />

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