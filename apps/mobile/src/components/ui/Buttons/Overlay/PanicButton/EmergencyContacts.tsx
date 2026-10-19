import React, { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { EmergencyContact } from '@/src/interfaces/EmergencyContact';
import { AccordionCard } from '../../../Accordion/AccordionCard';
import { color, layout, radius, space, typography } from '@/src/constants/tokens';
import { toastService } from '@/src/services/toastService';

interface EmergencyContactsListProps {
    data: EmergencyContact[];
}

export default function EmergencyContacts({ data }: EmergencyContactsListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };

    // Abre o discador direto (canOpenURL('tel:') falha no Android 11+ sem <queries>).
    const openDialer = async (phoneNumber: string, title: string) => {
        if (!phoneNumber) return;
        try {
            await Linking.openURL(`tel:${phoneNumber}`);
        } catch {
            toastService.error(`Não foi possível abrir o discador. Ligue para ${phoneNumber} (${title}).`);
        }
    };

    if (data.length === 0) {
        return <Text style={styles.emptyText}>Nenhum contato encontrado.</Text>;
    }

    return (
        <View style={styles.list} accessibilityRole="list">
            {data.map((item) => {
                const cleanNumber = item.phoneNumber.replace(/\D/g, '');
                return (
                    <View key={String(item.id)} style={styles.cardWrapper}>
                        <AccordionCard
                            title={item.title}
                            description={item.description || 'Nenhuma descrição disponível.'}
                            isExpanded={expandedId === String(item.id)}
                            onToggle={() => toggleExpand(String(item.id))}
                            actionText={`Ligar para ${item.phoneNumber}`}
                            actionIcon="phone"
                            actionVariant="danger"
                            onAction={() => openDialer(cleanNumber, item.title)}
                        />
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        gap: space.sm,
        paddingBottom: space.md,
    },
    cardWrapper: {
        borderLeftWidth: space.xxs,
        borderLeftColor: color.action.danger,
        borderRadius: radius.lg,
        overflow: 'hidden',
    },
    emptyText: {
        ...typography.body,
        textAlign: 'center',
        color: color.text.secondary,
        marginTop: space.md,
        borderWidth: layout.borderHairline,
        borderColor: color.border.default,
    },
});
