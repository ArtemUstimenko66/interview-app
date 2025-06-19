import axios from 'axios';

export const API_URL = 'http://localhost:3000/'; // уточнить какое api

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post('/auth/refresh');
                return api(originalRequest);
            } catch (e) {
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);