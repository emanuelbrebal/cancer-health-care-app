import { Colors } from "@/src/constants/Colors";
import { InputStyles } from "@/src/styles/Inputs";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputWithIconProps extends TextInputProps {
  iconLeftName?: keyof typeof Feather.glyphMap;
  iconRightName?: keyof typeof Feather.glyphMap;
  iconColor?: string,
  isPassword?: boolean;
}

export function InputWithIcon({ iconLeftName, iconRightName, iconColor=Colors.lilacPrimary, isPassword = false, style, ...rest }: InputWithIconProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[InputStyles.inputContainer, style]}>
      {iconLeftName && <Feather name={iconLeftName} size={20} color={iconColor} style={InputStyles.iconLeft} />}

      <TextInput
        style={InputStyles.inputField}
        placeholderTextColor={Colors.purpleSecondary}
        secureTextEntry={isPassword && !isPasswordVisible}
        {...rest}
      />

      {iconRightName && <Feather name={iconRightName} size={20} color={iconColor} style={InputStyles.iconLeft} />}
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