import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Nav = () => {
    // Estado para controlar la visibilidad del menú en pantallas pequeñas
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <nav className="navbar__container-lists">
            {/* Botón de flecha */}
            <button className="hamburger-btn" onClick={toggleMenu}>
                <div className={`arrow-down ${isMenuOpen ? 'open' : ''}`}></div>
            </button>

            {/* Menú */}
            <ul className={`container-lists__menu-list ${toggleMenu ? 'open' : ''}`}>
                <li className="menu-list__item">
                    <NavLink to='/landing' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/beneficios' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Beneficios</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/resultado' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Resultado</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/contacto' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Contacto</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/tienda' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Tienda</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/admin/logout' className="menu-list__link" onClick={toggleMenu}>
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};
