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

            {/*<ul className="container-lists__list-end">
                <li className="list-end__item">
                    <a href="#" className="list-end__link">
                        <span className="list-end__name">nick</span>
                    </a>
                    <a href="#" className="list-end__link">
                        <i className='fa-solid fa-gear' />
                        <span className="list-end__name">ajustes</span>
                    </a>
                    <a href="#" className="list-end__link">
                        <i className='fa-solid fa-arrow-right-from-bracket' />
                        <span className="list-end__name">Cerrar Sesión</span>
                    </a>
                </li>
            </ul>*/}

        </nav>
    )
}
