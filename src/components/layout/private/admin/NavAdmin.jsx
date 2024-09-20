import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AltaVendedor } from './AltaVendedor'

export const NavAdmin = () => {
    return (
        <nav className="navbar__container-lists">

            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <span className="menu-list__title">Perfil</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <NavLink to="/admin/alta-vendedor" className="menu-list__link">
                        <span className="menu-list__title">Vendedores</span>
                    </NavLink>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <span className="menu-list__title">Rifas</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <a href="#" className="menu-list__link">
                        <span className="menu-list__title">Productos</span>
                    </a>
                </li>

                <li className="menu-list__item">
                    <NavLink to='/admin/logout' className="menu-list__link">
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>

        </nav>
    )
}
