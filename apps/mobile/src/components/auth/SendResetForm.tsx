import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";

export interface FormProps {
  setEmail: (text: string) => void;
  error?: string | false; 
}

export function SendResetForm({ setEmail, error }: FormProps) {

  return (
    <View style={globalStyles.formContainer}>
      
      <InputWithIcon
        iconLeftName="mail" 
        onChangeText={setEmail}
        placeholder='email@email.com'
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}
      
    </View>
  );
}
