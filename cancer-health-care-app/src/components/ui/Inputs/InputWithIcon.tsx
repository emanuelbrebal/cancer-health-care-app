import { Colors } from "@/src/constants/Colors";
import { InputStyles } from "@/src/styles/Inputs";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputWithIconProps extends TextInputProps {
  iconLeftName: keyof typeof Feather.glyphMap; 
  isPassword?: boolean; 
}

export function InputWithIcon({ iconLeftName, isPassword = false, style, ...rest }: InputWithIconProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={InputStyles.inputContainer}>
      
      <Feather name={iconLeftName} size={20} color={Colors.lilacPrimary} style={InputStyles.iconLeft} />

      <TextInput
        style={[InputStyles.inputField, style]}
        placeholderTextColor={Colors.purpleSecondary}
        secureTextEntry={isPassword && !isPasswordVisible}
        {...rest}
      />

      {isPassword && (
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Feather 
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={20} 
            color={Colors.lilacPrimary}
          />
        </TouchableOpacity>
      )}

    </View>
    )
}