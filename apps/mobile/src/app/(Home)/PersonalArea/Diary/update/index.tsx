import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import diaryService, { DailyLog } from '@/src/services/diaryService';
import { toastService } from '@/src/services/toastService';
import { DiaryForm, DiaryFormValues } from '@/src/components/diary/DiaryForm';
import { useAsyncResource } from '@/src/hooks/useAsyncResource';
import { ErrorState, LoadingState } from '@/src/components/ds/States';
import { Button } from '@/src/components/ds/Button';
import { space } from '@/src/constants/tokens';

export default function DiaryUpdateScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    // v1: erro ao carregar mostrava só um toast e deixava o formulário vazio.
    const { status, data: entry, reload } = useAsyncResource<DailyLog | null>(() => diaryService.getOne(id!), [id], {
        isEmpty: (e) => !e,
        emptyValue: null,
    });

    const handleUpdate = async ({ title, content, emote }: DiaryFormValues) => {
        try {
            await diaryService.update(id!, { title, content, emotes: [emote] });
            toastService.success('Registro atualizado!');
            router.back();
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Não foi possível atualizar. Seu texto continua aqui.';
            toastService.error(msg);
        }
    };

    if (status !== 'success' || !entry) {
        return (
            <View style={styles.state}>
                {status === 'loading' && <LoadingState variant="list" count={3} label="Carregando registro" />}
                {(status === 'error' || status === 'empty') && (
                    <>
                        <ErrorState title="Não conseguimos abrir este registro" onRetry={reload} />
                        <Button title="Voltar ao diário" variant="ghost" onPress={() => router.back()} />
                    </>
                )}
            </View>
        );
    }

    return (
        <DiaryForm
            heading="Editar registro"
            submitLabel="Salvar alterações"
            initialValues={{
                title: entry.title,
                content: entry.content ?? '',
                emote: Array.isArray(entry.emotes) ? (entry.emotes[0] ?? 'neutral') : 'neutral',
            }}
            onSubmit={handleUpdate}
        />
    );
}

const styles = StyleSheet.create({
    state: {
        flex: 1,
        padding: space.sm,
        gap: space.md,
    },
});
