import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MediaViewer } from './MediaViewer';
import { Colors } from '@/src/constants/Colors';

export interface AccordionMediaProps {
    title: string;
    url: string;
}

export function AccordionMedia({ title, url }: AccordionMediaProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={toggleAccordion}
                activeOpacity={0.7}
            >
                <Text style={styles.title}>{title}</Text>
                <MaterialIcons
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={Colors.purpleSecondary}
                />
            </TouchableOpacity>

            <View style={[styles.content, { display: isExpanded ? 'flex' : 'none' }]}>
                <MediaViewer
                    url={url}
                    play={isExpanded}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#F9F5FF',
        borderWidth: 1,
        borderColor: Colors.purplePrimary,
    },
  header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'transparent',
    },
    title: {
        color: Colors.purpleSecondary,
        fontWeight: '600',
        fontSize: 16,
        flex: 1,
        paddingRight: 8,
    },
    content: {
        backgroundColor: '#000000',
        paddingBottom: 0,
    }
});