import { View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";
import { SelectWithIcon } from "../ui/Inputs/SelectWithIcon";

export interface RegisterFormErrors {
  role?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface FormProps {
  setEmail: (text: string) => void;
  setUserRole: (text: string) => void;
  setPassword: (text: string) => void;
  setConfirmPassword: (text: string) => void;
  userRole: string;
  errors?: RegisterFormErrors;
  /** @deprecated use errors */
  error?: string | false;
}

const userRoleData = [
  { label: 'Paciente', value: 'PATIENT' },
  { label: 'Cuidador', value: 'CAREGIVER' },
  { label: 'Admin', value: 'ADMIN' },
];

export function RegisterForm({ setEmail, setPassword, setUserRole, setConfirmPassword, userRole, errors = {} }: FormProps) {
  return (
    <View style={globalStyles.formContainer}>
      <SelectWithIcon
        iconLeftName="user"
        data={userRoleData}
        value={userRole}
        placeholder="Tipo de usuário"
        onChange={item => setUserRole(item.value)}
        error={errors.role}
      />

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
        placeholder='senha (mín. 6 caracteres)'
        error={errors.password}
      />

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setConfirmPassword}
        placeholder='confirmar senha'
        error={errors.confirmPassword}
      />
    </View>
  );
}
