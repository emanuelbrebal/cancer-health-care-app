import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { MediaViewer } from './MediaViewer';
import { Colors } from '@/src/constants/Colors';

export interface AccordionMediaProps {
    title: string;
    url: string | number;
    description?: string;
    series?: number;
    reps?: string;
}

export function AccordionMedia({ title, url, description, series, reps }: AccordionMediaProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
                onPress={() => setIsExpanded(!isExpanded)}
                activeOpacity={0.7}
            >
                <Text style={styles.title}>{title}</Text>
                <MaterialIcons
                    name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={Colors.purpleSecondary}
                />
            </TouchableOpacity>

            {isExpanded && (
                <View>
                    <MediaViewer url={url} play={isExpanded} />

                    {(description || series || reps) && (
                        <View style={styles.infoContainer}>
                            {description ? (
                                <Text style={styles.description}>{description}</Text>
                            ) : null}

                            {(series || reps) ? (
                                <View style={styles.metaRow}>
                                    {series ? (
                                        <View style={styles.metaBadge}>
                                            <Feather name="repeat" size={13} color={Colors.purplePrimary} />
                                            <Text style={styles.metaText}>{series} séries</Text>
                                        </View>
                                    ) : null}
                                    {reps ? (
                                        <View style={styles.metaBadge}>
                                            <Feather name="activity" size={13} color={Colors.purplePrimary} />
                                            <Text style={styles.metaText}>{reps}</Text>
                                        </View>
                                    ) : null}
                                </View>
                            ) : null}
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 12,
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
        fontSize: 15,
        fontFamily: 'Montserrat',
        flex: 1,
        paddingRight: 8,
    },
    infoContainer: {
        padding: 14,
        backgroundColor: '#FFF',
        gap: 10,
    },
    description: {
        fontFamily: 'Montserrat',
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    metaBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#F3E5F5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    metaText: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        fontWeight: '600',
        color: Colors.purplePrimary,
    },
});
