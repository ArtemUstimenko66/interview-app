import { z } from "zod";

export interface IUser {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface IAuthResponse {
    user: IUser;
    access_token: string;
    refresh_token: string;
}

export const loginSchema = z.object({
    email: z.string().email('Incorrect email'),
    password: z.string().min(6, 'Minimum password length is 6 characters')
});

export const registerSchema = loginSchema.extend({
    username: z.string().min(3, 'Minimum name length is 3 characters'),
    password: z.string().min(6, 'Minimum password length is 6 characters')
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;