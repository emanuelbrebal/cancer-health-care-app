import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { RecoverPasswordForm } from '@/src/components/auth/ResetPasswordForm';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { CancelButton } from '@/src/components/ui/Buttons/CancelButton';
import { ImageContainer } from '@/src/components/ui/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

export default function RecoverPassword() {

  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<false | string>(false);

  const handleRecoverPassword = () => {
    router.push('/(auth)/RecoverPassword');
  }

  return (
    <AuthLayout
      textPrimary="Recupere a senha!"
      textSecondary="Digite sua nova senha e confirme abaixo."
    >
      <RecoverPasswordForm setPassword={setPassword} error={error} />

      <View style={globalStyles.buttonContainer}>

        <CancelButton />

        <ButtonPrimary title='Enviar' action={handleRecoverPassword} />
      </View>

      <ImageContainer imagePath={require('@assets/images/Home/purpleMascotSunglasses.png')} reverted/>

      <StatusBar style="auto" />

    </AuthLayout>
  );
}