import React from 'react'
import { Nav } from './Nav'

export const Header = () => {
    return (
        <header className="layout__navbar">
            <div className="navbar__header">
                <a href="#" className="navbar__logo">
                    <img src="/Logo-Circulo.png" alt="Logo" className="navbar__logo-image" />
                </a>
            </div>
            <Nav />
        </header>
    )
}
