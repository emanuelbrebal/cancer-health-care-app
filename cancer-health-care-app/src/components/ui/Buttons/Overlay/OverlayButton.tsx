import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/src/constants/Colors';
import * as Haptics from 'expo-haptics';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface OverlayButtonProps {
    onPress: () => void;
    iconName: IoniconsName;
    iconColor?: string;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

export function OverlayButton({
    onPress,
    iconName,
    iconColor = Colors.white,
    size = 60,
    style
}: OverlayButtonProps) {

    function handlePress() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (onPress) {
            onPress();
        }
    }

    return (
        <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
                styles.overlayButtonContainer,
                pressed && styles.pressed,
                style
            ]}
        >
            <Ionicons name={iconName} size={size || 40} color={iconColor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    overlayButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,

        justifyContent: 'center',
        alignContent: 'center',
        
        width: 60,
        height: 60,
        backgroundColor: Colors.purplePrimary,
        borderRadius: 30,

        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.85 }]
    }
})