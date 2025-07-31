import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const ProtectedRoute = ({ children }) => {
    // 1. Gunakan `isAuthenticated` untuk pengecekan yang lebih eksplisit
    const { isAuthenticated } = useAuth();

    // Jika user tidak login, redirect ke login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Jika user sudah login, tampilkan rute-rute di dalamnya (nested routes)
    return <Outlet />;
};
export default ProtectedRoute;