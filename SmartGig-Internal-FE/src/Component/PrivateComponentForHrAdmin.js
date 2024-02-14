import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateComponentForHrAdmin() {
    const auth = localStorage.getItem('TOKEN');
    const role = localStorage.getItem('ROLE_OF_ADMIN');
    return ((auth) && (role == "SUPER_ADMIN" || "ADMIN")) ? <Outlet /> : <Navigate to="/" />
}

