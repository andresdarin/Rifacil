import React, { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';

export const RecoverPass = () => {
    const { form, changed } = useForm({});
    const [recoveryStatus, setRecoveryStatus] = useState("not_sended");
    const navigate = useNavigate();

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

                // Aquí supongamos que tu backend te devuelve el token
                const resetToken = data.resetToken; // Asegúrate de que tu backend envíe esto

                // Redirigir al formulario de cambio de contraseña con el token
                setTimeout(() => {
                    navigate(`/reset-password/${resetToken}`);
                }, 3000); // Redirigir después de 3 segundos
            } else {
                setRecoveryStatus('error');
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            setRecoveryStatus('error');
        }
    }

    return (
        <div className="form-container sign-up">
            <div className="login-card">
                <header className="content_header content_header--public">
                    <h1 className="content__title">Recuperar Contraseña</h1>
                </header>
                {recoveryStatus === 'success' && <strong className='alert alert-success'>Correo enviado. Redirigiendo a login...</strong>}
                {recoveryStatus === 'error' && <strong className='alert alert-danger'>Error al enviar el correo</strong>}
                <form className='form-login' onSubmit={recoverPassword}>
                    <div className="form-group">
                        <label htmlFor='email' />
                        <input type='email' name='email' placeholder='Introduce tu eMail' onChange={changed} />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="buttons-login">
                        <button type="submit" className='btn'>Recuperar Contraseña</button>
                    </div>
                    <div className="buttons-login-label">
                        <span>O recordaste tu contraseña?</span>
                        <NavLink to='/login'>Inicia Sesión</NavLink>
                    </div>
                </form>
            </div>
        </div>
    );
};
