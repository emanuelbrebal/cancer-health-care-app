import { authService } from '@/src/services/auth';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useState } from 'react';
import {
  ActivityIndicator, Image, KeyboardAvoidingView,
  Modal, Platform, Pressable, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function SoftLoginModal({ visible, onDismiss }: Props) {
  const storeLogin = useAuthStore((s) => s.login);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Preencha e-mail e senha.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await authService.login(email.trim().toLowerCase(), password);
      storeLogin(data.access_token, data.user);
      onDismiss();
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheet}>

          <Image
            source={require('@assets/images/Home/blueMascotPlaceholder.png')}
            style={styles.mascot}
            resizeMode="contain"
          />

          <Text style={styles.title}>Olá! Que bom te ver!</Text>
          <Text style={styles.subtitle}>Entre para personalizar sua experiência.</Text>

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.btnPrimaryText}>Entrar</Text>
            }
          </TouchableOpacity>

          <Pressable onPress={onDismiss} style={styles.btnSkip}>
            <Text style={styles.btnSkipText}>Continuar sem login</Text>
          </Pressable>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
  },
  mascot: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#1A1A1A',
  },
  error: {
    color: '#e53935',
    fontSize: 13,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  btnPrimary: {
    width: '100%',
    backgroundColor: '#9B5DE0',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSkip: {
    marginTop: 16,
    paddingVertical: 8,
  },
  btnSkipText: {
    color: '#9B5DE0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
