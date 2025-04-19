import React from 'react';
import { NavLink } from 'react-router-dom';

const NavVendedor = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const vendedorId = user?.id;

    return (
        <li className="menu-list__item">
            <NavLink to={`/vendedor/profile/${vendedorId}`} className="menu-list__link">
                <span className="menu-list__title">Perfil</span>
            </NavLink>
            <NavLink to={`/vendedor/estadisticas/${vendedorId}`} className="menu-list__link">
                <span className="menu-list__title">Estadísticas</span>
            </NavLink>
            <NavLink to={`/vendedor/historial-vendedor/${vendedorId}`} className="menu-list__link">
                <span className="menu-list__title">Historial Ventas</span>
            </NavLink>
            <NavLink to={`/vendedor/vender-rifa/${vendedorId}`} className="menu-list__link">
                <span className="menu-list__title">Vender Rifa</span>
            </NavLink>
            <NavLink to='/vendedor/logout' className="menu-list__link">
                <span className="menu-list__title">Cerrar Sesión</span>
            </NavLink>
        </li>
    );
};

export default NavVendedor;
