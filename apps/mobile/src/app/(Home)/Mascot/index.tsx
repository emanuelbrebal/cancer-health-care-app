import { useCallback } from 'react';
import { ButtonOutline } from '@/src/components/ui/Buttons/ButtonOutline';
import { ButtonPrimary } from '@/src/components/ui/Buttons/ButtonPrimary';
import { ImageContainer } from '@/src/components/ui/Images/ImageContainer';
import { globalStyles } from '@/src/styles/global';
import { useAuthStore } from '@/src/store/useAuthStore';
import { router, useFocusEffect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeMascot() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useFocusEffect(
        useCallback(() => {
            if (isAuthenticated) router.replace('/(Home)/Mascot/Chat');
        }, [isAuthenticated])
    );

    function handleLogin() {
        router.push('/(auth)/LoginScreen');
    }

    function redirectRegister() {
        router.push('/(auth)/RegisterScreen');
    }

    return (
        <SafeAreaView style={[globalStyles.startContainer]}>
            <ImageContainer imagePath={require('@/assets/images/Home/blueMascotPlaceholder.png')} reverted />
            <View style={styles.content}>

                <Text style={styles.title}>
                    Converse com o Mascote Virtual
                </Text>

                <Text style={styles.descriptionText}>
                    Um companheiro digital calmo, paciente e muito carinhoso. Seu tom é de um abraço em forma de palavras.
                    Um assistente virtual pronto para responder dúvidas sobre a oncologia e saúde mental.
                </Text>

                <Text style={styles.callToAction}>
                    É necessário autenticação para conversar!
                </Text>

                <View style={globalStyles.buttonContainer}>
                    <ButtonPrimary title='Criar Conta' action={redirectRegister} />
                    <ButtonOutline title='Entrar' action={handleLogin} />
                </View>

                <Text style={styles.footerText}>
                    É rápido e gratuito!
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        lineHeight: 22,
    },
    callToAction: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    footerText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    }
});
