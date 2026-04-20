import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RecoverPassword() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Feather name="mail" size={40} color="#9B5DE0" />
        </View>

        <Text style={styles.title}>Recuperação de senha</Text>

        <Text style={styles.body}>
          A recuperação de senha por e-mail ainda não está disponível nesta versão do aplicativo.
        </Text>
        <Text style={styles.body}>
          Para redefinir sua senha, entre em contato com o suporte do OncoMente pelo e-mail:
        </Text>
        <Text style={styles.email}>suporte@oncomente.com</Text>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={16} color="#9B5DE0" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrapper: {
    backgroundColor: '#EDE9FE',
    borderRadius: 50,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C1D95',
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
  },
  email: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9B5DE0',
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 15,
    color: '#9B5DE0',
    fontWeight: '600',
  },
});
