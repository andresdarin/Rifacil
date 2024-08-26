import React from 'react'
import { Nav } from './Nav'
import logo from '../../../assets/img/Logo-Circulo.png';

export const Header = () => {
    return (
        <header className="layout__navbar">

            <div className="navbar__header">
                <img src={logo} alt="Logo" className='header_logo' />
            </div>
            <Nav />


        </header>

    )
}
