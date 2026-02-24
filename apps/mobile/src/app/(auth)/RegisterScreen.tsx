import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { RegisterForm } from '@/src/components/auth/RegisterForm';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { globalStyles } from '@/src/styles/global';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { authService } from '@/src/services/auth';

export default function RegisterScreen() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [error, setError] = useState<false | string>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !userRole) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await authService.register({ email, password, role: userRole });
      router.replace('/(auth)/LoginScreen');
    } catch (err) {
      setError("Erro ao cadastrar usuário");
    } finally {
      setIsLoading(false);
    }
  }

  const redirectLogin = () => {
    router.push('/(auth)/LoginScreen');
  }

  return (
    <AuthLayout
      textPrimary="Bem-vindo(a)"
      textSecondary="Faça seu cadastro para acessar o sistema!"
    >
      <RegisterForm setUserRole={setUserRole} setEmail={setEmail} setPassword={setPassword} setConfirmPassword={setConfirmPassword} userRole={userRole} error={error} />

      <View style={globalStyles.buttonContainer}>
        <ButtonOutline title='Fazer Login' action={redirectLogin} loading={isLoading}/>

        <ButtonPrimary title='Cadastrar' action={handleRegister} loading={isLoading}/>
      </View>

      <Link href="/(auth)/ResetPassword">
        <Text style={[globalStyles.textHyperlink, { marginTop: 40 }]}>Esqueci minha senha</Text>
      </Link>

      <StatusBar style="auto" />

    </AuthLayout>
  );
}