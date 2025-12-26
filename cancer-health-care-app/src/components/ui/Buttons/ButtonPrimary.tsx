import { ButtonStyles } from "@/src/styles/Buttons";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string,
    action: any
}
export function ButtonPrimary({ title, action }: ButtonProps) {
    return (
        <TouchableOpacity style={ButtonStyles.buttonPrimary} onPress={action}>
            <Text style={ButtonStyles.buttonTextPrimary}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}