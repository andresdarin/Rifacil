import React from 'react';
import { NavLink } from 'react-router-dom';

const NavVendedor = () => {
    const vendedorId = localStorage.getItem("id"); // Obtiene el ID del vendedor

    return (
        <li className="menu-list__item">
            <NavLink to={`/vendedor/profile/${vendedorId}`} className="menu-list__link">
                <span className="menu-list__title">Perfil</span>
            </NavLink>
            <NavLink to='' className="menu-list__link">
                <span className="menu-list__title">Estadísticas</span>
            </NavLink>
            <NavLink to='' className="menu-list__link">
                <span className="menu-list__title">Historial Ventas</span>
            </NavLink>
            <NavLink to='' className="menu-list__link">
                <span className="menu-list__title">Vender Rifa</span>
            </NavLink>
            <NavLink to='/vendedor/logout' className="menu-list__link">
                <span className="menu-list__title">Cerrar Sesión</span>
            </NavLink>
        </li>
    );
};

export default NavVendedor;
