import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { useEffect, useState } from 'react';
import { authApi } from '../../../auth/api/auth.api';
import { useAppDispatch } from '../hooks/redux';
import { setUser } from '../../../auth/store/auth.slice';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const [isChecking, setIsChecking] = useState(true);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authApi.checkAuth();
                dispatch(setUser(response.user));
            } catch (error) {
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    if (isChecking) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};