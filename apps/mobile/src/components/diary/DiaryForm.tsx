import React, { useState } from 'react';
import {
    View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { EMOTES } from '@/src/constants/Emotes';
import { TextField } from '@/src/components/ds/TextField';
import { Button } from '@/src/components/ds/Button';
import { Header } from '@/src/components/ds/Header';
import { color, layout, radius, space, touch, typography } from '@/src/constants/tokens';

export interface DiaryFormValues {
    title: string;
    content: string;
    emote: string;
}

interface DiaryFormProps {
    heading: string;
    subheading?: string;
    submitLabel: string;
    initialValues?: Partial<DiaryFormValues>;
    /** Trata os próprios erros; o formulário mantém o texto digitado. */
    onSubmit: (values: DiaryFormValues) => Promise<void>;
}

function EmoteButton({ emote, isSelected, onPress }: { emote: typeof EMOTES[0]; isSelected: boolean; onPress: () => void }) {
    const [scale] = useState(() => new Animated.Value(1));

    const handlePress = () => {
        Animated.sequence([
            Animated.spring(scale, { toValue: 1.15, useNativeDriver: true, speed: 40, bounciness: 10 }),
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
        ]).start();
        onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={styles.emoteWrapper}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={emote.label}
        >
            <Animated.View
                style={[
                    styles.emoteCircle,
                    { backgroundColor: isSelected ? emote.color : color.bg.subtle, transform: [{ scale }] },
                    isSelected && styles.emoteCircleSelected,
                ]}
            >
                <Text style={styles.emoteEmoji}>{emote.emoji}</Text>
            </Animated.View>
            <Text style={[styles.emoteLabel, isSelected && styles.emoteLabelSelected]}>
                {emote.label}
            </Text>
        </Pressable>
    );
}

/**
 * Formulário do diário (criar e editar). Labels visíveis, validação no envio
 * e botão sempre legível (v1: desabilitado com 1.3:1 de contraste, P21).
 */
export function DiaryForm({ heading, subheading, submitLabel, initialValues, onSubmit }: DiaryFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialValues?.title ?? '');
    const [diaryEntry, setDiaryEntry] = useState(initialValues?.content ?? '');
    const [selectedEmote, setSelectedEmote] = useState(initialValues?.emote ?? 'neutral');
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    const validate = (): boolean => {
        const next: { title?: string; content?: string } = {};
        if (!title.trim()) next.title = 'Dê um título curto ao seu dia.';
        else if (title.length > 150) next.title = 'Máximo de 150 caracteres.';
        if (!diaryEntry.trim()) next.content = 'Escreva pelo menos uma frase antes de salvar.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await onSubmit({ title, content: diaryEntry, emote: selectedEmote });
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Header level="screen" title={heading} subtitle={subheading} />

                <TextField
                    label="Título"
                    required
                    placeholder="Ex.: Dia de consulta"
                    value={title}
                    onChangeText={(v) => { setTitle(v); setErrors((e) => ({ ...e, title: undefined })); }}
                    maxLength={150}
                    error={errors.title}
                />

                <View style={styles.section} accessibilityRole="radiogroup" accessibilityLabel="Como você está se sentindo?">
                    <Text style={styles.sectionLabel}>Como você está se sentindo?</Text>
                    <View style={styles.emoteRow}>
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

                <TextField
                    label="O que aconteceu hoje?"
                    required
                    placeholder="Escreva livremente…"
                    multiline
                    textAlignVertical="top"
                    value={diaryEntry}
                    onChangeText={(v) => { setDiaryEntry(v); setErrors((e) => ({ ...e, content: undefined })); }}
                    maxLength={2000}
                    error={errors.content}
                    helper={`${diaryEntry.length}/2000 caracteres`}
                />

                <Button title={submitLabel} icon="check" onPress={handleSave} loading={saving} fullWidth />
                <Button title="Cancelar" variant="ghost" onPress={() => router.back()} disabled={saving} fullWidth />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        paddingHorizontal: space.sm,
        paddingBottom: layout.tabBarHeight + space.xl,
        gap: space.md,
    },
    section: {
        gap: space.xs,
    },
    sectionLabel: {
        ...typography.smallStrong,
        color: color.text.primary,
    },
    emoteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    emoteWrapper: {
        alignItems: 'center',
        gap: space.xxs,
        minWidth: touch.comfortable,
    },
    emoteCircle: {
        width: touch.comfortable + space.xs,
        height: touch.comfortable + space.xs,
        borderRadius: radius.pill,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: layout.borderStrong,
        borderColor: 'transparent',
    },
    emoteCircleSelected: {
        borderColor: color.border.brand,
    },
    emoteEmoji: {
        fontSize: typography.title.fontSize + space.xxs,
    },
    emoteLabel: {
        ...typography.caption,
        color: color.text.secondary,
    },
    emoteLabelSelected: {
        fontFamily: typography.smallStrong.fontFamily,
        color: color.text.link,
    },
});
