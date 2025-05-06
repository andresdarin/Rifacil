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

        if (paymentId && status) {
            // Simulación de validación del pago usando fetch
            // En producción harías algo como:
            // fetch(`/api/pagos/verify-payment`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ paymentId, status })
            // })
            // .then(res => res.json())
            // .then(data => { ... })

            // Por ahora simulamos localmente:
            if (status === 'approved') {
                setPaymentStatus('success');
                setPaymentDetails({
                    payment_id: paymentId,
                    amount: 100 // Aquí iría el monto real desde la respuesta
                });
            } else {
                setPaymentStatus('failure');
            }
        }
    }, [location]);

    if (paymentStatus === null) {
        return <div>Verificando el estado de tu pago...</div>;
    }

    if (paymentStatus === 'failure') {
        return (
            <div className="success-container">
                <h1>¡Pago Fallido! 😞</h1>
                <p>Hubo un problema al procesar tu pago. Intenta nuevamente.</p>
                <Link to="/tienda">Volver a intentar</Link>
            </div>
        );
    }

    return (
        <div className="success-container">
            <h1>¡Pago Exitoso! 🎉</h1>
            <p>Tu compra se ha procesado correctamente.</p>
            {paymentDetails && (
                <>
                    <p><strong>Detalles del pago:</strong></p>
                    <p>ID de pago: {paymentDetails.payment_id}</p>
                    <p>Monto: ${paymentDetails.amount}</p>
                </>
            )}
            <Link to="/landing">Volver a la página principal</Link>
        </div>
    );
};

export default PagoSuccess;
