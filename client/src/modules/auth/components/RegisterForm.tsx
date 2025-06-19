import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RegisterFormData, registerSchema } from '../types/auth.types';
import { useAppDispatch, useAppSelector } from '../../shared/lib/hooks/redux';
import { register as registerAction } from '../store/auth.slice';
import { useNavigate } from 'react-router-dom';

export const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector(state => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormData) => {
        try { 
            await dispatch(registerAction(data)).unwrap();
            navigate('/profile')
        } catch (error) {}
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input
                    {...register('username')}
                    type="text"
                    placeholder="Username"
                />
                {errors.username && (
                    <span>{errors.username.message}</span>
                )}
            </div>

            <div>
                <input
                    {...register('email')}
                    type="email"
                    placeholder="Email"
                />
                {errors.email && (
                    <span>{errors.email.message}</span>
                )}
            </div>

            <div>
                <input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                />
                {errors.password && (
                    <span>{errors.password.message}</span>
                )}
            </div>

            {error && <div>{error}</div>}

            <button
                type="submit"
                disabled={isLoading}
            >
                {isLoading ? 'Registration...' : 'Register'}
            </button>
        </form>
    );
};