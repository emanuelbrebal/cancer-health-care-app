import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';


export default function LoginScreen() {

  const [ email, setEmail ] = useState<string>('');
  const [ senha, setSenha ] = useState<string>('');
  const [ error, setError ] = useState<false|string>(false);
  // ------------------------------------------------
  const handleLogin = () => {
    if (email == 'teste@teste.com' && senha == '123456') {
      router.push('/auth/tela1');
      // router.replace('/auth/tela1');
      // router.back();
    } else {
      setError('Email ou senha incorretos!');
    }
      
  }
  // ------------------------------------------------
  return (
    <View style={styles.container}>
      
      {/* FORMULÁRIO */}
      <View style={styles.loginContainer}>
        <Text style={{fontSize: 30, textAlign: 'center'}}>Meu APP</Text>
        {/* LOGIN */}
        <Text style={styles.text}>Login</Text>
        <TextInput 
          onChangeText={setEmail}
          style={styles.textInput} 
          placeholder='Digite seu email' />

        {/* SENHA */}
        <Text style={styles.text}>Senha</Text>
        <TextInput style={styles.textInput}
          onChangeText={setSenha}
          secureTextEntry  placeholder='Digite sua senha'/>

        { error && <Text>{error}</Text>}
        {/* BOTÃO */}
        <Button title="Entrar" onPress={handleLogin} />

        <Link href="/auth/tela2">
          <Text>VÁ PARA TELA 2</Text>
        </Link>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0072be',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 30
  },
  loginContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 5
  },
  text: {
    color: 'black'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 10
  }
});
