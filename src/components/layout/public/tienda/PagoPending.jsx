import React from 'react';
import { Link } from 'react-router-dom';

export const PagoPending = () => {
    return (
        <div className="success-container centered">
            <div className="container-banner__productos">
                <header className="header__productos header__checkout">
                    ¡Ya casi es tuyo!
                </header>
            </div>

            <div className="boleta-container">
                <div className="boleta checkout-box">
                    <h1>⌛⌛⌛</h1>
                    <h3 className='checkout-item'>Estamos procesando tu pago</h3>
                    <p>No te preocupes, en unas horas te avisaremos por e-mail si se acreditó correctamente.</p>
                </div>

                <div className="links">
                    <Link className='btn btn-pay-success' to="/landing">Volver a la página principal</Link>
                    <Link className='btn btn-pay-success' to="/tienda">Volver a la Tienda</Link>
                </div>
            </div>
        </div>
    );
};

export default PagoPending;
