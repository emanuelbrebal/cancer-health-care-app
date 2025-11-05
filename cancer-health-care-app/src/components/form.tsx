import { Button, Text, TextInput, View } from "react-native";
import { styles } from "../app/auth";

export interface FormProps {
    setEmail: any, 
    setSenha: any, 
    handleLogin: any, 
    error: any
}


export function Form({setEmail, setSenha, handleLogin, error}: FormProps) {

    return (
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
        </View>
    );
}