import api from './api'
import * as SecureStore from 'expo-secure-store'

export const authService = {
    async register(data: any) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(email:any, password:any) {
        const response = await api.post('/auth/login', {email, password});

        const { access_token, user } = response.data;

        if (response.data.access_token) {
            await SecureStore.setItemAsync('user_token', access_token);
            await SecureStore.setItemAsync('user_name', user.name || '');
        }
        return response.data
    },

    async logout() {
        await SecureStore.deleteItemAsync('user_token');
        await SecureStore.deleteItemAsync('user_name');
    },

    async getToken() {
    return await SecureStore.getItemAsync('user_token');
  }
};