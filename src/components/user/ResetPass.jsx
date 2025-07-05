import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { FaLock } from 'react-icons/fa';

export const ResetPass = () => {
    const { token } = useParams(); // Obtener el token DESDE la URL NO del body
    const { form, changed } = useForm({ password: '', confirmPassword: '' });
    const [status, setStatus] = useState("not_sended");
    const navigate = useNavigate();

    const resetPassword = async (e) => {
        e.preventDefault();

        const { password, confirmPassword } = form;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setStatus('error');
            console.error('Las contraseñas no coinciden');
            return; // Salir si no coinciden
        }

        const newPasswordData = {
            newPassword: password // Enviar solo la nueva contraseña
        };

        try {
            // Enviar nueva contraseña al backend
            const request = await fetch(`${Global.url}usuario/reset-password/${token}`, {
                method: 'POST',
                body: JSON.stringify(newPasswordData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();

            // Imprimir el estado de la respuesta para depuración
            console.log('Respuesta del servidor:', data);

            if (data.status === 'success') {
                setStatus('success');
                // Redirigir al login tras éxito
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setStatus('error');
                console.error('Error al cambiar la contraseña:', data.message);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            setStatus('error');
        }
    };

    return (
        <div className="form-container sign-up">
            <div className="login-card">
                <header className="content_header content_header--public">
                    <h2 className="content__title reset_pass">Recuperación de Contraseña</h2>
                </header>
                {status === 'success' && (
                    <strong className='alert alert-success'>
                        Contraseña cambiada con éxito. Redirigiendo al login...
                    </strong>
                )}
                {status === 'error' && (
                    <strong className='alert alert-danger'>
                        Error al cambiar la contraseña
                    </strong>
                )}
                <form className='form-login' onSubmit={resetPassword}>
                    <div className="form-group">
                        <label htmlFor='password' />
                        <input
                            type='password'
                            name='password'
                            placeholder='Nueva Contraseña'
                            onChange={changed}
                            required
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="form-group">
                        <label htmlFor='confirmPassword' />
                        <input
                            type='password'
                            name='confirmPassword'
                            placeholder='Confirmar Nueva Contraseña'
                            onChange={changed}
                            required
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="recover-pass__text">
                        Recordaste tu contraseña?
                        <NavLink to="/login" className="back-to-login">
                            Volvamos al inicio
                        </NavLink>
                    </div>

                    <div className="buttons-login">
                        <button type="submit" className='btn'>Cambiar Contraseña</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
