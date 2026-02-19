import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";
import { SelectWithIcon } from "../ui/Inputs/SelectWithIcon";
import { useState } from "react";

export interface FormProps {
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  error?: string | false;
}
const accountTypeData = [
  { label: 'Paciente', value: '0' },
  { label: 'Cuidador', value: '1' },
];

export function RegisterForm({setEmail, setPassword, error }: FormProps) {

  const [accountType, setAccountType] = useState('');

  return (
    <View style={globalStyles.formContainer}>

      <SelectWithIcon
        iconLeftName="user"
        data={accountTypeData}
        value={accountType}
        placeholder="Tipo de usuário"
        onChange={item => {
          setAccountType(item.value);
        }}
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
        onChangeText={setPassword}
        placeholder='Confirmar senha'
      />

      {error ? <Text style={globalStyles.textError}>{error}</Text> : null}

    </View>
  );
}