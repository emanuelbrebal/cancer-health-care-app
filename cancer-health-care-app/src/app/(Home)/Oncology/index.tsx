import { View, Text, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "@/src/styles/global";

export default function OncologyMenu() {
  return (
    <View style={globalStyles.layoutContainer}>
      <Text style={globalStyles.textPrimary}>Bem-vindo à Área Oncológica</Text>

      <Button
        title="Ir para Auth"
        onPress={() => router.push('/(auth)')}
      />
      <Button
        title="Ir para Direitos"
        onPress={() => router.push('/(Home)/Oncology/LegalArea')}
      />

      <Button
        title="Ir para Lazer"
        onPress={() => router.push('/(Home)/Oncology/Leisure')}
      />
    </View>
  );
}