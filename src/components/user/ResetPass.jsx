import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { useParams, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { FaLock } from 'react-icons/fa';

export const ResetPass = () => {
    const { token } = useParams(); // Obtener el token de la URL
    const { form, changed } = useForm({});
    const [status, setStatus] = useState("not_sended");
    const navigate = useNavigate();

    const resetPassword = async (e) => {
        e.preventDefault();

        const newPasswordData = {
            token, // Enviar el token que obtuvimos de la URL
            newPassword: form.password // Nueva contraseña ingresada por el usuario
        };

        try {
            // Enviar nueva contraseña al backend
            const request = await fetch(Global.url + 'usuario/reset-password', {
                method: 'POST',
                body: JSON.stringify(newPasswordData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();

            if (data.status === 'success') {
                setStatus('success');
                // Redirigir al login tras éxito
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setStatus('error');
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
                    <h1 className="content__title">Cambiar Contraseña</h1>
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
                            required // Aseguramos que el campo sea obligatorio
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
                            required // Aseguramos que el campo sea obligatorio
                        />
                        <FaLock className='icon' />
                    </div>
                    <div className="buttons-login">
                        <button type="submit" className='btn'>Cambiar Contraseña</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
