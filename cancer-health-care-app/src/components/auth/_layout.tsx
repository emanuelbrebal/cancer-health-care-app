import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { authLayoutStyles } from '../../styles/AuthLayoutStyle';
import { globalStyles } from '@/src/styles/global';

interface AuthProps {
    textPrimary: string,
    textSecondary: string,
    children: React.ReactNode
}

export default function AuthLayout({ textPrimary, textSecondary, children }: AuthProps) {
   
    return (
        <View style={globalStyles.authLayoutContainer}>
            <View style={authLayoutStyles.authLayout}>
                <View style={globalStyles.titleContainer}>
                    <Text style={globalStyles.textPrimary}>{textPrimary ? textPrimary : 'Bem-vindo(a)'}</Text>
                    <Text style={globalStyles.textSecondary}>{textSecondary ? textSecondary : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}</Text>
                </View>

                <View style={globalStyles.dynamicContent}>
                    {children}
                </View>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}


