import AuthLayout from '@/src/components/layouts/AuthLayout/AuthLayout';
import { SendResetForm } from '@/src/components/auth/SendResetForm';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { CancelButton } from '@/src/components/ui/Buttons/CancelButton';
import { ImageContainer } from '@/src/components/ui/Images/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View } from 'react-native';

export default function ResetPassword() {

    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<false | string>(false);

    const redirectResetPassword = () => {
        router.push('/(auth)/RecoverPassword');
    }

    return (
        <AuthLayout
            textPrimary="Esqueceu a senha?"
            textSecondary="Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha."
        >
            <SendResetForm setEmail={setEmail} error={error} />

            <View style={globalStyles.buttonContainer}>

                <CancelButton />

                <ButtonPrimary title='Enviar' action={redirectResetPassword} />
            </View>

            <ImageContainer imagePath={require('@assets/images/Home/greenMascotPlaceholder.png')} reverted />

            <StatusBar style="auto" />

        </AuthLayout>
    );
}