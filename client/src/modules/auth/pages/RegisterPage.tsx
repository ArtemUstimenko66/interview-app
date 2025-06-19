import { RegisterForm } from '../components/RegisterForm';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
    return (
        <div>
            <div>
                <div>
                    <h2>Register</h2>
                </div>
                <RegisterForm />
                <div>
                    <Link to="/login">
                    Already have an account? Login                    
                    </Link>
                </div>
            </div>
        </div>
    );
};