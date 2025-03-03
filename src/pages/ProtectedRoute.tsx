import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
    // Replace with actual authentication logic
    return localStorage.getItem('authToken') !== null;
};

const ProtectedRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
