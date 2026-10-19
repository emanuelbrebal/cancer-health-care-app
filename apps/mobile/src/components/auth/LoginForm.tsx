import { View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { TextField } from "../ds/TextField";

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface FormProps {
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  errors?: LoginFormErrors;
  onSubmit?: () => void;
  /** @deprecated use errors */
  error?: string | false;
}

export function LoginForm({ setEmail, setPassword, errors = {}, onSubmit }: FormProps) {
  return (
    <View style={globalStyles.formContainer}>
      <TextField
        label="E-mail"
        icon="mail"
        required
        onChangeText={setEmail}
        placeholder="seuemail@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        error={errors.email}
      />

      <TextField
        label="Senha"
        icon="lock"
        required
        isPassword
        onChangeText={setPassword}
        placeholder="Mínimo de 6 caracteres"
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        error={errors.password}
      />
    </View>
  );
}
