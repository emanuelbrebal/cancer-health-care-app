import { ButtonProps } from "@/src/interfaces/ui/ButtonProps";
import { ButtonStyles } from "@/src/styles/Buttons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export function ButtonPrimary({ title, action, loading = false }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={action}
            disabled={loading}
            style={[ButtonStyles.buttonPrimary, loading && { opacity: 0.7 }]}>
            {loading ? (
                <ActivityIndicator color="FFF" />
            ) : (
                <Text style={ButtonStyles.buttonTextPrimary}>
                    {title}
                </Text>
            )
            }
        </TouchableOpacity>
    )
}