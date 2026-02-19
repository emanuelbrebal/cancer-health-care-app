import React from 'react';
import { StyleSheet, View } from "react-native";
import { Image } from 'expo-image';
import { imageContainerProps } from "@/src/interfaces/ImageContainerProps";

export function Avatar({ style, imagePath = require('@assets/images/Placeholders/ImagePlaceholder.png') }: imageContainerProps) {
    return (
        <View style={[styles.avatarContainer, style]}>
            <Image 
                style={styles.image} 
                source={imagePath} 
                contentFit="cover" 
                transition={200} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        width: 50,           
        height: 50,
        backgroundColor: '#5FBDFF',
        borderRadius: 25,   
        overflow: 'hidden', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});