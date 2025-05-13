import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const NavVendedor = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const vendedorId = user?.id;

    useEffect(() => {
        setIsMenuOpen(false);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(open => !open);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar__container-lists">
            {/* Botón hamburguesa */}
            <button className="hamburger-btn" onClick={toggleMenu}>
                <div className={`arrow-down ${isMenuOpen ? 'open' : ''}`}></div>
            </button>

            {/* Menú de navegación */}
            <ul className={`container-lists__menu-list ${isMenuOpen ? 'open' : ''}`}>
                <li className="menu-list__item">
                    <NavLink to={`/vendedor/profile/${vendedorId}`} className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Perfil</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to={`/vendedor/estadisticas/${vendedorId}`} className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Estadísticas</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to={`/vendedor/historial-vendedor/${vendedorId}`} className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Historial Ventas</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to={`/vendedor/vender-rifa/${vendedorId}`} className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Vender Rifa</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to={`/vendedor/editarVendedor/${vendedorId}`} className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Editar Perfil</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to="/vendedor/logout" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default NavVendedor;
