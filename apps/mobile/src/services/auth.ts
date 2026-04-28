import api from './api'

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
        return response.data;
    },

    async forgotPassword(email: string) {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data as { message: string; debug_token?: string };
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
