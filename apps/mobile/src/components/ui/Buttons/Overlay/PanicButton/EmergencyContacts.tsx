import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Colors } from '@/src/constants/Colors';
import { EmergencyContact } from '@/src/interfaces/EmergencyContact';

interface EmergencyContactsListProps {
    data: EmergencyContact[];
}

export default function EmergencyContacts({ data }: EmergencyContactsListProps) {

    // lembrete: antes de publicar o aplicativo colocar os números reais.
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

    const renderCard = ({ item }: { item: EmergencyContact }) => (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                
                {item.description ? (
                    <Text style={styles.cardDescription}>
                        {item.description}
                    </Text>
                ) : null}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => openDialer(item.phoneNumber)}
                    style={styles.actionButton}
                >
                    <Text style={styles.buttonText}>Ligar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={styles.listContent}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    listContent: {
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between',
        
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.white,
        
        borderWidth: 1,
        borderColor: Colors.cyan || '#E0E0E0',
        marginBottom: 10,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    textContainer: {
        flex: 1,
        marginRight: 12, 
        maxWidth: '70%'
    },
    buttonContainer: {
        flexShrink: 0, 
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 16, 
        backgroundColor: '#F0F9FF', 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#BAE6FD', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#0284C7', 
        fontWeight: 'bold',
        fontSize: 14,
    }
});