import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export const NavAdmin = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const menuRef = useRef(null);

    // Al montar, aseguramos que ambos menús estén cerrados
    useEffect(() => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    }, []);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(open => !open);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(open => !open);
    };

    // Cierra el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMenu();
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <nav className="navbar__container-lists">
            <button className="hamburger-btn" onClick={toggleMenu}>
                <div className={`arrow-down ${isMenuOpen ? 'open' : ''}`}></div>
            </button>

            <ul ref={menuRef} className={`container-lists__menu-list ${isMenuOpen ? 'open' : ''}`}>
                <li className="menu-list__item">
                    <NavLink to="/admin/profile" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Perfil</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to="/admin/alta-vendedor" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Alta Vendedor</span>
                    </NavLink>
                </li>
                <li className={`menu-list__item ${isDropdownOpen ? 'open' : ''}`}>
                    <span
                        className={`menu-list__link menu-list__link--dropdown ${isDropdownOpen ? 'selected' : ''}`}
                        onClick={toggleDropdown}
                    >
                        <span className="menu-list__title">Rifas</span>
                    </span>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/crear" className="dropdown-menu__link" onClick={closeMenu}>
                                    Generación
                                </NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/asignar" className="dropdown-menu__link" onClick={closeMenu}>
                                    Asignar
                                </NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/historial" className="dropdown-menu__link" onClick={closeMenu}>
                                    Historial
                                </NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/premios" className="dropdown-menu__link" onClick={closeMenu}>
                                    Premios
                                </NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/sorteo" className="dropdown-menu__link" onClick={closeMenu}>
                                    Agendar Sorteo
                                </NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/sortear" className="dropdown-menu__link" onClick={closeMenu}>
                                    SORTEAR
                                </NavLink>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="menu-list__item">
                    <NavLink to="/admin/productos" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Productos</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to="/admin/admin-config" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Configuración</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to="/admin/logout" className="menu-list__link" onClick={closeMenu}>
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};
