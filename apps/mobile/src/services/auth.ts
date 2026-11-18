import api from './api'
import { sessionStorage } from './sessionStorage';

import { User } from '../../../../packages/shared/types/user';

export interface RegisterData {
    email: string;
    password: string;
    role: string;
    name?: string;
}

export const authService = {
    async register(data: RegisterData) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(email: string, password: string) {
        const response = await api.post('/auth/login', { email, password });
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
