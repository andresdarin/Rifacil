import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { NavLink } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

export const RecoverPass = () => {
    const { form, changed } = useForm({});
    const [recoveryStatus, setRecoveryStatus] = useState("not_sended");

    const recoverPassword = async (e) => {
        e.preventDefault();

        // Datos del formulario
        const emailToRecover = form;

        try {
            // Petición al backend
            const request = await fetch(Global.url + 'usuario/recover-password', {
                method: 'POST',
                body: JSON.stringify(emailToRecover),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await request.json();

            if (data.status === 'success') {
                setRecoveryStatus('success');
            } else {
                setRecoveryStatus('error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            setRecoveryStatus('error');
        }
    };

    return (
        <div className="form-container sign-up">
            <div className="login-card">
                <header className="content_header content_header--public">
                    <h1 className="content__title">Recuperar Contraseña</h1>
                </header>
                {recoveryStatus === 'success' && (
                    <strong className='alert alert-success'>
                        Correo enviado. Revisa tu bandeja de entrada para continuar con el restablecimiento de la contraseña.
                    </strong>
                )}
                {recoveryStatus === 'error' && (
                    <strong className='alert alert-danger'>
                        Error al enviar el correo. Inténtalo de nuevo.
                    </strong>
                )}
                <form className='form-login' onSubmit={recoverPassword}>
                    <div className="form-group">
                        <label htmlFor='email' />
                        <input
                            type='email'
                            name='email'
                            placeholder='Introduce tu eMail'
                            onChange={changed}
                            required
                        />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="buttons-login">
                        <button type="submit" className='btn'>Recuperar Contraseña</button>
                    </div>
                    <div className="buttons-login-label">
                        <span>¿Recordaste tu contraseña?</span>
                        <NavLink to='/login'>Inicia Sesión</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};
