import api from '@/lib/api';

export const userService = {
    /**
     * Get all users (RH only)
     */
    getAll: async () => {
        const response = await api.get('/api/users');
        return response.data;
    },

    /**
     * Get user by ID (RH only)
     */
    getById: async (id: string) => {
        const response = await api.get(`/api/users/${id}`);
        return response.data;
    },

    /**
     * Create new user (RH only)
     */
    create: async (data: any) => {
        const response = await api.post('/api/users', data);
        return response.data;
    },

    /**
     * Update user (RH only)
     */
    update: async (id: string, data: any) => {
        const response = await api.put(`/api/users/${id}`, data);
        return response.data;
    },

    /**
     * Delete user (RH only)
     */
    delete: async (id: string) => {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    },
};
