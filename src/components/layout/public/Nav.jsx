import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export const Nav = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); // Referencia al menú

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    // useEffect para cerrar el menú si se hace clic afuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar__container-lists" ref={menuRef}>
            {/* Botón de flecha */}
            <button className="hamburger-btn" onClick={toggleMenu}>
                <div className={`arrow-down ${isMenuOpen ? 'open' : ''}`}></div>
            </button>

            {/* Menú */}
            <ul className={`container-lists__menu-list ${isMenuOpen ? 'open' : ''}`}>
                <li className="menu-list__item">
                    <NavLink to='/landing' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Inicio</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/beneficios' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Beneficios</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/resultado' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Resultado</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/contacto' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Contacto</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/tienda' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Tienda</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/editarPerfil' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Editar Perfil</span>
                    </NavLink>
                </li>
                <li className="menu-list__item">
                    <NavLink to='/admin/logout' className="menu-list__link" onClick={() => setIsMenuOpen(false)}>
                        <span className="menu-list__title">Cerrar Sesión</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};
