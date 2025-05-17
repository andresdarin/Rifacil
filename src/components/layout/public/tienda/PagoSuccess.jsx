import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PagoSuccess = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const paymentId = queryParams.get('payment_id');
        const status = queryParams.get('status');
        const total = queryParams.get('total');
        const externalReference = queryParams.get('external_reference');

        if (paymentId && status) {
            if (status === 'approved') {
                setPaymentStatus('success');
                setPaymentDetails({
                    payment_id: paymentId,
                    totalAPagar: parseFloat(total)
                });

                localStorage.removeItem('cart');

                // Llamar al backend para registrar la compra y actualizar metas
                fetch(`https://tu-api.com/api/pago/exito?payment_id=${paymentId}&status=${status}&external_reference=${externalReference}`);
            } else {
                setPaymentStatus('failure');
            }
        }
    }, [location]);


    if (paymentStatus === null) {
        return (
            <div className="success-container centered">
                <div className="status-message">Verificando el estado de tu pago...</div>
            </div>
        );
    }

    if (paymentStatus === 'failure') {
        return (
            <div className="success-container centered">
                <div className="container-banner__productos">
                    <header className="header__productos header__checkout">
                        Pago Fallido! 😞
                    </header>
                </div>
                <p>Hubo un problema al procesar tu pago. Intenta nuevamente.</p>
                <Link to="/tienda/Failure">Volver a intentar</Link>
            </div>
        );
    }


    return (
        <div className="success-container centered">
            <div className="container-banner__productos">
                <header className="header__productos header__checkout">
                    Pago Exitoso!
                </header>
            </div>
            <div className="boleta-container">
                <div className="boleta checkout-box">
                    <h1>🎉🎉🎉</h1>
                    <h3 className='checkout-item'>Tu compra se ha procesado correctamente.</h3>
                    {paymentDetails && (
                        <>
                            <h2><strong>Detalles del pago</strong></h2>
                            <h3>ID {paymentDetails.payment_id}</h3>
                            <h3>ID {paymentDetails.status}</h3>
                            <h3>Monto ${paymentDetails.totalAPagar}</h3>
                        </>
                    )}
                </div>
                <div className="links">
                    <Link className='btn btn-pay-success' to="/landing">Volver a la página principal</Link>
                    <Link className='btn btn-pay-success' to="/tienda">Volver a la Tienda</Link>
                </div>
            </div>


        </div>
    );
};

export default PagoSuccess;
