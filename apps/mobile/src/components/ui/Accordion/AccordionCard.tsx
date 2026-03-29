import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface AccordionCardProps {
    title: string;
    description: string;
    isExpanded: boolean;
    onToggle: () => void;
    actionText?: string;
    actionIcon?: string;
    onAction?: () => void;
    actionButtonColor?: string;
    // Novas props opcionais para customização de cores
    chevronColor?: string;
    expandedBorderColor?: string;
}

export function AccordionCard({
    title,
    description,
    isExpanded,
    onToggle,
    actionText,
    actionIcon,
    onAction,
    actionButtonColor = '#D32F2F', // Vermelho original
    chevronColor = '#D32F2F',      // Vermelho original
    expandedBorderColor = '#F8B4B4' // Vermelho original
}: AccordionCardProps) {
    return (
        <View style={[
            styles.accordionCard, 
            // Aplica a borda customizada apenas quando estiver expandido
            isExpanded && { borderColor: expandedBorderColor }
        ]}>
            <TouchableOpacity
                style={styles.accordionHeader}
                activeOpacity={0.7}
                onPress={onToggle}
            >
                <Text style={styles.title}>{title}</Text>
                <Feather
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={chevronColor} // Usa a cor customizada ou original
                />
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.accordionContent}>
                    <Text style={styles.description}>{description}</Text>

                    {actionText && actionIcon && onAction && (
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: actionButtonColor }]}
                            activeOpacity={0.8}
                            onPress={onAction}
                        >
                            <Feather name={actionIcon as any} size={20} color="#FFF" />
                            <Text style={styles.actionButtonText}>{actionText}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    accordionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    // Removi a classe 'accordionCardExpanded' daqui, pois agora aplicamos a cor diretamente no View
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        paddingRight: 16,
    },
    accordionContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    description: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFF',
    },
});