import CommonAreasLayout from "@/src/components/layouts/CommonAreasLayout/CommonAreasLayout";
import { router } from "expo-router";
import { Button, View } from "react-native";

export default function OncologyMenu() {
  return (
    <View>
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