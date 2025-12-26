import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";

export interface FormProps {
  setPassword: (text: string) => void;
  error?: string | false;
}

export function RecoverPasswordForm({ setPassword, error }: FormProps) {

  return (
    <View style={globalStyles.formContainer}>

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setPassword}
        placeholder='Nova Senha'
      />

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setPassword}
        placeholder='Confirmar senha'
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}

    </View>
  );
}