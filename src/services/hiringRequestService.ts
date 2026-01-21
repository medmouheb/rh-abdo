import api from '@/lib/api';

export const hiringRequestService = {
    /**
     * Get all hiring requests
     */
    getAll: async () => {
        const response = await api.get('/api/hiring-requests');
        return response.data;
    },

    /**
     * Get hiring request by ID
     */
    getById: async (id: string) => {
        const response = await api.get(`/api/hiring-requests/${id}`);
        return response.data;
    },

    /**
     * Create new hiring request
     */
    create: async (data: any) => {
        const response = await api.post('/api/hiring-requests', data);
        return response.data;
    },

    /**
     * Update hiring request
     */
    update: async (id: string, data: any) => {
        const response = await api.put(`/api/hiring-requests/${id}`, data);
        return response.data;
    },

    /**
     * Delete hiring request
     */
    delete: async (id: string) => {
        const response = await api.delete(`/api/hiring-requests/${id}`);
        return response.data;
    },
};
