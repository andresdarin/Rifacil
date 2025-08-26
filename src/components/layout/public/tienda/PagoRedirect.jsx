import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PagoRedirect = () => {
    const { search } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const status = params.get('status');

        if (status === 'approved') {
            navigate('/pago-success');
        } else {
            navigate('/tienda/failure');
        }
    }, [search, navigate]);

    return <p>Verificando el estado del pago...</p>;
};

export default PagoRedirect;
