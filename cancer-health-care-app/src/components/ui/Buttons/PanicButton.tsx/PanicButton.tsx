import React from 'react';
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from '@/src/constants/Colors';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

export function PanicButton() {

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const handleLongPress = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.push('/MentalHealth/PanicButtonContacts');
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onLongPress={handleLongPress}
            style={({ pressed }) => [
                styles.panicButtonContainer,
                pressed && { opacity: 0.7 }
            ]}
            delayLongPress={1000}
        >
            <Ionicons name="alert-circle-outline" size={60} color={Colors.white} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    panicButtonContainer: {
        position: 'absolute',
        bottom: 30,
        right: 20,

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
    panicButtonPressed: {
        width: 80,
        height: 80,

        transform: 'scale'
    },
})