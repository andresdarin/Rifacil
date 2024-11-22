import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export const NavAdmin = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Controla el estado del menú desplegable
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar__container-lists">
            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to='/admin/profile' className="menu-list__link">
                        <span className="menu-list__title">Perfil</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/admin/alta-vendedor" className="menu-list__link">
                        <span className="menu-list__title">Alta Vendedor</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    {/* Añade el evento onClick para mostrar/ocultar el menú desplegable */}
                    <span
                        className={`menu-list__link menu-list__link--dropdown ${isDropdownOpen ? 'selected' : ''}`}
                        onClick={toggleDropdown}
                    >
                        <span className="menu-list__title">Rifas</span>
                    </span>


                    {/* Menú desplegable que se muestra solo si isDropdownOpen es true */}
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/crear" className="dropdown-menu__link">Generación</NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/asignar" className="dropdown-menu__link">Asignar</NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/historial" className="dropdown-menu__link">Historial</NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/sorteo" className="dropdown-menu__link">Sorteo</NavLink>
                            </li>
                            <li className="dropdown-menu__item">
                                <NavLink to="/admin/rifas/premios" className="dropdown-menu__link">Premios</NavLink>
                            </li>
                        </ul>
                    )}
                </li>

                <li className="menu-list__item">
                    <NavLink to='/admin/productos' className="menu-list__link">
                        <span className="menu-list__title">Productos</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/admin/admin-config' className="menu-list__link">
                        <span className="menu-list__title">Configuración</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/admin/logout' className="menu-list__link">
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};
