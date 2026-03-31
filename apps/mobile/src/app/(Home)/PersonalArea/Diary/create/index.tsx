import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { EMOTES } from '@/src/constants/Emotes';

export default function DiaryCreateScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [diaryEntry, setDiaryEntry] = useState('');
    const [selectedEmote, setSelectedEmote] = useState('neutral');

    const handleSave = () => {
        const payload = { title, content: diaryEntry, emotes: selectedEmote, date: new Date().toISOString() };
        console.log("Salvando:", payload);
        router.back();
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={localStyles.safeArea} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                    <ScrollView contentContainerStyle={globalStyles.startContainer}>
                        {/* Título com textPrimary em evidência */}
                        <View style={globalStyles.titleContainer}>
                            <TextInput
                                style={[globalStyles.textPrimary, localStyles.mainInput]}
                                placeholder="Como foi seu dia?"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor={Colors.purplePrimary}
                            />
                        </View>

                        {/* Seletor de Humor */}
                        <View style={localStyles.section}>
                            <Text style={[globalStyles.textSecondary, localStyles.sectionTitle]}>Como você está se sentindo?</Text>
                            <View style={localStyles.emoteRow}>
                                {EMOTES.map((emote) => {
                                    const isSelected = selectedEmote === emote.id;
                                    return (
                                        <TouchableOpacity
                                            key={emote.id}
                                            onPress={() => setSelectedEmote(emote.id)}
                                            style={[localStyles.emoteCircle, { backgroundColor: emote.color }, isSelected && localStyles.selectedEmote]}
                                        >
                                            <MaterialCommunityIcons
                                                name={isSelected ? (emote.icon.replace('-outline', '') as any) : emote.icon as any}
                                                size={26}
                                                color={isSelected ? Colors.purplePrimary : '#555'}
                                            />
                                            <Text style={localStyles.emoteLabel}>{emote.label}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={localStyles.inputSection}>
                            <Text style={[globalStyles.textSecondary, localStyles.sectionTitle]}>
                                Deixe aqui seus pensamentos:
                            </Text>
                            <View style={localStyles.textAreaWrapper}>
                                <TextInput
                                    style={localStyles.mainTextArea}
                                    placeholder="Comece a escrever seus pensamentos aqui..."
                                    multiline
                                    textAlignVertical="top" 
                                    value={diaryEntry}
                                    onChangeText={setDiaryEntry}
                                    maxLength={2000}
                                    placeholderTextColor="#ADB5BD"
                                />
                            </View>
                        </View>
                    </ScrollView>

                    <View style={localStyles.footerContainer}>
                        <TouchableOpacity
                            style={[
                                localStyles.saveActionButton,
                                { backgroundColor: (diaryEntry && title) ? Colors.purplePrimary : '#E0E0E0' }
                            ]}
                            onPress={handleSave}
                            disabled={!diaryEntry || !title}
                            activeOpacity={0.8}
                        >
                            <View style={localStyles.saveButtonContent}>
                                <Text style={localStyles.saveButtonText}>
                                    {(diaryEntry && title) ? "Guardar no Diário" : "Preencha para salvar"}
                                </Text>
                                <View style={localStyles.iconCircle}>
                                    <Ionicons name="chevron-forward" size={24} color="#FFF" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const localStyles = StyleSheet.create({
    safeArea: { flex: 1 },
    mainInput: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.purpleSecondary + '30',
        paddingBottom: 5,
        marginTop: 5,
        fontSize: 20
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 15,
    },
    emoteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    emoteCircle: {
        width: 60,
        height: 75,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedEmote: {
        borderWidth: 2,
        borderColor: Colors.purpleSecondary,
        backgroundColor: '#FFF',
        elevation: 3,
    },
    emoteLabel: {
        fontSize: 10,
        fontFamily: 'Montserrat',
        marginTop: 4,
        fontWeight: '600',
        color: '#666',
    },
    previewCard: {
        marginTop: 15,
        padding: 20,
        backgroundColor: '#FAFAFA',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EEE',
        minHeight: 120,
    },
    bottomBar: {
        padding: 15,
        flexDirection: 'row',
        alignItems: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    },
    chatInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        fontFamily: 'Montserrat',
        fontSize: 16,
        maxHeight: 100,
    },
    actionButton: {
        marginLeft: 10,
        width: 45,
        height: 45,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    scrollPadding: {
        flexGrow: 1,
        paddingTop: 10,
        paddingBottom: 120
    },
    inputSection: {
        flex: 1,
        paddingHorizontal: 15,
        marginTop: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.purpleSecondary,
        marginBottom: 10,
    },
    textAreaWrapper: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 15,
    },
    mainTextArea: {
        flex: 1,
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
    },
    footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    paddingTop: 10,
    backgroundColor: 'transparent', // Mantém a leveza da tela
  },
  saveActionButton: {
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    paddingHorizontal: 10,
    // Sombra para dar profundidade e cor
    elevation: 5,
    shadowColor: Colors.purpleSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  saveButtonText: {
    fontFamily: 'Montserrat',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Efeito de vidro no ícone
    justifyContent: 'center',
    alignItems: 'center',
  },
});