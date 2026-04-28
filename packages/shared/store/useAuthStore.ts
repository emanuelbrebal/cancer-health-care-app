import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import { User } from '../types/user';

export interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

export const createAuthStore = (
    storageEngine: PersistStorage<AuthState>,
    onLogout?: () => void | Promise<void>,
) => {
    return create<AuthState>()(
        persist(
            (set) => ({
                token: null,
                user: null,
                isAuthenticated: false,

                login: (token, user) => set({ token, user, isAuthenticated: true }),
                logout: () => {
                    set({ token: null, user: null, isAuthenticated: false });
                    onLogout?.();
                },
            }),
            {
                name: 'oncomente-auth',
                storage: storageEngine,
            }
        )
    );
};