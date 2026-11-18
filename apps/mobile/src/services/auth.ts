import api from './api'
import { sessionStorage } from './sessionStorage';
import { Alert, Platform } from 'react-native';

import { User } from '../../../../packages/shared/types/user';

export interface RegisterData {
    email: string;
    password: string;
    role: string;
    name?: string;
}

function confirmReactivation(): Promise<boolean> {
    const title = 'Conta suspensa';
    const message = 'Seu acesso está suspenso e seus dados estão guardados. Deseja reativar a conta agora?';
    // Alert com botões não funciona no Expo Web.
    if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${title}\n\n${message}`));
    return new Promise((resolve) => {
        Alert.alert(title, message, [
            { text: 'Agora não', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Reativar', onPress: () => resolve(true) },
        ], { cancelable: true, onDismiss: () => resolve(false) });
    });
}

export const authService = {
    async register(data: RegisterData) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    // Conta suspensa: o servidor responde 403 ACCOUNT_SUSPENDED e só reativa com confirmação.
    async login(email: string, password: string, reactivate = false): Promise<{ access_token: string; user: User }> {
        let response;
        try {
            response = await api.post('/auth/login', { email, password, ...(reactivate && { reactivate }) });
        } catch (error: any) {
            const suspended = error?.response?.data?.code === 'ACCOUNT_SUSPENDED';
            if (!suspended || reactivate || !(await confirmReactivation())) throw error;
            return this.login(email, password, true);
        }
        const { refresh_token, ...session } = response.data;
        if (refresh_token) await sessionStorage.set(refresh_token);
        return session as { access_token: string; user: User };
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data as { message: string };
    },

    async resetPassword(token: string, newPassword: string) {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data as { message: string };
    },

    async changePassword(currentPassword: string, newPassword: string) {
        const response = await api.patch('/auth/change-password', { currentPassword, newPassword });
        return response.data as { message: string };
    },
};
