import { useDispatch } from "react-redux"
import { useAppSelector } from "./redux";
import { useEffect } from "react";
import { authApi } from "../../../auth/api/auth.api";

export const useAuth = () => { 
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAppSelector(state => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authApi.checkAuth();
                dispatch({ type: 'auth/setUser', payload: response.user });
            } catch (error) {}
        };

        if (!isAuthenticated) {
            checkAuth();
        }
    }, [dispatch, isAuthenticated]);

    return { user, isAuthenticated };
};