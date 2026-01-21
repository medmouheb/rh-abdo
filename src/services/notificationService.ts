import api from '@/lib/api';

export const notificationService = {
    /**
     * Get my notifications
     */
    getMyNotifications: async () => {
        const response = await api.get('/api/notifications/me');
        return response.data;
    },

    /**
     * Create notification
     */
    create: async (data: any) => {
        const response = await api.post('/api/notifications', data);
        return response.data;
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string) => {
        const response = await api.put(`/api/notifications/${id}/read`);
        return response.data;
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async () => {
        const response = await api.put('/api/notifications/read-all');
        return response.data;
    },

    /**
     * Delete notification
     */
    delete: async (id: string) => {
        const response = await api.delete(`/api/notifications/${id}`);
        return response.data;
    },
};
