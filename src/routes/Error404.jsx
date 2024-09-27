import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Error404 = () => {
    const { auth } = useAuth();

    const getRedirectPath = () => {
        if (auth.rol === 'admin') {
            return '/admin/profile';
        } else if (auth.rol === 'vendedor') {
            return '/vendedor/profile';
        } else {
            return '/login';
        }
    };

    return (
        <div>
            <h1>Error 404 - Página no encontrada</h1>
            <Link to={getRedirectPath()}>Volver al inicio</Link>
        </div>
    );
};

export default Error404;
