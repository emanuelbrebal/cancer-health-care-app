import { ComponentType, ReactNode, useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { EmptyState, ErrorState, LoadingState } from '@/src/components/ds/States';
import { consentInfo, type ConsentPurpose } from '@/src/constants/consents';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useConsentStore } from '@/src/store/useConsentStore';
import { globalStyles } from '@/src/styles/global';

const PRIVACY_ROUTE = '/PersonalArea/AccountConfigurations/Privacy';

// Bloqueia a área enquanto o consentimento da finalidade não estiver ativo no servidor.
// O botão de emergência nunca passa por aqui.
export function ConsentGate({ purpose, children }: { purpose: ConsentPurpose; children: ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id);
  const status = useConsentStore((s) => s.status);
  const granted = useConsentStore((s) => s.granted[purpose]);
  const load = useConsentStore((s) => s.load);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  if (!userId || granted) return <>{children}</>;

  const info = consentInfo(purpose);
  return (
    <View style={globalStyles.scrollContainer}>
      {status === 'error' ? (
        <ErrorState
          message="Não foi possível verificar suas preferências de privacidade."
          onRetry={() => load(userId, true)}
        />
      ) : status !== 'ready' ? (
        <LoadingState label="Verificando suas preferências de privacidade" />
      ) : (
        <EmptyState
          icon="shield"
          title={`${info.unlocks}: precisa do seu consentimento`}
          message={`Para usar esta área, o OncoMente precisa tratar: ${info.what} Você decide, e pode mudar de ideia quando quiser.`}
          actionLabel="Ver detalhes e decidir"
          onAction={() => router.push(PRIVACY_ROUTE)}
        />
      )}
    </View>
  );
}

export function withConsent<P extends object>(purpose: ConsentPurpose, Screen: ComponentType<P>) {
  return function ConsentGatedScreen(props: P) {
    return (
      <ConsentGate purpose={purpose}>
        <Screen {...props} />
      </ConsentGate>
    );
  };
}
