import { defineStore } from 'pinia';
import api from '@/services/api';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    token: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('token'),
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        async login(credentials: any) {
            const response = await api.post('/login', credentials);
            this.token = response.data.token;
            this.user = response.data.user;
            localStorage.setItem('token', this.token!);
            return response.data;
        },
        async logout() {
            try {
                await api.post('/logout');
            } catch (error) {
                console.error("Logout failed on server", error);
            } finally {
                this.logoutLocally();
            }
        },
        async fetchUser() {
            if (!this.token) return null;
            try {
                const response = await api.get('/user');
                this.user = response.data;
                return this.user;
            } catch (error) {
                this.logoutLocally();
                throw error;
            }
        },
        logoutLocally() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
        }
    }
});
