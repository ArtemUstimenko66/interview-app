import { authApi } from "../api/auth.api";
import { type IAuthResponse, type IUser, type LoginFormData, type RegisterFormData } from "../types/auth.types";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AuthState {
    user: IUser | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
};

export const login = createAsyncThunk<IAuthResponse, LoginFormData>(
    'auth/login',
    async (data, { rejectWithValue }) => { 
        try { 
            return await authApi.login(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login error');
        }
    }
);

export const register = createAsyncThunk<IAuthResponse, RegisterFormData>(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            return await authApi.register(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Registration error');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authApi.logout();
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => { 
        builder
        .addCase(login.pending, (state) => { 
            state.isLoading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
        });
    }
});

export default authSlice.reducer;
export const { setUser } = authSlice.actions;