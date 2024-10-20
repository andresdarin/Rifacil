import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import errorImage from '../../src/assets/img/ImgError404.png'

const Error404 = () => {

    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackgroundLong.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    const { auth } = useAuth();

    const getRedirectPath = () => {
        if (auth.rol === 'admin') {
            return '/admin/profile';
        } else if (auth.rol === 'vendedor') {
            return '/vendedor/profile';
        } else {
            return '/login';
        }
    };

    return (
        <div className='error-page'>
            <img src={errorImage} alt='Error 404 - Pagina no encontrada' />
            <div className="error-page-text">
                <h2>Parece que nos perdimos...</h2>
                <Link to={getRedirectPath()}>Volvemos al incio?</Link>
            </div>
        </div>
    );
};

export default Error404;
