import React, { useEffect } from 'react'

export const AltaVendedor = () => {
    useEffect(() => {
        // Cambiar el fondo del body cuando se monta el componente
        document.body.style.backgroundImage = "url('/src/assets/img/BackGorundVendedor.png')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        // Limpiar el fondo cuando el componente se desmonta
        return () => {
            document.body.style.backgroundImage = ''; // Limpia el fondo
        };
    }, []);

    return (
        <div className="alta-vendedor__container">
            {/* Hero Section */}
            <div className="container-banner__vendedor">
                <header className='header__vendedor'>Alta Vendedor</header>
            </div>

            {/* Formulario */}
            <section className="alta-vendedor__form-container">
                <form className="alta-vendedor__form" autoComplete="off">
                    <div className="form-group">
                        <input
                            type="text"
                            id="nombreUsu"
                            placeholder="Nombre de Usuario"
                            name="nombreUsu"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="nombre"
                            placeholder="Nombre Completo"
                            name="nombre"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            placeholder="Contraseña"
                            name="password"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="ci"
                            placeholder="Cédula de identidad"
                            name="cedula"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            placeholder="Correo Electrónico"
                            name="email"
                            required
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            id="telefono"
                            placeholder="Telefono"
                            name="telefono"
                            required
                            autoComplete="off"
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
