// src/components/user/Register.jsx
import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const { form, changed } = useForm({})
    const [saved, setSaved] = useState('not_sended')
    const navigate = useNavigate();
    const LoginRedirect = () => {
        navigate('/login');
    };
    const saveUser = async (e) => {
        e.preventDefault();

        try {
            let newUser = form;
            console.log("Global.url:", Global.url);
            console.log("Nuevo usuario:", newUser);

            const request = await fetch(Global.url + 'usuario/register', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!request.ok) {
                throw new Error(`HTTP error! Status: ${request.status}`);
            }

            const data = await request.json();
            console.log("Respuesta del servidor:", data);

            if (data.status === 'success') {
                setSaved('saved');
                navigate('/landing');
            } else {
                setSaved('error');
            }
        } catch (error) {
            console.error("Error en fetch:", error);
            setSaved('error');
        }
    };

    return (

        <div className="form-container sign-up">
            <div className='login-card'>
                <header className="content__header content__header--public">
                    <h1 className="content__title content__title-register">Registro</h1>
                </header>

                {saved == 'saved' ? <strong className='alert alert-success'>Ususario registado Correctamente </strong> : ''}
                {saved == 'error' ? <strong className='alert alert-danger'>Ususario no registado </strong> : ''}

                <form className='form-login' onSubmit={saveUser}>
                    <div className="form-group form-group_login">
                        <label htmlFor='nombreUsu' />
                        <input type='text' name='nombreUsu' placeholder='Nombre de usuario' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='nombreCompleto' />
                        <input type='text' name='nombreCompleto' placeholder='Nombre Completo' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='ci' />
                        <input type='text' name='ci' placeholder='Documento de identidad' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='telefono' />
                        <input type='text' name='telefono' placeholder='Teléfono' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='direccion' />
                        <input type='text' name='direccion' placeholder='Dirección' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='email' />
                        <input type='email' name='email' placeholder='eMail' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='password' />
                        <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                    </div>
                    <div className="form-group form-group_login">
                        <label htmlFor='passwordRep' />
                        <input type='password' name='password' placeholder='Confirma tu Contraseña' onChange={changed} />
                    </div>


                    <div className="buttons-login buttons-register">
                        <button type="submit" className='btn'>Registrarse</button>
                        <button type="button" className='btn' onClick={LoginRedirect}>Login</button>
                    </div>

                </form>
            </div>

        </div>
    );
};

export default Register;
