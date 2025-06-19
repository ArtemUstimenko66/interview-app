import { useAppSelector, useAppDispatch } from '../../shared/lib/hooks/redux';
import { logout } from '../store/auth.slice';

export const ProfileForm = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);

    if (!user) return null;

    return (
        <div>
            <div>
                <span>Username:</span>
                <span>{user.username}</span>
            </div>
            
            <div>
                <span>Email:</span>
                <span>{user.email}</span>
            </div>
            
            <div>
                <span>Role:</span>
                <span>{user.role}</span>
            </div>

            <div>
                <button 
                    onClick={() => dispatch(logout())}
                >
                    Exit
                </button>
            </div>
        </div>
    );
};