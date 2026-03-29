import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { EmergencyContact } from '@/src/interfaces/EmergencyContact';
import { AccordionCard } from '../../../Accordion/AccordionCard';

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

    const renderCard = ({ item }: { item: EmergencyContact }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={styles.cardWrapper}>
                <AccordionCard
                    title={item.title}
                    description={item.description || "Nenhuma descrição disponível."}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(String(item.id))}
                    actionText="Ligar"
                    actionIcon="phone"
                    onAction={() => openDialer(item.phoneNumber)}
                    actionButtonColor="#0284C7"
                    expandedBorderColor="#0284C7" 
                    chevronColor="#9CA3AF"       
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
        marginBottom: 12,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
    }
});