import React, { useEffect, useState } from 'react'
import { useForm } from '../../../../hooks/useForm';
import { Global } from '../../../../helpers/Global';


export const AltaVendedor = () => {
    useEffect(() => {
        document.body.style.backgroundImage = "url('/src/assets/img/BackGorundVendedor.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);
    const { form, changed } = useForm({})
    const [saved, setSaved] = useState('not_sended')

    const saveVendedor = async (e) => {
        try {
            e.preventDefault();

            let newUser = form;

            console.log(newUser);

            const request = await fetch(Global.url + 'usuario/registerVendedor', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'Content-Type': 'application/json'

                }
            });

            const data = await request.json();

            if (data.status == 'success') {
                console.log("Registro exitoso", data.user);
                setSaved('saved');
                e.target.reset();

            } else {
                console.error(data.message);
                setSaved('error');
            }
        } catch (error) {
            console.error("Error en el frontend:", error);
        }

    }


    return (
        <div className="alta-vendedor__container">
            {/* Hero Section */}
            <div className="container-banner__vendedor">
                <header className='header__vendedor header__alta-vendedor'>Alta Vendedor</header>
            </div>

            {/* Formulario */}
            <section className="alta-vendedor__form-container">

                {saved == 'saved' ? <strong className='alert alert-success'>Vendedor registrado correctamente</strong> : ''}
                {saved == 'error' ? <strong className='alert alert-danger'>Vendedor no registado </strong> : ''}

                <form className="alta-vendedor__form" autoComplete="off" onSubmit={saveVendedor}>
                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="nombreUsu"
                            placeholder="Nombre de Usuario"
                            name="nombreUsu" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="nombreCompleto"
                            placeholder="Nombre Completo"
                            name="nombreCompleto" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            name="password" // Coincide con lo que espera el backend
                            required
                            autoComplete="new-password"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="text"
                            id="ci"
                            placeholder="Cédula de Identidad"
                            name="ci" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="email"
                            id="email"
                            placeholder="Correo Electrónico"
                            name="email" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="tel"
                            id="telefono"
                            placeholder="Teléfono"
                            name="telefono" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>

                    <div className="form-group form-group__vendedor">
                        <input
                            type="name"
                            id="rol"
                            placeholder="Rol"
                            name="rol" // Coincide con lo que espera el backend
                            required
                            autoComplete="off"
                            onChange={changed}
                        />
                    </div>


                    <button type="submit" className="alta-vendedor__submit-button">
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>
                </form>


            </section>
        </div>
    )
}
