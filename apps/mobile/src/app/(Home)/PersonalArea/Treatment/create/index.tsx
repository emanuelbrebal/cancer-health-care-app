import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from '@react-navigation/elements';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';

const FREQUENCIAS = [
    '8 em 8 horas (3x ao dia)',
    '12 em 12 horas (2x ao dia)',
    '24 em 24 horas (1x ao dia)'
];

export default function CreateTreatment() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();

    const [nome, setNome] = useState('');
    const [frequencia, setFrequencia] = useState(FREQUENCIAS[2]);
    const [horaInicio, setHoraInicio] = useState('');
    const [dataFim, setDataFim] = useState('25/12/2026');

    const [nomeMedico, setNomeMedico] = useState('');
    const [contatoMedico, setContatoMedico] = useState('');
    const [nomeHospital, setNomeHospital] = useState('');

    const handleUpdate = () => {
        if (!nome.trim() || !dataFim || !horaInicio) {
            Alert.alert("Atenção", "Preencha o nome, hora de início e data de término.");
            return;
        }
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[globalStyles.startContainer, { paddingTop: headerHeight }]}
        >
            <ScrollView
                contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: 10, paddingBottom: 60 }]}
                showsVerticalScrollIndicator={false}
            >

                <View style={globalStyles.titleContainer}>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[globalStyles.textPrimary, { color: Colors.purplePrimary, fontSize: 24, fontWeight: '700' }]}
                    >
                        Configurar Tratamento
                    </Text>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[globalStyles.textSecondary, { fontSize: 14, marginTop: -4 }]}
                    >
                        Preencha os dados abaixo para iniciar o ciclo
                    </Text>
                </View>

                <View style={styles.formContainer}>

                    {/* Nome do Remédio */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Nome do Remédio</Text>
                        <TextInput
                            style={styles.input}
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Ex: Amoxicilina 500mg"
                            placeholderTextColor="#A0A0A0"
                            maxLength={150}
                        />
                    </View>

                    {/* Data e Hora na mesma linha */}
                    <View style={styles.row}>
                        <View style={[styles.inputWrapper, { flex: 1 }]}>
                            <Text style={styles.label}>Hora Início</Text>
                            <TextInput
                                style={styles.input}
                                value={horaInicio}
                                onChangeText={setHoraInicio}
                                placeholder="08:00"
                                placeholderTextColor="#A0A0A0"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.inputWrapper, { flex: 1.2 }]}>
                            <Text style={styles.label}>Data Término</Text>
                            <TextInput
                                style={[styles.input, { borderColor: Colors.purplePrimary, borderWidth: 1.2 }]}
                                value={dataFim}
                                onChangeText={setDataFim}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor="#A0A0A0"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Frequência */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Frequência</Text>
                        <View style={styles.chipGrid}>
                            {FREQUENCIAS.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => setFrequencia(item)}
                                    style={[
                                        styles.chip,
                                        frequencia === item && { backgroundColor: Colors.purplePrimary, borderColor: Colors.purplePrimary }
                                    ]}
                                >
                                    <Text style={[
                                        styles.chipText,
                                        frequencia === item && { color: '#FFF', fontWeight: '600' }
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Médico */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Médico (Opcional)</Text>
                        <TextInput
                            style={[styles.input, { marginBottom: 12 }]}
                            placeholder="Nome completo"
                            placeholderTextColor="#A0A0A0"
                            value={nomeMedico}
                            onChangeText={setNomeMedico}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone de contato"
                            placeholderTextColor="#A0A0A0"
                            value={contatoMedico}
                            onChangeText={setContatoMedico}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Hospital */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Hospital (Opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome da instituição"
                            placeholderTextColor="#A0A0A0"
                            value={nomeHospital}
                            onChangeText={setNomeHospital}
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.btnSave, { backgroundColor: Colors.purplePrimary }]}
                        onPress={handleUpdate}
                    >
                        <Text style={styles.btnText}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 4,
    },
    inputWrapper: {
        marginBottom: 24 // Aumentado de 16 para 24 para mais espaçamento
    },
    label: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10, // Aumentado levemente
        marginLeft: 4
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12, // Aumentado padding vertical
        fontSize: 16,
        fontFamily: 'Montserrat',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    chipGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, // Aumentado gap entre chips
    },
    chip: {
        paddingVertical: 12, // Aumentado para chips mais robustos
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: '#FFF',
    },
    chipText: {
        fontSize: 13,
        fontFamily: 'Montserrat',
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 20, // Aumentado de 10 para 20
        width: '100%',
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    btnSave: {
        width: '50%',
        height: 52, // Aumentado levemente
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: Colors.purplePrimary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    btnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
        fontFamily: 'Montserrat',
    }
});