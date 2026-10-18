import { useRouter } from 'expo-router';
import diaryService from '@/src/services/diaryService';
import { toastService } from '@/src/services/toastService';
import { DiaryForm, DiaryFormValues } from '@/src/components/diary/DiaryForm';

export default function DiaryCreateScreen() {
    const router = useRouter();

    const handleCreate = async ({ title, content, emote }: DiaryFormValues) => {
        try {
            const localDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD no fuso local
            await diaryService.create({ title, content, emotes: [emote], date: localDate });
            toastService.success('Registro salvo no seu diário 💜');
            router.back();
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Não foi possível salvar. Seu texto continua aqui; tente de novo.';
            toastService.error(msg);
        }
    };

    return (
        <DiaryForm
            heading="Como foi seu dia?"
            subheading="Só você vê este registro."
            submitLabel="Salvar no diário"
            onSubmit={handleCreate}
        />
    );
}
