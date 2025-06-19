import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
    return (
        <div>
            <div>
                <div>
                    <h2>Login</h2>
                </div>
                <LoginForm />
                <div>
                    <Link to="/register">
                        Don't have an account? Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};