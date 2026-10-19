import { StatusBar } from 'expo-status-bar';
import { Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { FitScrollView } from '../FitScrollView';
import { authLayoutStyles } from './AuthLayoutStyle';
import { globalStyles } from '@/src/styles/global';

interface AuthProps {
    textPrimary: string,
    textSecondary: string,
    children: React.ReactNode
}

export default function AuthLayout({ textPrimary, textSecondary, children }: AuthProps) {

    return (
        <KeyboardAvoidingView
            style={globalStyles.authLayoutContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={authLayoutStyles.authLayout}>
                <FitScrollView contentContainerStyle={authLayoutStyles.scrollContent}>
                    <View style={globalStyles.titleContainer}>
                        <Text style={globalStyles.textPrimary}>{textPrimary ? textPrimary : 'Bem-vindo(a)'}</Text>
                        <Text style={globalStyles.textSecondary}>{textSecondary ? textSecondary : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}</Text>
                    </View>

                    {children}
                </FitScrollView>
            </View>
            <StatusBar style="auto" />
        </KeyboardAvoidingView>
    );
}