import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom'; // Importa useNavigate

// Iconos
import { FaUser } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import Register from './Register';

export const Login = () => {
    const { form, changed } = useForm({});
    const [loged, setLoged] = useState("not_sended");
    const { setAuth } = useAuth();
    const navigate = useNavigate();


    const loginUser = async (e) => {
        e.preventDefault();

        // Datos del formulario
        let userToLogin = form;

        try {
            // Petición al backend
            const request = await fetch(Global.url + 'usuario/login', {
                method: 'POST',
                body: JSON.stringify(userToLogin),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();
            console.log('data', data)

            if (data.status === 'success') {
                // Persistir los datos en el navegador
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('rol', data.user.rol);



                // Actualizar el estado de autenticación
                setAuth(data.user);

                setLoged('loged');

                const userRol = data.user?.rol; // Evita errores si 'user' es undefined
                const userId = data.user?.id || localStorage.getItem("id");

                if (userRol === 'admin') {
                    console.log("📌 Redirigiendo a perfil de admin...");
                    navigate('/admin/profile');
                } else if (userRol === 'vendedor') {
                    console.log("📌 Redirigiendo a perfil de vendedor...");
                    navigate(`/vendedor/profile/${userId}`);
                } else {
                    console.log("📌 Redirigiendo a landing...");
                    navigate('/landing');
                }

            } else {
                setLoged('error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            setLoged('error');
        }
    }

    return (

        <div className="form-container sign-up">
            <div className="login-card">
                <header className="content_header content_header--public">
                    <h1 className="content__title"><span className='content__title__span'>Log</span>in</h1>
                </header>
                {loged === 'loged' && <strong className='alert alert-success'>Usuario Identificado Correctamente</strong>}
                {loged === 'error' && <strong className='alert alert-danger'>Usuario no Identificado</strong>}
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group form-group_login">
                        <label htmlFor='email' />
                        <input type='email' name='email' placeholder='eMail' onChange={changed} />
                        <FaUser className='icon' />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='password' />
                        <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                        <FaLock className='icon' />
                    </div>
                    <div className="remember-forgot">
                        <div className="recuerdame">
                            <input type='checkbox' />
                            <label>Recuérdame</label>
                        </div>
                        <NavLink to='/recover-pass'>Olvidaste la contraseña?</NavLink>
                    </div>
                    <div className="buttons-login">
                        <button type="submit" className='btn'>Iniciar Sesion</button>
                    </div>
                    <div className="buttons-login-label">
                        <span>No tienes cuenta todavía?</span>
                        <NavLink to='/registro'>Regístrate</NavLink>
                    </div>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><i className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-github"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Login;