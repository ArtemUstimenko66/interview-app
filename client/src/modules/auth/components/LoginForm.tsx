import { loginSchema, type LoginFormData } from "../types/auth.types";
import { useAppDispatch, useAppSelector } from "../../shared/lib/hooks/redux"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { login } from "../store/auth.slice";

export const LoginForm = () => { 
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector(state => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        try { 
            await dispatch(login(data)).unwrap();
            navigate('/profile')
        } catch (error) {}
    };

    return ( 
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    )
}