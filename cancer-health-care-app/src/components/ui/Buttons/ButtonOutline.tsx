import { ButtonStyles } from "@/src/styles/Buttons";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string,
    action: any
}
export function ButtonOutline({ title, action }: ButtonProps) {
    return (
        <TouchableOpacity style={ButtonStyles.buttonOutline} onPress={action}>
            <Text style={ButtonStyles.buttonTextOutline}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}