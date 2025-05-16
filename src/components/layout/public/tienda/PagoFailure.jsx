import React from 'react';
import { Link } from 'react-router-dom';

export const PagoFailure = () => {
    return (
        <div className="success-container centered">
            <div className="container-banner__productos">
                <header className="header__productos header__checkout">
                    Pago Fallido!
                </header>
            </div>
            <div className="boleta-container">
                <div className="boleta checkout-box">
                    <h1>😞</h1>
                    <h3 className='checkout-item '>
                        No pudimos procesar tu pago correctamente.
                    </h3>
                    <h5 className='checkout-item-failure'>Verificá que los datos de tu tarjeta o cuenta estén correctos e intentá nuevamente.</h5>
                </div>
                <div className="links">
                    <Link className='btn btn-pay-success' to="/tienda">Volver a la Tienda</Link>
                    <Link className='btn btn-pay-success' to="/landing">Volver a la página principal</Link>
                </div>
            </div>
        </div>
    );
};

export default PagoFailure;
