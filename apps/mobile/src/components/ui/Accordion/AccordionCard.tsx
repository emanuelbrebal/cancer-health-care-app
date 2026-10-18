import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Button, ButtonVariant } from '@/src/components/ds/Button';
import { color, iconSize, layout, radius, shadow, space, touch, typography } from '@/src/constants/tokens';

interface AccordionCardProps {
    title: string;
    description?: string;
    isExpanded: boolean;
    onToggle: () => void;
    actionText?: string;
    actionIcon?: string;
    onAction?: () => void;
    /** Variante do botão de ação (o fundo vem dos tokens, garantindo contraste ≥ 4.5:1). */
    actionVariant?: ButtonVariant;
    /** @deprecated cores livres no botão reprovavam contraste; use actionVariant. */
    actionButtonColor?: string;
    chevronColor?: string;
    expandedBorderColor?: string;
    children?: React.ReactNode;
}

export function AccordionCard({
    title,
    description,
    isExpanded,
    onToggle,
    actionText,
    actionIcon,
    onAction,
    actionVariant = 'primary',
    chevronColor = color.icon.brand,
    expandedBorderColor = color.border.brand,
    children
}: AccordionCardProps) {
    return (
        <View style={[
            styles.accordionCard,
            isExpanded && { borderColor: expandedBorderColor }
        ]}>
            <Pressable
                style={({ pressed }) => [styles.accordionHeader, pressed && styles.headerPressed]}
                onPress={onToggle}
                accessibilityRole="button"
                accessibilityState={{ expanded: isExpanded }}
                accessibilityHint={isExpanded ? 'Recolhe os detalhes' : 'Mostra os detalhes'}
            >
                <Text style={styles.title}>{title}</Text>
                <Feather
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={iconSize.lg}
                    color={chevronColor}
                />
            </Pressable>

            {isExpanded && (
                <View style={styles.accordionContent}>
                    {description && <Text style={styles.description}>{description}</Text>}

                    {children}

                    {actionText && actionIcon && onAction && (
                        <Button
                            title={actionText}
                            icon={actionIcon as any}
                            variant={actionVariant}
                            onPress={onAction}
                            fullWidth
                        />
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    accordionCard: {
        backgroundColor: color.bg.surface,
        borderRadius: radius.lg,
        borderWidth: layout.borderHairline,
        borderColor: color.border.default,
        overflow: 'hidden',
        ...shadow.sm,
    },
    accordionHeader: {
        minHeight: touch.comfortable + space.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: space.sm,
        paddingVertical: space.sm,
        backgroundColor: color.bg.surface,
    },
    headerPressed: {
        backgroundColor: color.bg.brandSubtle,
    },
    title: {
        ...typography.subtitle,
        color: color.text.primary,
        flex: 1,
        paddingRight: space.sm,
    },
    accordionContent: {
        paddingHorizontal: space.sm,
        paddingBottom: space.sm,
        gap: space.sm,
        backgroundColor: color.bg.surface,
    },
    description: {
        ...typography.body,
        color: color.text.secondary,
    },
});
