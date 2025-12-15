import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PagoSuccess = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                setIsLoading(true);
                const queryParams = new URLSearchParams(location.search);

                // Obtener todos los parámetros necesarios
                const paymentId = queryParams.get('payment_id');
                const status = queryParams.get('status');
                const external_reference = queryParams.get('external_reference');
                const total = queryParams.get('total');

                // Verificar que tenemos los parámetros necesarios
                if (!paymentId || !status || !external_reference) {
                    throw new Error('Faltan parámetros necesarios para confirmar el pago');
                }

                if (status === 'approved') {
                    // Llamar a la API para confirmar el pago en el backend usando fetch
                    const url = `http://localhost:4001/api/pago/exito?payment_id=${paymentId}&status=${status}&external_reference=${external_reference}`;

                    const response = await fetch(url);

                    if (!response.ok) {
                        throw new Error('Error en la respuesta del servidor');
                    }

                    const data = await response.json();

                    // Verificar la respuesta del servidor
                    if (status === 'approved') {
                        setPaymentStatus('success');
                        setPaymentDetails({
                            payment_id: paymentId,
                            totalAPagar: parseFloat(total),
                            external_reference: external_reference
                        });

                        localStorage.removeItem('cart');
                    } else {
                        throw new Error('El servidor no confirmó la aprobación del pago');
                    }
                } else {
                    setPaymentStatus('failure');
                }
            } catch (err) {
                console.error('Error al confirmar el pago:', err);
                setError(err.message || 'Hubo un error al procesar tu pago');
                setPaymentStatus('failure');
            } finally {
                setIsLoading(false);
            }
        };

        confirmPayment();
    }, [location]);

    if (isLoading) {
        return (
            <div className="success-container centered">
                <div className="status-message">Verificando el estado de tu pago...</div>
            </div>
        );
    }

    if (error || paymentStatus === 'failure') {
        return (
            <div className="success-container centered">
                <div className="container-banner__productos">
                    <header className="header__productos header__checkout">
                        Pago Fallido! 😞
                    </header>
                </div>
                <p>{error || 'Hubo un problema al procesar tu pago. Intenta nuevamente.'}</p>
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
                            {paymentDetails.external_reference && (
                                <h3>Referencia: {paymentDetails.external_reference}</h3>
                            )}
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
