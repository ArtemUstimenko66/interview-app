import { ProfileForm } from '../components/ProfileForm';
import { useAppSelector } from '../../shared/lib/hooks/redux';
import { Navigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { isAuthenticated } = useAppSelector(state => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <div>
                <h1>User Profile</h1>
                <ProfileForm />
            </div>
        </div>
    );
};