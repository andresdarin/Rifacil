import React from 'react'
import { useLocation } from 'react-router-dom';
import logo from '../../../assets/img/Logo-Circulo.png';
import { Nav } from './Nav'
import { NavAdmin } from './admin/NavAdmin';
import NavVendedor from './vendedor/NavVendedor';

export const Header = () => {
    const location = useLocation();

    // Determinar qué componente de navegación renderizar basado en la ruta actual
    let NavComponent;

    if (location.pathname.startsWith('/admin/profile')) {
        NavComponent = NavAdmin;
    } else if (location.pathname.startsWith('/vendedor/profile')) {
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
}
