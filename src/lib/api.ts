import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true, // Important for HTTP-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            // Only redirect if not already on login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/sign-in')) {
                window.location.href = '/auth/sign-in';
            }
        }

        // Log error for debugging
        console.error('API Error:', error.response?.data || error.message);

        return Promise.reject(error);
    }
);

export default api;
