import { useCallback } from 'react';
import { AuthGate } from '@/src/components/auth/AuthGate';
import { useAuthStore } from '@/src/store/useAuthStore';
import { router, useFocusEffect } from 'expo-router';

export default function HomePersonalArea() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) router.replace('/PersonalArea/Hub');
    }, [isAuthenticated])
  );

  return (
    <AuthGate
      image={require('@assets/images/Home/purpleMascotSunglasses.png')}
      title="Sua Área Pessoal"
      description="Um espaço só seu para acompanhar a jornada. Entre na sua conta para acessar."
      benefits={[
        'Diário de humor e emoções',
        'Lembretes de tratamento e calendário',
        'Canais de denúncia de discriminação',
      ]}
    />
  );
}
