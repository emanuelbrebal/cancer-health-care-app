import { Text, View } from "react-native";
import { globalStyles } from "@/src/styles/global";
import { InputWithIcon } from "../ui/Inputs/InputWithIcon";
import { SelectWithIcon } from "../ui/Inputs/SelectWithIcon";
import { useState } from "react";

export interface FormProps {
  setAccountType: (text: string) => void;
  setEmail: (text: string) => void;
  setPassword: (text: string) => void;
  error?: string | false;
}
const accountType = [
  { label: 'Paciente', value: '0' },
  { label: 'Cuidador', value: '1' },
];

export function RegisterForm({ setAccountType, setEmail, setPassword, error }: FormProps) {

  const [genero, setGenero] = useState('');

  return (
    <View style={globalStyles.formContainer}>

      <SelectWithIcon
        iconLeftName="user"
        data={accountType}
        value={genero}
        placeholder="Tipo de usuário"
        onChange={item => {
          setGenero(item.value);
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