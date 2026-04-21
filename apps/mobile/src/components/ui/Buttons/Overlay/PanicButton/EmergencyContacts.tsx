import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Feather } from '@expo/vector-icons';
import { EmergencyContact } from '@/src/interfaces/EmergencyContact';
import { AccordionCard } from '../../../Accordion/AccordionCard';

const ACCENT_COLORS = ['#0284C7', '#DC2626', '#7C3AED', '#059669'];
const BG_COLORS    = ['#EFF6FF', '#FEF2F2', '#F5F3FF', '#ECFDF5'];

interface EmergencyContactsListProps {
    data: EmergencyContact[];
}

export default function EmergencyContacts({ data }: EmergencyContactsListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(prevId => (prevId === id ? null : id));
    };

    const openDialer = (phoneNumber: string) => {
        if (!phoneNumber) return;
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        const url = `tel:${cleanPhoneNumber}`;

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert('Erro', 'Não foi possível abrir o discador.');
            }
        });
    };

    const renderCard = ({ item, index }: { item: EmergencyContact; index: number }) => {
        const isExpanded = expandedId === String(item.id);
        const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
        const bg = BG_COLORS[index % BG_COLORS.length];
        const cleanNumber = item.phoneNumber.replace(/\D/g, '');

        return (
            <View style={[styles.cardWrapper, { borderLeftColor: accent, backgroundColor: bg }]}>
                <AccordionCard
                    title={item.title}
                    description={item.description || 'Nenhuma descrição disponível.'}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(String(item.id))}
                    actionText={`Ligar — ${item.phoneNumber}`}
                    actionIcon="phone"
                    onAction={() => openDialer(cleanNumber)}
                    actionButtonColor={accent}
                    expandedBorderColor={accent}
                    chevronColor={accent}
                />
               
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderCard}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum contato encontrado.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    cardWrapper: {
        marginBottom: 14,
        borderLeftWidth: 4,
        borderRadius: 16,
        overflow: 'hidden',
    },
    phoneBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 20,
        paddingBottom: 14,
    },
    phoneBadgeText: {
        fontSize: 13,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    },
});
