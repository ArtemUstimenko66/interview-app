import { api } from "../../shared/api/baseApi";
import type { IAuthResponse,LoginFormData, RegisterFormData } from "../types/auth.types";

export const authApi = {
    async login(data: LoginFormData) : Promise<IAuthResponse> { 
        const response = await api.post<IAuthResponse>('/auth/login', data);
        return response.data;
    },

    async register(data: RegisterFormData): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/register', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async checkAuth(): Promise<IAuthResponse> {
        const response = await api.post<IAuthResponse>('/auth/refresh');
        return response.data;
    }
}

