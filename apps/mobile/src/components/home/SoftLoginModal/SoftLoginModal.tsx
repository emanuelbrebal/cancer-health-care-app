import { authService } from '@/src/services/auth';
import { useAuthStore } from '@/src/store/useAuthStore';
import { Button } from '@/src/components/ds/Button';
import { TextField } from '@/src/components/ds/TextField';
import { toastService } from '@/src/services/toastService';
import { color, iconSize, layout, radius, space, touch, typography } from '@/src/constants/tokens';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Image, KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function SoftLoginModal({ visible, onDismiss }: Props) {
  const storeLogin = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (isAuthenticated && visible) onDismiss();
  }, [isAuthenticated, visible]);

  async function handleLogin() {
    if (!email || !password) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email.trim().toLowerCase(), password);
      storeLogin(data.access_token, data.user);
      const firstName = data.user?.name?.split(' ')[0];
      toastService.success(firstName ? `Que bom te ver, ${firstName}!` : 'Login realizado!');
      onDismiss();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 404) {
        setError('E-mail ou senha incorretos.');
      } else if (!err?.response) {
        setError('Sem conexão. Verifique sua internet.');
      } else {
        setError('Erro ao entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleRegister() {
    onDismiss();
    router.push('/(auth)/RegisterScreen');
  }

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent onRequestClose={onDismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.overlay}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Pressable
              onPress={onDismiss}
              accessibilityRole="button"
              accessibilityLabel="Fechar e continuar sem login"
              style={styles.close}
            >
              <Feather name="x" size={iconSize.lg} color={color.icon.muted} />
            </Pressable>

            <Image
              source={require('@assets/images/Home/blueMascotPlaceholder.png')}
              style={styles.mascot}
              resizeMode="contain"
              accessible={false}
            />

            <Text style={styles.title} accessibilityRole="header">Olá! Que bom te ver!</Text>
            <Text style={styles.subtitle}>
              Entre para usar o Mascote e o seu Diário. As áreas de Oncologia e Saúde Mental são abertas a todos.
            </Text>

            <TextField
              label="E-mail"
              placeholder="seuemail@exemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={(v) => { setEmail(v); setError(''); }}
            />
            <TextField
              label="Senha"
              isPassword
              autoComplete="password"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
              error={error || undefined}
            />

            <Button title="Entrar" onPress={handleLogin} loading={loading} fullWidth />
            <Button title="Criar conta" variant="secondary" onPress={handleRegister} fullWidth />
            <Button title="Agora não" variant="ghost" onPress={onDismiss} fullWidth
              accessibilityHint="Fecha este aviso e não mostra de novo" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.bg.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: color.bg.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '92%',
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.lg,
    alignItems: 'center',
    gap: space.sm,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
  },
  close: {
    alignSelf: 'flex-end',
    width: touch.comfortable,
    height: touch.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascot: {
    width: layout.mascotSm,
    height: layout.mascotSm,
  },
  title: {
    ...typography.title,
    color: color.text.primary,
  },
  subtitle: {
    ...typography.body,
    color: color.text.secondary,
    textAlign: 'center',
  },
});
