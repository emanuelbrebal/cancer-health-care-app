import { Colors } from "@/src/constants/Colors";
import { InputStyles } from "@/src/styles/Inputs";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputWithIconProps extends TextInputProps {
  iconLeftName?: keyof typeof Feather.glyphMap;
  iconRightName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  isPassword?: boolean;
  error?: string;
}

export function InputWithIcon({ iconLeftName, iconRightName, iconColor = Colors.lilacPrimary, isPassword = false, error, style, ...rest }: InputWithIconProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={style}>
      <View style={[InputStyles.inputContainer, error ? InputStyles.inputContainerError : null]}>
        {iconLeftName && <Feather name={iconLeftName} size={20} color={error ? Colors.status.error : iconColor} style={InputStyles.iconLeft} />}

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
      {error ? <Text style={InputStyles.errorText}>{error}</Text> : null}
    </View>
  );
}
