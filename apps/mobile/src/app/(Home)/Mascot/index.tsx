import { useCallback } from 'react';
import { AuthGate } from '@/src/components/auth/AuthGate';
import { useAuthStore } from '@/src/store/useAuthStore';
import { router, useFocusEffect } from 'expo-router';

export default function HomeMascot() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) router.replace('/(Home)/Mascot/Chat');
        }, [isAuthenticated])
    );

    // v1: "É necessário autenticação para conversar!" + botões lado a lado quebrando o texto (P14).
    return (
        <AuthGate
            image={require('@/assets/images/Home/blueMascotPlaceholder.png')}
            mirrorImage
            title="Converse com o Mascote"
            description="Um companheiro calmo e paciente para tirar dúvidas sobre oncologia e saúde mental. Entre na sua conta para conversar."
            benefits={[
                'Respostas acolhedoras a qualquer hora',
                'Histórico salvo só no seu aparelho',
                'Gratuito',
            ]}
        />
    );
}
