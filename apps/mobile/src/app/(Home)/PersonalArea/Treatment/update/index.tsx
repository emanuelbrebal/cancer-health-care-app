import React, { useState, useEffect } from 'react';
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

export default function EditTreatment() {
    const router = useRouter();
    const { id, currentNome, currentFreq, currentHora, currentFim, currentMedico, currentHospital } = useLocalSearchParams();
    const headerHeight = useHeaderHeight();

    // Estados inicializados com os valores vindos por parâmetro (ou strings vazias)
    const [nome, setNome] = useState(currentNome || '');
    const [frequencia, setFrequencia] = useState(currentFreq || FREQUENCIAS[2]);
    const [horaInicio, setHoraInicio] = useState(currentHora || '');
    const [dataFim, setDataFim] = useState(currentFim || '');

    const [nomeMedico, setNomeMedico] = useState(currentMedico || '');
    const [contatoMedico, setContatoMedico] = useState(''); // Se houver contato salvo
    const [nomeHospital, setNomeHospital] = useState(currentHospital || '');

    const handleSaveEdit = () => {
        if (!nome.trim() || !dataFim || !horaInicio) {
            Alert.alert("Atenção", "Os campos de Remédio, Hora e Data Término são obrigatórios.");
            return;
        }

        const dataHoje = new Date().toLocaleDateString('pt-BR');

        Alert.alert(
            "Confirmar Edição",
            `Ao alterar o protocolo, um novo ciclo será registrado iniciando hoje (${dataHoje}). Confirmar?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Salvar Alterações", 
                    onPress: () => {
                        console.log("Salvando edição e gerando histórico...", { 
                            id, nome, frequencia, dataInicio: dataHoje, horaInicio, dataFim 
                        });
                        router.back();
                    } 
                }
            ]
        );
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
                        Editar Tratamento
                    </Text>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        style={[globalStyles.textSecondary, { fontSize: 14, marginTop: -4 }]}
                    >
                        Ajuste o protocolo para atualizar o ciclo atual
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
                            <Text style={styles.label}>Nova Data Término</Text>
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
                        <Text style={styles.label}>Frequência Atualizada</Text>
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
                            placeholder="Nome do Médico"
                            placeholderTextColor="#A0A0A0"
                            value={nomeMedico}
                            onChangeText={setNomeMedico}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone/Contato"
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
                        onPress={handleSaveEdit}
                    >
                        <Text style={styles.btnText}>Atualizar Ciclo</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={{ marginTop: 20 }}
                        onPress={() => router.back()}
                    >
                        <Text style={{ color: '#999', fontFamily: 'Montserrat', fontSize: 14 }}>Descartar alterações</Text>
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
        marginBottom: 24
    },
    label: {
        fontFamily: 'Montserrat',
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 10,
        marginLeft: 4
    },
    input: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
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
        gap: 10,
    },
    chip: {
        paddingVertical: 12,
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
        marginVertical: 20,
        width: '100%',
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    btnSave: {
        width: '60%',
        height: 52,
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