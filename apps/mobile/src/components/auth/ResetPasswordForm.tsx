import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";

export interface ResetPasswordFormProps {
  setPassword: (text: string) => void;
  setConfirmPassword: (text: string) => void;
  error?: string | false;
}

export function ResetPasswordForm({ setPassword, setConfirmPassword, error }: ResetPasswordFormProps) {
  return (
    <View style={globalStyles.formContainer}>
      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setPassword}
        label="Nova senha"
        placeholder="Mínimo de 6 caracteres"
      />

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setConfirmPassword}
        label="Confirmar nova senha"
        placeholder="Repita a nova senha"
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}
    </View>
  );
}
