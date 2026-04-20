import { View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface FormProps {
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  errors?: LoginFormErrors;
  /** @deprecated use errors */
  error?: string | false;
}

export function LoginForm({ setEmail, setPassword, errors = {} }: FormProps) {
  return (
    <View style={globalStyles.formContainer}>
      <InputWithIcon
        iconLeftName="mail"
        onChangeText={setEmail}
        placeholder='email@email.com'
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setPassword}
        placeholder='senha'
        error={errors.password}
      />
    </View>
  );
}
