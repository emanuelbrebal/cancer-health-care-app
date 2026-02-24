import { ButtonProps } from "@/src/interfaces/ui/ButtonProps";
import { ButtonStyles } from "@/src/styles/Buttons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export function ButtonOutline({ title, action, loading = false }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={action}
            disabled={loading}
            style={ButtonStyles.buttonOutline}>
            {loading ? (
                <ActivityIndicator color={'#FFF'} />
            ) : (
                <Text style={ButtonStyles.buttonTextOutline}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    )
}