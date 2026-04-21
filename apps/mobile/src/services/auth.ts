import api from './api'

export const authService = {
    async register(data: any) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(email: string, password: string) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
};
