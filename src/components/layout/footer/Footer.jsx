import React from 'react';
import { FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__left">
                    <h3>Rifácil © {new Date().getFullYear()}</h3>
                    <p>Todos los derechos reservados.</p>
                </div>
                <div className="footer__right">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="mailto:contacto@tuapp.com"><FaEnvelope /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
