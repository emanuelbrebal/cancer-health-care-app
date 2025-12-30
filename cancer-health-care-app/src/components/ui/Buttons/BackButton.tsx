import React from 'react';
import { TouchableOpacity} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';

interface BackButtonProps {
    color?: string;
}

export function BackButton({
    color = Colors.purpleSecondary,
}: BackButtonProps) {

    const handlePress = () => {
        if (router.canGoBack()) {
            router.back();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[globalStyles.layoutContainer, {flex: 1}]}
            activeOpacity={0.7}
        >
            <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
    );
}

