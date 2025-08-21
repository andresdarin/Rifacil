import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';

// Iconos
import { FaUser, FaLock } from 'react-icons/fa';

export const Login = () => {
    const { form, changed } = useForm({});
    const [status, setStatus] = useState("not_sended");
    const [errorMessage, setErrorMessage] = useState("");
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const request = await fetch(Global.url + 'usuario/login', {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await request.json();

            if (data.status === 'success') {
                // Primero validamos estado
                if (data.user.estado === 'inactivo') {
                    setStatus('error');
                    setErrorMessage('Tu cuenta está inactiva. Contacta al administrador.');
                    return;  // Abortamos antes de guardar token o redirigir
                }

                // Si está activo, continuamos con el login
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('rol', data.user.rol);
                setAuth(data.user);
                setStatus('loged');

                // Redirección según rol
                if (data.user.rol === 'admin') {
                    navigate('/admin/profile');
                } else if (data.user.rol === 'vendedor') {
                    navigate(`/vendedor/profile/${data.user.id}`);
                } else {
                    navigate('/landing');
                }
            } else {
                // Login rechazado por credenciales
                setStatus('error');
                setErrorMessage(data.message || 'Error al iniciar sesión');
            }
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message || 'Error en la solicitud');
        }
    };

    return (
        <div className="form-container sign-up">
            <div className="login-card">
                <header className="content_header content_header--public">
                    <h1 className="content__title"><span className='content__title__span'>Log</span>in</h1>
                </header>

                {status === 'loged' && (
                    <strong className='alert alert-success'>
                        Usuario identificado correctamente
                    </strong>
                )}

                {status === 'error' && (
                    <strong className='alert alert-danger'>
                        {errorMessage}
                    </strong>
                )}

                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group form-group_login">
                        <input
                            type='email'
                            name='email'
                            placeholder='eMail'
                            onChange={changed}
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="form-group form-group_login">
                        <input
                            type='password'
                            name='password'
                            placeholder='Contraseña'
                            onChange={changed}
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="remember-forgot">
                        <NavLink to='/recover-pass'>¿Olvidaste la contraseña?</NavLink>
                    </div>
                    <div className="buttons-login">
                        <button type="submit" className='btn'>Iniciar Sesión</button>
                    </div>
                    <div className="buttons-login-label">
                        <span>¿No tienes cuenta todavía?</span>
                        <NavLink to='/registro'>Regístrate</NavLink>
                    </div>
                    {/*Pendiente de hacer funcionar */}
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
