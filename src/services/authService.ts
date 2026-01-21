import api from '@/lib/api';

export const authService = {
    /**
     * Login user and set HTTP-only cookies
     */
    login: async (username: string, password: string) => {
        const response = await api.post('/api/auth/login', { username, password });
        return response.data;
    },

    /**
     * Logout user and clear cookies
     */
    logout: async () => {
        const response = await api.post('/api/auth/logout');
        return response.data;
    },

    /**
     * Get current authenticated user
     */
    getCurrentUser: async () => {
        const response = await api.get('/api/auth/me');
        return response.data;
    },
};
