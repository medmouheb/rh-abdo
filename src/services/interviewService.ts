import api from '@/lib/api';

export const interviewService = {
    /**
     * Get all interviews
     */
    getAll: async () => {
        const response = await api.get('/api/interviews');
        return response.data;
    },

    /**
     * Get interview by ID
     */
    getById: async (id: string) => {
        const response = await api.get(`/api/interviews/${id}`);
        return response.data;
    },

    /**
     * Create new interview
     */
    create: async (data: any) => {
        const response = await api.post('/api/interviews', data);
        return response.data;
    },

    /**
     * Update interview
     */
    update: async (id: string, data: any) => {
        const response = await api.put(`/api/interviews/${id}`, data);
        return response.data;
    },

    /**
     * Delete interview
     */
    delete: async (id: string) => {
        const response = await api.delete(`/api/interviews/${id}`);
        return response.data;
    },
};
