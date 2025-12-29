import AuthLayout from '@/src/components/auth/AuthLayout/AuthLayout';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { ImageContainer } from '@/src/components/ui/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function WelcomeScreen() {
  const redirectLogin = () => {
    router.push('/LoginScreen');
  }

  const redirectRegister = () => {
    router.push('/RegisterScreen');
  }
  return (
    <AuthLayout
      textPrimary="Bem-vindo(a)"
      textSecondary="Lorem ipsum dolor sit amet, vamos cuidar de você hoje."
    >
      <ImageContainer imagePath={require('@assets/images/Home/blueMascotPlaceholder.png')} reverted={false} />

      <View style={globalStyles.buttonContainer}>
        <ButtonOutline title='Cadastrar' action={redirectRegister} />

        <ButtonPrimary title='Entrar' action={redirectLogin} />

      </View>
    </AuthLayout>
  );
}