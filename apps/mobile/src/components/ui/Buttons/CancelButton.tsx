import { ButtonStyles } from "@/src/styles/Buttons";
import { globalStyles } from "@/src/styles/global";
import { router } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

export function CancelButton() {
    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        }
    }
    return (
        <TouchableOpacity onPress={goBack}>
            <Text style={[globalStyles.textError, { fontWeight: 'bold', paddingLeft: 20 }]}>
                Cancelar
            </Text>
        </TouchableOpacity>
    )
} 