import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/src/components/ds/Button';
import { Card } from '@/src/components/ds/Card';
import { ErrorState, LoadingState } from '@/src/components/ds/States';
import { CONSENTS, type ConsentInfo, type ConsentPurpose } from '@/src/constants/consents';
import { color, space, typography } from '@/src/constants/tokens';
import { toastService } from '@/src/services/toastService';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useConsentStore } from '@/src/store/useConsentStore';
import { globalStyles } from '@/src/styles/global';

// Chave local lida pela tela de Notificações; acompanha o consentimento do servidor.
const NOTIFICATIONS_LOCAL_KEY = 'oncomente:notifications:consent';

function ConsentCard({
  info,
  granted,
  busy,
  onChange,
}: {
  info: ConsentInfo;
  granted: boolean;
  busy: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{info.title}</Text>
          <Text style={styles.cardUnlocks}>{info.unlocks}</Text>
        </View>
        <Switch
          value={granted}
          onValueChange={onChange}
          disabled={busy}
          trackColor={{ false: color.border.strong, true: color.action.primary }}
          accessibilityLabel={`Consentimento para ${info.title}`}
          accessibilityHint={granted ? 'Ativado. Toque duas vezes para revogar.' : 'Desativado. Toque duas vezes para permitir.'}
        />
      </View>

      <Text style={styles.label}>O que é tratado</Text>
      <Text style={styles.body}>{info.what}</Text>
      <Text style={styles.label}>Para quê</Text>
      <Text style={styles.body}>{info.why}</Text>
      <Text style={styles.label}>Com quem é compartilhado</Text>
      <Text style={styles.body}>{info.sharedWith}</Text>
      <Text style={styles.label}>Se você não permitir</Text>
      <Text style={styles.body}>{info.ifDenied}</Text>
    </Card>
  );
}

export default function PrivacyScreen() {
  const { firstTime } = useLocalSearchParams<{ firstTime?: string }>();
  const userId = useAuthStore((s) => s.user?.id);
  const { status, granted, load, setConsent } = useConsentStore();
  const [busy, setBusy] = useState<ConsentPurpose | null>(null);

  useEffect(() => {
    if (userId) load(userId);
  }, [userId, load]);

  async function handleChange(purpose: ConsentPurpose, value: boolean) {
    setBusy(purpose);
    try {
      await setConsent(purpose, value);
      if (purpose === 'NOTIFICATIONS' && !value) {
        await AsyncStorage.removeItem(NOTIFICATIONS_LOCAL_KEY);
      }
      toastService.success(value ? 'Consentimento registrado.' : 'Consentimento revogado.');
    } catch {
      toastService.error('Não foi possível salvar. Tente novamente.');
    } finally {
      setBusy(null);
    }
  }

  if (!userId) return null;

  return (
    <ScrollView contentContainerStyle={[globalStyles.scrollContainer, styles.content]}>
      <Text style={styles.intro}>
        Você decide como o OncoMente trata seus dados. Tudo começa desativado, e você pode permitir ou revogar
        cada item a qualquer momento. Revogar não apaga o que já foi registrado: seus dados só são apagados se
        você excluir a conta.
      </Text>

      {status === 'error' ? (
        <ErrorState
          message="Não foi possível carregar suas preferências de privacidade."
          onRetry={() => load(userId, true)}
        />
      ) : status !== 'ready' ? (
        <LoadingState label="Carregando suas preferências de privacidade" />
      ) : (
        CONSENTS.map((info) => (
          <ConsentCard
            key={info.purpose}
            info={info}
            granted={granted[info.purpose]}
            busy={busy === info.purpose}
            onChange={(value) => handleChange(info.purpose, value)}
          />
        ))
      )}

      <Text style={styles.footnote}>
        O botão de emergência e os conteúdos de Oncologia e Saúde Mental funcionam sem nenhum consentimento.
        Base legal: Lei Geral de Proteção de Dados (Lei nº 13.709/2018), art. 11.
      </Text>

      {firstTime === '1' && (
        <Button title="Continuar" fullWidth onPress={() => router.replace('/(Home)/PersonalArea/Hub')} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.sm,
    paddingBottom: space.lg,
  },
  intro: {
    ...typography.body,
    color: color.text.primary,
  },
  card: {
    gap: space.xxs,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.xs,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    ...typography.subtitle,
    color: color.text.primary,
  },
  cardUnlocks: {
    ...typography.small,
    color: color.text.secondary,
  },
  label: {
    ...typography.small,
    fontFamily: typography.subtitle.fontFamily,
    color: color.text.brandStrong,
    marginTop: space.xs,
  },
  body: {
    ...typography.small,
    color: color.text.primary,
  },
  footnote: {
    ...typography.caption,
    color: color.text.secondary,
  },
});
