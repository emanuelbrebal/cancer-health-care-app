import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { ImageContainer } from '@/src/components/ui/Images/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomePersonalArea() {
  function redirectRegister() {
    router.push('/(auth)/RegisterScreen');
  }
  
  function handleLogin() {
    router.push('/PersonalArea/Hub'); 
  }

  return (
    <SafeAreaView style={[globalStyles.startContainer]}>
     
      <ImageContainer imagePath={require('@assets/images/Home/purpleMascotSunglasses.png')} />
      
      <View style={styles.content}>
        <Text style={styles.title}>
          Sua Área Pessoal OncoMente
        </Text>

        <Text style={styles.descriptionText}>
          Um espaço exclusivo para sua jornada. Registre suas emoções no Diário, gerencie Tratamentos, acompanhe seu Calendário e converse com nosso Mascote!
        </Text>

        <Text style={styles.callToAction}>
          Acesse suas ferramentas agora!
        </Text>

        <View style={globalStyles.buttonContainer}>
          <ButtonPrimary title='Criar Conta' action={redirectRegister} />
          <ButtonOutline title='Entrar' action={handleLogin} />
        </View>

        <Text style={styles.footerText}>
          Tudo centralizado, gratuito e seguro.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15, 
    textAlign: 'center',
    color: '#333',
    lineHeight: 22,
  },
  callToAction: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15, 
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  }
});