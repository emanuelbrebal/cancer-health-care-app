import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView,
    KeyboardAvoidingView, Platform, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/src/constants/Colors';
import { globalStyles } from '@/src/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { EMOTES } from '@/src/constants/Emotes';
import diaryService from '@/src/services/diaryService';
import { toastService } from '@/src/services/toastService';

function EmoteButton({ emote, isSelected, onPress }: { emote: typeof EMOTES[0]; isSelected: boolean; onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.2, useNativeDriver: true, speed: 40, bounciness: 10 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
        ]).start();
        onPress();
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={localStyles.emoteWrapper}>
            <Animated.View
                style={[
                    localStyles.emoteCircle,
                    { backgroundColor: isSelected ? emote.color : '#F0F0F0', transform: [{ scale }] },
                    isSelected && localStyles.emoteCircleSelected,
                ]}
            >
                <Text style={localStyles.emoteEmoji}>{emote.emoji}</Text>
            </Animated.View>
            <Text style={[localStyles.emoteLabel, isSelected && { color: Colors.purplePrimary, fontWeight: '700' }]}>
                {emote.label}
            </Text>
        </TouchableOpacity>
    );
}

export default function DiaryCreateScreen() {
    const router = useRouter();
    const scrollRef = useRef<ScrollView>(null);
    const [title, setTitle] = useState('');
    const [diaryEntry, setDiaryEntry] = useState('');
    const [selectedEmote, setSelectedEmote] = useState('neutral');
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    const validate = (): boolean => {
        const next: { title?: string; content?: string } = {};
        if (!title.trim()) next.title = 'O título é obrigatório.';
        else if (title.length > 150) next.title = 'Máximo de 150 caracteres.';
        if (!diaryEntry.trim()) next.content = 'Escreva algo antes de salvar.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            setSaving(true);
            const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
            await diaryService.create({ title, content: diaryEntry, emotes: [selectedEmote], date: localDate });
            toastService.success('Entrada salva no diário!');
            router.back();
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Não foi possível salvar o diário.';
            toastService.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const isValid = !!title.trim() && !!diaryEntry.trim();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={localStyles.safeArea} edges={['top', 'left', 'right']}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>

                    <ScrollView
                        ref={scrollRef}
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={globalStyles.titleContainer}>
                            <TextInput
                                style={[globalStyles.textPrimary, localStyles.mainInput, errors.title ? localStyles.inputError : null]}
                                placeholder="Como foi seu dia?"
                                value={title}
                                onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: undefined })); }}
                                placeholderTextColor={Colors.purplePrimary}
                                maxLength={150}
                            />
                            {errors.title ? <Text style={localStyles.errorText}>{errors.title}</Text> : null}
                        </View>

                        <View style={localStyles.section}>
                            <Text style={[globalStyles.textSecondary, localStyles.sectionTitle]}>Como você está se sentindo?</Text>
                            <View style={localStyles.emoteRow}>
                                {EMOTES.map((emote) => (
                                    <EmoteButton
                                        key={emote.id}
                                        emote={emote}
                                        isSelected={selectedEmote === emote.id}
                                        onPress={() => setSelectedEmote(emote.id)}
                                    />
                                ))}
                            </View>
                        </View>

                        <View style={localStyles.inputSection}>
                            <Text style={[globalStyles.textSecondary, localStyles.sectionTitle]}>
                                Digite aqui seu diário:
                            </Text>
                            <View style={[localStyles.textAreaWrapper, errors.content ? localStyles.textAreaError : null]}>
                                <TextInput
                                    style={localStyles.mainTextArea}
                                    placeholder="Conteúdo do diário"
                                    multiline
                                    textAlignVertical="top"
                                    value={diaryEntry}
                                    onChangeText={(v) => { setDiaryEntry(v); setErrors((e) => ({ ...e, content: undefined })); }}
                                    onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
                                    maxLength={2000}
                                    placeholderTextColor="#ADB5BD"
                                />
                            </View>
                            {errors.content ? <Text style={localStyles.errorText}>{errors.content}</Text> : null}
                        </View>
                    </ScrollView>

                    <View style={localStyles.footerContainer}>
                        <TouchableOpacity
                            style={[
                                localStyles.saveActionButton,
                                { backgroundColor: (isValid && !saving) ? Colors.purplePrimary : '#E0E0E0' }
                            ]}
                            onPress={handleSave}
                            disabled={!isValid || saving}
                            activeOpacity={0.8}
                        >
                            <View style={localStyles.saveButtonContent}>
                                <Text style={localStyles.saveButtonText}>
                                    {saving ? 'Salvando...' : isValid ? 'Guardar no Diário' : 'Preencha para salvar'}
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
        fontSize: 20,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 15,
    },
    emoteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    emoteWrapper: {
        alignItems: 'center',
        gap: 8,
    },
    emoteCircle: {
        width: 58,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    emoteCircleSelected: {
        borderColor: Colors.purplePrimary,
        elevation: 4,
        shadowColor: Colors.purplePrimary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    emoteEmoji: {
        fontSize: 30,
    },
    emoteLabel: {
        fontSize: 11,
        fontFamily: 'Montserrat',
        fontWeight: '500',
        color: '#888',
    },
    inputSection: {
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
        backgroundColor: '#FAFAFA',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#EEE',
        padding: 15,
        minHeight: 220,
    },
    mainTextArea: {
        fontFamily: 'Montserrat',
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        minHeight: 200,
    },
    footerContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        paddingTop: 10,
        backgroundColor: 'transparent',
    },
    saveActionButton: {
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        paddingHorizontal: 10,
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputError: {
        borderBottomColor: '#FF4C4C',
    },
    textAreaError: {
        borderColor: '#FF4C4C',
        borderWidth: 1.5,
    },
    errorText: {
        fontFamily: 'Montserrat',
        fontSize: 12,
        color: '#FF4C4C',
        marginTop: 4,
        marginLeft: 2,
    },
});
