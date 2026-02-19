import { Text, TextInput, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";

export interface FormProps {
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  error?: string | false; 
}

export function LoginForm({ setEmail, setPassword, error }: FormProps) {

  return (
    <View style={globalStyles.formContainer}>
      
      <InputWithIcon
        iconLeftName="mail" 
        onChangeText={setEmail}
        placeholder='email@email.com'
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}   
        onChangeText={setPassword}
        placeholder='senha'
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}
      
    </View>
  );
}