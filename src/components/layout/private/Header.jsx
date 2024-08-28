import React from 'react'
import { useLocation } from 'react-router-dom';
import logo from '../../../assets/img/Logo-Circulo.png';
import { Nav } from '../private/Nav'
import { NavAdmin } from './admin/NavAdmin';
import NavVendedor from './vendedor/NavVendedor';
import useAuth from '../../../hooks/useAuth';

export const Header = () => {
    const location = useLocation();
    const { auth } = useAuth(); // Obtenemos el estado de autenticación

    let NavComponent;

    if (location.pathname === '/login' || location.pathname === '/registro') {
        return null; // No renderiza el header si la ruta es '/login'
    }

    // Si el usuario está autenticado y tiene un rol
    if (auth?.rol === 'admin' && location.pathname.startsWith('/admin')) {
        NavComponent = NavAdmin;
    } else if (auth?.rol === 'vendedor' && location.pathname.startsWith('/vendedor')) {
        NavComponent = NavVendedor;
    } else {
        NavComponent = Nav;
    }

    return (
        <header className="layout__navbar">
            <div className="navbar__header">
                <img src={logo} alt="Logo" className='header_logo' />
            </div>
            <NavComponent />
        </header>
    );
};
