// src/components/user/Register.jsx
import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

const Register = () => {

    const { form, changed } = useForm({})
    const [saved, setSaved] = useState('not_sended')
    const saveUser = async (e) => {
        //prevenir actualizacin de pantalla
        e.preventDefault();

        //recoger datos del formulario
        let newUser = form;

        //guardar usuario en el backend
        const request = await fetch(Global.url + 'usuario/register', {
            method: 'POST',
            body: JSON.stringify(newUser),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await request.json();

        if (data.status == 'success') {
            setSaved('saved');
        } else {
            setSaved('error')
        }
    }
    return (
        <div>
            <>
                <div className="form-container sign-up">
                    <header className="content__header content__header--public">
                        <h1 className="content__title">Registro</h1>
                    </header>

                    {saved == 'saved' ? <strong className='alert alert-success'>Ususario registado Correctamente </strong> : ''}
                    {saved == 'error' ? <strong className='alert alert-danger'>Ususario no registado </strong> : ''}

                    <form className='form-login' onSubmit={saveUser}>
                        <div className="form-group">
                            <label htmlFor='nombreUsu' />
                            <input type='text' name='nombreUsu' placeholder='Nombre de usuario' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='nombreCompleto' />
                            <input type='text' name='nombreCompleto' placeholder='Nombre Completo' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='ci' />
                            <input type='text' name='ci' placeholder='Documento de identidad' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='telefono' />
                            <input type='text' name='telefono' placeholder='Teléfono' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='direccion' />
                            <input type='text' name='direccion' placeholder='Dirección' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='email' />
                            <input type='email' name='email' placeholder='eMail' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='password' />
                            <input type='password' name='password' placeholder='Contraseña' onChange={changed} />
                        </div>
                        <div className="form-group">
                            <label htmlFor='passwordRep' />
                            <input type='password' name='password' placeholder='Confirma tu Contraseña' onChange={changed} />
                        </div>


                        <div className="buttons-login">
                            <button type="submit" className='btn'>Registrarse</button>
                        </div>

                    </form>
                </div>
            </>
        </div>
    );
};

export default Register;
