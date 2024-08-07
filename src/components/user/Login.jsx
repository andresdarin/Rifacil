import React, { useState } from 'react'
import { useForm } from '../../hooks/useForm'
import { Global } from '../../helpers/Global'

export const Login = () => {

    const { form, changed } = useForm({})
    const [loged, setLoged] = useState("not_sended")
    const loginUser = async (e) => {
        e.preventDefault();

        //Datos del formulario
        let userToLogin = form;

        //Peticion al backend 
        const request = await fetch(Global.url + 'user/login', {
            method: 'POST',
            body: JSON.stringify(userToLogin),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await request.json();


        if (data.status === 'success') {

            //Persistir los datos en el navegador
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));


            setLoged('loged');
        } else {
            setLoged('error')
        }

    }

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Login</h1>
            </header>

            <div className="content__posts">
                {loged == 'loged' ? <strong className='alert alert-success'>Ususario Identificado Correctamente </strong> : ''}
                {loged == 'error' ? <strong className='alert alert-danger'>Ususario no Identificado </strong> : ''}
                <form className='form-login' onSubmit={loginUser}>
                    <div className="form-group">
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={changed} />
                    </div>
                    <div className="form-group">
                        <label htmlFor='password'>Constraseña</label>
                        <input type='password' name='password' onChange={changed} />
                    </div>
                    <input type="submit" value='Identificate' className='btn btn-success' />
                </form>

            </div>
        </>
    )
}

export default Login;
