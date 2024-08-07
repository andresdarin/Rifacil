import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

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
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="form-container sign-up">
                {loged === 'loged' && <strong className='alert alert-success'>Usuario Identificado Correctamente</strong>}
                {loged === 'error' && <strong className='alert alert-danger'>Usuario no Identificado</strong>}
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Contraseña</label>
                        <input type='password' name='password' onChange={changed} />
                    </div>
                    <input type="submit" value='Identifícate' className='btn btn-success' />
                </form>
            </div>
        </>
    )
}

export default Login;
