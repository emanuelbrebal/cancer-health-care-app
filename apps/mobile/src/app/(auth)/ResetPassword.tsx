import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { SendResetForm } from '@/src/components/auth/SendResetForm';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { CancelButton } from '@/src/components/ui/Buttons/CancelButton';
import { ImageContainer } from '@/src/components/ui/Images/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { authService } from '@/src/services/auth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPassword() {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!email.trim()) {
            setError('Informe seu e-mail.');
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            setError('Formato de e-mail inválido.');
            return;
        }
        setError(false);
        setLoading(true);
        try {
            await authService.forgotPassword(email.trim().toLowerCase());
            router.push({
                pathname: '/(auth)/RecoverPassword',
                params: { email: email.trim().toLowerCase() },
            });
        } catch (err: any) {
            if (!err.response) {
                setError('Sem conexão. Verifique sua internet.');
            } else {
                setError('Não foi possível enviar o e-mail. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            textPrimary="Esqueceu a senha?"
            textSecondary="Digite o e-mail associado à sua conta e enviaremos um código para redefinir sua senha."
        >
            <SendResetForm setEmail={(v) => { setEmail(v); setError(false); }} error={error} />

            <View style={globalStyles.buttonContainer}>
                <CancelButton />
                <ButtonPrimary title='Enviar' action={handleSend} loading={loading} />
            </View>

            <ImageContainer imagePath={require('@assets/images/Home/greenMascotPlaceholder.png')} reverted />

            <StatusBar style="auto" />
        </AuthLayout>
    );
}
