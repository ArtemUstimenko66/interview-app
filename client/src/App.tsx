import './App.css'
import { useAuth } from './modules/shared/lib/hooks/useAuth'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './modules/auth/pages/LoginPage'
import { RegisterPage } from './modules/auth/pages/RegisterPage'
import { ProtectedRoute } from './modules/shared/lib/components/ProtectedRoute'
import { ProfilePage } from './modules/auth/pages/ProfilePage'
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
);
}

export default App
