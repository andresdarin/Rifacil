import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

//iconos
import { FaUser } from 'react-icons/fa'
import { FaLock } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'

export const Login = () => {
    const { form, changed } = useForm({});
    const [loged, setLoged] = useState("not_sended");

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

            if (!request.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await request.json();

            if (data.status === 'success') {
                // Persistir los datos en el navegador
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setLoged('loged');
                Navigate('/landing')
            } else {
                setLoged('error');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setLoged('error');
        }
    }

    return (
        <>
            <div className="form-container sign-up">
                <header className="content__header content__header--public">
                    <h1 className="content__title">Login</h1>
                </header>
                {loged === 'loged' && <strong className='alert alert-success'>Usuario Identificado Correctamente</strong>}
                {loged === 'error' && <strong className='alert alert-danger'>Usuario no Identificado</strong>}
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor='email' />
                        <input type='email' name='email' placeholder='eMail' onChange={changed} />
                        <FaUser className='icon' />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password' />
                        <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                        <FaLock className='icon' />
                    </div>
                    <div className="remember-forgot">
                        <label><input type='checkbox' />Recuérdame</label>
                        <a href="#">Olvidaste la contraseña?</a>
                    </div>
                    <div className="buttons-login">
                        <input type="submit" value='Iniciar Sesión' className='btn' />
                    </div>
                    <div className="buttons-login-label">
                        <span>No tienes cuenta todavía?</span>
                        <a href="#">Regístrate</a>
                    </div>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><i className="fa-brands fa-google-plus-g"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-github"></i></a>
                        <a href="#" className="social-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                    </div>

                </form>
            </div>
        </>
    )
}

export default Login;
