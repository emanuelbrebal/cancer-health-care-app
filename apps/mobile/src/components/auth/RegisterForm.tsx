import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";
import { SelectWithIcon } from "../ui/Inputs/SelectWithIcon";

export interface FormProps {
  setEmail: (text: string) => void;
  setUserRole: (text: string) => void;
  setPassword: (text: string) => void;
  setConfirmPassword: (text: string) => void;
  userRole: string;
  error?: string | false;
}

const userRoleData = [
  { label: 'Paciente', value: 'PATIENT' },
  { label: 'Cuidador', value: 'CAREGIVER' },
  { label: 'Admin', value: 'ADMIN' },
];

export function RegisterForm({setEmail, setPassword, setUserRole, setConfirmPassword, userRole, error }: FormProps) {


  return (
    <View style={globalStyles.formContainer}>

      <SelectWithIcon
        iconLeftName="user"
        data={userRoleData}
        value={userRole}
        placeholder="Tipo de usuário"
        onChange={item => { setUserRole(item.value) }}
      />

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

      <InputWithIcon
        iconLeftName="lock"
        isPassword={true}
        onChangeText={setConfirmPassword}
        placeholder='Confirmar senha'
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}

    </View>
  );
}