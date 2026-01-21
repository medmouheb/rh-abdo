import api from '@/lib/api';

export const candidateService = {
    /**
     * Get all candidates
     */
    getAll: async () => {
        const response = await api.get('/api/candidates');
        return response.data;
    },

    /**
     * Get candidate by ID
     */
    getById: async (id: string) => {
        const response = await api.get(`/api/candidates/${id}`);
        return response.data;
    },

    /**
     * Create new candidate
     */
    create: async (data: any) => {
        const response = await api.post('/api/candidates', data);
        return response.data;
    },

    /**
     * Update candidate
     */
    update: async (id: string, data: any) => {
        const response = await api.put(`/api/candidates/${id}`, data);
        return response.data;
    },

    /**
     * Delete candidate
     */
    delete: async (id: string) => {
        const response = await api.delete(`/api/candidates/${id}`);
        return response.data;
    },

    /**
     * Get candidate status history
     */
    getStatusHistory: async (id: string) => {
        const response = await api.get(`/api/candidates/${id}/status-history`);
        return response.data;
    },

    /**
     * Upload candidate documents
     */
    uploadDocuments: async (id: string, formData: FormData) => {
        const response = await api.post(`/api/candidates/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
