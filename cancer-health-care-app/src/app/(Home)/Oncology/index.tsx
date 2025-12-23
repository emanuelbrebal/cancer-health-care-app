import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function OncologyMenu() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo à Área Oncológica</Text>
      
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