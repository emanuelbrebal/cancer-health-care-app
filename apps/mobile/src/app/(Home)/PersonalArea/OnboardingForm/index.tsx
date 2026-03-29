import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { baseText, globalStyles } from '@/src/styles/global';
import { InputWithIcon } from '@/src/components/ui/Inputs/InputWithIcon';
import { SelectWithIcon } from '@/src/components/ui/Inputs/SelectWithIcon';

const treatmentData = [
    { label: 'Sr', value: '1' },
    { label: 'Sra', value: '2' },
    { label: 'Srta', value: '3' },
    { label: 'Prefiro não informar', value: '4' },
];

export default function OnboardingProfileScreen() {
    const [treatment, setTreatment] = useState('');

    return (
        <ScrollView contentContainerStyle={[globalStyles.scrollContainer, styles.paddingGeral]}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
                        style={styles.avatarImage}
                    />
                    <TouchableOpacity style={styles.addBadge}>
                        <Feather name="plus" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Formulário */}
            <View style={globalStyles.formContainer}>

                {/* Uso do SelectWithIcon */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Como deseja ser tratado?</Text>
                    <SelectWithIcon
                        data={treatmentData}
                        iconLeftName='user'
                        placeholder='Pronome de tratamento'
                        value={treatment}
                        onChange={(item) => setTreatment(item.value)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Digite seu nome:</Text>
                    <InputWithIcon
                        iconLeftName="user"
                        placeholder="Seu nome"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Digite telefone:</Text>
                    <InputWithIcon
                        iconLeftName="phone"
                        placeholder="(12) 9 9765-4321"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de nascimento</Text>
                    <InputWithIcon
                        iconLeftName="calendar"
                        placeholder="Dia/Mês/Ano"
                    />
                </View>

            </View>

            {/* Botões de Ação */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Salvar Informações</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipButton}>
                    <Text style={styles.skipButtonText}>Pular</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    paddingGeral: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    headerTitle: {
        ...baseText,
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarImage: {
        width: 90,
        height: 90,
        borderRadius: 50,
    },
    addBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1AD5AD',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 2,
    },
    label: {
        ...baseText,
        color: '#333333',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    actionsContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#9B51E0',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        ...baseText,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButtonText: {
        ...baseText,
        color: '#9B51E0',
        fontSize: 14,
        fontWeight: '600',
    },
});