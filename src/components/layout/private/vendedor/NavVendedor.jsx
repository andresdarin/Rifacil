
import React from 'react';
import { NavLink } from 'react-router-dom'

const NavVendedor = () => {
    return (
        <li className="menu-list__item">
            <NavLink to='/vendedor/logout' className="menu-list__link">
                <span className="menu-list__title">Cerrar Sesión</span>
            </NavLink>
        </li>
    );
};

export default NavVendedor;
