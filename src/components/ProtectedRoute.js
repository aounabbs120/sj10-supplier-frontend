import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('supplierToken');

    // If a token exists, render the child component (e.g., Dashboard).
    // The <Outlet /> component is a placeholder for the actual page component.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;