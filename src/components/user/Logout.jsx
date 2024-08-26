import React, { useEffect } from 'react'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const Logout = () => {

    const { setAuth } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        //vacial el localstorage
        localStorage.clear();

        //Setear estados globales a vacio
        setAuth({})

        //Navigate (redireccion) al login
        navigate('/login')
    }, []);
    return (
        <h1>Cerrando Sesion...</h1>
    )
}